// Parent-side bridge for the embedded navigation directory.
// The card's iframe is sandboxed without allow-downloads and the engine has no
// message listener, so "close this card" and "export a backup" are delegated
// to the top-level document here.
const panel = () => document.querySelector('#panel');
const frame = () => panel()?.querySelector('.body iframe');

window.addEventListener('message', event => {
  if (event.origin !== location.origin) return;
  const host = frame();
  if (!host || event.source !== host.contentWindow) return;
  const data = event.data;
  if (!data || typeof data !== 'object') return;
  if (data.type === 'homecraft-nav-close') {
    const close = panel()?.querySelector('header .close');
    if (close) close.click(); else panel()?.close();
    return;
  }
  if (data.type === 'homecraft-nav-export') {
    const backup = data.backup;
    if (!backup || !Array.isArray(backup.groups) || !Array.isArray(backup.quickLinks)) return;
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'homecraft-navigation-backup.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
