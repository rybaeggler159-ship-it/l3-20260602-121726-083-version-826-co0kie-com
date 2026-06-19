(function () {
    var HLS_CDN = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    var hlsScriptPromise = null;

    function loadHlsScript() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsScriptPromise) {
            return hlsScriptPromise;
        }
        hlsScriptPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = HLS_CDN;
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = function () {
                reject(new Error('HLS 脚本加载失败'));
            };
            document.head.appendChild(script);
        });
        return hlsScriptPromise;
    }

    function setStatus(box, message) {
        var status = box.querySelector('[data-player-status]');
        if (status) {
            status.textContent = message;
        }
    }

    function attachSource(video, sourceUrl) {
        if (!sourceUrl) {
            return Promise.reject(new Error('播放源为空'));
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            return Promise.resolve();
        }
        return loadHlsScript().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                if (video._hlsInstance) {
                    video._hlsInstance.destroy();
                }
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                video._hlsInstance = hls;
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                return new Promise(function (resolve, reject) {
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                    hls.on(Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            reject(new Error('HLS 播放源加载失败'));
                        }
                    });
                });
            }
            video.src = sourceUrl;
            return Promise.resolve();
        });
    }

    function setupPlayer(box) {
        var sourceUrl = box.getAttribute('data-src');
        var video = box.querySelector('video');
        var start = box.querySelector('[data-player-start]');
        if (!video || !start) {
            return;
        }
        start.addEventListener('click', function () {
            start.disabled = true;
            setStatus(box, '正在加载 m3u8 播放源...');
            attachSource(video, sourceUrl)
                .then(function () {
                    box.classList.add('is-playing');
                    setStatus(box, '播放源已加载，正在播放。');
                    return video.play();
                })
                .catch(function (error) {
                    start.disabled = false;
                    box.classList.remove('is-playing');
                    setStatus(box, error.message || '播放器加载失败，请稍后重试。');
                });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-player]').forEach(setupPlayer);
        });
    } else {
        document.querySelectorAll('[data-player]').forEach(setupPlayer);
    }
})();
