
(function () {
  const input = document.querySelector('[data-site-search]');
  const results = document.querySelector('[data-search-results]');
  const items = Array.isArray(window.SEARCH_ITEMS) ? window.SEARCH_ITEMS : [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function render(list) {
    results.innerHTML = list.slice(0, 120).map(function (movie) {
      return [
        '<article class="movie-card">',
        '<a class="poster-link" href="./' + escapeHtml(movie.file) + '">',
        '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
        '</a>',
        '<div class="card-content">',
        '<div class="card-meta"><a href="./' + escapeHtml(movie.categoryFile) + '">' + escapeHtml(movie.categoryName) + '</a><span>' + escapeHtml(movie.region) + '</span></div>',
        '<h3><a href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>',
        '<p>' + escapeHtml(movie.oneLine) + '</p>',
        '<div class="tag-row">' + movie.tags.slice(0, 4).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function search(value) {
    const query = value.trim().toLowerCase();
    if (!query) {
      render(items.slice(0, 60));
      return;
    }
    const matched = items.filter(function (movie) {
      return [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags.join(' '),
        movie.oneLine,
        movie.categoryName
      ].join(' ').toLowerCase().includes(query);
    });
    render(matched);
  }

  if (input && results) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    input.value = initial;
    input.addEventListener('input', function () {
      search(input.value);
    });
    search(initial);
  }
})();
