import gsap from 'gsap';
import type { WebGLRenderer } from 'three';

const MAX_PARTICLES = 90000;
const vertexShader = `
  attribute vec4 aVariation;
  attribute float aSize;
  attribute float aTone;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform float uScroll;
  varying float vBlur;
  varying float vOpacity;
  varying float vTone;

  void main() {
    vec3 p = position;
    float phase = aVariation.x * 6.2831853;
    // A slow, coherent drift with smaller individual movements.
    p.x += sin(p.y * 0.44 + uTime * 0.11) * 0.14;
    p.y += sin(p.x * 0.32 + uTime * 0.10) * 0.13;
    p.x += sin(uTime * 0.18 + phase) * 0.055;
    p.y += cos(uTime * 0.15 + phase) * 0.045;
    p.z += sin(uTime * 0.12 + phase) * 0.16;
    p.y += uScroll * 0.32;

    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    float focusDistance = abs(-viewPosition.z - 12.0);
    vBlur = smoothstep(0.5, 3.8, focusDistance);
    float perspectiveSize = clamp(12.0 / max(-viewPosition.z, 1.0), 0.7, 1.5);
    gl_PointSize = clamp(aSize * uSizeScale * uPixelRatio * perspectiveSize * mix(1.0, 3.9, vBlur), 1.0, 20.0);
    vOpacity = aVariation.y * mix(1.0, 0.42, vBlur);
    vTone = aTone;
  }
`;

const fragmentShader = `
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform vec2 uResolution;
  uniform vec4 uCopyBounds;
  uniform vec2 uCopyFeather;
  varying float vBlur;
  varying float vOpacity;
  varying float vTone;

  void main() {
    vec2 point = gl_PointCoord * 2.0 - 1.0;
    float radiusSquared = dot(point, point);
    if (radiusSquared > 1.0) discard;
    float crisp = 1.0 - smoothstep(0.34, 1.0, radiusSquared);
    float soft = exp(-radiusSquared * 3.8) * 0.76;
    float coverage = mix(crisp, soft, vBlur);

    vec2 screen = gl_FragCoord.xy / uResolution;
    // Protect the actual text block, rather than clearing the whole lower-left.
    float insideX = smoothstep(uCopyBounds.x - uCopyFeather.x, uCopyBounds.x, screen.x)
      * (1.0 - smoothstep(uCopyBounds.z, uCopyBounds.z + uCopyFeather.x, screen.x));
    float insideY = smoothstep(uCopyBounds.y - uCopyFeather.y, uCopyBounds.y, screen.y)
      * (1.0 - smoothstep(uCopyBounds.w, uCopyBounds.w + uCopyFeather.y, screen.y));
    float copySpace = mix(1.0, 0.055, insideX * insideY);
    float headerSpace = 1.0 - smoothstep(0.9, 0.999, screen.y);
    float footerSpace = smoothstep(0.015, 0.085, screen.y);
    float alpha = coverage * vOpacity * copySpace * headerSpace * footerSpace;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(mix(uInk, uPaper, vTone), alpha);
    #include <colorspace_fragment>
  }
`;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function sampleReference(image: HTMLImageElement) {
  const width = 512;
  const height = Math.max(1, Math.round(width * image.naturalHeight / image.naturalWidth));
  const samplingCanvas = document.createElement('canvas');
  samplingCanvas.width = width;
  samplingCanvas.height = height;
  const context = samplingCanvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Reference sampling is unavailable');
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const cumulative = new Float64Array(width * height);
  let total = 0;
  for (let index = 0; index < cumulative.length; index++) {
    const offset = index * 4;
    const luminance = (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255;
    const darkness = Math.max(0, (.97 - luminance) / .97 - .012);
    total += Math.pow(darkness, 1.3) + .00004;
    cumulative[index] = total;
  }

  const random = seededRandom(41791);
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const variations = new Float32Array(MAX_PARTICLES * 4);
  const sizes = new Float32Array(MAX_PARTICLES);
  const tones = new Float32Array(MAX_PARTICLES);
  for (let index = 0; index < MAX_PARTICLES; index++) {
    const target = random() * total;
    let low = 0;
    let high = cumulative.length - 1;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (cumulative[middle] < target) low = middle + 1;
      else high = middle;
    }
    const u = (low % width + random()) / width;
    const v = (Math.floor(low / width) + random()) / height;
    const gaussian = Math.sqrt(-2 * Math.log(Math.max(random(), .00001))) * Math.cos(random() * Math.PI * 2);
    positions[index * 3] = (u - .5) * 16;
    positions[index * 3 + 1] = (.5 - v) * 9;
    positions[index * 3 + 2] = Math.max(-3.8, Math.min(3.8, gaussian * 1.25));
    variations[index * 4] = random();
    variations[index * 4 + 1] = .38 + random() * .6;
    variations[index * 4 + 2] = random();
    variations[index * 4 + 3] = random();
    sizes[index] = .75 + Math.pow(random(), 3) * 1.65;
    tones[index] = random() < .045 ? 1 : .025 + random() * .24;
  }
  // The temporary pixel buffer is not retained by the render loop.
  samplingCanvas.width = 0;
  samplingCanvas.height = 0;
  return { positions, variations, sizes, tones };
}

export async function initHeroParticles(host: HTMLElement): Promise<() => void> {
  const canvas = host.querySelector<HTMLCanvasElement>('[data-particles-canvas]');
  const reference = host.querySelector<HTMLImageElement>('[data-particles-reference]');
  const hero = host.closest<HTMLElement>('[data-hero]');
  const toggle = hero?.querySelector<HTMLButtonElement>('[data-hero-motion-toggle]');
  if (!canvas || !reference || !hero || !toggle) return () => {};
  const [THREE] = await Promise.all([import('three'), reference.decode()]);
  if (!host.isConnected || reference.naturalWidth === 0) return () => {};

  let sampled: ReturnType<typeof sampleReference>;
  try {
    sampled = sampleReference(reference);
  } catch {
    return () => {};
  }
  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0xf1f6fc, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };

  const styles = getComputedStyle(host);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 40);
  camera.position.z = 12;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(sampled.positions, 3));
  geometry.setAttribute('aVariation', new THREE.BufferAttribute(sampled.variations, 4));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sampled.sizes, 1));
  geometry.setAttribute('aTone', new THREE.BufferAttribute(sampled.tones, 1));
  const uniforms = {
    uInk: { value: new THREE.Color(styles.getPropertyValue('--ink').trim() || '#0a2035') },
    uPaper: { value: new THREE.Color(styles.getPropertyValue('--paper').trim() || '#f1f6fc') },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uCopyBounds: { value: new THREE.Vector4(0, .1, .62, .48) },
    uCopyFeather: { value: new THREE.Vector2(.045, .055) },
    uPixelRatio: { value: 1 },
    uSizeScale: { value: 1 },
    uTime: { value: 0 },
    uScroll: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, vertexShader, fragmentShader,
    transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
  });
  const particles = new THREE.Points(geometry, material);
  particles.frustumCulled = false;
  const field = new THREE.Group();
  field.add(particles);
  scene.add(field);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const targetPointer = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  const zeroPointer = new THREE.Vector2();
  let compact = false;
  let paused = false;
  let inView = true;
  let menuOpen = document.documentElement.classList.contains('menu-is-open');
  let contextLost = false;
  let disposed = false;
  let elapsed = 0;
  let scrollProgress = 0;
  let previousTick: number | null = null;
  let sinceRender = 0;

  function draw(delta = 0) {
    if (disposed || contextLost) return;
    pointer.lerp(finePointer.matches && !compact && !reducedMotion.matches ? targetPointer : zeroPointer, 1 - Math.exp(-delta * 2.5));
    uniforms.uTime.value = elapsed;
    if (!paused && !reducedMotion.matches) uniforms.uScroll.value = scrollProgress;
    field.rotation.x = -pointer.y * .026;
    field.rotation.y = pointer.x * .045;
    field.rotation.z = Math.sin(elapsed * .07) * .007;
    renderer.render(scene, camera);
  }

  function updateToggle() {
    toggle!.hidden = reducedMotion.matches || contextLost;
    toggle!.setAttribute('aria-pressed', String(paused));
    toggle!.setAttribute('aria-label', paused ? '背景の動きを再生する' : '背景の動きを停止する');
    toggle!.classList.toggle('is-paused', paused);
    const label = toggle!.querySelector('[data-hero-motion-label]');
    if (label) label.textContent = paused ? '動きを再生する' : '動きを止める';
  }

  function measureCopySpace() {
    if (disposed) return;
    const bounds = hero!.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    const text = Array.from(hero!.querySelectorAll<HTMLElement>('.hero__eyebrow, .hero__title, .hero__description, .hero__cta'));
    if (!text.length) return;
    const rects = text.map((element) => element.getBoundingClientRect());
    const left = Math.max(0, (Math.min(...rects.map((rect) => rect.left)) - bounds.left - 8) / bounds.width);
    const right = Math.min(1, (Math.max(...rects.map((rect) => rect.right)) - bounds.left + 8) / bounds.width);
    const bottom = Math.max(0, (bounds.bottom - Math.max(...rects.map((rect) => rect.bottom)) - 10) / bounds.height);
    const top = Math.min(1, (bounds.bottom - Math.min(...rects.map((rect) => rect.top)) + 10) / bounds.height);
    uniforms.uCopyBounds.value.set(left, bottom, right, top);
    uniforms.uCopyFeather.value.set(36 / bounds.width, 44 / bounds.height);
    host.style.setProperty('--copy-center-x', `${(left + right) * 50}%`);
    host.style.setProperty('--copy-center-y', `${100 - (bottom + top) * 50}%`);
    host.style.setProperty('--copy-radius-x', `${(right - left) * bounds.width / 2 + 48}px`);
    host.style.setProperty('--copy-radius-y', `${(top - bottom) * bounds.height / 2 + 48}px`);
  }

  function resize() {
    if (disposed || contextLost) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const aspect = width / height;
    compact = width < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.getDrawingBufferSize(uniforms.uResolution.value);
    uniforms.uPixelRatio.value = pixelRatio;
    uniforms.uSizeScale.value = compact ? .85 : Math.min(1.25, Math.max(.9, width / 1440));
    camera.left = -5 * aspect;
    camera.right = 5 * aspect;
    camera.top = 5;
    camera.bottom = -5;
    camera.updateProjectionMatrix();
    // Fill the full hero height on every device, including portrait tablets and phones.
    field.scale.set(10 * aspect / 16 * 1.08, 10 / 9 * 1.08, 1);
    field.position.set(0, 0, 0);
    geometry.setDrawRange(0, compact ? 22000 : width < 1200 ? 52000 : MAX_PARTICLES);
    measureCopySpace();
    draw();
  }

  const onScroll = () => {
    const rect = hero!.getBoundingClientRect();
    scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || compact || !finePointer.matches || reducedMotion.matches) return;
    const rect = hero!.getBoundingClientRect();
    targetPointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
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
    shaderFailed = false;
    previousTick = null;
    resize();
    if (shaderFailed) {
      dispose();
      return;
    }
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
    if (sinceRender < (compact ? 1 / 30 : 1 / 45)) return;
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
    geometry.dispose();
    material.dispose();
    scene.clear();
    renderer.dispose();
    host.classList.remove('is-webgl-ready');
    toggle!.hidden = true;
  };

  try {
    onScroll();
    resize();
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
  void document.fonts.ready.then(() => {
    if (disposed) return;
    measureCopySpace();
    draw();
  });
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
