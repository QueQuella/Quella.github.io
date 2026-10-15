(() => {
  const periods = [...document.querySelectorAll('.journey-period')];
  const yearLinks = [...document.querySelectorAll('.journey-index a')];
  const courseLinks = [...document.querySelectorAll('.journey-course-index a')];
  const menus = [...document.querySelectorAll('[data-journey-for]')];
  const activate = period => {
    if (!period) return;
    menus.forEach(menu => { menu.hidden = menu.dataset.journeyFor !== period.id; });
    yearLinks.forEach(link => {
      if (link.hash === '#' + period.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const courses = [...period.querySelectorAll('.journey-course[id]')];
    let activeCourse = courses[0];
    for (const course of courses) if (course.getBoundingClientRect().top <= innerHeight * .32) activeCourse = course;
    courseLinks.forEach(link => {
      if (activeCourse && link.hash === '#' + activeCourse.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const fromHash = () => {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) activate(target.closest('.journey-period'));
  };
  let frame;
  const track = () => {
    frame = null;
    let active = periods[0];
    for (const period of periods) if (period.getBoundingClientRect().top <= innerHeight * .28) active = period;
    activate(active);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(track); };
  yearLinks.concat(courseLinks).forEach(link => link.addEventListener('click', () => {
    activate(document.getElementById(link.hash.slice(1))?.closest('.journey-period'));
  }));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  addEventListener('hashchange', fromHash);
  track(); fromHash();
})();