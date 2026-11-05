import gsap from 'gsap';

// Keep native details/summary behavior when JavaScript is unavailable.
export function initAccordions(onLayoutChange: () => void): () => void {
  const controller = new AbortController();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLDetailsElement>('[data-business-area]').forEach((area) => {
    const summary = area.querySelector<HTMLElement>(':scope > summary');
    const panel = area.querySelector<HTMLElement>(':scope > [data-accordion-panel]');
    const content = panel?.querySelector<HTMLElement>('[data-accordion-content]');
    if (!summary || !panel || !content) return;

    let expanded = area.open;
    let animation: gsap.core.Timeline | undefined;
    let targetHeight = 0;

    const syncState = () => {
      area.dataset.accordionExpanded = String(expanded);
      summary.setAttribute('aria-expanded', String(expanded));
      // Native closed details already hides its content; inert is only needed
      // while the still-open element is visually collapsing.
      panel.inert = !expanded && area.open;
    };

    const settle = (next: boolean) => {
      animation?.kill();
      animation = undefined;
      expanded = next;
      area.open = expanded;
      syncState();
      // Return to natural height so wrapping and font changes remain responsive.
      gsap.set(panel, { clearProps: 'height,overflow' });
      gsap.set(content, { clearProps: 'opacity' });
      onLayoutChange();
    };

    const animateTo = (next: boolean) => {
      const wasOpen = area.open;
      const currentHeight = wasOpen ? panel.getBoundingClientRect().height : 0;
      animation?.kill();
      animation = undefined;
      expanded = next;
      syncState();

      if (!expanded && panel.contains(document.activeElement)) {
        summary.focus({ preventScroll: true });
      }
      if (reducedMotion.matches) {
        settle(expanded);
        return;
      }

      // Closing must finish before removing open; otherwise details hides instantly.
      if (!wasOpen) {
        area.open = true;
        gsap.set(content, { opacity: 0 });
      }
      gsap.set(panel, { height: currentHeight, overflow: 'hidden' });
      targetHeight = expanded ? content.getBoundingClientRect().height : 0;

      animation = gsap.timeline({
        onComplete: () => {
          animation = undefined;
          settle(expanded);
        },
      });
      animation.to(panel, {
        height: targetHeight,
        duration: expanded ? .44 : .32,
        ease: expanded ? 'power2.out' : 'power2.inOut',
      }, 0).to(content, {
        opacity: expanded ? 1 : 0,
        duration: expanded ? .3 : .2,
        ease: 'power1.out',
      }, expanded ? .04 : 0);
    };

    syncState();
    summary.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, input, select, textarea')) return;
      // Enter and Space on native summary generate the same click event.
      event.preventDefault();
      animateTo(!expanded);
    }, { signal: controller.signal });

    area.addEventListener('toggle', () => {
      // Browser-driven changes (e.g. find-in-page) retain native state semantics.
      if (!animation) settle(area.open);
    }, { signal: controller.signal });

    reducedMotion.addEventListener('change', () => settle(expanded), { signal: controller.signal });

    const observer = new ResizeObserver(() => {
      if (animation && expanded && Math.abs(content.getBoundingClientRect().height - targetHeight) > .5) {
        animateTo(true);
      }
    });
    observer.observe(content);

    cleanups.push(() => {
      observer.disconnect();
      animation?.kill();
      area.open = expanded;
      panel.inert = false;
      delete area.dataset.accordionExpanded;
      summary.removeAttribute('aria-expanded');
      gsap.set(panel, { clearProps: 'height,overflow' });
      gsap.set(content, { clearProps: 'opacity' });
    });
  });

  return () => {
    controller.abort();
    cleanups.forEach((cleanup) => cleanup());
  };
}
