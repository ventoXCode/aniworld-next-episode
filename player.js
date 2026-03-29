(() => {
  // Only run inside iframes (embedded video players)
  if (window === window.top) return;

  let sent = false;

  function attach(video) {
    video.addEventListener('timeupdate', () => {
      if (sent) return;
      if (!video.duration || !isFinite(video.duration)) return;
      if (video.duration - video.currentTime <= 90) {
        sent = true;
        window.parent.postMessage({ type: 'aniworld-near-end' }, '*');
      }
    });
  }

  const video = document.querySelector('video');
  if (video) {
    attach(video);
  } else {
    // Wait for the video element to be inserted by the player JS
    const observer = new MutationObserver(() => {
      const v = document.querySelector('video');
      if (v) {
        observer.disconnect();
        attach(v);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
