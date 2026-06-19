(function () {
  function closest(target, selector) {
    while (target && target !== document) {
      if (target.matches && target.matches(selector)) {
        return target;
      }
      target = target.parentNode;
    }
    return null;
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length) {
    var current = 0;
    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
  filterForms.forEach(function (form) {
    var scope = document.querySelector(form.getAttribute('data-filter-form')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-result]');
    var apply = function () {
      var keyword = normalize(form.querySelector('[name="keyword"]') && form.querySelector('[name="keyword"]').value);
      var year = normalize(form.querySelector('[name="year"]') && form.querySelector('[name="year"]').value);
      var region = normalize(form.querySelector('[name="region"]') && form.querySelector('[name="region"]').value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre')
        ].join(' '));
        var ok = (!keyword || text.indexOf(keyword) !== -1) && (!year || normalize(card.getAttribute('data-year')) === year) && (!region || normalize(card.getAttribute('data-region')).indexOf(region) !== -1);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });
    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    apply();
  });

  var searchGrid = document.querySelector('[data-search-grid]');
  var searchForm = document.querySelector('[data-search-form]');
  if (searchGrid && searchForm) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = searchForm.querySelector('[name="keyword"]');
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var source = player.getAttribute('data-player');
    var ready = false;
    var hlsInstance = null;
    var load = function () {
      if (!video || !source || ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      ready = true;
    };
    var start = function () {
      load();
      if (button) {
        button.classList.add('hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    };
    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('hidden');
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
