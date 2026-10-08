(() => {
 const button = document.querySelector('.top-button');
 const logo = document.querySelector('.masthead .brand');
 if (!button || !logo) return;
 let queued = false;
 const update = () => {
  queued = false;
  const visible = logo.getBoundingClientRect().bottom <= 0;
  button.classList.toggle('is-visible', visible);
  button.setAttribute('aria-hidden', String(!visible));
  button.tabIndex = visible ? 0 : -1;
 };
 const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule);
 addEventListener('pageshow', update);
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(update, {threshold:0});
  observer.observe(logo);
 }
 button.addEventListener('click', e => {
  e.preventDefault();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:0, behavior:reduced ? 'auto' : 'smooth'});
 });
 update();
})();
