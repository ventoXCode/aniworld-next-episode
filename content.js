if (!location.pathname.match(/\/staffel-\d+\/episode-\d+/)) return;

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

const btn = document.createElement('button');
btn.className = 'next-episode-btn';
btn.textContent = 'Next Episode →';
btn.addEventListener('click', () => { window.location.href = nextUrl; });

const playerSection = document.querySelector('.hosterSiteVideo');
if (playerSection) playerSection.insertAdjacentElement('afterend', btn);
