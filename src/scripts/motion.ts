import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initAccordions } from './accordions';
import { initHeroTiles } from './hero-tiles';

export function initMotion(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const header = document.querySelector<HTMLElement>('[data-header]');
  const visual = document.querySelector<HTMLElement>('[data-hero-visual]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!header || !visual || !hero) return () => {};
  const controller = new AbortController();
  const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 32);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true, signal: controller.signal });

  const cleanupAccordions = initAccordions(() => ScrollTrigger.refresh());
  const cleanupHeroTiles = initHeroTiles();

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    // Content remains visible in the HTML if JavaScript is unavailable.
    const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    intro.from(visual, { opacity: 0, duration: .9 }, 0)
      .from('[data-hero-mark]', { opacity: 0, duration: 1.3 }, 0)
      .from('[data-hero-line]', { y: 16, opacity: 0, duration: .8, stagger: .12 }, .12)
      .from('[data-hero-detail]', { y: 9, opacity: 0, duration: .65, stagger: .035 }, .35);
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 22, opacity: 0, duration: .75, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 91%', once: true },
      });
    });
  });
  media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
    const lenis = new Lenis({ lerp: .1, smoothWheel: true, anchors: { offset: -96 } });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const handleMenu = ((event: CustomEvent<{ open: boolean }>) => { event.detail.open ? lenis.stop() : lenis.start(); }) as EventListener;
    document.addEventListener('menu:change', handleMenu);
    return () => {
      document.removeEventListener('menu:change', handleMenu);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  });
  return () => {
    controller.abort();
    cleanupAccordions();
    cleanupHeroTiles();
    media.revert();
  };
}
