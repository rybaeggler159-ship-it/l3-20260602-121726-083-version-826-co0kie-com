(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(
      slider.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      slider.querySelectorAll("[data-hero-dot]"),
    );
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initSearchAndFilters() {
    var scopes = Array.prototype.slice.call(
      document.querySelectorAll("[data-card-scope]"),
    );
    if (!scopes.length) {
      return;
    }

    function apply(scope) {
      var form = document.querySelector("[data-search-form]");
      var keyword = "";
      if (form) {
        var input = form.querySelector("input[type='search']");
        keyword = input ? input.value.trim().toLowerCase() : "";
      }
      var activeFilter = document.querySelector(
        "[data-filter-group] button.is-active",
      );
      var filterValue = activeFilter
        ? activeFilter.getAttribute("data-filter-value")
        : "";
      var cards = Array.prototype.slice.call(
        scope.querySelectorAll("[data-movie-card]"),
      );
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = card.getAttribute("data-search") || "";
        var type = card.getAttribute("data-type") || "";
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilter =
          !filterValue ||
          type.indexOf(filterValue) !== -1 ||
          haystack.indexOf(filterValue.toLowerCase()) !== -1;
        var keep = matchesKeyword && matchesFilter;
        card.hidden = !keep;
        if (keep) {
          visible += 1;
        }
      });
      var empty = scope.querySelector(".no-results");
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "no-results";
        empty.textContent = "没有找到匹配影片";
        scope.appendChild(empty);
      }
      empty.hidden = visible !== 0;
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        scopes.forEach(apply);
      });
      var input = form.querySelector("input[type='search']");
      if (input) {
        input.addEventListener("input", function () {
          scopes.forEach(apply);
        });
      }
    });

    document
      .querySelectorAll("[data-filter-group] button")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          var group = button.closest("[data-filter-group]");
          group.querySelectorAll("button").forEach(function (item) {
            item.classList.remove("is-active");
          });
          button.classList.add("is-active");
          scopes.forEach(apply);
        });
      });
  }

  function initPlayer() {
    var video = document.querySelector(".video-player");
    if (!video) {
      return;
    }
    var overlay = document.querySelector("[data-play-overlay]");
    var stream = video.getAttribute("data-stream");
    var hls = null;
    var attached = false;

    function setOverlay() {
      if (!overlay) {
        return;
      }
      overlay.classList.toggle("is-hidden", !video.paused);
    }

    function attachStream() {
      if (!stream || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      }
    }

    function playVideo() {
      attachStream();
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    attachStream();
    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", setOverlay);
    video.addEventListener("pause", setOverlay);
    video.addEventListener("ended", setOverlay);
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
    setOverlay();
  }

  ready(function () {
    initNav();
    initHero();
    initSearchAndFilters();
    initPlayer();
  });
})();
