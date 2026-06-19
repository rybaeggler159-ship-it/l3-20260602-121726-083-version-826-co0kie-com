
(async () => {
  const video = document.querySelector('video[data-hls-src]');
  if (!video) return;
  const source = video.dataset.hlsSrc;
  const status = document.querySelector('[data-player-status]');
  const shell = video.closest('.player-shell');
  video.addEventListener('play', () => shell && shell.classList.add('is-playing'));
  video.addEventListener('pause', () => shell && shell.classList.remove('is-playing'));
  let attached = false;
  try {
    const mod = await import('./hls-vendor-dru42stk.js');
    const Hls = mod.H;
    if (Hls && Hls.isSupported && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      attached = true;
      hls.on(Hls.Events.MANIFEST_PARSED, () => { if (status) status.textContent = '播放器已就绪'; });
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data && data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        }
      });
    }
  } catch (err) { console.warn('HLS module unavailable', err); }
  if (!attached) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      if (status) status.textContent = '播放器已就绪';
    } else if (status) {
      status.textContent = '当前浏览器需要通过本地服务器打开页面，或使用支持 HLS 的浏览器。';
    }
  }
})();
