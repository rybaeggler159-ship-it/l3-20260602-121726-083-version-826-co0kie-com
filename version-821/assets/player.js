function initMoviePlayer(sourceUrl) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('player-overlay');
  var toggle = document.getElementById('player-toggle');
  var mute = document.getElementById('player-mute');
  var fullscreen = document.getElementById('player-fullscreen');

  if (!video || !sourceUrl) {
    return;
  }

  var hlsInstance = null;

  if (window.Hls && window.Hls.isSupported()) {
    hlsInstance = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hlsInstance.loadSource(sourceUrl);
    hlsInstance.attachMedia(video);
    hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
        hlsInstance.startLoad();
        return;
      }

      if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
        hlsInstance.recoverMediaError();
        return;
      }

      hlsInstance.destroy();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = sourceUrl;
  }

  function setPlayingState(isPlaying) {
    if (toggle) {
      toggle.textContent = isPlaying ? '暂停' : '播放';
    }
    if (overlay) {
      overlay.classList.toggle('hidden', isPlaying);
    }
  }

  function playVideo() {
    var playRequest = video.play();

    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {});
    }
  }

  function toggleVideo() {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  }

  video.addEventListener('click', toggleVideo);
  video.addEventListener('play', function () {
    setPlayingState(true);
  });
  video.addEventListener('pause', function () {
    setPlayingState(false);
  });
  video.addEventListener('ended', function () {
    setPlayingState(false);
  });

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  if (toggle) {
    toggle.addEventListener('click', toggleVideo);
  }

  if (mute) {
    mute.addEventListener('click', function () {
      video.muted = !video.muted;
      mute.textContent = video.muted ? '取消静音' : '静音';
    });
  }

  if (fullscreen) {
    fullscreen.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
