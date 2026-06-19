
(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('.player-cover');
        var stream = video ? video.getAttribute('data-stream') : '';
        var ready = false;
        var hls = null;

        function prepare() {
            if (!video || !stream || ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                ready = true;
                return;
            }

            video.src = stream;
            ready = true;
        }

        function play() {
            prepare();
            player.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        if (cover && video) {
            cover.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
