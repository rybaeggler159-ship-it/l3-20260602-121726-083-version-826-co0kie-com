(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function() {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");
        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function() {
                mobilePanel.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("img").forEach(function(image) {
            image.addEventListener("error", function() {
                image.classList.add("image-missing");
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var previous = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function start() {
                window.clearInterval(timer);
                timer = window.setInterval(function() {
                    show(current + 1);
                }, 5000);
            }

            dots.forEach(function(dot, index) {
                dot.addEventListener("click", function() {
                    show(index);
                    start();
                });
            });
            if (previous) {
                previous.addEventListener("click", function() {
                    show(current - 1);
                    start();
                });
            }
            if (next) {
                next.addEventListener("click", function() {
                    show(current + 1);
                    start();
                });
            }
            start();
        }

        var filterForm = document.querySelector("[data-card-filter]");
        if (filterForm) {
            var filterInput = filterForm.querySelector("input");
            var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list] .movie-card"));
            filterForm.addEventListener("submit", function(event) {
                event.preventDefault();
            });
            filterInput.addEventListener("input", function() {
                var keyword = filterInput.value.trim().toLowerCase();
                cards.forEach(function(card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-region")
                    ].join(" ").toLowerCase();
                    card.style.display = !keyword || text.indexOf(keyword) !== -1 ? "" : "none";
                });
            });
        }

        var searchResults = document.querySelector("[data-search-results]");
        if (searchResults && window.MOVIE_INDEX) {
            var params = new URLSearchParams(window.location.search);
            var keyword = (params.get("q") || "").trim();
            var input = document.querySelector("[data-search-input]");
            var title = document.querySelector("[data-search-title]");
            if (input) {
                input.value = keyword;
            }
            if (title) {
                title.textContent = keyword ? "与“" + keyword + "”相关的影片" : "影片列表";
            }
            var lower = keyword.toLowerCase();
            var items = window.MOVIE_INDEX.filter(function(movie) {
                if (!lower) {
                    return false;
                }
                return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.category].join(" ").toLowerCase().indexOf(lower) !== -1;
            }).slice(0, 120);

            if (keyword && items.length === 0) {
                searchResults.innerHTML = '<p class="empty-result">没有找到相关影片，请尝试更换关键词。</p>';
            } else {
                searchResults.innerHTML = items.map(function(movie) {
                    return [
                        '<article class="movie-card">',
                        '    <a class="poster" href="' + movie.url + '">',
                        '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                        '        <span class="play-chip">播放</span>',
                        '    </a>',
                        '    <div class="card-body">',
                        '        <div class="card-meta"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
                        '        <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
                        '        <p>' + escapeHtml(movie.oneLine) + '</p>',
                        '        <div class="tag-row">' + movie.tags.split(" ").slice(0, 3).map(function(tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join("") + '</div>',
                        '    </div>',
                        '</article>'
                    ].join("");
                }).join("");
            }
        }
    });

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}());
