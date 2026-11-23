/*
 * share-qr.js — full-screen QR code so people can share a page.
 *
 * Usage:
 *   <script src="share-qr.js"></script>
 *   <button onclick="openShareQR('https://code-lifter.github.io/Fitness/', 'Fitness Hub')">Share</button>
 *
 * The QR library is only downloaded the first time the QR screen is opened.
 */
(function () {
  const LIB_URL = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
  const LIB_SRI = 'sha384-lQXOAyZwHXE55JFyrOMB7nY2Wv+m5ZWNtJcHrd1rceRQXAYNLak8ukN5TjBTcIwz';
  let libPromise = null;
  let overlay = null;
  let currentUrl = '';

  function loadLib() {
    if (window.qrcode) return Promise.resolve();
    if (!libPromise) {
      libPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = LIB_URL;
        s.integrity = LIB_SRI;
        s.crossOrigin = 'anonymous';
        s.onload = resolve;
        s.onerror = () => { libPromise = null; reject(new Error('QR library failed to load')); };
        document.head.appendChild(s);
      });
    }
    return libPromise;
  }

  function el(tag, style, text) {
    const e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (text) e.textContent = text;
    return e;
  }

  const BTN = 'flex:1;min-width:0;padding:14px 16px;border-radius:12px;font:700 13px/1 system-ui,sans-serif;' +
              'letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border:1px solid #334155;' +
              'background:#1e293b;color:#e2e8f0;';

  function build() {
    overlay = el('div',
      'position:fixed;inset:0;z-index:9999;display:none;flex-direction:column;align-items:center;justify-content:center;' +
      'gap:20px;padding:max(24px,env(safe-area-inset-top)) 20px max(24px,env(safe-area-inset-bottom));' +
      'background:#060a10;color:#e2e8f0;font-family:system-ui,sans-serif;text-align:center;');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Share QR code');

    const close = el('button',
      'position:absolute;top:max(14px,env(safe-area-inset-top));right:14px;width:44px;height:44px;border-radius:50%;' +
      'border:1px solid #334155;background:#0f172a;color:#cbd5e1;font-size:24px;line-height:1;cursor:pointer;', '×');
    close.setAttribute('aria-label', 'Close');
    close.onclick = closeShareQR;

    const title = el('div', 'font:800 22px/1.2 system-ui,sans-serif;letter-spacing:.04em;color:#f59e0b;text-transform:uppercase;');
    title.id = 'sqr-title';
    const hint = el('div', 'font-size:13px;color:#94a3b8;margin-top:-12px;', 'Scan with a phone camera to open');

    // White "quiet zone" card so the code scans reliably on a dark page
    const card = el('div',
      'background:#fff;border-radius:20px;padding:min(5vw,24px);width:min(86vw,62vh,520px);aspect-ratio:1;' +
      'display:flex;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,.6);');
    card.id = 'sqr-code';

    const link = el('div', 'font:500 13px/1.4 ui-monospace,Menlo,monospace;color:#cbd5e1;word-break:break-all;max-width:min(86vw,520px);');
    link.id = 'sqr-link';

    const row = el('div', 'display:flex;gap:10px;width:min(86vw,520px);');
    const copy = el('button', BTN, 'Copy link');
    copy.onclick = () => {
      const done = () => { copy.textContent = 'Copied!'; setTimeout(() => (copy.textContent = 'Copy link'), 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(currentUrl).then(done, () => window.prompt('Copy this link:', currentUrl));
      else window.prompt('Copy this link:', currentUrl);
    };
    row.appendChild(copy);
    if (navigator.share) {
      const share = el('button', BTN + 'background:#f59e0b;border-color:#f59e0b;color:#0f172a;', 'Share…');
      share.onclick = () => navigator.share({ title: document.title, url: currentUrl }).catch(() => {});
      row.appendChild(share);
    }

    overlay.append(close, title, hint, card, link, row);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeShareQR(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.style.display !== 'none') closeShareQR(); });
    document.body.appendChild(overlay);
  }

  function render() {
    const box = document.getElementById('sqr-code');
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(currentUrl);
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });
      const svg = box.querySelector('svg');
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'QR code for ' + currentUrl);
    } catch (e) {
      box.innerHTML = '<span style="color:#0f172a;font-size:14px;">Could not make QR code</span>';
    }
  }

  window.openShareQR = function (url, title) {
    currentUrl = url || location.href;
    if (!overlay) build();
    document.getElementById('sqr-title').textContent = title || document.title;
    document.getElementById('sqr-link').textContent = currentUrl;
    const box = document.getElementById('sqr-code');
    box.innerHTML = '<span style="color:#64748b;font-size:14px;">Loading…</span>';
    overlay.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    loadLib().then(render, () => {
      box.innerHTML = '<span style="color:#0f172a;font-size:14px;padding:12px;">Couldn\'t load the QR code. Check your connection, or use Copy link.</span>';
    });
  };

  window.closeShareQR = function () {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.documentElement.style.overflow = '';
  };
})();
