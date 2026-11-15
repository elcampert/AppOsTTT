/* Cifrado local + Google (Drive para la copia cifrada, Gmail para enviar facturas). */
const b64 = {
  enc(bytes) { let s = ''; const b = new Uint8Array(bytes); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); },
  dec(str) { const s = atob(str); const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; },
  url(bytes) { return b64.enc(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
};
async function deriveKey(pass, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function cifrar(bytes, pass) {
  const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes);
  return JSON.stringify({ v: 1, salt: b64.enc(salt), iv: b64.enc(iv), data: b64.enc(ct) });
}
async function descifrar(text, pass) {
  const o = JSON.parse(text);
  const key = await deriveKey(pass, b64.dec(o.salt));
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64.dec(o.iv) }, key, b64.dec(o.data));
  return new Uint8Array(pt);
}
async function sha256hex(s) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

const G = {
  token: null, exp: 0, client: null, clientId: '',
  SCOPES: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/gmail.send',
  loadLib() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client';
      s.onload = () => res(); s.onerror = () => rej(new Error('No se pudo cargar Google. ¿Hay conexión?'));
      document.head.appendChild(s);
    });
  },
  async auth(clientId) {
    if (!clientId) throw new Error('Falta el ID de cliente de Google (Ajustes › Google).');
    G.clientId = clientId;
    if (G.token && Date.now() < G.exp - 60000) return G.token;
    await G.loadLib();
    return new Promise((res, rej) => {
      G.client = google.accounts.oauth2.initTokenClient({
        client_id: clientId, scope: G.SCOPES,
        callback: (r) => { if (r.error) return rej(new Error('Google: ' + r.error)); if (!google.accounts.oauth2.hasGrantedAllScopes(r, ...G.SCOPES.split(' '))) { G.forzar = true; return rej(new Error('Falta algún permiso. Vuelve a sincronizar y marca las casillas de Drive y Gmail.')); } G.token = r.access_token; G.exp = Date.now() + (r.expires_in || 3600) * 1000; res(G.token); },
        error_callback: (e) => rej(new Error('Google: ' + (e && e.type || 'cancelado')))
      });
      G.client.requestAccessToken({ prompt: G.forzar ? 'consent' : '' }); G.forzar = false;
    });
  },
  async api(url, opts) {
    opts = opts || {};
    const r = await fetch(url, { ...opts, headers: { Authorization: 'Bearer ' + G.token, ...(opts.headers || {}) } });
    if (r.status === 401 && !opts._retry) { G.token = null; G.exp = 0; await G.auth(G.clientId); return G.api(url, { ...opts, _retry: true }); }
    if (r.status === 403 && !opts._retry) { const t = await r.clone().text(); if (/insufficient/i.test(t)) { G.token = null; G.exp = 0; G.forzar = true; await G.auth(G.clientId); return G.api(url, { ...opts, _retry: true }); } }
    if (!r.ok) throw new Error('Google respondió ' + r.status + ': ' + (await r.text()).slice(0, 200));
    return r;
  },
  async find(name) {
    const q = encodeURIComponent("name='" + name + "'");
    const r = await G.api('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)&q=' + q);
    const j = await r.json(); return j.files && j.files[0] || null;
  },
  async list() {
    let out = []; let page = '';
    do {
      const r = await G.api('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=1000&fields=nextPageToken,files(id,name)' + (page ? '&pageToken=' + page : ''));
      const j = await r.json(); out = out.concat(j.files || []); page = j.nextPageToken || '';
    } while (page);
    return out;
  },
  async download(id) { const r = await G.api('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media'); return r.text(); },
  async put(name, text, id) {
    if (id) {
      await G.api('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: text });
      return id;
    }
    const bnd = 'b' + Math.random().toString(36).slice(2);
    const body = '--' + bnd + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify({ name, parents: ['appDataFolder'] }) +
      '\r\n--' + bnd + '\r\nContent-Type: application/json\r\n\r\n' + text + '\r\n--' + bnd + '--';
    const r = await G.api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bnd }, body });
    return (await r.json()).id;
  },
  async sendMail({ to, subject, body, attachName, attachBytes }) {
    const bnd = 'm' + Math.random().toString(36).slice(2);
    const encH = (s) => '=?UTF-8?B?' + b64.enc(new TextEncoder().encode(s)) + '?=';
    let mime = 'To: ' + to.join(', ') + '\r\nSubject: ' + encH(subject) + '\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="' + bnd + '"\r\n\r\n' +
      '--' + bnd + '\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n' + b64.enc(new TextEncoder().encode(body)).replace(/.{76}/g, '$&\r\n') + '\r\n';
    if (attachBytes) {
      mime += '--' + bnd + '\r\nContent-Type: application/pdf; name="' + encH(attachName) + '"\r\nContent-Disposition: attachment; filename="' + encH(attachName) + '"\r\nContent-Transfer-Encoding: base64\r\n\r\n' +
        b64.enc(attachBytes).replace(/.{76}/g, '$&\r\n') + '\r\n';
    }
    mime += '--' + bnd + '--';
    await G.api('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: b64.url(new TextEncoder().encode(mime)) }) });
  }
};
