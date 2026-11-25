// Galería: cada elemento con data-gallery="a.jpg,b.jpg" abre las imágenes a pantalla completa
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lb-img');
const lbN = document.getElementById('lb-n');
let gal = [], idx = 0, galAlt = '', opener = null;

function show(i) {
  idx = (i + gal.length) % gal.length;
  lbImg.src = 'assets/img/' + gal[idx];
  lbImg.alt = gal.length > 1 ? `${galAlt} (${idx + 1} de ${gal.length})` : galAlt;
  lbN.textContent = gal.length > 1 ? `${idx + 1} / ${gal.length}` : '';
  document.querySelectorAll('.lb-prev,.lb-next').forEach(b => { b.hidden = gal.length < 2; });
}

document.querySelectorAll('[data-gallery]').forEach(el => el.addEventListener('click', () => {
  opener = el;
  gal = el.dataset.gallery.split(',').map(s => s.trim());
  galAlt = el.querySelector('img')?.alt || '';
  show(0);
  if (lb.showModal) lb.showModal(); else window.open(lbImg.src, '_blank');
}));
document.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
document.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
document.querySelector('.lb-close').addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-in')) lb.close(); });
lb.addEventListener('close', () => opener?.focus());
document.addEventListener('keydown', e => {
  if (!lb.open) return;
  if (e.key === 'ArrowRight') show(idx + 1);
  if (e.key === 'ArrowLeft') show(idx - 1);
});
let tx = null;
lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 50 && gal.length > 1) show(idx + (dx < 0 ? 1 : -1));
});

// Formulario: arma el mensaje y abre WhatsApp de Martín
const WA_NUM = '5493855861068';
const WA_INTRO = 'Hola Martín, vi tu portfolio y quiero consultarte:';
document.querySelectorAll('form[data-wa-form]').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const lines = [WA_INTRO, ''];
  const add = (label, v) => { if (v && String(v).trim()) lines.push(`*${label}:* ${String(v).trim()}`); };
  add('Nombre', d.get('nombre'));
  add('WhatsApp', d.get('whatsapp'));
  add('Negocio', d.get('negocio'));
  add('Necesito', d.getAll('servicio').join(', '));
  add('Cantidad', d.get('cantidad'));
  add('Mensaje', d.get('mensaje'));
  window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
}));
