const dialog = document.querySelector('.media-dialog');
const stage = dialog.querySelector('.viewer-media');
const previous = dialog.querySelector('.viewer-prev');
const next = dialog.querySelector('.viewer-next');
const count = dialog.querySelector('.viewer-count');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const visibleVideos = new Set();
let gallery = [];
let index = 0;

function updatePreviews() {
  for (const video of document.querySelectorAll('.media-tile video')) {
    if (!dialog.open && !reducedMotion.matches && visibleVideos.has(video)) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleVideos.add(entry.target);
    else visibleVideos.delete(entry.target);
  }
  updatePreviews();
}, { threshold: 0.15 });
document.querySelectorAll('.media-tile video').forEach(video => observer.observe(video));
reducedMotion.addEventListener('change', updatePreviews);

function showItem() {
  const source = gallery[index].firstElementChild;
  const media = source.cloneNode(true);
  if (media instanceof HTMLVideoElement) {
    media.controls = true;
    media.muted = true;
    media.removeAttribute('aria-hidden');
    media.setAttribute('aria-label', gallery[index].getAttribute('aria-label').replace(/^Enlarge /, ''));
  } else {
    media.loading = 'eager';
  }
  stage.querySelector('video')?.pause();
  stage.replaceChildren(media);
  if (media instanceof HTMLVideoElement && !reducedMotion.matches) media.play().catch(() => {});
  previous.hidden = next.hidden = count.hidden = gallery.length < 2;
  count.textContent = `${index + 1} / ${gallery.length}`;
}

function step(offset) {
  if (gallery.length < 2) return;
  index = (index + offset + gallery.length) % gallery.length;
  showItem();
}

for (const tile of document.querySelectorAll('.media-tile')) {
  tile.addEventListener('click', () => {
    gallery = Array.from(tile.closest('.media-grid').querySelectorAll('.media-tile'));
    index = gallery.indexOf(tile);
    dialog.showModal();
    updatePreviews();
    showItem();
  });
}

previous.addEventListener('click', () => step(-1));
next.addEventListener('click', () => step(1));
dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  stage.querySelector('video')?.pause();
  stage.replaceChildren();
  updatePreviews();
});
dialog.addEventListener('keydown', event => {
  if (event.target instanceof HTMLVideoElement) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
