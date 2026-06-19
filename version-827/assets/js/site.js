
(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function move(step) {
            showSlide(current + step);
        }

        function startTimer() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                move(1);
            }, 5000);
        }

        if (previous) {
            previous.addEventListener('click', function () {
                move(-1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                move(1);
                startTimer();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var filterPanel = document.querySelector('[data-filter-panel]');

    if (filterPanel) {
        var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
        var regionSelect = filterPanel.querySelector('[data-filter-region]');
        var typeSelect = filterPanel.querySelector('[data-filter-type]');
        var yearSelect = filterPanel.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var emptyState = document.querySelector('.empty-state');
        var params = new URLSearchParams(window.location.search);
        var initialKeyword = params.get('q') || '';

        if (keywordInput && initialKeyword) {
            keywordInput.value = initialKeyword;
        }

        function getValue(element) {
            return element ? element.value.trim().toLowerCase() : '';
        }

        function applyFilters() {
            var keyword = getValue(keywordInput);
            var region = getValue(regionSelect);
            var type = getValue(typeSelect);
            var year = getValue(yearSelect);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
                var cardType = (card.getAttribute('data-type') || '').toLowerCase();
                var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
                var match = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    match = false;
                }

                if (region && cardRegion !== region) {
                    match = false;
                }

                if (type && cardType !== type) {
                    match = false;
                }

                if (year && cardYear !== year) {
                    match = false;
                }

                card.style.display = match ? '' : 'none';

                if (match) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.style.display = visible ? 'none' : 'block';
            }
        }

        [keywordInput, regionSelect, typeSelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', applyFilters);
                element.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }
})();
