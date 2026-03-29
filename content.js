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

  // Show 90s before estimated episode end (adjust EPISODE_DURATION_SEC per season)
  const EPISODE_DURATION_SEC = 24 * 60;
  const SHOW_DELAY_MS = Math.max(0, (EPISODE_DURATION_SEC - 90) * 1000);
  setTimeout(() => btn.classList.remove('next-episode-btn--hidden'), SHOW_DELAY_MS);

  // Fullscreen: switch to fixed positioning so button stays over the player
  document.addEventListener('fullscreenchange', () => {
    btn.classList.toggle('next-episode-btn--fullscreen', !!document.fullscreenElement);
  });
})();
