(() => {
  let cleanup = () => {};
  const alignHash = () => {
    cleanup();
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = id && document.getElementById(id);
    if (!target) return;
    let frame = 0;
    let stopped = false;
    let observer;
    let timeout;
    const scrollingKeys = new Set(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ']);
    const align = () => {
      frame = 0;
      if (stopped) return;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const top = Math.min(document.documentElement.scrollHeight - innerHeight,
        Math.max(0, scrollY + target.getBoundingClientRect().top - margin));
      if (Math.abs(top - scrollY) > 2) window.scrollTo({top, behavior:'instant'});
    };
    const schedule = () => { if (!stopped && !frame) frame = requestAnimationFrame(align); };
    const cancelOnKey = event => { if (scrollingKeys.has(event.key)) cleanup(); };
    const media = [...document.querySelectorAll('img,video')].filter(el =>
      Boolean(el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING));
    cleanup = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      observer?.disconnect();
      media.forEach(el => { el.removeEventListener('load', schedule); el.removeEventListener('error', schedule); el.removeEventListener('loadedmetadata', schedule); });
      removeEventListener('wheel', cleanup);
      removeEventListener('touchstart', cleanup);
      removeEventListener('pointerdown', cleanup);
      removeEventListener('keydown', cancelOnKey);
      removeEventListener('resize', schedule);
    };
    media.forEach(el => { el.addEventListener('load', schedule); el.addEventListener('error', schedule); el.addEventListener('loadedmetadata', schedule); });
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(schedule);
      observer.observe(document.querySelector('main') || document.body);
    }
    addEventListener('wheel', cleanup, {passive:true});
    addEventListener('touchstart', cleanup, {passive:true});
    addEventListener('pointerdown', cleanup, {passive:true});
    addEventListener('keydown', cancelOnKey);
    addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    timeout = setTimeout(() => cleanup(), 15000);
    schedule();
  };
  addEventListener('hashchange', alignHash);
  addEventListener('pageshow', alignHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    if (url.hash !== location.hash) {
      history.pushState(null, '', url.hash);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else alignHash();
  });
  alignHash();
})();