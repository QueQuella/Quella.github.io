(() => {
 const button = document.querySelector('.top-button');
 if (!button) return;
 const update = () => {
  const visible = scrollY > Math.max(400, innerHeight * .7);
  button.classList.toggle('is-visible', visible);
  button.setAttribute('aria-hidden', String(!visible));
  button.tabIndex = visible ? 0 : -1;
 };
 addEventListener('scroll', update, {passive:true});
 button.addEventListener('click', e => {
  e.preventDefault();
  scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 });
 update();
})();
