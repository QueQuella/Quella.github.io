(() => {
  const fit = () => document.querySelectorAll('.side-index a, .subnav a, .archive-primary a, .archive-secondary a').forEach(a => {
    a.style.fontSize = '';
    let size = parseFloat(getComputedStyle(a).fontSize);
    while (a.scrollWidth > a.clientWidth + 1 && size > 6) { size -= .25; a.style.fontSize = size + 'px'; }
  });
  addEventListener('resize', fit); document.fonts.ready.then(fit); fit();
  if (!document.body.classList.contains('archive-page')) return;
  const groups = [...document.querySelectorAll('[data-archive-section]')];
  const activate = id => {
    document.body.dataset.archiveActive = id;
    document.querySelectorAll('[data-archive]').forEach(a => {
      if (a.dataset.archive === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    fit();
  };
  const track = () => {
    let current = 'images';
    for (const group of groups) if (group.getBoundingClientRect().top <= innerHeight * .3) current = group.dataset.archiveSection;
    activate(current);
  };
  document.querySelectorAll('[data-archive]').forEach(a => a.addEventListener('click', () => activate(a.dataset.archive)));
  const fromHash = () => { const target = document.getElementById(location.hash.slice(1)); activate(target?.closest('[data-archive-section]')?.dataset.archiveSection || 'images'); };
  addEventListener('scroll', track, {passive:true}); addEventListener('hashchange', fromHash); fromHash();
})();
