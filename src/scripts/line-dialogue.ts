import gsap from 'gsap';
import type { BufferGeometry, LineSegments, ShaderMaterial, WebGLRenderer } from 'three';

type Triple = [number, number, number];
type Paragraph = {
  position: Triple;
  rotation: Triple;
  width: number;
  height: number;
  opacity: number;
};

// Open groups of strokes suggest paragraphs, without spelling or claiming a language.
const paragraphs: Paragraph[] = [
  { position: [-3.8, 2.6, -2.8], rotation: [.22, -.55, -.25], width: 4.4, height: 2.7, opacity: .52 },
  { position: [-.3, 2.1, .3], rotation: [-.24, .56, .38], width: 5.7, height: 3.2, opacity: .9 },
  { position: [3.5, 1.2, -1.2], rotation: [.48, -.68, -.23], width: 6.1, height: 3.8, opacity: .86 },
  { position: [5.7, 3, -3.5], rotation: [-.3, .44, .62], width: 4.7, height: 2.9, opacity: .55 },
  { position: [3.5, -.7, .7], rotation: [.4, .72, .22], width: 4.3, height: 2.6, opacity: .68 },
  { position: [.3, 4.5, -4.6], rotation: [.5, -.4, -.48], width: 5, height: 2.3, opacity: .38 },
  { position: [7.2, -.5, -4], rotation: [-.38, -.55, -.52], width: 4.5, height: 3.1, opacity: .4 },
];

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function paragraphVertices(spec: Paragraph, rows: number, seed: number) {
  const random = seededRandom(seed);
  const vertices: number[] = [];
  for (let row = 0; row < rows; row++) {
    const progress = row / (rows - 1);
    const y = (progress - .5) * spec.height;
    const length = spec.width * (.78 + random() * .22);
    const start = -spec.width / 2 + Math.sin(progress * Math.PI) * .12;
    const z = Math.sin(progress * Math.PI * 1.5) * .15;
    let x = start;
    while (x < start + length) {
      const end = Math.min(x + .1 + random() * .38, start + length);
      vertices.push(x, y, z, end, y, z);
      x = end + .035 + random() * .095;
    }
  }
  return new Float32Array(vertices);
}

const vertexShader = `
  uniform float uTime;
  uniform float uPhase;
  varying float vDepth;
  void main() {
    vec3 p = position;
    p.z += sin(p.y * 1.1 + uTime * 0.22 + uPhase) * 0.045;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    vDepth = -viewPosition.z;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uInk;
  uniform vec2 uResolution;
  uniform float uOpacity;
  varying float vDepth;
  void main() {
    vec2 screen = gl_FragCoord.xy / uResolution;
    // Keep the lower-left copy area, header and footer calm in every viewport.
    float besideCopy = smoothstep(0.32, 0.79, screen.x);
    float aboveCopy = smoothstep(0.47, 0.72, screen.y);
    float copySpace = mix(0.025, 1.0, max(besideCopy, aboveCopy));
    float headerSpace = 1.0 - smoothstep(0.84, 0.99, screen.y);
    float footerSpace = smoothstep(0.045, 0.17, screen.y);
    float depthFade = 1.0 - smoothstep(20.0, 31.0, vDepth);
    float alpha = uOpacity * copySpace * headerSpace * footerSpace * depthFade;
    gl_FragColor = vec4(uInk, alpha);
    #include <colorspace_fragment>
  }
`;

export async function initLineDialogue(host: HTMLElement): Promise<() => void> {
  const canvas = host.querySelector<HTMLCanvasElement>('[data-dialogue-canvas]');
  const hero = host.closest<HTMLElement>('[data-hero]');
  const toggle = hero?.querySelector<HTMLButtonElement>('[data-dialogue-toggle]');
  if (!canvas || !hero || !toggle) return () => {};

  // Three.js is a separate client chunk; the heading and vector fallback render first.
  const THREE = await import('three');
  if (!host.isConnected) return () => {};

  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0xf4f8fa, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  camera.position.set(0, 0, 19);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const resolution = new THREE.Vector2(1, 1);
  const timeUniform = { value: 0 };
  const ink = new THREE.Color(getComputedStyle(host).getPropertyValue('--ink').trim() || '#081824');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let compact = false;
  let paused = false;
  let inView = true;
  let menuOpen = document.documentElement.classList.contains('menu-is-open');
  let contextLost = false;
  let disposed = false;
  let elapsed = 0;
  let previousTick: number | null = null;
  let sinceRender = 0;
  let scrollProgress = 0;
  const targetPointer = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  const zeroPointer = new THREE.Vector2();

  const bundles: {
    lines: LineSegments<BufferGeometry, ShaderMaterial>;
    dense: BufferGeometry;
    light: BufferGeometry;
    spec: Paragraph;
    phase: number;
  }[] = paragraphs.map((spec, index) => {
    const makeGeometry = (rows: number) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(paragraphVertices(spec, rows, 97 + index * 41), 3));
      geometry.computeBoundingSphere();
      return geometry;
    };
    const dense = makeGeometry(64);
    const light = makeGeometry(32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uInk: { value: ink },
        uResolution: { value: resolution },
        uTime: timeUniform,
        uPhase: { value: index * .83 },
        uOpacity: { value: spec.opacity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const lines = new THREE.LineSegments(dense, material);
    lines.position.set(...spec.position);
    lines.rotation.set(...spec.rotation);
    lines.renderOrder = index;
    sculpture.add(lines);
    return { lines, dense, light, spec, phase: index * .83 };
  });

  function draw(delta = 0) {
    if (disposed || contextLost) return;
    const respond = finePointer.matches && !compact && !reducedMotion.matches;
    pointer.lerp(respond ? targetPointer : zeroPointer, 1 - Math.exp(-delta * 3.5));
    const alignment = (Math.sin(elapsed * .115 - .7) + 1) * .11 + scrollProgress * .45;
    sculpture.rotation.y = pointer.x * .12;
    sculpture.rotation.x = -pointer.y * .065 + scrollProgress * .06;
    bundles.forEach(({ lines, spec, phase }) => {
      lines.rotation.x = THREE.MathUtils.lerp(spec.rotation[0], .08, alignment) + Math.sin(elapsed * .13 + phase) * .045;
      lines.rotation.y = THREE.MathUtils.lerp(spec.rotation[1], .12, alignment) + Math.cos(elapsed * .11 + phase) * .065;
      lines.rotation.z = THREE.MathUtils.lerp(spec.rotation[2], -.06, alignment) + Math.sin(elapsed * .09 + phase) * .045;
      lines.position.y = spec.position[1] + Math.sin(elapsed * .2 + phase) * .085;
    });
    timeUniform.value = elapsed;
    renderer.render(scene, camera);
  }

  function updateToggle() {
    toggle!.hidden = reducedMotion.matches || contextLost;
    toggle!.setAttribute('aria-pressed', String(paused));
    toggle!.setAttribute('aria-label', paused ? '背景の動きを再生する' : '背景の動きを停止する');
    toggle!.classList.toggle('is-paused', paused);
    const label = toggle!.querySelector('[data-dialogue-toggle-label]');
    if (label) label.textContent = paused ? '動きを再生する' : '動きを止める';
  }

  function resize() {
    if (disposed || contextLost) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    compact = width < 768;
    const portrait = width < height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75));
    renderer.setSize(width, height, false);
    renderer.getDrawingBufferSize(resolution);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sculpture.scale.setScalar(compact ? .59 : portrait ? .8 : 1.06);
    sculpture.position.set(compact ? -.8 : portrait ? -.65 : .25, compact ? 2.0 : portrait ? .85 : .25, 0);
    bundles.forEach(({ lines, dense, light }, index) => {
      lines.geometry = compact ? light : dense;
      lines.visible = !compact || index < 5;
    });
    draw();
  }

  const onScroll = () => {
    const rect = hero!.getBoundingClientRect();
    scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
    // Paused and reduced-motion scenes stay still even when scrolling.
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || compact || reducedMotion.matches) return;
    const rect = hero!.getBoundingClientRect();
    targetPointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
  };
  const onPointerLeave = () => targetPointer.set(0, 0);
  const onToggle = () => {
    paused = !paused;
    previousTick = null;
    updateToggle();
  };
  const onReducedMotion = () => {
    previousTick = null;
    targetPointer.set(0, 0);
    pointer.set(0, 0);
    updateToggle();
    draw();
  };
  const onVisibility = () => { previousTick = null; };
  const onMenuChange = ((event: CustomEvent<{ open: boolean }>) => {
    menuOpen = event.detail.open;
    previousTick = null;
  }) as EventListener;
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    previousTick = null;
    host.classList.remove('is-webgl-ready');
    updateToggle();
  };
  const onContextRestored = () => {
    contextLost = false;
    previousTick = null;
    resize();
    host.classList.add('is-webgl-ready');
    updateToggle();
  };
  const tick = (time: number) => {
    if (disposed || contextLost || paused || reducedMotion.matches || document.hidden || !inView || menuOpen) {
      previousTick = null;
      return;
    }
    const delta = previousTick === null ? 0 : Math.min(time - previousTick, .05);
    previousTick = time;
    elapsed += delta;
    sinceRender += delta;
    if (sinceRender < (compact ? 1 / 30 : 1 / 60)) return;
    draw(sinceRender);
    sinceRender = 0;
  };
  const observer = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    previousTick = null;
  });

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    gsap.ticker.remove(tick);
    observer.disconnect();
    intersection.disconnect();
    window.removeEventListener('scroll', onScroll);
    hero!.removeEventListener('pointermove', onPointerMove);
    hero!.removeEventListener('pointerleave', onPointerLeave);
    toggle!.removeEventListener('click', onToggle);
    reducedMotion.removeEventListener('change', onReducedMotion);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('menu:change', onMenuChange);
    canvas!.removeEventListener('webglcontextlost', onContextLost);
    canvas!.removeEventListener('webglcontextrestored', onContextRestored);
    bundles.forEach(({ dense, light, lines }) => {
      dense.dispose();
      light.dispose();
      lines.material.dispose();
    });
    scene.clear();
    renderer.dispose();
    host.classList.remove('is-webgl-ready');
    toggle!.hidden = true;
  };

  try {
    resize();
    onScroll();
    if (shaderFailed) {
      dispose();
      return () => {};
    }
  } catch {
    dispose();
    return () => {};
  }
  host.classList.add('is-webgl-ready');
  updateToggle();
  observer.observe(host);
  intersection.observe(hero);
  window.addEventListener('scroll', onScroll, { passive: true });
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', onPointerLeave);
  toggle.addEventListener('click', onToggle);
  reducedMotion.addEventListener('change', onReducedMotion);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('menu:change', onMenuChange);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  gsap.ticker.add(tick);
  return dispose;
}
