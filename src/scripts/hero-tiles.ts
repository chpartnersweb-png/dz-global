import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WebGLRenderer } from 'three';

const vertexShader = `
  attribute float aTone;
  attribute float aOpacity;
  uniform float uRadius;
  varying float vTone;
  varying float vOpacity;
  void main() {
    vec4 p = instanceMatrix * vec4(position, 1.0);
    vTone = aTone;
    vOpacity = aOpacity * mix(0.3, 1.0, smoothstep(-uRadius, uRadius, p.z));
    gl_Position = projectionMatrix * modelViewMatrix * p;
  }
`;

const fragmentShader = `
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform vec2 uResolution;
  uniform vec4 uHeroCopy;
  uniform vec4 uAboutCopy;
  uniform float uAboutEdge;
  varying float vTone;
  varying float vOpacity;
  float textMask(vec2 p, vec4 rect) {
    float f = 0.025;
    return smoothstep(rect.x - f, rect.x, p.x)
      * (1.0 - smoothstep(rect.z, rect.z + f, p.x))
      * smoothstep(rect.y - f, rect.y, p.y)
      * (1.0 - smoothstep(rect.w, rect.w + f, p.y));
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    uv.y = 1.0 - uv.y;
    float onDark = step(uAboutEdge, uv.y);
    vec3 color = mix(mix(uInk, uPaper, vTone), mix(uPaper, uInk, vTone), onDark);
    float alpha = vOpacity;
    alpha *= 1.0 - 0.95 * textMask(uv, uHeroCopy);
    alpha *= 1.0 - 0.96 * textMask(uv, uAboutCopy);
    alpha *= 0.25 + 0.75 * smoothstep(0.07, 0.23, uv.y);
    alpha *= 0.35 + 0.65 * smoothstep(0.02, 0.12, 1.0 - uv.y);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export function initHeroTiles(): () => void {
  const story = document.querySelector<HTMLElement>('[data-hero-story]');
  const host = story?.querySelector<HTMLElement>('[data-hero-tiles]');
  const hero = story?.querySelector<HTMLElement>('[data-hero]');
  const about = story?.querySelector<HTMLElement>('.about-section');
  if (!story || !host || !hero || !about) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    let cancelled = false;
    let release: (() => void) | undefined;

    // Keep the first paint and the existing ampersand independent of WebGL.
    void import('three').then((THREE) => {
      if (cancelled) return;
      const touchDevice = window.matchMedia('(pointer: coarse)').matches;
      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !touchDevice, powerPreference: 'low-power' });
      } catch {
        return; // The small CSS panels remain as the static fallback.
      }

      const compact = window.matchMedia('(max-width: 767px)').matches;
      const count = compact || touchDevice ? 90 : 156;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
      camera.position.z = 12;
      const palette = getComputedStyle(story);
      const uniforms = {
        uInk: { value: new THREE.Color(palette.getPropertyValue('--ink').trim() || '#2b405f') },
        uPaper: { value: new THREE.Color(palette.getPropertyValue('--paper').trim() || '#ffffff') },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uHeroCopy: { value: new THREE.Vector4(-2, -2, -1, -1) },
        uAboutCopy: { value: new THREE.Vector4(-2, -2, -1, -1) },
        uAboutEdge: { value: 2 },
        uRadius: { value: 3 },
      };
      const geometry = new THREE.PlaneGeometry(1, 1);
      const tones = new Float32Array(count);
      const opacities = new Float32Array(count);
      const material = new THREE.ShaderMaterial({
        uniforms, vertexShader, fragmentShader, transparent: true,
        side: THREE.DoubleSide, depthWrite: false,
      });
      const tiles = new THREE.InstancedMesh(geometry, material, count);
      tiles.frustumCulled = false;
      tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(tiles);

      let randomState = 9371;
      const random = () => {
        randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
        return randomState / 4294967296;
      };
      const seeds = Array.from({ length: count }, (_, index) => {
        const y = 1 - 2 * (index + .5) / count;
        const ring = Math.sqrt(1 - y * y);
        const theta = index * Math.PI * (3 - Math.sqrt(5));
        tones[index] = .04 + random() * .58;
        opacities[index] = .3 + random() * .48;
        return {
          x: random() * 2 - 1, y: random() * 2 - 1, z: random() * 6 - 3.8,
          size: random(), ratio: .7 + random() * .8, angle: (random() - .5) * .22,
          phase: random() * Math.PI * 2,
          normal: new THREE.Vector3(Math.cos(theta) * ring, y, Math.sin(theta) * ring),
        };
      });
      geometry.setAttribute('aTone', new THREE.InstancedBufferAttribute(tones, 1));
      geometry.setAttribute('aOpacity', new THREE.InstancedBufferAttribute(opacities, 1));

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = 'hero-story__canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.append(renderer.domElement);
      story.classList.add('hero-story--enhanced');

      let width = 1;
      let height = 1;
      let visible = true;
      let paused = document.documentElement.classList.contains('menu-is-open');
      let elapsed = 0;
      let previousTime = 0;
      const state = { morph: 0, shift: 0 };
      const dummy = new THREE.Object3D();
      const scatter = new THREE.Vector3();
      const normal = new THREE.Vector3();
      const sphere = new THREE.Vector3();
      const zAxis = new THREE.Vector3(0, 0, 1);
      const rotation = new THREE.Quaternion();
      const flatRotation = new THREE.Quaternion();
      const sphereRotation = new THREE.Quaternion();
      const euler = new THREE.Euler();
      const heroCopy = Array.from(hero.querySelectorAll<HTMLElement>('.home-hero__title, .home-hero__message'));
      const aboutCopy = Array.from(about.querySelectorAll<HTMLElement>('.about-section__body'));

      const updateCopyBounds = (elements: HTMLElement[], destination: InstanceType<typeof THREE.Vector4>, hostTop: number) => {
        let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          left = Math.min(left, rect.left - 12);
          top = Math.min(top, rect.top - 12);
          right = Math.max(right, rect.right + 12);
          bottom = Math.max(bottom, rect.bottom + 12);
        });
        destination.set(left / width, (top - hostTop) / height, right / width, (bottom - hostTop) / height);
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: story, start: 'top top', end: () => `+=${hero.offsetHeight * 1.1}`,
          scrub: .75, invalidateOnRefresh: true,
        },
      });
      timeline.to(state, { morph: 1, duration: .78, ease: 'none' }, .04)
        .to(state, { shift: 1, duration: .62, ease: 'none' }, .34);

      const draw = (time: number) => {
        const delta = previousTime ? Math.min(time - previousTime, .05) : 0;
        previousTime = time;
        if (!visible || paused || document.hidden) return;
        elapsed += delta;

        const hostRect = host.getBoundingClientRect();
        const isMobile = width < 768;
        const viewHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const viewWidth = viewHeight * camera.aspect;
        const unit = Math.min(viewWidth, viewHeight);
        const radius = Math.min(viewHeight * .4, viewWidth * .51) * (1 - state.shift * .17);
        const centerX = viewWidth * (isMobile ? .37 : .39) * state.shift;
        const centerY = isMobile ? viewHeight * .08 * state.shift : 0;
        rotation.setFromEuler(euler.set(.12 * state.morph, elapsed * .065 + state.morph * .32, .04 * state.morph));
        uniforms.uRadius.value = radius;
        uniforms.uAboutEdge.value = (about.getBoundingClientRect().top - hostRect.top) / height;
        updateCopyBounds(heroCopy, uniforms.uHeroCopy.value, hostRect.top);
        updateCopyBounds(aboutCopy, uniforms.uAboutCopy.value, hostRect.top);

        seeds.forEach((seed, index) => {
          scatter.set(
            seed.x * viewWidth * .6 + Math.sin(elapsed * .12 + seed.phase) * .08,
            seed.y * viewHeight * .6 + Math.cos(elapsed * .1 + seed.phase) * .07,
            seed.z,
          );
          normal.copy(seed.normal).applyQuaternion(rotation);
          sphere.copy(normal).multiplyScalar(radius);
          sphere.x += centerX;
          sphere.y += centerY;
          dummy.position.lerpVectors(scatter, sphere, state.morph);
          flatRotation.setFromAxisAngle(zAxis, seed.angle);
          sphereRotation.setFromUnitVectors(zAxis, normal);
          dummy.quaternion.copy(flatRotation).slerp(sphereRotation, state.morph);
          const scatteredWidth = unit * (.027 + seed.size * seed.size * .16);
          const sphereWidth = radius * (.13 + seed.size * .2);
          const tileWidth = THREE.MathUtils.lerp(scatteredWidth, sphereWidth, state.morph);
          dummy.scale.set(tileWidth, tileWidth / seed.ratio, 1);
          dummy.updateMatrix();
          tiles.setMatrixAt(index, dummy.matrix);
        });
        tiles.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
      };

      const resize = () => {
        const rect = host.getBoundingClientRect();
        const nextWidth = Math.max(1, rect.width);
        const nextHeight = Math.max(1, rect.height);
        if (nextWidth === width && nextHeight === height) return;
        width = nextWidth;
        height = nextHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, touchDevice ? 1.25 : width < 768 ? 1.4 : 1.75));
        renderer.setSize(width, height, false);
        renderer.getDrawingBufferSize(uniforms.uResolution.value);
        // Resizing a decorative canvas does not change document layout.
        // Do not refresh scroll positions from a ResizeObserver callback.
      };
      let resizeFrame = 0;
      const resizeObserver = new ResizeObserver(() => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(resize);
      });
      resizeObserver.observe(host);
      const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '100px' });
      visibilityObserver.observe(story);
      const onMenuChange = ((event: CustomEvent<{ open: boolean }>) => { paused = event.detail.open; }) as EventListener;
      document.addEventListener('menu:change', onMenuChange);
      const onContextLost = (event: Event) => {
        event.preventDefault();
        release?.();
        release = undefined;
        ScrollTrigger.refresh();
      };
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);

      release = () => {
        gsap.ticker.remove(draw);
        timeline.scrollTrigger?.kill();
        timeline.kill();
        resizeObserver.disconnect();
        window.cancelAnimationFrame(resizeFrame);
        visibilityObserver.disconnect();
        document.removeEventListener('menu:change', onMenuChange);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        geometry.dispose();
        material.dispose();
        tiles.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        story.classList.remove('hero-story--enhanced');
        host.classList.remove('is-webgl-ready');
      };
      resize();
      draw(0);
      // The enhanced About layout is the only initial layout change here.
      // A safe refresh waits until an active scroll gesture has finished.
      ScrollTrigger.refresh(true);
      host.classList.add('is-webgl-ready');
      gsap.ticker.add(draw);
    }).catch(() => {
      release?.();
      release = undefined;
    });

    return () => {
      cancelled = true;
      release?.();
      release = undefined;
    };
  });

  return () => media.revert();
}
