// @ts-nocheck

const liveHotReload = () => {
  // EventSource는 node에서 실행 불가능하며, 브라우저에서만 실행 가능하여 html에 적용함
  if (location.hostname === 'local.plaync.com') {
    // live reload + hot reloading for css
    new EventSource('/esbuild').addEventListener('change', (e) => {
      const { added, removed, updated } = JSON.parse(e.data);

      // hot reloading for css
      if (!added.length && !removed.length && updated.length === 1) {
        for (const link of document.getElementsByTagName('link')) {
          const url = new URL(link.href);
          if (url.host === location.host && url.pathname === updated[0]) {
            const next = link.cloneNode();
            next.href = updated[0] + '?' + Math.random().toString(36).slice(2);
            next.onload = () => link.remove();
            link.parentNode.insertBefore(next, link.nextSibling);
            return;
          }
        }
      }

      // live reload
      location.reload();
    });
  }
};

liveHotReload();
