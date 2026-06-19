(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.movie-search'));
  var sortableGrid = document.querySelector('.sortable-grid');
  var sortSelect = document.querySelector('.movie-sort');

  function filterCards(value) {
    var normalized = String(value || '').trim().toLowerCase();
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));

    cards.forEach(function (card) {
      var haystack = String(card.getAttribute('data-search') || '').toLowerCase();
      card.classList.toggle('hidden-card', normalized && haystack.indexOf(normalized) === -1);
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      filterCards(input.value);
    });
  });

  if (sortSelect && sortableGrid) {
    sortSelect.addEventListener('change', function () {
      var cards = Array.prototype.slice.call(sortableGrid.querySelectorAll('.movie-card'));
      var mode = sortSelect.value;

      cards.sort(function (a, b) {
        if (mode === 'title-asc') {
          var titleA = a.querySelector('.movie-title').textContent.trim();
          var titleB = b.querySelector('.movie-title').textContent.trim();
          return titleA.localeCompare(titleB, 'zh-CN');
        }

        if (mode === 'year-desc') {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        }

        return 0;
      });

      cards.forEach(function (card) {
        sortableGrid.appendChild(card);
      });
    });
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');

  if (query && searchInputs.length) {
    searchInputs[0].value = query;
    filterCards(query);
  }
})();
