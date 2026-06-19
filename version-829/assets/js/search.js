(function () {
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var summary = document.getElementById('searchSummary');
  var data = window.__SEARCH_DATA__ || [];
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  function esc(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + esc(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-wrap" href="' + esc(item.file) + '" aria-label="' + esc(item.title) + '">' +
      '<img src="' + esc(item.cover) + '" alt="' + esc(item.title) + '" loading="lazy">' +
      '<span class="play-dot">▶</span>' +
      '</a>' +
      '<div class="card-body">' +
      '<h2><a href="' + esc(item.file) + '">' + esc(item.title) + '</a></h2>' +
      '<p class="meta-line">' + esc(item.year) + ' · ' + esc(item.region) + ' · ' + esc(item.type) + ' · ' + esc(item.genre) + '</p>' +
      '<p class="card-desc">' + esc(item.oneLine) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '<div class="card-actions"><a class="mini-btn" href="' + esc(item.file) + '">立即观看</a></div>' +
      '</div>' +
      '</article>';
  }

  function render(q) {
    var keyword = String(q || '').trim().toLowerCase();
    if (input) {
      input.value = q;
    }
    var list = keyword ? data.filter(function (item) {
      var text = [item.title, item.year, item.region, item.type, item.genre, item.category, item.oneLine, (item.tags || []).join(' ')].join(' ').toLowerCase();
      return text.indexOf(keyword) !== -1;
    }) : data.slice(0, 48);
    list = list.slice(0, 120);
    if (summary) {
      summary.textContent = keyword ? '为你找到 ' + list.length + ' 条相关内容' : '展示最新精选内容';
    }
    if (results) {
      results.innerHTML = list.map(card).join('');
    }
  }

  render(query);
})();
