const sections = [...document.querySelectorAll('main > section[id]')];
const links = [...document.querySelectorAll('.side-main')];
function activate(id) {
  document.body.dataset.activeSection = id;
  links.forEach(link => link.setAttribute('aria-current', link.dataset.section === id ? 'page' : 'false'));
}
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
  if (visible) activate(visible.target.id);
}, {rootMargin:'-10% 0px -55% 0px', threshold:[0,.1,.5]});
sections.forEach(section => observer.observe(section));
links.forEach(link => link.addEventListener('click', () => activate(link.dataset.section)));
activate(location.hash.slice(1) || 'about');
