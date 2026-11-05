import gsap from 'gsap';

export function initMobileMenu(): () => void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
  const surface = menu?.querySelector<HTMLElement>('[data-menu-surface]');
  if (!toggle || !menu || !surface) return () => {};

  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');
  const header = toggle.closest<HTMLElement>('[data-header]');
  const wordmark = header?.querySelector<HTMLAnchorElement>('[data-header-wordmark]');
  const wordmarkParent = wordmark?.parentElement;
  const makePlaceholder = () => {
    const slot = document.createElement('span');
    slot.className = 'header-control-placeholder';
    slot.setAttribute('aria-hidden', 'true');
    return slot;
  };
  const wordmarkPlaceholder = makePlaceholder();
  const originalParent = toggle.parentElement;
  const placeholder = makePlaceholder();

  const controller = new AbortController();
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = menu.querySelectorAll<HTMLElement>('.mobile-menu__link, .mobile-menu__contact, .mobile-menu__note');
  let animation: gsap.core.Timeline | undefined;
  let expanded = false;
  let locked = false;
  let pendingHash: string | undefined;

  const setExpanded = (open: boolean) => {
    expanded = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  };

  const positionHeaderControls = () => {
    // Preserve the original flex layout and its fractional pixel coordinates.
    // Do not recalculate the vertical center from the header's border box.
    const controls = [
      { element: toggle, slot: placeholder, property: '--menu-toggle' },
      ...(wordmark ? [{ element: wordmark, slot: wordmarkPlaceholder, property: '--menu-wordmark' }] : []),
    ];
    controls.forEach(({ element, slot }) => {
      if (!slot.isConnected) return;
      const size = element.getBoundingClientRect();
      slot.style.width = `${size.width}px`;
      slot.style.height = `${size.height}px`;
    });
    controls.forEach(({ element, slot, property }) => {
      if (!slot.isConnected) return;
      const rect = slot.getBoundingClientRect();
      element.style.setProperty(`${property}-top`, `${rect.top}px`);
      element.style.setProperty(`${property}-left`, `${rect.left}px`);
    });
  };

  const reservePosition = (element: HTMLElement, slot: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    slot.style.width = `${rect.width}px`;
    slot.style.height = `${rect.height}px`;
    element.before(slot);
  };

  const moveHeaderControlsIntoMenu = () => {
    // Reuse the original header elements inside the modal's interactive layer.
    // Keep both outside the animated surface so their appearance stays stable.
    reservePosition(toggle, placeholder);
    menu.prepend(toggle);
    toggle.classList.add('is-in-menu');
    if (wordmark) {
      reservePosition(wordmark, wordmarkPlaceholder);
      menu.prepend(wordmark);
      wordmark.classList.add('is-in-menu');
    }
  };

  const restoreHeaderControls = () => {
    if (placeholder.parentNode) placeholder.replaceWith(toggle);
    else if (toggle.parentElement === menu && originalParent?.isConnected) originalParent.append(toggle);
    toggle.classList.remove('is-in-menu');
    toggle.style.removeProperty('--menu-toggle-top');
    toggle.style.removeProperty('--menu-toggle-left');
    if (wordmark) {
      if (wordmarkPlaceholder.parentNode) wordmarkPlaceholder.replaceWith(wordmark);
      else if (wordmark.parentElement === menu && wordmarkParent?.isConnected) wordmarkParent.prepend(wordmark);
      wordmark.classList.remove('is-in-menu');
      wordmark.style.removeProperty('--menu-wordmark-top');
      wordmark.style.removeProperty('--menu-wordmark-left');
    }
  };

  const setLocked = (open: boolean) => {
    document.documentElement.classList.toggle('menu-is-open', open);
    if (locked === open) return;
    locked = open;
    document.dispatchEvent(new CustomEvent('menu:change', { detail: { open } }));
  };

  const clearMotionStyles = () => {
    gsap.set(menu, { clearProps: 'opacity,transform,--menu-backdrop-opacity' });
    gsap.set(surface, { clearProps: 'opacity,transform' });
    gsap.set(items, { clearProps: 'opacity,transform' });
  };

  const navigateToSection = (hash: string) => {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) {
      window.location.hash = hash;
      return;
    }
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  const finishClose = (restoreFocus = true) => {
    animation?.kill();
    animation = undefined;
    setExpanded(false);
    if (menu.open) menu.close();
    restoreHeaderControls();
    clearMotionStyles();
    setLocked(false);
    if (restoreFocus && !desktop.matches && toggle.isConnected) toggle.focus({ preventScroll: true });
    const hash = pendingHash;
    pendingHash = undefined;
    if (hash) navigateToSection(hash);
  };

  const finishOpen = () => {
    animation?.kill();
    animation = undefined;
    gsap.set(menu, { clearProps: 'opacity,transform', '--menu-backdrop-opacity': 1 });
    gsap.set(surface, { clearProps: 'opacity,transform' });
    gsap.set(items, { clearProps: 'opacity,transform' });
  };

  const openMenu = () => {
    if (desktop.matches || expanded) return;
    animation?.kill();
    animation = undefined;
    pendingHash = undefined;
    const wasOpen = menu.open;
    if (!wasOpen) {
      gsap.set(menu, { '--menu-backdrop-opacity': 0 });
      gsap.set(surface, { opacity: 0, y: -12 });
      gsap.set(items, { opacity: 0, y: 16 });
      moveHeaderControlsIntoMenu();
      menu.showModal();
      positionHeaderControls();
      surface.scrollTop = 0;
      toggle.focus({ preventScroll: true });
    }
    setExpanded(true);
    setLocked(true);
    if (reducedMotion.matches) {
      finishOpen();
      return;
    }
    animation = gsap.timeline({ onComplete: finishOpen })
      .to(surface, { opacity: 1, y: 0, duration: .38, ease: 'power2.out' }, 0)
      .to(menu, { '--menu-backdrop-opacity': 1, duration: .38, ease: 'power2.out' }, 0)
      .to(items, { opacity: 1, y: 0, duration: .36, stagger: .05, ease: 'power2.out' }, .08);
  };

  const closeMenu = (immediate = false) => {
    if (!menu.open) return;
    if (immediate || reducedMotion.matches) {
      finishClose();
      return;
    }
    if (!expanded) return;
    animation?.kill();
    setExpanded(false);
    // Keep the native modal and scroll lock until the exit animation finishes.
    animation = gsap.timeline({ onComplete: () => finishClose() })
      .to(items, { opacity: 0, y: -8, duration: .18, stagger: { each: .02, from: 'end' }, ease: 'power1.in' }, 0)
      .to(surface, { opacity: 0, y: -10, duration: .3, ease: 'power2.inOut' }, 0)
      .to(menu, { '--menu-backdrop-opacity': 0, duration: .3, ease: 'power2.inOut' }, 0);
  };

  toggle.addEventListener('click', () => expanded ? closeMenu() : openMenu(), { signal: controller.signal });
  menu.addEventListener('cancel', (event) => {
    // Delay native Escape dismissal so it uses the same exit animation.
    event.preventDefault();
    closeMenu();
  }, { signal: controller.signal });
  menu.addEventListener('close', () => {
    if (!menu.open) finishClose();
  }, { signal: controller.signal });

  const links = [...menu.querySelectorAll<HTMLAnchorElement>('a')];
  if (wordmark) links.push(wordmark);
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!menu.open) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      const samePage = link.origin === window.location.origin && link.pathname === window.location.pathname && link.search === window.location.search;
      if (samePage && link.hash) {
        event.preventDefault();
        pendingHash = link.hash;
      }
      closeMenu();
    }, { signal: controller.signal });
  });

  desktop.addEventListener('change', ({ matches }) => {
    if (matches && menu.open) {
      pendingHash = undefined;
      closeMenu(true);
    }
  }, { signal: controller.signal });
  window.addEventListener('resize', () => {
    if (menu.open) positionHeaderControls();
  }, { passive: true, signal: controller.signal });
  const headerObserver = header ? new ResizeObserver(() => {
    if (menu.open) positionHeaderControls();
  }) : undefined;
  if (header) headerObserver?.observe(header);
  reducedMotion.addEventListener('change', () => {
    if (!menu.open) return;
    if (expanded) finishOpen(); else finishClose();
  }, { signal: controller.signal });

  return () => {
    controller.abort();
    headerObserver?.disconnect();
    pendingHash = undefined;
    finishClose(false);
  };
}
