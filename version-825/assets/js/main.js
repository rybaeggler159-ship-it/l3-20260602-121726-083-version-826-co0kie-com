
(() => {
  const btn = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('open'));
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  if (slides.length) {
    let active = 0;
    const show = (i) => {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === active));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === active));
    };
    dots.forEach((dot, idx) => dot.addEventListener('click', () => show(idx)));
    window.setInterval(() => show(active + 1), 5000);
  }
  const input = document.querySelector('[data-search-input]');
  const region = document.querySelector('[data-filter-region]');
  const cat = document.querySelector('[data-filter-category]');
  const year = document.querySelector('[data-filter-year]');
  const items = Array.from(document.querySelectorAll('[data-search-item]'));
  const count = document.querySelector('[data-result-count]');
  const reset = document.querySelector('[data-filter-reset]');
  const filter = () => {
    if (!items.length) return;
    const q = (input?.value || '').trim().toLowerCase();
    const r = region?.value || '';
    const c = cat?.value || '';
    const y = year?.value || '';
    let visible = 0;
    items.forEach(item => {
      const text = (item.dataset.searchText || '').toLowerCase();
      const ok = (!q || text.includes(q)) && (!r || item.dataset.region === r) && (!c || item.dataset.category === c) && (!y || item.dataset.year === y);
      item.classList.toggle('hidden-by-filter', !ok);
      if (ok) visible++;
    });
    if (count) count.textContent = visible;
  };
  [input, region, cat, year].forEach(el => el && el.addEventListener('input', filter));
  if (reset) reset.addEventListener('click', () => { if(input) input.value=''; if(region) region.value=''; if(cat) cat.value=''; if(year) year.value=''; filter(); });
  filter();
})();
