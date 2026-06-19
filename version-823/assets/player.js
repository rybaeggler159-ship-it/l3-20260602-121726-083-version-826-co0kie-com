
const players = Array.from(document.querySelectorAll('[data-player]'));

async function createHls(video, stream) {
  const module = await import('./hls-vendor.js');
  const Hls = module.H;
  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    });
    hls.loadSource(stream);
    hls.attachMedia(video);
    return hls;
  }
  video.src = stream;
  return null;
}

players.forEach(function (wrap) {
  const video = wrap.querySelector('video');
  const button = wrap.querySelector('.play-overlay');
  const stream = video ? video.getAttribute('data-stream') : '';
  let initialized = false;
  let hlsInstance = null;

  async function start() {
    if (!video || !stream) {
      return;
    }

    if (!initialized) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        hlsInstance = await createHls(video, stream);
      }
      initialized = true;
    }

    video.controls = true;
    wrap.classList.add('is-playing');
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        wrap.classList.remove('is-playing');
      });
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }
});
