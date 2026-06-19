(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMobileNav() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
            var search = scope.querySelector('[data-filter-search]');
            var type = scope.querySelector('[data-filter-type]');
            var year = scope.querySelector('[data-filter-year]');
            var reset = scope.querySelector('[data-filter-reset]');
            var count = scope.querySelector('[data-result-count]');
            var empty = scope.querySelector('[data-empty-message]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));

            function normalize(value) {
                return String(value || '').trim().toLowerCase();
            }

            function matches(card, keyword, selectedType, selectedYear) {
                var text = normalize(card.getAttribute('data-search'));
                var cardType = card.getAttribute('data-type') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var typeOk = selectedType === 'all' || cardType.indexOf(selectedType) !== -1;
                var yearOk = selectedYear === 'all' || cardYear === selectedYear;
                var keywordOk = !keyword || text.indexOf(keyword) !== -1;
                return typeOk && yearOk && keywordOk;
            }

            function apply() {
                var keyword = normalize(search ? search.value : '');
                var selectedType = type ? type.value : 'all';
                var selectedYear = year ? year.value : 'all';
                var visible = 0;
                cards.forEach(function (card) {
                    var ok = matches(card, keyword, selectedType, selectedYear);
                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = String(visible);
                }
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            if (search) {
                search.addEventListener('input', apply);
            }
            if (type) {
                type.addEventListener('change', apply);
            }
            if (year) {
                year.addEventListener('change', apply);
            }
            if (reset) {
                reset.addEventListener('click', function () {
                    if (search) {
                        search.value = '';
                    }
                    if (type) {
                        type.value = 'all';
                    }
                    if (year) {
                        year.value = 'all';
                    }
                    apply();
                });
            }
            apply();
        });
    }

    ready(function () {
        setupMobileNav();
        setupHero();
        setupFilters();
    });
})();
