(() => {
  // Only run inside iframes (embedded video players)
  if (window === window.top) return;

  let sent = false;

  function attach(video) {
    video.addEventListener('timeupdate', () => {
      if (sent) return;
      if (!video.duration || !isFinite(video.duration)) return;
      if (video.duration - video.currentTime <= 120) {
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

  // Fullscreen button: created when parent sends back the next episode URL
  let fsBtn = null;

  window.addEventListener('message', (e) => {
    if (e.data?.type !== 'aniworld-next-url' || fsBtn) return;
    const url = e.data.url;

    fsBtn = document.createElement('button');
    fsBtn.textContent = 'Next Episode';
    fsBtn.style.cssText = [
      'position:fixed', 'bottom:60px', 'right:16px', 'z-index:2147483647',
      'display:none', 'padding:10px 28px', 'font-size:15px', 'font-weight:600',
      'cursor:pointer', 'border:none', 'border-radius:6px',
      'background:rgba(255,255,255,0.9)', 'color:#000'
    ].join(';');
    fsBtn.addEventListener('click', () => { window.parent.location.href = url; });
    document.body.appendChild(fsBtn);

    // Show immediately if already in fullscreen when the message arrives
    if (document.fullscreenElement) fsBtn.style.display = 'block';

    document.addEventListener('fullscreenchange', () => {
      fsBtn.style.display = document.fullscreenElement ? 'block' : 'none';
    });
  });
})();
