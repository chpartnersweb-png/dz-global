import gsap from 'gsap';

export function initPageEntry(): () => void {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  let context: gsap.Context | undefined;
  let frame = 0;
  let disposed = false;
  let finished = false;
  let scheduled = false;
  let fontTimeout: number | undefined;

  const finish = () => {
    if (finished) return;
    finished = true;
    controller.abort();
    window.clearTimeout(fontTimeout);
    window.cancelAnimationFrame(frame);
    root.classList.remove('page-entering');
    const activeContext = context;
    context = undefined;
    activeContext?.revert();
  };

  if (!hero || !header || reducedMotion.matches || !root.classList.contains('page-entering')) {
    finish();
    return () => {};
  }

  const start = () => {
    if (disposed || reducedMotion.matches || !root.classList.contains('page-entering') || window.scrollY > 48) {
      finish();
      return;
    }

    const visual = hero.querySelector<HTMLElement>('[data-hero-visual]');
    const mark = hero.querySelector<HTMLElement>('[data-hero-mark]');
    const planes = document.querySelector<HTMLElement>('[data-hero-tiles]');
    const lines = hero.querySelectorAll<HTMLElement>('[data-hero-line]');
    const labels = hero.querySelectorAll<HTMLElement>('.home-hero__topline, .home-hero__eyebrow');
    const message = hero.querySelector<HTMLElement>('.home-hero__message');
    const footer = hero.querySelector<HTMLElement>('.home-hero__bottom');

    context = gsap.context(() => {
      // Set every start state before releasing the pre-paint visibility gate.
      // Keep the header stationary so the shared menu logo cannot shift.
      gsap.set(header, { autoAlpha: 0 });
      if (visual) gsap.set(visual, { autoAlpha: 0 });
      if (mark) gsap.set(mark, { opacity: 0, scale: .94, transformOrigin: '50% 50%' });
      if (planes) gsap.set(planes, { autoAlpha: 0 });
      gsap.set(lines, { autoAlpha: 0, yPercent: 112 });
      gsap.set(labels, { autoAlpha: 0, y: 10 });
      if (message) gsap.set(message, { autoAlpha: 0, y: 18 });
      if (footer) gsap.set(footer, { autoAlpha: 0, y: 10 });
      root.classList.remove('page-entering');

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });
      if (visual) intro.to(visual, { autoAlpha: 1, duration: .8 }, 0);
      if (mark) intro.to(mark, { opacity: 1, scale: 1, duration: 1.35 }, .03);
      intro.to(header, { autoAlpha: 1, duration: .6 }, .08);
      if (planes) intro.to(planes, { autoAlpha: 1, duration: 1.1 }, .25);
      intro.to(labels, { autoAlpha: 1, y: 0, duration: .6, stagger: .06 }, .22)
        .to(lines, { autoAlpha: 1, yPercent: 0, duration: .95, stagger: .16 }, .4);
      if (message) intro.to(message, { autoAlpha: 1, y: 0, duration: .7 }, .94);
      if (footer) intro.to(footer, { autoAlpha: 1, y: 0, duration: .55 }, 1.2);
    });
  };

  const schedule = () => {
    if (disposed || finished || scheduled) return;
    scheduled = true;
    window.clearTimeout(fontTimeout);
    frame = window.requestAnimationFrame(start);
  };

  // Wait briefly for the local font, without holding the page for slow loading.
  fontTimeout = window.setTimeout(schedule, 350);
  void document.fonts.ready.then(schedule, schedule);
  window.addEventListener('scroll', () => {
    if (window.scrollY > 48) finish();
  }, { passive: true, signal: controller.signal });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) finish();
  }, { signal: controller.signal });
  reducedMotion.addEventListener('change', ({ matches }) => {
    if (matches) finish();
  }, { signal: controller.signal });
  document.addEventListener('menu:change', ((event: CustomEvent<{ open: boolean }>) => {
    if (event.detail.open) finish();
  }) as EventListener, { signal: controller.signal });

  return () => {
    disposed = true;
    controller.abort();
    finish();
  };
}
