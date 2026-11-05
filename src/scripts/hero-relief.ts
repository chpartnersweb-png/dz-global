import gsap from 'gsap';
import type { WebGLRenderer } from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform float uAspect;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  varying vec2 vUv;

  // A continuous matte relief surface, with a few broad, open contours.
  float heightAt(vec2 p) {
    vec2 focus = vec2(uAspect * 0.53 + 0.12, 0.27 + uScroll * 0.035);
    vec2 q = p - focus + uPointer * 0.014;
    q.x += sin(q.y * 2.0 + 0.6) * 0.055;
    q.y += cos(q.x * 2.2 - 0.2) * 0.035;
    float distanceFromEdge = length(q * vec2(0.88, 1.06));
    float phase = distanceFromEdge * 17.0 + q.x * 0.48 - uTime * 0.047 - uScroll * 0.3;
    return sin(phase) * 0.044 + sin(phase * 2.0 - 0.35) * 0.011;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float h = heightAt(p);
    float stepSize = 0.0018;
    float dx = (heightAt(p + vec2(stepSize, 0.0)) - heightAt(p - vec2(stepSize, 0.0))) / (2.0 * stepSize);
    float dy = (heightAt(p + vec2(0.0, stepSize)) - heightAt(p - vec2(0.0, stepSize))) / (2.0 * stepSize);
    vec3 normal = normalize(vec3(-dx, -dy, 1.0));
    vec3 light = normalize(vec3(-0.4 + uPointer.x * 0.13, 0.58 + uPointer.y * 0.08, 0.84));
    float diffuse = max(dot(normal, light), 0.0);
    float valley = 1.0 - smoothstep(-0.052, -0.014, h);
    float occlusion = valley * valley * 0.53;
    float shade = clamp(0.76 + diffuse * 0.24 - occlusion, 0.14, 1.0);

    // Keep the lettering, navigation and footer on a quiet, pale surface.
    float besideCopy = smoothstep(0.3, 0.78, vUv.x);
    float aboveCopy = smoothstep(0.42, 0.7, vUv.y);
    float composition = mix(0.025, 1.0, max(besideCopy, aboveCopy));
    float headerSpace = 1.0 - smoothstep(0.83, 0.995, vUv.y);
    float footerSpace = smoothstep(0.035, 0.15, vUv.y);
    float strength = composition * headerSpace * footerSpace;
    float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.004;
    float tone = clamp(1.0 - (1.0 - shade) * strength + grain * strength, 0.0, 1.0);
    gl_FragColor = vec4(mix(uInk, uPaper, tone), 1.0);
    #include <colorspace_fragment>
  }
`;

export async function initHeroRelief(host: HTMLElement): Promise<() => void> {
  const canvas = host.querySelector<HTMLCanvasElement>('[data-relief-canvas]');
  const hero = host.closest<HTMLElement>('[data-hero]');
  const toggle = hero?.querySelector<HTMLButtonElement>('[data-hero-motion-toggle]');
  if (!canvas || !hero || !toggle) return () => {};
  const THREE = await import('three');
  if (!host.isConnected) return () => {};

  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };

  const styles = getComputedStyle(host);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    uPaper: { value: new THREE.Color(styles.getPropertyValue('--paper').trim() || '#f4f8fa') },
    uInk: { value: new THREE.Color(styles.getPropertyValue('--ink').trim() || '#081824') },
    uAspect: { value: 1 },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
  };
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false, toneMapped: false });
  const surface = new THREE.Mesh(geometry, material);
  surface.frustumCulled = false;
  scene.add(surface);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const targetPointer = new THREE.Vector2();
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
    const respond = finePointer.matches && !compact && !reducedMotion.matches;
    uniforms.uPointer.value.lerp(respond ? targetPointer : zeroPointer, 1 - Math.exp(-delta * 2.6));
    uniforms.uTime.value = elapsed;
    if (!paused && !reducedMotion.matches) uniforms.uScroll.value = scrollProgress;
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

  function resize() {
    if (disposed || contextLost) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    compact = width < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5));
    renderer.setSize(width, height, false);
    uniforms.uAspect.value = width / height;
    draw();
  }

  const onScroll = () => {
    const rect = hero!.getBoundingClientRect();
    scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || compact || reducedMotion.matches) return;
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
    uniforms.uPointer.value.set(0, 0);
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
    if (shaderFailed) return;
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
    if (sinceRender < (compact ? 1 / 24 : 1 / 45)) return;
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
