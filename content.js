(() => {
  if (!location.pathname.match(/\/staffel-\d+\/episode-\d+/)) return;

  // Auto-select: German Sub / Japanese Dub (key 3) > German Dub (key 1, default)
  const currentLang = document.querySelector('img.selectedLanguage')?.dataset.langKey;
  if (currentLang !== '3') {
    const preferredLangBtn = document.querySelector('.changeLanguageBox img[data-lang-key="3"]');
    if (preferredLangBtn) preferredLangBtn.click();
  }

  // Detect next episode URL
  const activeLink = document.querySelector('li a.active[href*="episode"]');
  let nextUrl = activeLink?.parentElement?.nextElementSibling?.querySelector('a')?.href ?? null;

  if (!nextUrl) {
    const m = location.pathname.match(/\/staffel-(\d+)\/episode-(\d+)/);
    if (m) {
      const base = location.pathname.split('/').slice(0, 4).join('/');
      nextUrl = `${location.origin}${base}/staffel-${m[1]}/episode-${parseInt(m[2], 10) + 1}`;
    }
  }

  console.log('[next-episode]', nextUrl);

  if (!nextUrl) return;

  // Create overlay button
  const btn = document.createElement('button');
  btn.className = 'next-episode-btn next-episode-btn--hidden';
  btn.textContent = 'Next Episode →';
  btn.addEventListener('click', () => { window.location.href = nextUrl; });

  // Insert as overlay inside the actual video wrapper
  const streamSection = document.querySelector('.inSiteWebStream');
  if (streamSection) {
    streamSection.style.position = 'relative';
    streamSection.appendChild(btn);
  }

  // Show button when the embedded video player reports 90s remaining via postMessage
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'aniworld-near-end') {
      btn.classList.remove('next-episode-btn--hidden');
    }
  });

  // Fullscreen: reparent button to body so it renders above the fullscreen iframe
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      document.body.appendChild(btn);
      btn.classList.add('next-episode-btn--fullscreen');
    } else {
      if (streamSection) streamSection.appendChild(btn);
      btn.classList.remove('next-episode-btn--fullscreen');
    }
  });
})();
