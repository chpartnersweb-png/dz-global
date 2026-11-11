import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initAccordions } from './accordions';
import { initHeroTiles } from './hero-tiles';
import { initPageEntry } from './page-entry';

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
  const cleanupPageEntry = initPageEntry();
  const cleanupHeroTiles = initHeroTiles();

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 22, opacity: 0, duration: .75, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 91%', once: true },
      });
    });
  });
  media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
    const lenis = new Lenis({ lerp: .1, smoothWheel: true, anchors: { offset: -(header.getBoundingClientRect().height + 20) } });
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
    cleanupPageEntry();
    cleanupHeroTiles();
    media.revert();
  };
}
