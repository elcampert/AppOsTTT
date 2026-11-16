'use strict';
/* ============ Utilidades ============ */
const $ = (s, el) => (el || document).querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const hoy = () => isoDate(new Date());
const parseD = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
const fechaES = (s) => s ? s.split('-').reverse().join('/') : '';
const fechaCorta = (s) => { const d = parseD(s); return d.getDate() + ' ' + MESES_C[d.getMonth()]; };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return isoDate(d); };
const addMonths = (s, n) => { const d = parseD(s); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return isoDate(d); };
const diasEntre = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
let PRIV = false; try { PRIV = localStorage.getItem('mc-privado') === '1'; } catch (e) { }
function eur(n, sign) {
  if (PRIV) return '••••• €';
  const neg = n < 0; const v = Math.abs(r2(n)).toFixed(2).split('.');
  return (neg ? '−' : sign && n > 0 ? '+' : '') + v[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + v[1] + ' €';
}
const parseEur = (s) => { const n = parseFloat(String(s).replace(/[€\s]/g, '').replace(/\./g, '').replace(',', '.')); return isNaN(n) ? 0 : n; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const quarterOf = (s) => Math.floor((parseD(s).getMonth()) / 3) + 1;
const inRange = (s, a, b) => s >= a && s <= b;
const download = (name, data, type) => { const blob = data instanceof Blob ? data : new Blob([data], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };
const fileBytes = (file) => file.arrayBuffer().then((b) => new Uint8Array(b));

/* ============ Iconos ============ */
const I = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  tax: '<path d="M7 6v15M17 6v15M7 14h10"/><path fill="currentColor" stroke-width="1" d="M7 8C5 7.5 3.8 5.5 3.5 2.5C2 5.5 2.5 10 7 12z"/><path fill="currentColor" stroke-width="1" d="M17 8c2-.5 3.2-2.5 3.5-5.5 1.5 3 1 7.5-3.5 9.5z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  cam: '<path d="M14.5 4h-5L7 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3z"/><circle cx="12" cy="13" r="3.5"/>',
  swap: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  sync: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  finger: '<path d="M12 11v3a6 6 0 0 1-1.5 4M8.5 8.8A4 4 0 0 1 16 11v2.5M5.5 15c.6-1.2 1-2.6 1-4a5.5 5.5 0 0 1 9-4.2M18.4 16c.4-1.3.6-2.7.6-4"/>'
};
const ico = (k, s) => '<svg aria-hidden="true" width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</svg>';

const CAT_ICO = {
  gasolina: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10"/><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
  vicios: '<path d="M6 4h10v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M16 8h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M9 8v8M13 8v8"/>',
  comida: '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 21V3c-2 1-3 4-3 7s1 4 3 4"/>',
  material: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>',
  equipo: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  viajes: '<path d="M10.5 13.5 3 11l1.5-1.5 8 1L17 6a2 2 0 0 1 3 3l-4.5 4.5 1 8L15 23l-2.5-7.5-3 3V21l-1.5 1-1-3-3-1 1-1.5h2.5z"/>',
  cuota: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  gestoria: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  software: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M2 20h20M9 9l-2 2 2 2M15 9l2 2-2 2"/>',
  piso: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  fijos: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4"/>',
  telefono: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  taller: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  varios: '<path d="M6 7h12l1 14H5z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  hacienda: '<path d="M7 6v15M17 6v15M7 14h10"/><path fill="currentColor" stroke-width="1" d="M7 8C5 7.5 3.8 5.5 3.5 2.5C2 5.5 2.5 10 7 12z"/><path fill="currentColor" stroke-width="1" d="M17 8c2-.5 3.2-2.5 3.5-5.5 1.5 3 1 7.5-3.5 9.5z"/>',
  perdido: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  ahorro: '<path d="M5 11a7 6 0 0 1 13-2l2-1v4l-1 1a7 6 0 0 1-3 4v3h-3v-2h-3v2H7v-3a6 6 0 0 1-2-6z"/><path d="M15 10h.01"/>',
  ingreso: '<path d="M12 3v18M7 8l5-5 5 5"/>'
};
const catIco = (id, s) => '<svg aria-hidden="true" width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (CAT_ICO[id] || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
const VEH_SVG = {
  custom: '<svg viewBox="0 0 120 60" width="120" height="60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="44" r="12"/><circle cx="98" cy="44" r="12"/><path d="M24 44h20l10-14h22l10 14h12M44 30l-6-10h10M62 30l4-8h14l8 8M86 44 74 22"/></svg>',
  trail: '<svg viewBox="0 0 120 60" width="120" height="60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="44" r="13"/><circle cx="98" cy="44" r="13"/><path d="M24 44l18-20h26l12 8h10l8 12M42 24l-6-10h12M58 24l6-12h12l6 10M82 22l16 22"/></svg>',
  coche: '<svg viewBox="0 0 120 60" width="120" height="60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="46" r="8"/><circle cx="90" cy="46" r="8"/><path d="M14 46H8V34l10-4 14-12h40l16 12 18 4v12h-6M40 46h42M32 30h56"/></svg>'
};
function cara(dias) {
  const col = dias == null ? '#8A8191' : dias < 30 ? '#6EE7A8' : dias <= 60 ? '#FFC37F' : '#FF8A95';
  const mouth = dias == null ? 'M8 15h8' : dias < 30 ? 'M8 14c1.5 2 6.5 2 8 0' : dias <= 60 ? 'M8 15h8' : 'M8 16c1.5-2 6.5-2 8 0';
  const brows = dias != null && dias > 60 ? '<path d="M7 8l3 1.5M17 8l-3 1.5"/>' : '';
  const t = dias == null ? 'Sin datos de pago' : 'Paga en ' + Math.round(dias) + ' días de media';
  return '<svg class="face" viewBox="0 0 24 24" fill="none" stroke="' + col + '" stroke-width="2" stroke-linecap="round" role="img" aria-label="' + t + '"><circle cx="12" cy="12" r="10"/><path d="M9 10h.01M15 10h.01"/>' + mouth.replace(/^/, '<path d="') + '"/>' + brows + '</svg>';
}

/* ============ Datos ============ */
const CATS = [
  { id: 'gasolina', n: 'Gasolina', t: 'mixto', ic: 'G', fija: 1, veh: true, col: '#FFA94D' },
  { id: 'vicios', n: 'Drogas y vicios', t: 'personal', ic: 'D', fija: 2, col: '#B06CFF' },
  { id: 'comida', n: 'Comida', t: 'personal', ic: 'C', fija: 3, col: '#4FD1C5' },
  { id: 'material', n: 'Material y equipo', t: 'trabajo', iva: 100, irpf: 100, ic: 'M', col: '#FF4D9D' },
  { id: 'equipo', n: 'Equipo +300 € (5 años)', t: 'trabajo', iva: 100, irpf: 100, amort: 5, ic: 'E', col: '#FF7AB6' },
  { id: 'viajes', n: 'Viajes de trabajo', t: 'trabajo', iva: 100, irpf: 100, ic: 'V', col: '#E0418A' },
  { id: 'cuota', n: 'Cuota de autónomos', t: 'trabajo', sinIva: true, iva: 0, irpf: 100, ic: 'SS', col: '#C2185B' },
  { id: 'gestoria', n: 'Gestoría', t: 'trabajo', iva: 100, irpf: 100, ic: 'Ge', col: '#F06292' },
  { id: 'software', n: 'Software y suscripciones', t: 'trabajo', iva: 100, irpf: 100, ic: 'S', col: '#F48FB1' },
  { id: 'piso', n: 'Gastos del piso', t: 'personal', ic: 'P', col: '#5B8CFF' },
  { id: 'fijos', n: 'Gastos fijos personales', t: 'personal', ic: 'F', col: '#7C9CFF' },
  { id: 'telefono', n: 'Teléfono e internet', t: 'personal', ic: 'T', col: '#8FB0FF' },
  { id: 'taller', n: 'Taller y seguro', t: 'personal', ic: 'Ta', col: '#FFC37F' },
  { id: 'varios', n: 'Personal varios', t: 'personal', ic: '+', col: '#8A8191' },
  { id: 'hacienda', n: 'Pagos a Hacienda', t: 'personal', ic: 'H', col: '#6B5F74' },
  { id: 'perdido', n: 'Perdido', t: 'personal', ic: '!', nota: true, col: '#FF5C6C' }
];
function estadoInicial() {
  return {
    v: 1,
    ajustes: {
      upd: 0, nombre: '', nombreComercial: '', nif: '', direccion1: '', direccion2: '', telefono: '', iban: '', pieActividad: 'PRODUCCIONES',
      serie: 'BSD', siguiente: 1, ivaPct: 21, irpfPct: 15, venceMeses: 2, gdjPct: 5, gdjMax: 2000,
      correo: {
        envioAsunto: 'Factura {numero} – {concepto}',
        envio: 'Hola,\n\nTe adjunto la factura {numero} correspondiente a {concepto}, por un total de {total}.\n\nCualquier cosa me dices. ¡Un abrazo!\nOsel',
        vencAsunto: 'Recordatorio factura {numero}',
        venc: 'Hola,\n\nTe escribo porque hoy vence la factura {numero} ({total}) de {concepto}. Te la vuelvo a adjuntar por si se traspapeló.\n\n¡Gracias!\nOsel',
        recAsunto: 'Factura {numero} pendiente de pago',
        rec: 'Hola,\n\nLa factura {numero} ({total}) sigue pendiente desde el {vencimiento}. ¿Me puedes confirmar cuándo está previsto el pago?\n\nTe la adjunto de nuevo. ¡Gracias!\nOsel'
      },
      cats: {}, limites: {}, vista: 'lista', googleId: '', ultimaSync: null, pinHash: '', pinSalt: '', huella: null, cabeceraFoto: null
    },
    vehiculos: [
      { id: 'rebe', nombre: 'Rebe', modelo: 'Honda Rebel', tipo: 'custom', propio: true, pct: 0, foto: null, upd: 0 },
      { id: 'fusco', nombre: 'Fuscó', modelo: 'Honda CB500X', tipo: 'trail', propio: true, pct: 0, foto: null, upd: 0 },
      { id: 'elfo', nombre: 'Elfo', modelo: 'Dacia Sandero', tipo: 'coche', propio: true, pct: 0, foto: null, upd: 0 },
      { id: 'fury', nombre: 'Fury', modelo: 'Moto de la novia', tipo: 'custom', propio: false, pct: 0, foto: null, upd: 0 }
    ],
    movimientos: [], facturas: [], presupuestos: [], clientes: [], recurrentes: [], equipo: [], packs: [], borrados: {}
  };
}
let S = estadoInicial();
const UI = { periodo: 'mes', ref: hoy().slice(0, 8) + '01', ftab: 'pendientes', filtro: 'todos', q: '', mesFiltro: '', orden: 'facturado', anioCli: 'todos', anioH: new Date().getFullYear(), shown: 0, pass: null, locked: false };

/* IndexedDB */
const DB = {
  db: null,
  open() { return new Promise((res, rej) => { const r = indexedDB.open('mis-cuentas', 1); r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('fotos'); }; r.onsuccess = () => { DB.db = r.result; res(); }; r.onerror = () => rej(r.error); }); },
  tx(store, mode, fn) { return new Promise((res, rej) => { const t = DB.db.transaction(store, mode); const st = t.objectStore(store); const out = fn(st); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); },
  get(store, k) { return new Promise((res, rej) => { const r = DB.db.transaction(store).objectStore(store).get(k); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); },
  put(store, k, v) { return DB.tx(store, 'readwrite', (s) => s.put(v, k)); },
  del(store, k) { return DB.tx(store, 'readwrite', (s) => s.delete(k)); },
  keys(store) { return new Promise((res, rej) => { const r = DB.db.transaction(store).objectStore(store).getAllKeys(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
};
let saveT = null;
function guardar() { clearTimeout(saveT); saveT = setTimeout(() => DB.put('kv', 'estado', JSON.parse(JSON.stringify(S))).catch((e) => toast('No se pudo guardar: ' + e.message)), 150); }
function touch(o) { o.upd = Date.now(); return o; }
function borrar(col, id) { S[col] = S[col].filter((x) => x.id !== id); S.borrados[id] = Date.now(); }
const fotoURL = {};
async function fotoSrc(id) { if (!id) return null; if (fotoURL[id]) return fotoURL[id]; const b = await DB.get('fotos', id); if (!b) return null; fotoURL[id] = URL.createObjectURL(new Blob([b], { type: 'image/jpeg' })); return fotoURL[id]; }
async function comprimir(file, max) {
  max = max || 1600;
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
  cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
  const blob = await new Promise((res) => cv.toBlob(res, 'image/jpeg', 0.82));
  return new Uint8Array(await blob.arrayBuffer());
}

/* ============ Cálculos ============ */
const cat = (id) => { const b = CATS.find((c) => c.id === id) || { id, n: id, t: 'personal', ic: '?', col: '#8A8191' }; const o = S.ajustes.cats[id] || {}; return { ...b, ...o }; };
const veh = (id) => S.vehiculos.find((v) => v.id === id);
const esGasto = (m) => m.cat !== 'ahorro' && m.cat !== 'ingreso';
function movCalc(m) {
  const c = cat(m.cat);
  let ivaP = c.iva || 0, irpfP = c.irpf || 0;
  if (c.veh) { const v = veh(m.veh); const p = v && v.propio ? (v.pct || 0) : 0; ivaP = p; irpfP = p; }
  const base = c.sinIva ? m.importe : m.importe / (1 + S.ajustes.ivaPct / 100);
  const iva = c.sinIva ? 0 : m.importe - base;
  return { base, ivaDed: iva * ivaP / 100, irpfDed: c.amort ? 0 : base * irpfP / 100, amortBase: c.amort ? base * irpfP / 100 : 0, amortAnios: c.amort || 0 };
}
function totalesFactura(f, aj) {
  aj = aj || S.ajustes;
  const base = r2(f.lineas.reduce((s, l) => s + (+l.imp || 0), 0) + (typeof equipoCobrado === 'function' ? equipoCobrado(f) : 0));
  const iva = r2(base * aj.ivaPct / 100), irpf = r2(base * aj.irpfPct / 100);
  return { base, iva, irpf, total: r2(base + iva - irpf) };
}
const venceFactura = (f, aj) => addMonths(f.fecha, (aj || S.ajustes).venceMeses);
const emitida = (f) => f.estado === 'enviada' || f.estado === 'cobrada';
const pendiente = (f) => f.estado === 'enviada';
function rango(periodo, ref) {
  const d = parseD(ref); const y = d.getFullYear(), m = d.getMonth();
  if (periodo === 'mes') return [isoDate(new Date(y, m, 1)), isoDate(new Date(y, m + 1, 0)), MESES[m] + ' ' + y];
  if (periodo === 'trim') { const q = Math.floor(m / 3); return [isoDate(new Date(y, q * 3, 1)), isoDate(new Date(y, q * 3 + 3, 0)), (q + 1) + 'º trimestre ' + y]; }
  return [y + '-01-01', y + '-12-31', String(y)];
}
function resumen(a, b) {
  let cobrado = S.facturas.filter((f) => f.estado === 'cobrada' && f.fechaCobro && inRange(f.fechaCobro, a, b)).reduce((s, f) => s + totalesFactura(f).total, 0);
  const movs = S.movimientos.filter((m) => inRange(m.fecha, a, b));
  const gastado = movs.filter(esGasto).reduce((s, m) => s + m.importe, 0);
  const ahorrado = movs.filter((m) => m.cat === 'ahorro').reduce((s, m) => s + m.importe, 0);
  const otros = movs.filter((m) => m.cat === 'ingreso').reduce((s, m) => s + m.importe, 0);
  cobrado += otros;
  const porCat = {};
  movs.filter(esGasto).forEach((m) => { porCat[m.cat] = (porCat[m.cat] || 0) + m.importe; });
  return { cobrado, gastado, ahorrado, balance: cobrado - gastado, porCat };
}
function amortAnual(year) {
  let s = 0; const items = [];
  S.movimientos.forEach((m) => { const c = movCalc(m); if (!c.amortAnios) return; const y0 = +m.fecha.slice(0, 4); if (year >= y0 && year < y0 + c.amortAnios) { s += c.amortBase / c.amortAnios; items.push({ m, anual: c.amortBase / c.amortAnios, anio: year - y0 + 1, de: c.amortAnios }); } });
  return { total: s, items };
}
function hacienda(year, q) {
  const qa = year + '-' + pad((q - 1) * 3 + 1) + '-01', qb = isoDate(new Date(year, q * 3, 0)), ya = year + '-01-01';
  const fq = S.facturas.filter((f) => emitida(f) && inRange(f.fecha, qa, qb));
  const mq = S.movimientos.filter((m) => esGasto(m) && inRange(m.fecha, qa, qb));
  const ivaRep = fq.reduce((s, f) => s + totalesFactura(f).iva, 0);
  const ivaSop = mq.reduce((s, m) => s + movCalc(m).ivaDed, 0);
  const fy = S.facturas.filter((f) => emitida(f) && inRange(f.fecha, ya, qb));
  const my = S.movimientos.filter((m) => esGasto(m) && inRange(m.fecha, ya, qb));
  const ingresos = fy.reduce((s, f) => s + totalesFactura(f).base, 0);
  const gastos = my.reduce((s, m) => s + movCalc(m).irpfDed, 0) + amortAnual(year).total * q / 4;
  const prelim = ingresos - gastos;
  const gdj = Math.min(Math.max(0, prelim) * S.ajustes.gdjPct / 100, S.ajustes.gdjMax);
  const rend = prelim - gdj;
  const cuota = Math.max(0, rend * 0.2);
  const ret = fy.reduce((s, f) => s + totalesFactura(f).irpf, 0);
  let previos = 0; for (let k = 1; k < q; k++) previos += hacienda(year, k).pago130;
  const pago130 = Math.max(0, cuota - ret - previos);
  return { qa, qb, ivaRep, ivaSop, res303: ivaRep - ivaSop, ingresos, gastos, gdj, rend, cuota, ret, previos, pago130, nFact: fq.length };
}
function reservar() { const d = new Date(); const h = hacienda(d.getFullYear(), Math.floor(d.getMonth() / 3) + 1); return { h, total: Math.max(0, h.res303) + h.pago130 }; }
function plazoSiguiente() {
  const d = new Date(); const y = d.getFullYear();
  const pl = [[y, 0, 30, '4T de ' + (y - 1)], [y, 3, 20, '1T'], [y, 6, 20, '2T'], [y, 9, 20, '3T'], [y + 1, 0, 30, '4T']].map(([yy, m, dd, l]) => ({ f: new Date(yy, m, dd), l }));
  return pl.find((p) => p.f >= new Date(y, d.getMonth(), d.getDate()));
}
function statsClientes(anio) {
  const out = {};
  S.facturas.filter((f) => emitida(f) && f.cliente && (anio === 'todos' || f.fecha.startsWith(anio))).forEach((f) => {
    const o = out[f.cliente] || (out[f.cliente] = { n: 0, base: 0, dias: [], ultimo: '' });
    o.n++; o.base += totalesFactura(f).base; if (f.fecha > o.ultimo) o.ultimo = f.fecha;
    if (f.estado === 'cobrada' && f.fechaCobro && f.origen !== 'excel') o.dias.push(diasEntre(f.fechaEnvio || f.fecha, f.fechaCobro));
  });
  Object.values(out).forEach((o) => { o.media = o.base / o.n; o.diasMedia = o.dias.length ? o.dias.reduce((a, b) => a + b, 0) / o.dias.length : null; });
  return out;
}
function maxNum() { return Math.max(0, ...S.facturas.filter((f) => !String(f.num).startsWith('R')).map((f) => { const m = /\.(\d+)$/.exec(f.num); return m ? +m[1] : 0; })); }
function siguienteN() { const m = maxNum(); return m > 0 ? m + 1 : (+S.ajustes.siguiente || 1); }
function siguienteNum() { const y = String(new Date().getFullYear()).slice(2); return y + S.ajustes.serie + '.' + siguienteN(); }
function faltanDatos() {
  const a = S.ajustes; const f = [];
  if (!a.nombre) f.push('nombre'); if (!a.nif) f.push('NIF'); if (!a.direccion1) f.push('dirección'); if (!a.iban) f.push('IBAN'); if (!a.cabeceraFoto) f.push('cabecera');
  return f;
}
const DIAS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
function viajesDe(f) { if (f.viajes) return f.viajes; return f.km ? [{ id: 'v0', fecha: f.fecha, destino: '', km: +f.km || 0, iv: true, veh: f.veh || '' }] : []; }
function kmVeh(vid, a, b) { let k = 0; S.facturas.forEach((f) => viajesDe(f).forEach((v) => { if (v.veh === vid && inRange(v.fecha, a, b)) k += +v.km || 0; })); return k; }
const consumoDe = (v) => v ? (+v.consumo || (v.tipo === 'coche' ? 5.6 : v.tipo === 'trail' ? 4.5 : 4)) : 0;
function siguienteRect() {
  const y = String(new Date().getFullYear()).slice(2); const pre = 'R' + y + S.ajustes.serie + '.';
  const n = S.facturas.filter((f) => f.num.startsWith(pre)).length + 1; return pre + n;
}

/* Recurrentes */
function aplicarRecurrentes() {
  const now = new Date(); const ym = now.getFullYear() + '-' + pad(now.getMonth() + 1);
  let n = 0;
  S.recurrentes.forEach((r) => {
    let cur = r.ultimo ? addMonths(r.ultimo + '-01', 1).slice(0, 7) : ym;
    while (cur <= ym) {
      const dia = Math.min(r.dia || 1, 28);
      if (cur === ym && now.getDate() < dia) break;
      S.movimientos.push(touch({ id: uid(), fecha: cur + '-' + pad(dia), concepto: r.concepto, importe: r.importe, cat: r.cat, recurrente: true }));
      r.ultimo = cur; touch(r); n++;
      cur = addMonths(cur + '-01', 1).slice(0, 7);
    }
  });
  if (n) guardar();
}

/* ============ Render principal ============ */
const NAV = [['inicio', 'Inicio', 'home'], ['movimientos', 'Movimientos', 'list'], ['facturas', 'Facturas', 'file'], ['hacienda', 'Hacienda', 'tax']];
function ruta() { const h = location.hash.replace('#', '') || 'inicio'; const [v, id] = h.split('/'); return { v, id }; }
function render() {
  const { v, id } = ruta();
  const sec = v === 'factura' || v === 'cliente' || v === 'presupuesto' ? 'facturas' : v === 'art' || v === 'pack' ? 'equipo' : v === 'ajustes' ? 'ajustes' : v;
  $('#side').innerHTML = '<div class="logo">MIS CUENTAS</div>' + NAV.map(([k, l, i]) => '<a href="#' + k + '" class="' + (sec === k ? 'on' : '') + '">' + ico(i) + l + '</a>').join('') +
    '<a href="#equipo" class="' + (sec === 'equipo' ? 'on' : '') + '">' + catIco('equipo', 20) + 'Equipo</a><a href="#" data-a="nuevo-gasto">' + ico('plus') + 'Apuntar gasto</a><a href="#" data-a="privado">' + ico(PRIV ? 'eyeoff' : 'eye') + (PRIV ? 'Mostrar cantidades' : 'Ocultar cantidades') + '</a><div style="flex:1"></div><a href="#ajustes" class="' + (sec === 'ajustes' ? 'on' : '') + '">' + ico('gear') + 'Ajustes</a>' +
    '<button class="btn ghost sm" data-a="sync">' + ico('sync', 16) + 'Sincronizar' + (S.ajustes.ultimaSync ? ' · ' + haceCuanto(S.ajustes.ultimaSync) : '') + '</button>';
  $('#bottom').innerHTML = NAV.slice(0, 2).map(([k, l, i]) => '<a href="#' + k + '" class="' + (sec === k ? 'on' : '') + '">' + ico(i, 22) + l + '</a>').join('') +
    '<a href="#" class="fab" data-a="nuevo-gasto" aria-label="Apuntar gasto">' + ico('plus', 26) + '</a>' +
    NAV.slice(2).map(([k, l, i]) => '<a href="#' + k + '" class="' + (sec === k ? 'on' : '') + '">' + ico(i, 22) + l + '</a>').join('');
  const m = $('#main');
  const views = { inicio: vInicio, movimientos: vMovimientos, facturas: vFacturas, factura: vFactura, cliente: vCliente, hacienda: vHacienda, ajustes: vAjustes, presupuesto: vPresupuesto, equipo: vEquipo, art: vArticulo, pack: vPack };
  m.innerHTML = (views[v] || vInicio)(id);
  after(v, id);
}
function after(v, id) {
  if (v === 'inicio' || !v) { animarBalance(); cargarFotosVeh(); }
  if (v === 'factura') pintarPreview(id);
  if (v === 'ajustes' || v === 'equipo' || v === 'art') cargarFotosVeh();
}
function haceCuanto(ts) { const m = Math.round((Date.now() - ts) / 60000); if (m < 60) return 'hace ' + m + ' min'; const h = Math.round(m / 60); if (h < 48) return 'hace ' + h + ' h'; return 'hace ' + Math.round(h / 24) + ' días'; }

/* ---------- Inicio ---------- */
function vInicio() {
  const [a, b, nombre] = rango(UI.periodo, UI.ref);
  const r = resumen(a, b);
  UI.target = r.balance;
  const pend = S.facturas.filter(pendiente).sort((x, y) => venceFactura(x).localeCompare(venceFactura(y)));
  const res = reservar();
  const y = new Date().getFullYear();
  const ry = resumen(y + '-01-01', y + '-12-31');
  const libre = ry.balance - ry.ahorrado - res.total;
  const pl = plazoSiguiente();
  const avisos = [];
  const hd = hoy();
  pend.forEach((f) => { const dv = diasEntre(venceFactura(f), hd); if (dv >= 0) { const toca = !f.ultimoRecordatorio || diasEntre(f.ultimoRecordatorio, hd) >= 15; avisos.push('<button class="item" data-a="ver-factura" data-id="' + f.id + '"><span class="dot" style="background:var(--bad)"></span><span class="f1">' + esc(f.num) + ' · ' + esc(nombreCli(f.cliente)) + (dv === 0 ? ' vence hoy' : ' vencida hace ' + dv + ' días') + '</span>' + (toca ? '<span class="pill" style="background:#5A2230">Recordar</span>' : '') + '</button>'); } });
  if (!S.ajustes.ultimaSync || Date.now() - S.ajustes.ultimaSync > 7 * 86400000) avisos.push('<button class="item" data-a="sync"><span class="dot" style="background:var(--warn)"></span><span class="f1">' + (S.ajustes.ultimaSync ? 'Llevas ' + haceCuanto(S.ajustes.ultimaSync).replace('hace ', '') + ' sin sincronizar' : 'Aún no has hecho ninguna copia en Drive') + '</span><span class="pill">Sincronizar</span></button>');
  const [ma, mb] = rango('mes', hd.slice(0, 8) + '01'); const rm = resumen(ma, mb);
  Object.entries(S.ajustes.limites).forEach(([c, lim]) => { if (lim > 0 && (rm.porCat[c] || 0) >= lim * 0.85) avisos.push('<div class="item"><span class="dot" style="background:var(--warn)"></span><span class="f1">' + esc(cat(c).n) + ': ' + eur(rm.porCat[c] || 0) + ' de ' + eur(lim) + ' este mes</span></div>'); });
  if (pl && diasEntre(hd, isoDate(pl.f)) <= 15) avisos.push('<a class="item" href="#hacienda"><span class="dot" style="background:var(--ac)"></span><span class="f1">Plazo de Hacienda (' + pl.l + ') el ' + fechaCorta(isoDate(pl.f)) + '</span></a>');
  return '<div class="top" style="padding-bottom:4px"><div class="sub">Hola' + (S.ajustes.nombre ? ', ' + esc(S.ajustes.nombre.split(' ')[0]) : '') + '</div>' +
    '<div class="row"><button class="btn icon" data-a="privado" aria-label="' + (PRIV ? 'Mostrar cantidades' : 'Ocultar cantidades') + '" aria-pressed="' + PRIV + '">' + ico(PRIV ? 'eyeoff' : 'eye') + '</button><button class="btn icon" data-a="sync" aria-label="Sincronizar" id="btn-sync">' + ico('sync') + '</button><a href="#ajustes" class="btn icon" aria-label="Ajustes">' + ico('gear') + '</a></div></div>' +
    '<div class="row" style="margin-bottom:14px"><button class="btn icon sm" data-a="ref" data-d="-1" aria-label="Periodo anterior">' + ico('left', 18) + '</button><h1 class="f1" style="font-size:22px;text-transform:capitalize;text-align:center">' + esc(nombre) + '</h1><button class="btn icon sm" data-a="ref" data-d="1" aria-label="Periodo siguiente">' + ico('right', 18) + '</button></div>' +
    (S.movimientos.length + S.facturas.length === 0 ? '<div class="infobox" style="margin-bottom:14px">Todavía no hay datos. Ve a <a href="#ajustes">Ajustes › Datos</a> e importa el archivo <b>datos-2026.json</b> con tu Excel, tus datos fiscales y la cabecera de las facturas.</div>' : '') +
    '<div class="seg" style="margin-bottom:14px">' + [['mes', 'Mes'], ['trim', 'Trimestre'], ['anio', 'Año']].map(([k, l]) => '<button class="' + (UI.periodo === k ? 'on' : '') + '" data-a="periodo" data-p="' + k + '">' + l + '</button>').join('') + '</div>' +
    '<div class="grid home-grid">' +
    '<div class="hero"><span class="lbl">Balance de ' + esc(nombre) + '</span><span class="big num" id="balance">' + eur(UI.shown, true) + '</span>' +
    '<div class="row"><div class="f1"><div class="lbl">Cobrado</div><div class="num" style="font-weight:600;color:var(--ok)">' + eur(r.cobrado) + '</div></div><div class="f1"><div class="lbl">Gastado</div><div class="num" style="font-weight:600">' + eur(r.gastado) + '</div></div><div class="f1"><div class="lbl">Ahorrado</div><div class="num" style="font-weight:600">' + eur(r.ahorrado) + '</div></div></div></div>' +
    '<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px">' +
    '<button class="card" data-a="desglose" style="animation-delay:60ms;border:none;text-align:left;cursor:pointer;color:var(--tx)"><span class="sub">Te queda este año</span><span class="num" style="font-size:22px;font-weight:700;color:' + (libre >= 0 ? 'var(--tx)' : 'var(--bad)') + '">' + eur(libre) + '</span><span class="sub" style="font-size:12px">Ya descontado lo de Hacienda · toca para ver el desglose</span></button>' +
    '<a href="#hacienda" class="card" style="animation-delay:120ms;color:var(--tx)"><span class="sub">Reservar para Hacienda</span><span class="num" style="font-size:22px;font-weight:700">' + eur(res.total) + '</span><span class="sub" style="font-size:12px">303: ' + eur(Math.max(0, res.h.res303)) + ' · 130: ' + eur(res.h.pago130) + (pl ? '<br>Próximo plazo: ' + fechaCorta(isoDate(pl.f)) : '') + '</span></a></div>' +
    (avisos.length ? '<div class="card" style="animation-delay:150ms"><div class="between"><b>Avisos</b>' + ico('bell', 18) + '</div><div class="list">' + avisos.join('') + '</div></div>' : '') +
    '<div class="card" style="animation-delay:180ms"><div class="between"><b>Facturas pendientes</b><a href="#facturas" class="sub" style="color:var(--ac)">' + pend.length + ' · ' + eur(pend.reduce((s, f) => s + totalesFactura(f).total, 0)) + '</a></div>' +
    (pend.length ? '<div class="list">' + pend.slice(0, 5).map(filaPendiente).join('') + '</div>' : '<span class="sub">Nada pendiente de cobro.</span>') + '</div>' +
    grafico(r, a) +
    tarjetaVehiculos() + tarjetaEquipoInicio() +
    '</div>';
}
function estadoFactura(f) {
  const dv = diasEntre(venceFactura(f), hoy());
  if (dv >= 0) return { col: '#FF5C6C', tx: '#FF8A95', t: dv === 0 ? 'Vence hoy' : 'Vencida hace ' + dv + ' días', k: 'red' };
  if (dv >= -7) return { col: '#FFA94D', tx: '#FFC37F', t: 'Vence en ' + (-dv) + ' días', k: 'orange' };
  return { col: '#8A8191', tx: '#A99FB0', t: 'Vence el ' + fechaES(venceFactura(f)), k: 'gray' };
}
function filaPendiente(f) { const e = estadoFactura(f); return '<button class="item" data-a="ver-factura" data-id="' + f.id + '"><span class="dot" style="background:' + e.col + '"></span><span class="f1" style="font-size:14px">' + esc(f.num) + ' · ' + esc(nombreCli(f.cliente)) + '</span><span style="font-size:12px;color:' + e.tx + '">' + e.t + '</span></button>'; }
const nombreCli = (id) => { const c = S.clientes.find((x) => x.id === id); return c ? c.nombre : 'Sin cliente'; };
function grafico(r, a) {
  const vista = S.ajustes.vista || 'lista';
  const entries = Object.entries(r.porCat).sort((x, y) => y[1] - x[1]);
  const total = entries.reduce((s, e) => s + e[1], 0);
  const views = [['lista', 'Lista', 'Gastos por categoría'], ['circulo', 'Círculo', 'Reparto de gastos'], ['meses', 'Meses', 'Gastos mes a mes']];
  const vi = Math.max(0, views.findIndex((v) => v[0] === vista));
  let body = '';
  if (!entries.length && vi < 2) body = '<span class="sub">Sin gastos en este periodo.</span>';
  else if (vi === 0) {
    const max = entries[0][1];
    body = entries.map(([c, v]) => '<button class="item" style="padding:6px 0;border:none;display:block" data-a="filtrar-cat" data-c="' + c + '"><div class="between" style="font-size:13px;margin-bottom:4px"><span>' + esc(cat(c).n) + '</span><span class="sub">' + eur(v) + '</span></div><div class="bar"><div style="width:' + Math.max(2, v / max * 100) + '%;background:' + cat(c).col + '"></div></div></button>').join('');
  } else if (vi === 1) {
    const top = entries.slice(0, 5); const resto = entries.slice(5).reduce((s, e) => s + e[1], 0);
    const segs = top.map(([c, v]) => [cat(c).n, v, cat(c).col, c]); if (resto > 0) segs.push(['Otras', resto, '#4A3D52', '']);
    let acc = 0; const stops = segs.map((s) => { const a0 = acc; acc += s[1] / total * 360; return s[2] + ' ' + a0.toFixed(1) + 'deg ' + acc.toFixed(1) + 'deg'; });
    body = '<div class="row" style="gap:16px"><div class="donut" style="background:conic-gradient(' + stops.join(',') + ')"><div><span class="sub" style="font-size:11px">Total</span><span class="num" style="font-weight:700;font-size:14px">' + eur(total) + '</span></div></div><div class="f1" style="display:flex;flex-direction:column;gap:6px">' +
      segs.map((s) => '<div class="row" style="font-size:12px;gap:8px"><span class="dot" style="background:' + s[2] + '"></span><span class="f1">' + esc(s[0]) + '</span><span class="sub">' + Math.round(s[1] / total * 100) + ' %</span></div>').join('') + '</div></div>';
  } else {
    const ref = parseD(a); const meses = [];
    for (let k = 5; k >= 0; k--) { const d = new Date(ref.getFullYear(), ref.getMonth() - k, 1); const [ma, mb] = rango('mes', isoDate(d)); meses.push({ l: MESES_C[d.getMonth()], r: resumen(ma, mb) }); }
    const max = Math.max(1, ...meses.map((m) => m.r.gastado));
    const cs = [...new Set(meses.flatMap((m) => Object.keys(m.r.porCat)))];
    body = '<div class="months">' + meses.map((m, i) => '<div><span class="sub" style="font-size:10px;text-align:center">' + (PRIV ? '•••' : Math.round(m.r.gastado)) + '</span><div class="stack" style="animation-delay:' + i * 60 + 'ms;height:' + Math.round(m.r.gastado / max * 118) + 'px">' +
      cs.map((c) => m.r.porCat[c] ? '<div style="flex:' + m.r.porCat[c].toFixed(1) + ' 1 0;min-height:2px;background:' + cat(c).col + '"></div>' : '').join('') + '</div></div>').join('') + '</div>' +
      '<div class="row" style="gap:8px">' + meses.map((m, i) => '<span class="f1 sub" style="text-align:center;font-size:11px;' + (i === 5 ? 'color:var(--tx);font-weight:600' : '') + '">' + m.l + '</span>').join('') + '</div>';
  }
  return '<div class="card" style="animation-delay:220ms"><div class="between"><b>' + views[vi][2] + '</b><button class="btn ghost sm" data-a="vista" aria-label="Cambiar vista del gráfico">' + ico('swap', 14) + views[vi][1] + '</button></div>' + body +
    '<div class="row" style="justify-content:center;gap:6px">' + views.map((v, i) => '<span style="height:6px;border-radius:3px;transition:width .25s;width:' + (i === vi ? 18 : 6) + 'px;background:' + (i === vi ? 'var(--ac)' : '#3A2F42') + '"></span>').join('') + '</div></div>';
}
function tarjetaEquipoInicio() {
  if (!S.equipo.length) return '<a href="#equipo" class="card" style="color:var(--tx);animation-delay:300ms"><div class="between"><b>Mi equipo</b>' + ico('right', 18) + '</div><span class="sub">Añade tu equipo para ver lo que te genera cada cosa.</span></a>';
  const { st } = statsEquipo(); const inv = S.equipo.reduce((s, a) => s + st[a.id].coste, 0), gen = S.equipo.reduce((s, a) => s + st[a.id].total, 0);
  const top = S.equipo.filter((a) => st[a.id].total > 0).sort((a, b) => st[b.id].total - st[a.id].total).slice(0, 3);
  return '<a href="#equipo" class="card" style="color:var(--tx);animation-delay:300ms"><div class="between"><b>Mi equipo</b><span class="sub">' + S.equipo.reduce((s, a) => s + unidadesActivas(a).length, 0) + ' piezas ' + ico('right', 16) + '</span></div>' +
    '<div class="between" style="font-size:13px"><span class="sub">Invertido · generado</span><span class="num">' + eur(inv) + ' · ' + eur(gen) + '</span></div>' + barraPct(inv ? gen / inv * 100 : null) +
    (top.length ? '<span class="sub" style="font-size:12px">Lo que más te genera: ' + top.map((a) => esc(a.nombre)).join(', ') + '</span>' : '') + '</a>';
}
function tarjetaVehiculos() {
  const y = new Date().getFullYear(); const [ma, mb] = rango('mes', hoy().slice(0, 8) + '01');
  const vs = S.vehiculos.filter((v) => v.propio);
  return '<div class="card" style="animation-delay:260ms"><b>Mis vehículos</b><div class="veh">' + vs.map((v) => {
    const g = S.movimientos.filter((m) => m.cat === 'gasolina' && m.veh === v.id);
    const mes = g.filter((m) => inRange(m.fecha, ma, mb)).reduce((s, m) => s + m.importe, 0);
    const an = g.filter((m) => m.fecha.startsWith(String(y)));
    const km = kmVeh(v.id, y + '-01-01', y + '-12-31');
    const ded = an.reduce((s, m) => s + movCalc(m).irpfDed, 0);
    return '<div class="vehcard"><div class="vehimg" data-foto="' + (v.foto || '') + '">' + (v.foto ? '' : VEH_SVG[v.tipo]) + '</div><div style="padding:12px;display:flex;flex-direction:column;gap:4px"><div class="between"><b>' + esc(v.nombre) + '</b><span class="sub" style="font-size:11px">' + esc(v.modelo) + '</span></div>' +
      '<div class="between" style="font-size:13px"><span class="sub">Este mes</span><span class="num">' + eur(mes) + '</span></div><div class="between" style="font-size:13px"><span class="sub">' + y + ' (' + an.length + ' repostajes)</span><span class="num">' + eur(an.reduce((s, m) => s + m.importe, 0)) + '</span></div>' +
      '<div class="between" style="font-size:12px"><span class="sub">Km de trabajo</span><span>' + km + ' km</span></div><div class="between" style="font-size:12px"><span class="sub">Deducible</span><span>' + (v.pct ? eur(ded) : 'pendiente') + '</span></div></div></div>';
  }).join('') + '</div></div>';
}
async function cargarFotosVeh() { for (const el of document.querySelectorAll('[data-foto]')) { const id = el.getAttribute('data-foto'); if (id) { const src = await fotoSrc(id); if (src) el.style.backgroundImage = 'url(' + src + ')'; } } }
let rafB = null;
function animarBalance() {
  const el = $('#balance'); if (!el) return;
  const to = UI.target, from = UI.shown;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(to - from) < 0.01) { UI.shown = to; el.textContent = eur(to, true); return; }
  cancelAnimationFrame(rafB); const t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / 700); const e = 1 - Math.pow(1 - k, 3); UI.shown = from + (to - from) * e; const n = $('#balance'); if (n) n.textContent = eur(UI.shown, true); if (k < 1) rafB = requestAnimationFrame(step); };
  rafB = requestAnimationFrame(step);
}

/* ---------- Movimientos ---------- */
function vMovimientos() {
  const cobros = S.facturas.filter((f) => f.estado === 'cobrada' && f.fechaCobro).map((f) => ({ id: f.id, fecha: f.fechaCobro, concepto: 'Cobro ' + f.num + ' · ' + nombreCli(f.cliente), importe: totalesFactura(f).total, ingreso: true, cat: 'ingreso' }));
  let items = S.movimientos.concat(cobros);
  const f = UI.filtro;
  if (f === 'trabajo') items = items.filter((m) => !m.ingreso && esGasto(m) && cat(m.cat).t !== 'personal');
  else if (f === 'personal') items = items.filter((m) => !m.ingreso && esGasto(m) && cat(m.cat).t === 'personal');
  else if (f === 'ingresos') items = items.filter((m) => m.ingreso || m.cat === 'ingreso');
  else if (f === 'ahorro') items = items.filter((m) => m.cat === 'ahorro');
  else if (f === 'deducible') items = items.filter((m) => !m.ingreso && esGasto(m) && (movCalc(m).ivaDed > 0 || movCalc(m).irpfDed > 0 || movCalc(m).amortBase > 0));
  else if (f.startsWith('cat:')) items = items.filter((m) => m.cat === f.slice(4));
  else if (f.startsWith('veh:')) items = items.filter((m) => m.veh === f.slice(4));
  if (UI.mesFiltro) items = items.filter((m) => m.fecha.startsWith(UI.mesFiltro));
  if (UI.q) { const q = UI.q.toLowerCase(); items = items.filter((m) => (m.concepto + ' ' + (m.nota || '')).toLowerCase().includes(q)); }
  items.sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.upd || 0) - (a.upd || 0));
  const meses = [...new Set(S.movimientos.map((m) => m.fecha.slice(0, 7)))].sort().reverse();
  const shown = items.slice(0, 400);
  let html = '', last = '';
  shown.forEach((m) => {
    if (m.fecha !== last) { html += '<div class="sub" style="padding:14px 4px 4px;font-weight:600">' + fechaCorta(m.fecha) + ' ' + m.fecha.slice(0, 4) + '</div>'; last = m.fecha; }
    const c = m.ingreso ? { id: 'ingreso', col: '#6EE7A8', n: 'Cobro' } : m.cat === 'ingreso' ? { id: 'ingreso', col: '#6EE7A8', n: 'Ingreso · ' + (m.tipoIng || '') } : m.cat === 'ahorro' ? { id: 'ahorro', col: '#7C9CFF', n: 'Ahorro · ' + (m.cuenta || '') } : cat(m.cat);
    const sub = m.ingreso ? 'Factura cobrada' : m.cat === 'ingreso' ? 'Ingreso sin factura · ' + (m.tipoIng || '') : (c.n + (m.veh ? ' · ' + ((veh(m.veh) || {}).nombre || '') : '') + (m.foto ? ' · ticket' : ''));
    html += '<button class="item" data-a="' + (m.ingreso ? 'ver-factura' : 'editar-mov') + '" data-id="' + m.id + '"><span class="ico" style="background:' + c.col + '22;color:' + c.col + '">' + catIco(c.id, 20) + '</span><span class="f1"><div style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(m.concepto) + '</div><div class="sub" style="font-size:12px">' + esc(sub) + '</div></span><span class="num" style="font-weight:600;color:' + (m.ingreso || m.cat === 'ingreso' ? 'var(--ok)' : 'var(--tx)') + '">' + (m.ingreso || m.cat === 'ingreso' ? '+' : m.cat === 'ahorro' ? '' : '−') + eur(m.importe) + '</span></button>';
  });
  const tot = items.reduce((s, m) => s + (m.ingreso || m.cat === 'ingreso' ? m.importe : m.cat === 'ahorro' ? 0 : -m.importe), 0);
  const chips = [['todos', 'Todo'], ['trabajo', 'Trabajo'], ['personal', 'Personal'], ['ingresos', 'Cobros'], ['deducible', 'Deducible'], ['ahorro', 'Ahorro']];
  return '<div class="top"><h1>Movimientos</h1><button class="btn pri" data-a="nuevo-gasto">' + ico('plus', 16) + 'Apuntar</button></div>' +
    '<div class="row" style="margin-bottom:10px"><div style="position:relative" class="f1"><span style="position:absolute;left:12px;top:13px;color:var(--mut)">' + ico('search', 18) + '</span><input class="in" style="padding-left:40px" placeholder="Buscar: Iberia, Mercadona…" value="' + esc(UI.q) + '" data-in="q" aria-label="Buscar"></div>' +
    '<select class="in" style="width:auto" data-in="mesFiltro" aria-label="Mes"><option value="">Todos los meses</option>' + meses.map((m) => '<option value="' + m + '"' + (UI.mesFiltro === m ? ' selected' : '') + '>' + MESES[+m.slice(5) - 1] + ' ' + m.slice(0, 4) + '</option>').join('') + '</select></div>' +
    '<div class="chips" style="margin-bottom:6px">' + chips.map(([k, l]) => '<button class="chip ' + (f === k ? 'on' : '') + '" data-a="filtro" data-f="' + k + '">' + l + '</button>').join('') +
    '<select class="chip" data-in="filtro" aria-label="Categoría o vehículo"><option value="">Categoría…</option>' + CATS.map((c) => '<option value="cat:' + c.id + '"' + (f === 'cat:' + c.id ? ' selected' : '') + '>' + esc(c.n) + '</option>').join('') + S.vehiculos.map((v) => '<option value="veh:' + v.id + '"' + (f === 'veh:' + v.id ? ' selected' : '') + '>Vehículo: ' + esc(v.nombre) + '</option>').join('') + '</select></div>' +
    '<div id="mov-res"><div class="between sub" style="padding:6px 4px">' + items.length + ' movimientos<span class="num">' + eur(tot, true) + '</span></div>' +
    '<div class="card" style="padding:6px 12px">' + (html || '<span class="sub" style="padding:12px 0">No hay movimientos con este filtro.</span>') + (items.length > 400 ? '<span class="sub" style="padding:10px 0">Mostrando los 400 más recientes. Usa los filtros para ver más.</span>' : '') + '</div></div>';
}

/* ---------- Hoja de gasto ---------- */
let G_EDIT = null;
function abrirGasto(id) {
  const m = id ? S.movimientos.find((x) => x.id === id) : null;
  G_EDIT = m ? { ...JSON.parse(JSON.stringify(m)), yaTenia: true } : { id: null, fecha: hoy(), concepto: '', importe: 0, cat: 'gasolina', veh: null };
  if (!G_EDIT.veh && G_EDIT.cat === 'gasolina') G_EDIT.veh = ultimoVeh();
  pintarGasto();
}
function ultimoVeh() { const g = S.movimientos.filter((m) => m.cat === 'gasolina' && m.veh).sort((a, b) => b.fecha.localeCompare(a.fecha))[0]; return g ? g.veh : 'elfo'; }
function sugerirCat(concepto) {
  if (!concepto || concepto.length < 3) return null; const q = concepto.toLowerCase().split(' ')[0];
  const m = S.movimientos.filter((x) => x.concepto.toLowerCase().startsWith(q)).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  return m ? m.cat : null;
}
function sugHTML(g) { if (g.cat === 'ingreso' || g.cat === 'ahorro') return ''; const sug = !g.id ? sugerirCat(g.concepto) : null; return sug && sug !== g.cat ? ' · <button class="btn sm ghost" data-a="g-cat" data-c="' + sug + '">Usar ' + esc(cat(sug).n) + '</button>' : ''; }
function dedTexto(g) {
  if (g.cat === 'ahorro' || g.cat === 'ingreso' || !(g.importe > 0)) return '';
  const c = cat(g.cat); const k = movCalc(g); let ded;
  if (c.veh) { const v = veh(g.veh); ded = !v || !v.propio ? 'Vehículo personal: no deducible' : v.pct ? 'Deducible (' + v.pct + ' % por km de trabajo): IVA ' + eur(k.ivaDed) + ' · IRPF ' + eur(k.irpfDed) : 'Deducible según km de trabajo (fija el % en Hacienda)'; }
  else if (k.amortBase) ded = 'IVA deducible ' + eur(k.ivaDed) + ' · se amortiza ' + eur(k.amortBase / k.amortAnios) + ' al año durante ' + k.amortAnios + ' años';
  else if (k.ivaDed || k.irpfDed) ded = 'IVA deducible ' + eur(k.ivaDed) + ' · gasto deducible ' + eur(k.irpfDed);
  else ded = 'Gasto personal: no deducible';
  if (!c.amort && c.t === 'trabajo' && g.importe > 300 * (1 + S.ajustes.ivaPct / 100)) ded += '<br><b>Más de 300 €:</b> quizá deba amortizarse. Elige «Equipo +300 €».';
  return ded;
}
function refrescarGasto() {
  const a = $('#g-sug'); if (a) a.innerHTML = sugHTML(G_EDIT);
  const b = $('#g-ded'); if (b) { const t = dedTexto(G_EDIT); b.innerHTML = t ? '<div class="infobox">' + t + '</div>' : ''; }
}
function pintarGasto() {
  const g = G_EDIT; const esIng = g.cat === 'ingreso'; const esAhorro = g.cat === 'ahorro' || esIng;
  const cats = CATS.slice().sort((a, b) => (a.fija || 99) - (b.fija || 99));
  const sug = !g.id ? sugerirCat(g.concepto) : null;
  const c = esAhorro ? null : cat(g.cat);
  const ded = dedTexto(g);
  const trabajos = S.facturas.filter((f) => f.estado !== 'borrador' || true).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 25);
  hoja('<div class="between"><button class="btn icon" data-a="cerrar" aria-label="Cerrar">' + ico('x') + '</button><div class="seg"><button class="' + (!esAhorro ? 'on' : '') + '" data-a="g-tipo" data-t="gasto">Gasto</button><button class="' + (esIng ? 'on' : '') + '" data-a="g-tipo" data-t="ingreso">Ingreso</button><button class="' + (g.cat === 'ahorro' ? 'on' : '') + '" data-a="g-tipo" data-t="ahorro">Ahorro</button></div><span style="width:44px"></span></div>' +
    '<label class="f" style="align-items:center">Importe' + (esAhorro ? '' : ' (IVA incluido)') + '<input class="amount num" inputmode="decimal" id="g-imp" value="' + (g.importe ? String(g.importe).replace('.', ',') : '') + '" placeholder="0,00 €" data-g="importe"></label>' +
    '<label class="f">Concepto<input class="in" id="g-con" value="' + esc(g.concepto) + '" placeholder="' + (esIng ? 'Regalo de mamá' : esAhorro ? 'Ahorro del mes' : 'Repsol, Mercadona, vuelo…') + '" data-g="concepto" autocomplete="off"></label>' +
    (esIng ? '<label class="f">Tipo de ingreso<select class="in" data-g="tipoIng">' + ['Regalo', 'Venta de algo', 'Devolución o reembolso', 'Bizum de amigos', 'Otro'].map((x) => '<option' + (g.tipoIng === x ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></label><div class="infobox">No es un ingreso de tu actividad: suma a tu balance pero no cuenta para Hacienda.</div>' : esAhorro ? '<label class="f">Cuenta<select class="in" data-g="cuenta">' + ['BBVA', 'Metálico', 'Revolut', 'Otra'].map((x) => '<option' + (g.cuenta === x ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></label>' :
      '<div class="f" style="display:flex;flex-direction:column;gap:8px"><span class="sub">Categoría<span id="g-sug">' + sugHTML(g) + '</span></span><div class="catgrid">' +
      cats.map((x) => '<button class="cat ' + (g.cat === x.id ? 'on' : '') + '" data-a="g-cat" data-c="' + x.id + '"><span style="color:' + x.col + '">' + catIco(x.id, 24) + '</span>' + esc(cat(x.id).n) + '</button>').join('') + '</div></div>') +
    (c && c.veh ? '<div style="display:flex;flex-direction:column;gap:8px"><span class="sub">Vehículo</span><div class="seg">' + S.vehiculos.map((v) => '<button class="' + (g.veh === v.id ? 'on' : '') + '" data-a="g-veh" data-v="' + v.id + '">' + esc(v.nombre) + '</button>').join('') + '</div></div>' : '') +
    (c && c.veh ? '<div class="row"><label class="f f1">Litros (opcional)<input class="in" inputmode="decimal" value="' + (g.litros ? String(g.litros).replace('.', ',') : '') + '" data-g="litros"></label><label class="f f1">Nº factura o ticket<input class="in" value="' + esc(g.ticket || '') + '" data-g="ticket"></label></div>' : '') +
    (c && c.nota ? '<label class="f">Anotación (la lección)<input class="in" value="' + esc(g.nota || '') + '" data-g="nota" placeholder="Si llueve, no entrar en barrizales"></label>' : '') +
    '<div class="row"><label class="btn dash f1" style="cursor:pointer">' + ico('cam', 18) + (g.foto || g.fotoNueva ? 'Ticket añadido ✓' : 'Foto del ticket') + '<input type="file" accept="image/*" capture="environment" hidden data-file="ticket"></label><input type="date" class="in" style="width:auto" value="' + g.fecha + '" data-g="fecha" aria-label="Fecha"></div>' +
    (g.foto ? '<button class="btn ghost sm" data-a="ver-foto" data-id="' + g.foto + '">Ver ticket</button>' : '') +
    (!esAhorro && trabajos.length ? '<details' + (g.trabajo ? ' open' : '') + '><summary class="sub" style="cursor:pointer;padding:4px 0">Asociar a un trabajo (opcional)</summary><select class="in" data-g="trabajo" style="margin-top:8px"><option value="">Ninguno</option>' + trabajos.map((f) => '<option value="' + f.id + '"' + (g.trabajo === f.id ? ' selected' : '') + '>' + esc(f.num + ' · ' + (f.lineas[0] ? f.lineas[0].c : '')) + '</option>').join('') + '</select></details>' : '') +
    '<div id="g-ded">' + (ded ? '<div class="infobox">' + ded + '</div>' : '') + '</div>' +
    '<div class="row">' + (g.id ? '<button class="btn danger" data-a="g-borrar">Borrar</button>' : '') + '<button class="btn pri f1" style="min-height:54px;font-size:16px" data-a="g-guardar">Guardar' + (esIng ? ' ingreso' : esAhorro ? ' ahorro' : ' gasto') + '</button></div>');
  if (!g.id) setTimeout(() => { const e = $('#g-imp'); if (e && !g.importe) e.focus(); }, 250);
}
function hoja(html) { const sh = $('#layer .sheet'); if (sh) { const st = sh.scrollTop; sh.innerHTML = html; sh.scrollTop = st; return; } $('#layer').innerHTML = '<div class="sheet-bg" data-a="cerrar-fondo"><div class="sheet" role="dialog" aria-modal="true">' + html + '</div></div>'; }
function cerrarHoja() { $('#layer').innerHTML = ''; G_EDIT = null; }

/* ---------- Facturas ---------- */
function vFacturas() {
  const t = UI.ftab;
  const tabs = [['pendientes', 'Pendientes · ' + S.facturas.filter(pendiente).length], ['cobradas', 'Cobradas'], ['borradores', 'Borradores'], ['presupuestos', 'Presupuestos'], ['clientes', 'Clientes']];
  let body = '';
  if (t === 'pendientes') {
    const p = S.facturas.filter(pendiente).sort((a, b) => venceFactura(a).localeCompare(venceFactura(b)));
    body = '<div class="between sub" style="padding:4px">Pendiente de cobro<b class="num" style="color:var(--tx)">' + eur(p.reduce((s, f) => s + totalesFactura(f).total, 0)) + '</b></div>' +
      (p.length ? p.map(tarjetaPendiente).join('') : '<div class="card"><span class="sub">Todo cobrado. Nada pendiente.</span></div>');
  } else if (t === 'cobradas' || t === 'borradores') {
    const est = t === 'cobradas' ? 'cobrada' : 'borrador';
    const l = S.facturas.filter((f) => f.estado === est).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.num.localeCompare(a.num, 'es', { numeric: true }));
    body = '<div class="card" style="padding:6px 12px">' + (l.length ? l.map((f) => '<button class="item" data-a="ver-factura" data-id="' + f.id + '"><span class="f1"><div style="font-size:14px">' + esc(f.num) + ' · ' + esc(nombreCli(f.cliente)) + '</div><div class="sub" style="font-size:12px">' + esc(f.lineas.map((x) => x.c).join(', ')).slice(0, 80) + ' · ' + fechaES(f.fecha) + '</div></span><span class="num" style="font-weight:600">' + eur(totalesFactura(f).total) + '</span></button>').join('') : '<span class="sub" style="padding:12px 0;display:block">No hay ' + t + '.</span>') + '</div>';
  } else if (t === 'presupuestos') {
    const l = S.presupuestos.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
    body = '<div class="row" style="margin-bottom:8px"><button class="btn" data-a="nuevo-presu">' + ico('plus', 16) + 'Nuevo presupuesto</button></div><div class="card" style="padding:6px 12px">' + (l.length ? l.map((p) => '<button class="item" data-a="ver-presu" data-id="' + p.id + '"><span class="f1"><div style="font-size:14px">' + esc(p.ref) + ' · ' + esc(nombreCli(p.cliente)) + '</div><div class="sub" style="font-size:12px">' + (p.estado === 'aceptado' ? 'Convertido en factura' : 'Pendiente') + ' · ' + fechaES(p.fecha) + '</div></span><span class="num">' + eur(totalesFactura(p).total) + '</span></button>').join('') : '<span class="sub" style="padding:12px 0;display:block">Sin presupuestos.</span>') + '</div>';
  } else {
    const st = statsClientes(UI.anioCli);
    const anios = [...new Set(S.facturas.map((f) => f.fecha.slice(0, 4)))].sort().reverse();
    const rows = S.clientes.map((c) => ({ c, s: st[c.id] || { n: 0, base: 0, media: 0, diasMedia: null, ultimo: '' } }));
    const k = UI.orden; const sorters = { nombre: (a, b) => a.c.nombre.localeCompare(b.c.nombre), trabajos: (a, b) => b.s.n - a.s.n, facturado: (a, b) => b.s.base - a.s.base, media: (a, b) => b.s.media - a.s.media, paga: (a, b) => (a.s.diasMedia == null ? 999 : a.s.diasMedia) - (b.s.diasMedia == null ? 999 : b.s.diasMedia), ultimo: (a, b) => b.s.ultimo.localeCompare(a.s.ultimo) };
    rows.sort(sorters[k] || sorters.facturado);
    const sinCli = S.facturas.filter((f) => emitida(f) && !f.cliente).length;
    const th = (key, l, r) => '<th class="' + (r ? 'r' : '') + '" data-a="orden" data-o="' + key + '">' + l + (k === key ? ' ▾' : '') + '</th>';
    body = '<div class="row wrap" style="margin-bottom:8px"><button class="btn" data-a="nuevo-cliente">' + ico('plus', 16) + 'Nuevo cliente</button><select class="in" style="width:auto" data-in="anioCli" aria-label="Año"><option value="todos">Todos los años</option>' + anios.map((a) => '<option' + (UI.anioCli === a ? ' selected' : '') + '>' + a + '</option>').join('') + '</select></div>' +
      (sinCli ? '<div class="infobox" style="margin-bottom:10px">' + sinCli + ' facturas no tienen cliente asignado (vienen del Excel). Ábrelas y asígnalo para que cuenten aquí.</div>' : '') +
      '<div class="card scroll-x" style="padding:8px 12px"><table class="t"><thead><tr>' + th('nombre', 'Cliente') + th('trabajos', 'Trabajos', 1) + th('facturado', 'Facturado', 1) + th('media', 'Media', 1) + th('paga', 'Paga en') + th('ultimo', 'Último') + '</tr></thead><tbody>' +
      (rows.length ? rows.map(({ c, s }) => '<tr data-a="ver-cliente" data-id="' + c.id + '" style="cursor:pointer"><td>' + esc(c.nombre) + '</td><td class="r">' + s.n + '</td><td class="r num">' + eur(s.base) + '</td><td class="r num">' + eur(s.media || 0) + '</td><td style="white-space:nowrap">' + cara(s.diasMedia) + ' ' + (s.diasMedia == null ? '—' : Math.round(s.diasMedia) + ' d') + '</td><td>' + (s.ultimo ? fechaES(s.ultimo) : '—') + '</td></tr>').join('') : '<tr><td colspan="6" class="sub">Aún no hay clientes.</td></tr>') + '</tbody></table></div>';
  }
  return '<div class="top"><h1>Facturas</h1><button class="btn pri" data-a="nueva-factura">' + ico('plus', 16) + 'Nueva</button></div>' +
    '<div class="chips" style="margin-bottom:12px">' + tabs.map(([k, l]) => '<button class="chip ' + (t === k ? 'on' : '') + '" data-a="ftab" data-t="' + k + '">' + l + '</button>').join('') + '</div><div class="grid" style="gap:12px">' + body + '</div>';
}
function tarjetaPendiente(f) {
  const e = estadoFactura(f); const c = S.clientes.find((x) => x.id === f.cliente); const tt = totalesFactura(f);
  const bg = e.k === 'red' ? 'background:#2A1218;border:1px solid #5A2230' : 'border:1px solid var(--line)';
  return '<div class="card" style="' + bg + '" id="pf-' + f.id + '"><div class="between" style="align-items:flex-start"><button class="f1" style="text-align:left;background:none;border:none;padding:0;cursor:pointer" data-a="ver-factura" data-id="' + f.id + '"><div class="sub" style="font-size:13px">' + esc(f.num) + ' · enviada ' + fechaES(f.fechaEnvio || f.fecha) + '</div><div style="font-weight:600">' + esc(nombreCli(f.cliente)) + '</div><div class="sub" style="color:var(--soft)">' + esc(f.lineas.map((x) => x.c).join(', ')).slice(0, 70) + '</div></button><span class="num" style="font-size:18px;font-weight:700;white-space:nowrap">' + eur(tt.total) + '</span></div>' +
    '<div class="row"><span class="dot" style="background:' + e.col + '"></span><span style="font-size:12px;color:' + e.tx + '">' + e.t + (f.ultimoRecordatorio ? ' · último recordatorio ' + fechaES(f.ultimoRecordatorio) : '') + '</span></div>' +
    (e.k === 'red' && c && c.correos && c.correos.length ? '<div class="row wrap" style="gap:6px">' + c.correos.map((m) => '<span class="pill">' + esc(m) + '</span>').join('') + '</div>' : '') +
    '<div class="row"><button class="btn ghost f1 sm" data-a="recordar" data-id="' + f.id + '">' + ico('mail', 16) + 'Recordatorio</button><button class="btn ok f1 sm" data-a="cobrada" data-id="' + f.id + '">Cobrada</button></div></div>';
}

/* Editor de factura */
let F_EDIT = null;
function nuevaFactura(base) {
  const n = siguienteN();
  const f = { id: uid(), num: siguienteNum(), fecha: hoy(), cliente: base ? base.cliente : '', lineas: base ? JSON.parse(JSON.stringify(base.lineas)) : [{ c: '', imp: 0, det: '' }], estado: 'borrador', km: 0, veh: '', versiones: [] };
  S.facturas.push(touch(f)); guardar();
  return f;
}
function vFactura(id) {
  const f = S.facturas.find((x) => x.id === id);
  if (!f) return '<p class="sub">Factura no encontrada.</p>';
  F_EDIT = f; f._vgen = false;
  const t = totalesFactura(f);
  const gastos = S.movimientos.filter((m) => m.trabajo === f.id);
  const gb = gastos.reduce((s, m) => s + movCalc(m).base, 0);
  const estTxt = { borrador: 'Borrador', enviada: 'Enviada · pendiente de cobro', cobrada: 'Cobrada el ' + fechaES(f.fechaCobro) }[f.estado];
  const editable = true;
  const orden = S.facturas.slice().sort((a, b) => a.fecha.localeCompare(b.fecha) || a.num.localeCompare(b.num, 'es', { numeric: true }));
  const ix = orden.findIndex((x) => x.id === f.id); const ant = orden[ix - 1], sig = orden[ix + 1];
  const nav = '<div class="row" style="gap:6px">' + (ant ? '<a href="#factura/' + ant.id + '" class="btn icon" aria-label="Factura anterior: ' + esc(ant.num) + '">' + ico('left') + '</a>' : '<span class="btn icon" style="opacity:.3" aria-hidden="true">' + ico('left') + '</span>') + '<span class="sub" style="min-width:64px;text-align:center">' + (ix + 1) + ' de ' + orden.length + '</span>' + (sig ? '<a href="#factura/' + sig.id + '" class="btn icon" aria-label="Factura siguiente: ' + esc(sig.num) + '">' + ico('right') + '</a>' : '<span class="btn icon" style="opacity:.3" aria-hidden="true">' + ico('right') + '</span>') + '</div>';
  return '<div class="top wrap"><div class="row"><a href="#facturas" class="btn icon" aria-label="Volver a facturas">' + ico('x') + '</a><div><h1 style="font-size:22px">' + (f.rectificaDe ? 'Rectificativa ' : 'Factura ') + esc(f.num) + '</h1><div class="sub">' + estTxt + ' · plazo máximo ' + fechaES(venceFactura(f)) + '</div></div></div>' + nav + '</div>' +
    (f.estado !== 'borrador' ? '<div class="warnbox" style="margin-bottom:12px">Esta factura ya está enviada. Si la cambias se guarda una versión nueva (' + 'V' + ((f.versiones || []).length + 1) + ' guardada). Lo correcto es hacer una rectificativa. <button class="btn sm ghost" data-a="rectificar">Hacer rectificativa</button></div>' : '') +
    (faltanDatos().length ? '<div class="warnbox" style="margin-bottom:12px">Faltan tus datos en Ajustes: ' + faltanDatos().join(', ') + '. Sin ellos la factura sale incompleta. <a href="#ajustes" class="btn sm ghost">Ir a Ajustes</a></div>' : '') +
    (f.rectificaDe ? '<div class="infobox" style="margin-bottom:12px">Rectifica la factura ' + esc((S.facturas.find((x) => x.id === f.rectificaDe) || {}).num || '') + '.</div>' : '') +
    '<div class="row wrap" style="align-items:flex-start;gap:20px"><section style="flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:14px">' +
    '<div class="card"><label class="f">Cliente<select class="in" data-fx="cliente"><option value="">Elige cliente…</option>' + S.clientes.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((c) => '<option value="' + c.id + '"' + (f.cliente === c.id ? ' selected' : '') + '>' + esc(c.nombre) + '</option>').join('') + '</select></label>' +
    '<div class="row"><button class="btn sm ghost" data-a="nuevo-cliente" data-desde="' + f.id + '">' + ico('plus', 14) + 'Nuevo cliente</button>' + (f.cliente ? '<button class="btn sm ghost" data-a="editar-cliente" data-id="' + f.cliente + '" data-desde="' + f.id + '">Editar cliente</button>' : '') + '</div>' +
    '<div class="row"><label class="f f1">Número<input class="in" value="' + esc(f.num) + '" data-fx="num"></label><label class="f f1">Fecha<input type="date" class="in" value="' + f.fecha + '" data-fx="fecha"></label></div></div>' +
    '<div class="card"><span class="sub">Conceptos</span>' + f.lineas.map((l, i) => '<div style="display:flex;flex-direction:column;gap:6px"><div class="row"><input class="in f1" placeholder="Concepto" value="' + esc(l.c) + '" data-ln="' + i + '" data-k="c" aria-label="Concepto"><input class="in num" style="width:110px;text-align:right" inputmode="decimal" placeholder="0" value="' + (l.imp ? String(l.imp).replace('.', ',') : '') + '" data-ln="' + i + '" data-k="imp" aria-label="Importe"><button class="btn icon sm" data-a="quitar-linea" data-i="' + i + '" aria-label="Quitar concepto">' + ico('x', 14) + '</button></div>' +
      (l.det != null && l.det !== '' || l.showDet ? '<input class="in" style="margin-left:16px;width:calc(100% - 16px);min-height:38px;font-size:13px" placeholder="+ línea de detalle" value="' + esc(l.det || '') + '" data-ln="' + i + '" data-k="det" aria-label="Línea de detalle">' : '') + '</div>').join('') +
    '<div class="row"><button class="btn dash sm" data-a="add-linea">+ Concepto</button><button class="btn dash sm" data-a="add-det">+ Línea de detalle</button></div></div>' +
    tarjetaEquipoFactura(f) +
    '<div class="card" style="gap:6px;font-size:14px"><div class="between"><span class="sub">Subtotal</span><span class="num" id="t-base">' + eur(t.base) + '</span></div><div class="between"><span class="sub">IVA (' + S.ajustes.ivaPct + ' %)</span><span class="num" id="t-iva">' + eur(t.iva) + '</span></div><div class="between"><span class="sub">IRPF (' + S.ajustes.irpfPct + ' %)</span><span class="num" id="t-irpf">−' + eur(t.irpf) + '</span></div><div class="between" style="border-top:1px solid var(--line);padding-top:8px;font-weight:700;font-size:17px"><span>Total</span><span class="num" id="t-tot">' + eur(t.total) + '</span></div></div>' +
    '<details class="card"' + (viajesDe(f).length || gastos.length ? ' open' : '') + '><summary style="cursor:pointer;font-weight:600">Desplazamientos y gastos del trabajo' + (viajesDe(f).length ? ' · ' + viajesDe(f).reduce((a, v) => a + (+v.km || 0), 0) + ' km' : '') + '</summary>' +
    '<span class="sub" style="font-size:12px;margin-top:8px">Un día por fila, como en tu Excel de kilometraje. Salida desde ' + esc(S.ajustes.origen || 'EL MOLAR') + '.</span>' +
    viajesDe(f).map((v, i) => '<div style="background:var(--s1);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px;margin-top:8px"><div class="row"><input class="in f1" placeholder="Destino (dirección o lugar)" value="' + esc(v.destino) + '" data-vj="' + i + '" data-k="destino" aria-label="Destino"><button class="btn icon sm" data-a="quitar-viaje" data-i="' + i + '" aria-label="Quitar día">' + ico('x', 14) + '</button></div>' +
      '<div class="row wrap"><label class="f" style="flex:2 1 140px">Fecha<input type="date" class="in" value="' + v.fecha + '" data-vj="' + i + '" data-k="fecha"></label><label class="f" style="flex:1 1 70px">Km<input class="in" inputmode="numeric" value="' + (v.km || '') + '" data-vj="' + i + '" data-k="km"></label><label class="f" style="flex:2 1 120px">Vehículo<select class="in" data-vj="' + i + '" data-k="veh"><option value="">—</option>' + S.vehiculos.filter((x) => x.propio).map((x) => '<option value="' + x.id + '"' + (v.veh === x.id ? ' selected' : '') + '>' + esc(x.nombre) + '</option>').join('') + '</select></label><label class="row" style="gap:6px;font-size:13px;align-self:flex-end;min-height:46px"><input type="checkbox"' + (v.iv !== false ? ' checked' : '') + ' data-vj="' + i + '" data-k="iv">Ida y vuelta</label></div></div>').join('') +
    '<button class="btn dash sm" style="margin-top:8px" data-a="add-viaje">+ Día de desplazamiento</button>' +
    '<div class="sub" style="font-size:12px;margin-top:8px">Gastos asociados: ' + (gastos.length ? gastos.map((m) => esc(m.concepto) + ' ' + eur(m.importe)).join(', ') : 'ninguno (asócialos al apuntar un gasto)') + '</div>' +
    '<div class="between" style="font-size:13px;margin-top:6px"><span class="sub">Te deja limpio</span><b class="num">' + eur(t.base - gb) + '</b></div></details>' +
    '<div class="row wrap">' +
    (f.estado === 'borrador' ? '<button class="btn" data-a="guardar-factura">Guardar borrador</button>' : '') +
    '<button class="btn" data-a="pdf">' + ico('dl', 16) + 'PDF</button>' +
    '<button class="btn" data-a="duplicar">' + ico('copy', 16) + 'Duplicar</button>' +
    (f.estado === 'enviada' ? '<button class="btn ok" data-a="cobrada" data-id="' + f.id + '">Cobrada</button>' : '') +
    (f.estado === 'cobrada' ? '<button class="btn ghost" data-a="no-cobrada">Marcar no cobrada</button>' : '') +
    '<button class="btn pri" data-a="enviar">' + ico('mail', 16) + (f.estado === 'borrador' ? 'Enviar' : 'Reenviar') + '</button>' +
    (f.estado === 'borrador' ? '<button class="btn ghost" data-a="marcar-enviada">Ya la envié</button>' : '') + '<button class="btn danger" data-a="borrar-factura">Borrar</button>' + '</div>' +
    '</section><section style="flex:1 1 420px;min-width:0"><div class="sub" style="margin-bottom:8px">Vista previa</div><div class="preview-wrap"><div class="inv" id="preview"></div></div></section></div>';
}
async function pintarPreview(id) {
  const f = S.facturas.find((x) => x.id === id) || S.presupuestos.find((x) => x.id === id); const el = $('#preview'); if (!f || !el) return;
  const aj = S.ajustes; const c = S.clientes.find((x) => x.id === f.cliente); const t = totalesFactura(f);
  const cab = aj.cabeceraFoto ? await fotoSrc(aj.cabeceraFoto) : null;
  const e = (n) => eurPDF(n);
  el.innerHTML = (cab ? '<img src="' + cab + '" alt="Cabecera de la factura">' : '<div class="cabfake">' + esc((aj.nombreComercial || aj.nombre || 'TU NOMBRE').toUpperCase()) + '</div>') +
    '<div class="bd"><div style="display:flex;justify-content:flex-end"><div class="bx" style="width:44%">' + (f.ref ? 'Presupuesto: ' + esc(f.ref) : 'Factura Nº: ' + esc(f.num)) + '<br>Fecha: ' + fechaES(f.fecha) + '</div></div>' +
    '<div style="display:flex;gap:2.4cqw"><div class="bx" style="flex:1"><span style="font-size:2.1cqw">' + esc(aj.nombre) + '</span><br><span style="font-size:1.9cqw">' + esc(aj.nif) + '</span><br><span style="font-size:1.6cqw">' + esc(aj.direccion1) + '<br>' + esc(aj.direccion2) + '</span></div>' +
    '<div class="bx" style="flex:1;font-size:2.1cqw">' + (c ? [c.nombre, c.nif ? 'NIF: ' + c.nif : '', c.dir1, c.dir2].filter(Boolean).map(esc).join('<br>') : '[Cliente]') + '</div></div>' +
    '<div class="hd"><span>CONCEPTO</span><span>IMPORTE</span></div><div style="flex:1;display:flex;flex-direction:column;gap:1.3cqw;font-size:1.75cqw">' +
    f.lineas.map((l) => '<div style="display:flex;justify-content:space-between;gap:2cqw"><span>- ' + esc(l.c) + '</span><span style="font-size:1.95cqw">' + e(+l.imp || 0) + '</span></div>' + (l.det ? '<span>' + esc(l.det) + '</span>' : '')).join('') + (equipoCobrado(f) > 0 ? '<div style="display:flex;justify-content:space-between;gap:2cqw"><span>- Alquiler de equipo</span><span style="font-size:1.95cqw">' + e(equipoCobrado(f)) + '</span></div><div style="font-size:1.45cqw;line-height:1.5;color:#444;padding-left:1.4cqw">' + (f.equipo || []).filter((x) => !x.incluido && !x.propio).map((x) => esc(detalleEq(x))).join('<br>') + '</div>' : '') + '</div>' +
    '<div class="tot"><div style="display:flex;justify-content:space-between"><b>SUBTOTAL:</b><span>' + e(t.base) + '</span></div><div style="display:flex;justify-content:space-between"><b>IVA (' + aj.ivaPct + '%):</b><span>' + e(t.iva) + '</span></div><div style="display:flex;justify-content:space-between"><b>IRPF (' + aj.irpfPct + '%):</b><span>' + e(t.irpf) + '</span></div><div style="display:flex;justify-content:space-between"><b>TOTAL:</b><span>' + e(t.total) + '</span></div></div>' +
    '<div style="border-top:.4cqw solid #1e1e1e;padding-top:1.2cqw;text-align:center;line-height:1.6;font-size:1.6cqw">Condiciones de pago: TRANSFERENCIA<br><b>' + esc(aj.iban || '[IBAN en Ajustes]') + '</b><br><span style="color:#7a7a7a;font-size:1.25cqw">Plazo máximo de pago: ' + fechaES(venceFactura(f)) + '</span></div></div>' +
    '<div class="pie">' + esc([aj.telefono, (aj.nombre || '').toUpperCase(), aj.pieActividad].filter(Boolean).join(' · ').toUpperCase()) + '<br>' + esc([aj.nif, [aj.direccion1, aj.direccion2].filter(Boolean).join(', ')].filter(Boolean).join(' . ').toUpperCase()) + '</div>';
}
function refrescarTotales() {
  const f = F_EDIT; if (!f) return; const t = totalesFactura(f);
  const set = (id, v) => { const e = $('#' + id); if (e) e.textContent = v; };
  set('t-base', eur(t.base)); set('eq-total', eur(equipoCobrado(f))); set('t-iva', eur(t.iva)); set('t-irpf', '−' + eur(t.irpf)); set('t-tot', eur(t.total));
  clearTimeout(refrescarTotales.t); refrescarTotales.t = setTimeout(() => pintarPreview(f.id), 120);
}
function versionar(f) {
  if (f.estado === 'borrador' || f._vgen) return;
  f.versiones = f.versiones || []; f.versiones.push({ fecha: new Date().toISOString(), lineas: JSON.parse(JSON.stringify(f.lineas)), cliente: f.cliente, num: f.num, fechaF: f.fecha }); f._vgen = true;
}
async function pdfDe(f) {
  const aj = S.ajustes; const cli = S.clientes.find((c) => c.id === f.cliente);
  let cab = null; if (aj.cabeceraFoto) { const b = await DB.get('fotos', aj.cabeceraFoto); if (b) cab = new Uint8Array(b); }
  return facturaPDF(f, cli, aj, cab);
}
const nombrePDF = (f) => ((S.ajustes.nombre || 'Factura') + ' - Factura ' + f.num + ' - ' + fechaES(f.fecha).replace(/\//g, '-') + ' - ' + (f.lineas[0] ? f.lineas[0].c : '')).replace(/[\\/:*?"<>|]/g, '').slice(0, 120) + '.pdf';
function plantilla(txt, f) {
  const t = totalesFactura(f);
  return txt.replace(/\{numero\}/g, f.num).replace(/\{concepto\}/g, f.lineas.map((l) => l.c).filter(Boolean).join(', ')).replace(/\{total\}/g, eur(t.total)).replace(/\{vencimiento\}/g, fechaES(venceFactura(f))).replace(/\{cliente\}/g, nombreCli(f.cliente));
}
function abrirEnvio(f, tipo) {
  const c = S.clientes.find((x) => x.id === f.cliente);
  const co = S.ajustes.correo;
  const asunto = plantilla(tipo === 'envio' ? co.envioAsunto : tipo === 'venc' ? co.vencAsunto : co.recAsunto, f);
  const cuerpo = plantilla(tipo === 'envio' ? co.envio : tipo === 'venc' ? co.venc : co.rec, f);
  const mails = c && c.correos ? c.correos : [];
  hoja('<div class="between"><h2 style="font-size:20px">' + (tipo === 'envio' ? 'Enviar factura' : 'Enviar recordatorio') + '</h2><button class="btn icon" data-a="cerrar" aria-label="Cerrar">' + ico('x') + '</button></div>' +
    '<div class="sub">Para</div><div style="display:flex;flex-direction:column;gap:6px">' + (mails.length ? mails.map((m, i) => '<label class="row" style="font-size:14px;gap:8px"><input type="checkbox" class="env-to" value="' + esc(m) + '"' + (i === 0 ? ' checked' : '') + '>' + esc(m) + '</label>').join('') : '<span class="sub">Este cliente no tiene correos guardados.</span>') +
    '<input class="in" id="env-extra" placeholder="Otro correo (opcional)" type="email"></div>' +
    '<label class="f">Asunto<input class="in" id="env-asunto" value="' + esc(asunto) + '"></label><label class="f">Mensaje<textarea class="in" id="env-cuerpo" rows="8">' + esc(cuerpo) + '</textarea></label>' +
    '<div class="infobox" style="font-size:12px">Se adjunta el PDF: ' + esc(nombrePDF(f)) + (S.ajustes.googleId ? '' : '<br>Sin Google configurado: se descargará el PDF y se abrirá tu correo para que lo adjuntes.') + '</div>' +
    '<button class="btn pri" style="min-height:54px" data-a="env-ok" data-id="' + f.id + '" data-t="' + tipo + '">' + ico('mail', 18) + 'Enviar ahora</button>');
}
async function enviarCorreo(f, tipo) {
  const to = [...document.querySelectorAll('.env-to:checked')].map((x) => x.value); const ex = $('#env-extra').value.trim(); if (ex) to.push(ex);
  if (!to.length) return toast('Elige al menos un destinatario');
  const subject = $('#env-asunto').value, body = $('#env-cuerpo').value;
  const pdf = await pdfDe(f);
  if (S.ajustes.googleId) {
    try { await G.auth(S.ajustes.googleId); await G.sendMail({ to, subject, body, attachName: nombrePDF(f), attachBytes: pdf }); }
    catch (e) { return toast(e.message); }
  } else {
    download(nombrePDF(f), pdf, 'application/pdf');
    location.href = 'mailto:' + encodeURIComponent(to.join(',')) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  const c = S.clientes.find((x) => x.id === f.cliente); if (c && ex && !c.correos.includes(ex)) { c.correos.push(ex); touch(c); }
  if (tipo === 'envio') { if (f.estado === 'borrador') { f.estado = 'enviada'; f.fechaEnvio = hoy(); } }
  else f.ultimoRecordatorio = hoy();
  touch(f); guardar(); cerrarHoja(); toast(S.ajustes.googleId ? 'Correo enviado' : 'PDF descargado; adjúntalo en tu correo'); render();
}

/* Presupuestos */
function vPresupuesto(id) {
  const p = S.presupuestos.find((x) => x.id === id); if (!p) return '<p class="sub">No encontrado.</p>';
  F_EDIT = p; const t = totalesFactura(p);
  setTimeout(() => pintarPreview(p.id), 0);
  return '<div class="top"><div class="row"><a href="#facturas" class="btn icon" aria-label="Volver">' + ico('left') + '</a><h1 style="font-size:22px">Presupuesto ' + esc(p.ref) + '</h1></div></div>' +
    '<div class="row wrap" style="align-items:flex-start;gap:20px"><section style="flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:14px"><div class="card"><label class="f">Cliente<select class="in" data-fx="cliente"><option value="">Elige cliente…</option>' + S.clientes.map((c) => '<option value="' + c.id + '"' + (p.cliente === c.id ? ' selected' : '') + '>' + esc(c.nombre) + '</option>').join('') + '</select></label><div class="row"><label class="f f1">Referencia<input class="in" value="' + esc(p.ref) + '" data-fx="ref"></label><label class="f f1">Fecha<input type="date" class="in" value="' + p.fecha + '" data-fx="fecha"></label></div></div>' +
    '<div class="card"><span class="sub">Conceptos</span>' + p.lineas.map((l, i) => '<div class="row"><input class="in f1" value="' + esc(l.c) + '" data-ln="' + i + '" data-k="c" placeholder="Concepto" aria-label="Concepto"><input class="in num" style="width:110px;text-align:right" value="' + (l.imp ? String(l.imp).replace('.', ',') : '') + '" data-ln="' + i + '" data-k="imp" inputmode="decimal" aria-label="Importe"><button class="btn icon sm" data-a="quitar-linea" data-i="' + i + '" aria-label="Quitar">' + ico('x', 14) + '</button></div>').join('') + '<button class="btn dash sm" data-a="add-linea">+ Concepto</button></div>' +
    '<div class="card"><div class="between" style="font-weight:700"><span>Total</span><span class="num" id="t-tot">' + eur(t.total) + '</span></div></div>' +
    '<div class="row wrap"><button class="btn" data-a="pdf-presu">' + ico('dl', 16) + 'PDF</button>' + (p.estado !== 'aceptado' ? '<button class="btn pri" data-a="presu-a-factura">Convertir en factura</button>' : '') + '<button class="btn danger" data-a="borrar-presu">Borrar</button></div></section>' +
    '<section style="flex:1 1 420px;min-width:0"><div class="preview-wrap"><div class="inv" id="preview"></div></div></section></div>';
}

/* ---------- Cliente ---------- */
function vCliente(id) {
  const c = S.clientes.find((x) => x.id === id); if (!c) return '<p class="sub">Cliente no encontrado.</p>';
  const s = statsClientes('todos')[c.id] || { n: 0, base: 0, media: 0, diasMedia: null };
  const fs = S.facturas.filter((f) => f.cliente === c.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  return '<div class="top"><div class="row"><a href="#facturas" class="btn icon" aria-label="Volver" data-a="ftab-cli">' + ico('left') + '</a><h1 style="font-size:22px">' + esc(c.nombre || 'Cliente') + '</h1></div>' + cara(s.diasMedia) + '</div>' +
    '<div class="grid home-grid"><div class="card"><label class="f">Nombre fiscal<input class="in" value="' + esc(c.nombre) + '" data-cx="nombre"></label><label class="f">NIF / CIF<input class="in" value="' + esc(c.nif) + '" data-cx="nif"></label><label class="f">Dirección<input class="in" value="' + esc(c.dir1) + '" data-cx="dir1" placeholder="Calle, número"></label><label class="f">CP y ciudad<input class="in" value="' + esc(c.dir2) + '" data-cx="dir2" placeholder="28010 Madrid"></label><label class="f">Correos (separados por comas)<input class="in" value="' + esc((c.correos || []).join(', ')) + '" data-cx="correos"></label><div class="row"><button class="btn danger sm" data-a="borrar-cliente" data-id="' + c.id + '">Borrar cliente</button><button class="btn pri f1" data-a="guardar-cliente" data-id="' + c.id + '">' + (UI.volver ? 'Guardar y volver a la factura' : 'Guardar') + '</button></div></div>' +
    '<div class="card"><b>Resumen</b><div class="between"><span class="sub">Trabajos</span><b>' + s.n + '</b></div><div class="between"><span class="sub">Facturado (base)</span><b class="num">' + eur(s.base) + '</b></div><div class="between"><span class="sub">Media por trabajo</span><b class="num">' + eur(s.media || 0) + '</b></div><div class="between"><span class="sub">Tarda en pagar</span><span>' + (s.diasMedia == null ? 'Sin datos aún' : Math.round(s.diasMedia) + ' días de media') + '</span></div>' +
    '<div class="list">' + fs.map((f) => '<button class="item" data-a="ver-factura" data-id="' + f.id + '"><span class="f1">' + esc(f.num) + ' · ' + fechaES(f.fecha) + '<div class="sub" style="font-size:12px">' + esc(f.estado) + '</div></span><span class="num">' + eur(totalesFactura(f).total) + '</span></button>').join('') + '</div></div></div>';
}

/* ---------- Hacienda ---------- */
function vHacienda() {
  const y = UI.anioH; const qs = [1, 2, 3, 4].map((q) => ({ q, h: hacienda(y, q) }));
  const am = amortAnual(y);
  const curQ = new Date().getFullYear() === y ? Math.floor(new Date().getMonth() / 3) + 1 : 0;
  const row = (l, v, b) => '<div class="between" style="font-size:13px' + (b ? ';font-weight:700;font-size:14px;border-top:1px solid var(--line);padding-top:6px' : '') + '"><span class="' + (b ? '' : 'sub') + '">' + l + '</span><span class="num">' + v + '</span></div>';
  const pagado = (q, mod) => S.movimientos.some((m) => m.cat === 'hacienda' && m.ref === y + 'T' + q + mod);
  return '<div class="top"><h1>Hacienda</h1><div class="row"><button class="btn icon sm" data-a="anioH" data-d="-1" aria-label="Año anterior">' + ico('left', 18) + '</button><b>' + y + '</b><button class="btn icon sm" data-a="anioH" data-d="1" aria-label="Año siguiente">' + ico('right', 18) + '</button></div></div>' +
    '<div class="infobox" style="margin-bottom:14px">Estimaciones para que sepas cuánto apartar. Tu gestor presenta los modelos y puede ajustar cifras (por ejemplo, el % de gastos de difícil justificación, ahora ' + S.ajustes.gdjPct + ' %).</div>' +
    '<div class="grid home-grid">' + qs.map(({ q, h }) => '<div class="card" style="' + (q === curQ ? 'border:1px solid var(--ac)' : '') + '"><div class="between"><b>' + q + 'º trimestre' + (q === curQ ? ' · en curso' : '') + '</b><span class="sub">' + h.nFact + ' facturas</span></div>' +
      '<span class="sub" style="font-weight:600;color:var(--soft)">Modelo 303 · IVA</span>' + row('IVA de tus facturas', eur(h.ivaRep)) + row('IVA deducible de gastos', '−' + eur(h.ivaSop)) + row(h.res303 >= 0 ? 'A pagar' : 'A compensar', eur(Math.abs(h.res303)), 1) +
      '<span class="sub" style="font-weight:600;color:var(--soft);margin-top:6px">Modelo 130 · IRPF (acumulado desde enero)</span>' + row('Ingresos', eur(h.ingresos)) + row('Gastos deducibles', '−' + eur(h.gastos)) + row('Difícil justificación', '−' + eur(h.gdj)) + row('Rendimiento', eur(h.rend)) + row('20 %', eur(h.cuota)) + row('Retenciones de clientes', '−' + eur(h.ret)) + row('Pagado en trimestres anteriores', '−' + eur(h.previos)) + row('A pagar', eur(h.pago130), 1) +
      '<div class="row wrap" style="margin-top:6px"><button class="btn sm ghost" data-a="exportar" data-q="' + q + '">' + ico('dl', 14) + 'Exportar para el gestor</button><button class="btn sm ghost" data-a="kms" data-q="' + q + '">' + ico('dl', 14) + 'Kilometraje (Excel)</button>' +
      (h.res303 > 0 && !pagado(q, '303') ? '<button class="btn sm ghost" data-a="pagado" data-q="' + q + '" data-m="303" data-v="' + r2(h.res303) + '">303 pagado</button>' : '') + (h.pago130 > 0 && !pagado(q, '130') ? '<button class="btn sm ghost" data-a="pagado" data-q="' + q + '" data-m="130" data-v="' + r2(h.pago130) + '">130 pagado</button>' : '') + '</div></div>').join('') + '</div>' +
    '<div class="grid home-grid" style="margin-top:14px"><div class="card"><b>Gasolina y km de trabajo ' + y + '</b><span class="sub" style="font-size:12px">Pon el % de uso para trabajo que te diga tu gestor. Se aplica al IVA y al IRPF de cada repostaje.</span>' +
    S.vehiculos.filter((v) => v.propio).map((v) => { const g = S.movimientos.filter((m) => m.cat === 'gasolina' && m.veh === v.id && m.fecha.startsWith(String(y))); const km = kmVeh(v.id, y + '-01-01', y + '-12-31'); return '<div class="between" style="font-size:13px"><span><b>' + esc(v.nombre) + '</b> · ' + eur(g.reduce((s, m) => s + m.importe, 0)) + ' · ' + km + ' km de trabajo</span><label class="row" style="gap:6px"><input class="in" style="width:70px;min-height:38px" inputmode="numeric" value="' + (v.pct || 0) + '" data-vpct="' + v.id + '" aria-label="% de trabajo de ' + esc(v.nombre) + '">%</label></div>'; }).join('') + '</div>' +
    '<div class="card"><b>Amortizaciones ' + y + '</b>' + (am.items.length ? am.items.map((it) => row(esc(it.m.concepto) + ' (año ' + it.anio + ' de ' + it.de + ')', eur(it.anual))).join('') + row('Total del año', eur(am.total), 1) : '<span class="sub">Ninguna compra amortizable.</span>') +
    '<button class="btn ghost sm" data-a="resumen-anual">' + ico('dl', 14) + 'Resumen anual para la renta</button></div></div>';
}
async function exportar(y, q) {
  const h = hacienda(y, q);
  const fs = S.facturas.filter((f) => emitida(f) && inRange(f.fecha, h.qa, h.qb)).sort((a, b) => a.num.localeCompare(b.num, 'es', { numeric: true }));
  const ms = S.movimientos.filter((m) => esGasto(m) && inRange(m.fecha, h.qa, h.qb)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const files = [];
  const enc = new TextEncoder();
  files.push({ name: 'ingresos.csv', data: enc.encode(csv([['Factura', 'Fecha', 'Cliente', 'NIF', 'Concepto', 'Base', 'IVA', 'IRPF', 'Total', 'Estado', 'Cobrada'], ...fs.map((f) => { const t = totalesFactura(f); const c = S.clientes.find((x) => x.id === f.cliente) || {}; return [f.num, fechaES(f.fecha), c.nombre || '', c.nif || '', f.lineas.map((l) => l.c).join(' / '), n2(t.base), n2(t.iva), n2(t.irpf), n2(t.total), f.estado, fechaES(f.fechaCobro)]; })])) });
  files.push({ name: 'gastos.csv', data: enc.encode(csv([['Fecha', 'Concepto', 'Categoría', 'Tipo', 'Vehículo', 'Total', 'Base', 'IVA deducible', 'Gasto deducible IRPF', 'Ticket'], ...ms.map((m) => { const k = movCalc(m); const c = cat(m.cat); return [fechaES(m.fecha), m.concepto, c.n, c.t, m.veh ? (veh(m.veh) || {}).nombre : '', n2(m.importe), n2(k.base), n2(k.ivaDed), n2(k.irpfDed), m.foto ? 'tickets/' + m.fecha + '_' + m.id + '.jpg' : '']; })])) });
  files.push({ name: 'resumen.csv', data: enc.encode(csv([['Concepto', 'Importe'], ['303 · IVA repercutido', n2(h.ivaRep)], ['303 · IVA soportado deducible', n2(h.ivaSop)], ['303 · Resultado', n2(h.res303)], ['130 · Ingresos acumulados', n2(h.ingresos)], ['130 · Gastos deducibles acumulados', n2(h.gastos)], ['130 · Difícil justificación', n2(h.gdj)], ['130 · Rendimiento', n2(h.rend)], ['130 · Retenciones acumuladas', n2(h.ret)], ['130 · Pagos anteriores', n2(h.previos)], ['130 · A pagar', n2(h.pago130)]])) });
  files.push({ name: 'kilometraje-' + q + 'T-' + y + '.xlsx', data: await kilometrajeXlsx(y, q) });
  for (const f of fs) files.push({ name: 'facturas/' + nombrePDF(f), data: await pdfDe(f) });
  for (const m of ms.filter((x) => x.foto)) { const b = await DB.get('fotos', m.foto); if (b) files.push({ name: 'tickets/' + m.fecha + '_' + m.id + '.jpg', data: new Uint8Array(b) }); }
  download(y + '-' + q + 'T-gestor.zip', makeZip(files), 'application/zip');
  toast('Exportado ' + q + 'º trimestre');
}
async function kilometrajeXlsx(y, q) {
  const qa = y + '-' + pad((q - 1) * 3 + 1) + '-01', qb = isoDate(new Date(y, q * 3, 0));
  const ord = ['', 'er', 'º', 'er', 'º'][q];
  const viajes = [];
  S.facturas.filter((f) => f.estado !== 'borrador' || viajesDe(f).length).forEach((f) => viajesDe(f).forEach((v) => { if (inRange(v.fecha, qa, qb)) viajes.push({ v, f }); }));
  viajes.sort((a, b) => a.v.fecha.localeCompare(b.v.fecha) || a.f.num.localeCompare(b.f.num, 'es', { numeric: true }));
  const gas = S.movimientos.filter((m) => m.cat === 'gasolina' && inRange(m.fecha, qa, qb) && (veh(m.veh) || {}).propio).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const cliBloque = (id) => { const c = S.clientes.find((x) => x.id === id); return c ? [c.nombre, c.nif ? 'NIF: ' + c.nif : '', c.dir1, c.dir2].filter(Boolean).join('\n') : ''; };
  const totKm = viajes.reduce((a, x) => a + (+x.v.km || 0), 0);
  const fechas = viajes.map((x) => x.v.fecha);
  const corto = (iso) => { const [yy, mm, dd] = iso.split('-'); return +dd + '-' + +mm + '-' + yy.slice(2); };
  const rows = [];
  rows[0] = [{ v: 'KILOMETRAJE ' + q + ord + ' TRIMESTRE ' + y, s: 6 }];
  rows[2] = [{ v: 'Nombre', s: 5 }, S.ajustes.nombre || '', null, { v: 'Por período', s: 5 }, fechas.length ? 'De ' + corto(fechas[0]) + ' a ' + corto(fechas[fechas.length - 1]) : 'Sin desplazamientos'];
  rows[3] = [{ v: 'NIF', s: 5 }, S.ajustes.nif || '', null, { v: 'Kilometraje total', s: 5 }, { v: totKm, s: 7 }];
  rows[5] = [{ v: 'DESPLAZAMIENTOS', s: 5 }, null, null, null, null, null, null, null, null, null, null, { v: 'FACTURAS GASOLINA', s: 5 }];
  const H = (t) => ({ v: t, s: 1 });
  rows[6] = ['Fecha', 'Día semana', 'Ubicación inicial', 'Destino', 'Cliente', 'Ida/vuelta', 'Km', 'Factura', 'Vehículo', 'Litros consumidos', null, 'Fecha', 'Nº factura', 'Litros suministrados', 'Acreedor', 'Importe', 'Vehículo'].map((t) => t ? H(t) : null);
  const n = Math.max(viajes.length, gas.length);
  for (let i = 0; i < n; i++) {
    const r = new Array(17).fill(null);
    const x = viajes[i];
    if (x) {
      const vh = veh(x.v.veh);
      r[0] = { v: x.v.fecha, date: true }; r[1] = DIAS[parseD(x.v.fecha).getDay()]; r[2] = (S.ajustes.origen || 'EL MOLAR').toUpperCase(); r[3] = x.v.destino || '';
      r[4] = { v: cliBloque(x.f.cliente), s: 3 }; r[5] = x.v.iv !== false ? 'SI' : 'NO'; r[6] = { v: +x.v.km || 0, s: 7 }; r[7] = x.f.num; r[8] = vh ? vh.nombre + ' (' + vh.modelo + ')' : '';
      r[9] = vh ? { v: r2((+x.v.km || 0) * consumoDe(vh) / 100), s: 4 } : null;
    }
    const g = gas[i];
    if (g) { const vh = veh(g.veh); r[11] = { v: g.fecha, date: true }; r[12] = g.ticket || ''; r[13] = g.litros ? { v: g.litros, s: 4 } : null; r[14] = g.concepto; r[15] = { v: g.importe, s: 4 }; r[16] = vh ? vh.nombre : ''; }
    rows[7 + i] = r;
  }
  const t = 7 + n + 1;
  rows[t] = [{ v: 'TOTAL', s: 5 }, null, null, null, null, null, { v: totKm, s: 7 }, null, null, { v: r2(viajes.reduce((a, x) => a + (veh(x.v.veh) ? (+x.v.km || 0) * consumoDe(veh(x.v.veh)) / 100 : 0), 0)), s: 4 }, null, { v: 'TOTAL', s: 5 }, null, { v: r2(gas.reduce((a, g) => a + (+g.litros || 0), 0)), s: 4 }, null, { v: r2(gas.reduce((a, g) => a + g.importe, 0)), s: 4 }];
  return makeXlsx('Kilometraje ' + q + 'T ' + y, rows, { widths: [12, 12, 14, 34, 34, 10, 8, 12, 18, 12, 3, 12, 20, 12, 22, 11, 12], freeze: 7 });
}
const n2 = (n) => (r2(n || 0)).toFixed(2).replace('.', ',');
function resumenAnual(y) {
  const rows = [['Trimestre', 'IVA repercutido', 'IVA deducible', '303', 'Ingresos acum.', 'Gastos acum.', 'Rendimiento', 'Retenciones', '130 a pagar']];
  for (let q = 1; q <= 4; q++) { const h = hacienda(y, q); rows.push([q + 'T', n2(h.ivaRep), n2(h.ivaSop), n2(h.res303), n2(h.ingresos), n2(h.gastos), n2(h.rend), n2(h.ret), n2(h.pago130)]); }
  const porCat = {}; S.movimientos.filter((m) => esGasto(m) && m.fecha.startsWith(String(y))).forEach((m) => { const k = movCalc(m); const o = porCat[m.cat] || (porCat[m.cat] = [0, 0, 0]); o[0] += m.importe; o[1] += k.ivaDed; o[2] += k.irpfDed; });
  rows.push([], ['Categoría', 'Total', 'IVA deducible', 'Gasto deducible IRPF']);
  Object.entries(porCat).forEach(([c, v]) => rows.push([cat(c).n, n2(v[0]), n2(v[1]), n2(v[2])]));
  const am = amortAnual(y); rows.push([], ['Amortizaciones', n2(am.total)]);
  download('resumen-' + y + '.csv', csv(rows), 'text/csv');
}

/* ---------- Equipo ---------- */
const CATS_EQ = ['Cámaras', 'Lentes', 'Accesorios cámaras', 'Luces', 'Sonido', 'Cables', 'Alimentación', 'Transporte', 'Otros'];
const coincide = (txt, q) => { const t = txt.toLowerCase(); return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => t.includes(w)); };
function precioAlquiler(p, dias, qty) { dias = Math.max(1, +dias || 1); qty = Math.max(1, +qty || 1); const k = dias === 1 ? 1 : dias === 2 ? 0.85 : 0.75; return r2(p * dias * k * qty); }
const artDe = (id) => S.equipo.find((a) => a.id === id);
const packDe = (id) => S.packs.find((p) => p.id === id);
const unidadesActivas = (a) => (a.unidades || []).filter((u) => !u.estado || u.estado === 'activo');
function equipoCobrado(f) { return r2((f.equipo || []).filter((e) => !e.incluido && !e.propio).reduce((s, e) => s + (+e.precio || 0), 0)); }
function nombreEq(e) { const x = e.tipo === 'pack' ? packDe(e.id) : artDe(e.id); return x ? x.nombre : (e.nombre || 'Equipo borrado'); }
function detalleEq(e) { return (e.qty > 1 ? e.qty + '× ' : '') + nombreEq(e) + ' · ' + e.dias + (e.dias == 1 ? ' día' : ' días'); }
/* Reparte lo ganado y los días entre artículos (los packs se reparten según el precio de sus piezas) */
function statsEquipo() {
  const st = {}; const sp = {};
  const add = (id, euros, dias, propio, f) => { const o = st[id] || (st[id] = { ing: 0, dias: 0, diasPropio: 0, trabajos: new Set(), ultimo: '' }); o.ing += euros; if (propio) o.diasPropio += dias; else o.dias += dias; o.trabajos.add(f.id); if (f.fecha > o.ultimo) o.ultimo = f.fecha; };
  S.facturas.filter((f) => f.estado !== 'borrador').forEach((f) => (f.equipo || []).forEach((e) => {
    const euros = e.propio ? 0 : (+e.precio || 0); const dias = (+e.dias || 1) * (+e.qty || 1);
    if (e.tipo === 'pack') {
      const p = packDe(e.id); const o = sp[e.id] || (sp[e.id] = { ing: 0, veces: 0 }); o.ing += euros; o.veces++;
      const piezas = p ? (p.items || []).filter((it) => artDe(it.art)) : [];
      const tot = piezas.reduce((s, it) => s + (artDe(it.art).precioDia || 0) * (it.qty || 1), 0);
      piezas.forEach((it) => { const w = tot ? (artDe(it.art).precioDia || 0) * (it.qty || 1) / tot : 1 / piezas.length; add(it.art, euros * w, (+e.dias || 1) * (it.qty || 1) * (+e.qty || 1), e.propio, f); });
    } else add(e.id, euros, dias, e.propio, f);
  }));
  S.equipo.forEach((a) => {
    const o = st[a.id] || (st[a.id] = { ing: 0, dias: 0, diasPropio: 0, trabajos: new Set(), ultimo: '' });
    o.coste = (a.unidades || []).reduce((s, u) => s + (+u.coste || 0), 0);
    o.ventas = (a.unidades || []).filter((u) => u.estado === 'vendido').reduce((s, u) => s + (+u.venta || 0), 0);
    o.total = o.ing + o.ventas; o.pct = o.coste ? o.total / o.coste * 100 : null; o.n = o.trabajos.size;
  });
  return { st, sp };
}
function barraPct(pct) {
  if (pct == null) return '<span class="sub" style="font-size:12px">Sin precio de compra</span>';
  const col = pct >= 100 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--ac)';
  return '<div class="row" style="gap:8px"><div class="bar f1"><div style="width:' + Math.min(100, Math.max(2, pct)) + '%;background:' + col + '"></div></div><span style="font-size:12px;color:' + col + ';min-width:44px;text-align:right">' + (PRIV ? '••' : Math.round(pct)) + ' %</span></div>';
}

const EQ_ICO = {
  'Cámaras': '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><path d="M9 13h6v4H9z"/>',
  'Lentes': '<path d="M6 4h12v16H6z"/><path d="M9 8h6v8H9z"/>',
  'Accesorios cámaras': '<path d="M11 3h2v9h-2zM6 12h12v2H6zM6 14l-3 7M18 14l3 7M11 14h2v7h-2z"/>',
  'Luces': '<path d="M8 3h8v9H8zM10 12h4v3h-4zM11 15h2v6h-2zM5 6H3M21 6h-2M5 10H3M21 10h-2"/>',
  'Sonido': '<path d="M9 3h6v10H9zM6 10v3h12v-3M11 16h2v5h-2zM8 21h8"/>',
  'Cables': '<path d="M3 6h5v4H3zM16 14h5v4h-5zM8 8h4v8h4"/>',
  'Alimentación': '<path d="M9 3v5M15 3v5M6 8h12v5H6zM10 13h4v4h-4zM11 17h2v4h-2z"/>',
  'Transporte': '<path d="M5 8h14v13H5zM9 8V4h6v4M5 13h14"/>',
  'Otros': '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>'
};
const eqIco = (c) => '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" shape-rendering="crispEdges">' + (EQ_ICO[c] || EQ_ICO['Otros']) + '</svg>';
function rareza(pct) { return pct == null ? 'gris' : pct >= 100 ? 'oro' : pct >= 50 ? 'naranja' : 'rosa'; }
function inventarioRetro(arts, st) {
  const lim = (window.innerWidth >= 900 ? 8 : 4) * 3;
  const todo = UI.invTodo || arts.length <= lim;
  const shown = todo ? arts : arts.slice(0, lim);
  const cols = window.innerWidth >= 900 ? 8 : 4;
  const vacias = (cols - (shown.length % cols)) % cols;
  const etiqueta = { gris: 'sin precio de compra', rosa: 'aún sin recuperar', naranja: 'más de la mitad recuperada', oro: 'ya se ha pagado sola' };
  return '<div class="retro"><div class="retro-grid">' + shown.map((a) => {
    const s0 = st[a.id]; const r = rareza(s0.pct); const n = unidadesActivas(a).length;
    return '<button class="slot r-' + r + '" data-a="ver-art" data-id="' + a.id + '" aria-label="' + esc(a.nombre) + ', ' + n + ' unidades, ' + etiqueta[r] + '"><span class="slot-img" data-foto="' + (a.fotoPix || '') + '">' + (a.fotoPix ? '' : eqIco(a.cat)) + '</span>' + (n > 1 ? '<span class="slot-n">×' + n + '</span>' : '') + '</button>';
  }).join('') + '<span class="slot vacia" aria-hidden="true"></span>'.repeat(vacias) + '</div>' +
    (arts.length > lim ? '<button class="retro-btn" data-a="inv-todo">' + (todo ? 'Ver menos' : 'Ver todo el inventario (' + arts.length + ')') + '</button>' : '') +
    '<div class="retro-ley"><span><i class="lg r-gris"></i>sin precio</span><span><i class="lg r-rosa"></i>recuperando</span><span><i class="lg r-naranja"></i>+50 %</span><span><i class="lg r-oro"></i>pagado</span></div></div>';
}
function vEquipo() {
  const { st, sp } = statsEquipo();
  const f = UI.eqCat || 'todos';
  let arts = S.equipo.slice();
  if (f !== 'todos') arts = arts.filter((a) => a.cat === f);
  if (UI.eqQ) arts = arts.filter((a) => coincide(a.nombre + ' ' + a.cat + ' ' + (a.nota || ''), UI.eqQ));
  const o = UI.eqOrden || 'cat';
  const sorters = { cat: (a, b) => CATS_EQ.indexOf(a.cat) - CATS_EQ.indexOf(b.cat) || a.nombre.localeCompare(b.nombre), rent: (a, b) => (st[b.id].pct ?? -1) - (st[a.id].pct ?? -1), ing: (a, b) => st[b.id].total - st[a.id].total, coste: (a, b) => st[b.id].coste - st[a.id].coste, uso: (a, b) => (st[b.id].dias + st[b.id].diasPropio) - (st[a.id].dias + st[a.id].diasPropio) };
  arts.sort(sorters[o] || sorters.cat);
  const inv = S.equipo.reduce((s, a) => s + st[a.id].coste, 0), gen = S.equipo.reduce((s, a) => s + st[a.id].total, 0);
  const sinCoste = S.equipo.filter((a) => !st[a.id].coste).length;
  let html = '', last = '';
  arts.forEach((a) => {
    if (o === 'cat' && a.cat !== last) { html += '<div class="sub" style="padding:14px 4px 4px;font-weight:600">' + esc(a.cat) + '</div>'; last = a.cat; }
    const s = st[a.id]; const act = unidadesActivas(a).length; const tot = (a.unidades || []).length;
    html += '<button class="item" data-a="ver-art" data-id="' + a.id + '" style="flex-direction:column;align-items:stretch;gap:6px"><div class="between"><span style="font-size:14px;font-weight:500">' + (act > 1 ? act + '× ' : '') + esc(a.nombre) + (tot > act ? ' <span class="pill">' + (tot - act) + ' de baja</span>' : '') + '</span><span class="sub" style="font-size:12px;white-space:nowrap">' + (a.precioDia ? eur(a.precioDia) + '/día' : 'sin precio') + '</span></div>' +
      barraPct(s.pct) + '<div class="sub" style="font-size:12px">' + (s.coste ? 'Costó ' + eur(s.coste) + ' · ' : '') + 'Generado ' + eur(s.total) + ' · ' + s.dias + ' días alquilado' + (s.diasPropio ? ' · ' + s.diasPropio + ' de uso propio' : '') + '</div></button>';
  });
  const packs = S.packs.map((p) => '<button class="item" data-a="ver-pack" data-id="' + p.id + '"><span class="ico" style="background:#FF4D9D22;color:var(--ac)">' + catIco('material', 20) + '</span><span class="f1"><div style="font-size:14px">' + esc(p.nombre) + '</div><div class="sub" style="font-size:12px">' + (p.items || []).length + ' piezas · alquilado ' + ((sp[p.id] || {}).veces || 0) + ' veces · ' + eur((sp[p.id] || {}).ing || 0) + '</div></span><span class="sub">' + eur(p.precioDia || 0) + '/día</span></button>').join('');
  return '<div class="top"><h1>Equipo</h1><div class="row"><button class="btn" data-a="nuevo-pack">' + ico('plus', 16) + 'Pack</button><button class="btn pri" data-a="nuevo-art">' + ico('plus', 16) + 'Equipo</button></div></div>' +
    (S.equipo.length ? '' : '<div class="infobox" style="margin-bottom:12px">Aún no hay equipo. Importa <b>equipo.json</b> en Ajustes › Datos o añádelo a mano.</div>') +
    '<div class="hero" style="margin-bottom:14px"><span class="lbl">Rentabilidad de tu equipo</span><div class="row"><div class="f1"><div class="lbl">Invertido</div><div class="num" style="font-size:20px;font-weight:700">' + eur(inv) + '</div></div><div class="f1"><div class="lbl">Generado</div><div class="num" style="font-size:20px;font-weight:700;color:var(--ok)">' + eur(gen) + '</div></div></div>' + barraPct(inv ? gen / inv * 100 : null) +
    (sinCoste ? '<span class="lbl">' + sinCoste + ' artículos sin precio de compra: ábrelos para añadirlo.</span>' : '') + '</div>' +
    (S.packs.length ? '<div class="card" style="padding:6px 12px;margin-bottom:12px"><b style="padding:8px 4px 0">Packs</b>' + packs + '</div>' : '') +
    '<div class="row" style="margin-bottom:8px"><input class="in f1" placeholder="Buscar equipo" value="' + esc(UI.eqQ || '') + '" data-in="eqQ" aria-label="Buscar equipo"><select class="in" style="width:auto" data-in="eqOrden" aria-label="Ordenar"><option value="cat"' + (o === 'cat' ? ' selected' : '') + '>Por categoría</option><option value="rent"' + (o === 'rent' ? ' selected' : '') + '>Más rentable</option><option value="ing"' + (o === 'ing' ? ' selected' : '') + '>Más generado</option><option value="coste"' + (o === 'coste' ? ' selected' : '') + '>Más caro</option><option value="uso"' + (o === 'uso' ? ' selected' : '') + '>Más usado</option></select></div>' +
    '<div class="chips" style="margin-bottom:8px">' + ['todos'].concat(CATS_EQ).map((c) => '<button class="chip ' + (f === c ? 'on' : '') + '" data-a="eqcat" data-c="' + c + '">' + (c === 'todos' ? 'Todo' : c) + '</button>').join('') + '</div>' +
    (arts.length ? inventarioRetro(arts, st) : '') +
    '<div class="card" style="padding:6px 12px" id="eq-res">' + (html || '<span class="sub" style="padding:12px 0">Nada con este filtro.</span>') + '</div>';
}
function vArticulo(id) {
  const a = artDe(id); if (!a) return '<p class="sub">No encontrado.</p>';
  const s = statsEquipo().st[a.id];
  const hist = S.facturas.filter((f) => (f.equipo || []).some((e) => (e.tipo === 'art' && e.id === a.id) || (e.tipo === 'pack' && (packDe(e.id) || { items: [] }).items.some((it) => it.art === a.id)))).sort((x, y) => y.fecha.localeCompare(x.fecha));
  return '<div class="top"><div class="row"><a href="#equipo" class="btn icon" aria-label="Volver a equipo">' + ico('left') + '</a><h1 style="font-size:22px">' + esc(a.nombre || 'Equipo nuevo') + '</h1></div></div>' +
    '<div class="grid home-grid"><div class="card"><label class="f">Nombre<input class="in" value="' + esc(a.nombre) + '" data-ex="nombre"></label>' +
    '<div class="row wrap"><label class="f" style="flex:2 1 160px">Categoría<select class="in" data-ex="cat">' + CATS_EQ.map((c) => '<option' + (a.cat === c ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></label><label class="f" style="flex:1 1 100px">Precio alquiler €/día<input class="in" inputmode="decimal" value="' + (a.precioDia ? String(a.precioDia).replace('.', ',') : '') + '" data-ex="precioDia"></label></div>' +
    '<span class="sub" style="font-size:12px">' + (a.precioDia ? '1 día ' + eur(precioAlquiler(a.precioDia, 1)) + ' · 2 días ' + eur(precioAlquiler(a.precioDia, 2)) + ' · 3 días ' + eur(precioAlquiler(a.precioDia, 3)) + ' (por unidad)' : 'Sin precio: no se alquila suelto') + '</span>' +
    '<label class="f">Notas<input class="in" value="' + esc(a.nota || '') + '" data-ex="nota"></label>' +
    '<div class="row"><span class="slot r-' + rareza(s.pct) + '" style="width:72px;height:72px;flex:0 0 auto"><span class="slot-img" data-foto="' + (a.fotoPix || '') + '">' + (a.fotoPix ? '' : eqIco(a.cat)) + '</span></span><label class="btn ghost f1" style="cursor:pointer">' + ico('cam', 16) + (a.foto ? 'Cambiar foto' : 'Hacer o subir foto') + '<input type="file" accept="image/*" capture="environment" hidden data-file="art"></label></div>' +
    '<div class="row"><button class="btn danger sm" data-a="borrar-art" data-id="' + a.id + '">Borrar</button><a href="#equipo" class="btn pri f1">Guardar</a></div></div>' +
    '<div class="card"><b>Rentabilidad</b>' + barraPct(s.pct) + ((a.unidades || []).filter((u) => !u.coste).length && (a.unidades || []).some((u) => u.coste) ? '<span class="sub" style="font-size:12px;color:var(--warn)">Faltan precios de ' + (a.unidades || []).filter((u) => !u.coste).length + ' unidades: el porcentaje sale más alto de lo real.</span>' : '') +
    '<div class="between"><span class="sub">Costó</span><b class="num">' + eur(s.coste) + '</b></div><div class="between"><span class="sub">Generado en alquileres</span><b class="num">' + eur(s.ing) + '</b></div>' + (s.ventas ? '<div class="between"><span class="sub">Vendido por</span><b class="num">' + eur(s.ventas) + '</b></div>' : '') +
    '<div class="between"><span class="sub">' + (s.total >= s.coste && s.coste ? 'Ganancia neta' : 'Falta por recuperar') + '</span><b class="num" style="color:' + (s.total >= s.coste && s.coste ? 'var(--ok)' : 'var(--tx)') + '">' + eur(Math.abs(s.total - s.coste)) + '</b></div>' +
    '<div class="between"><span class="sub">Días alquilado · uso propio</span><span>' + s.dias + ' · ' + s.diasPropio + '</span></div><div class="between"><span class="sub">Trabajos</span><span>' + s.n + (s.ultimo ? ' · último ' + fechaES(s.ultimo) : '') + '</span></div>' +
    (s.dias ? '<div class="between"><span class="sub">Media por día alquilado</span><span class="num">' + eur(s.ing / s.dias) + '</span></div>' : '') + '</div>' +
    '<div class="card"><div class="between"><b>Unidades</b><button class="btn sm ghost" data-a="add-unidad">' + ico('plus', 14) + 'Unidad</button></div><span class="sub" style="font-size:12px">Precio de compra sin IVA (lo que realmente te cuesta, porque el IVA lo recuperas).</span>' +
    (a.unidades || []).map((u, i) => '<div style="background:var(--s1);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px;' + (u.estado && u.estado !== 'activo' ? 'opacity:.6' : '') + '"><div class="between"><b>Unidad ' + (i + 1) + (u.estado === 'vendido' ? ' · vendida' : u.estado === 'roto' ? ' · rota' : '') + '</b><button class="btn icon sm" data-a="quitar-unidad" data-i="' + i + '" aria-label="Quitar unidad ' + (i + 1) + '">' + ico('x', 14) + '</button></div>' +
      '<div class="row wrap"><label class="f" style="flex:1 1 120px">Fecha de compra<input type="date" class="in" value="' + (u.fecha || '') + '" data-ux="' + i + '" data-k="fecha"></label><label class="f" style="flex:1 1 100px">Precio de compra €<input class="in" inputmode="decimal" value="' + (u.coste ? String(u.coste).replace('.', ',') : '') + '" data-ux="' + i + '" data-k="coste"></label></div>' +
      '<div class="row wrap"><label class="f" style="flex:1 1 120px">Estado<select class="in" data-ux="' + i + '" data-k="estado"><option value="activo"' + (!u.estado || u.estado === 'activo' ? ' selected' : '') + '>En uso</option><option value="vendido"' + (u.estado === 'vendido' ? ' selected' : '') + '>Vendida</option><option value="roto"' + (u.estado === 'roto' ? ' selected' : '') + '>Rota o perdida</option></select></label>' +
      (u.estado === 'vendido' ? '<label class="f" style="flex:1 1 100px">Vendida por €<input class="in" inputmode="decimal" value="' + (u.venta ? String(u.venta).replace('.', ',') : '') + '" data-ux="' + i + '" data-k="venta"></label>' : '') + '</div>' +
      (u.estado === 'vendido' && u.venta && !u.ingreso ? '<button class="btn sm ghost" data-a="venta-ingreso" data-i="' + i + '">Apuntar la venta como ingreso</button>' : '') + '</div>').join('') + '</div>' +
    '<div class="card"><b>Historial</b>' + (hist.length ? '<div class="list">' + hist.map((f) => { const e = (f.equipo || []).find((x) => x.tipo === 'art' && x.id === a.id); return '<button class="item" data-a="ver-factura" data-id="' + f.id + '"><span class="f1">' + esc(f.num) + ' · ' + esc(nombreCli(f.cliente)) + '<div class="sub" style="font-size:12px">' + fechaES(f.fecha) + (e ? ' · ' + e.dias + ' días' + (e.propio ? ' · uso propio' : '') : ' · en pack') + '</div></span>' + (e && !e.propio ? '<span class="num">' + eur(+e.precio || 0) + '</span>' : '') + '</button>'; }).join('') + '</div>' : '<span class="sub">Aún no se ha usado en ninguna factura.</span>') + '</div></div>';
}
function vPack(id) {
  const p = packDe(id); if (!p) return '<p class="sub">No encontrado.</p>';
  const suma = (p.items || []).reduce((s, it) => s + ((artDe(it.art) || {}).precioDia || 0) * (it.qty || 1), 0);
  return '<div class="top"><div class="row"><a href="#equipo" class="btn icon" aria-label="Volver a equipo">' + ico('left') + '</a><h1 style="font-size:22px">' + esc(p.nombre || 'Pack nuevo') + '</h1></div></div>' +
    '<div class="grid home-grid"><div class="card"><label class="f">Nombre del pack<input class="in" value="' + esc(p.nombre) + '" data-px="nombre"></label><label class="f">Precio del pack €/día<input class="in" inputmode="decimal" value="' + (p.precioDia ? String(p.precioDia).replace('.', ',') : '') + '" data-px="precioDia"></label>' +
    '<span class="sub" style="font-size:12px">Por separado saldría a ' + eur(suma) + '/día. Lo que ganes con el pack se reparte entre sus piezas según su precio.</span><div class="row"><button class="btn danger sm" data-a="borrar-pack" data-id="' + p.id + '">Borrar</button><a href="#equipo" class="btn pri f1">Guardar</a></div></div>' +
    '<div class="card"><div class="between"><b>Contenido</b><button class="btn sm ghost" data-a="pack-add">' + ico('plus', 14) + 'Añadir</button></div>' +
    ((p.items || []).length ? (p.items || []).map((it, i) => '<div class="row"><span class="f1" style="font-size:14px">' + esc((artDe(it.art) || {}).nombre || 'Borrado') + '</span><input class="in" style="width:64px;min-height:38px" inputmode="numeric" value="' + (it.qty || 1) + '" data-pq="' + i + '" aria-label="Cantidad"><button class="btn icon sm" data-a="pack-quitar" data-i="' + i + '" aria-label="Quitar">' + ico('x', 14) + '</button></div>').join('') : '<span class="sub">Vacío. Añade las piezas que van en el pack.</span>') + '</div></div>';
}
/* Selector de equipo (factura o pack) */
function abrirSelector(destino, soloLista) {
  UI.selDest = destino; UI.selQ = UI.selQ || '';
  const q = UI.selQ.toLowerCase();
  const arts = S.equipo.filter((a) => unidadesActivas(a).length && (!q || coincide(a.nombre + ' ' + a.cat, q))).sort((a, b) => CATS_EQ.indexOf(a.cat) - CATS_EQ.indexOf(b.cat) || a.nombre.localeCompare(b.nombre));
  const packs = destino === 'factura' ? S.packs.filter((p) => !q || coincide(p.nombre, q)) : [];
  let html = '', last = '';
  packs.forEach((p) => { html += '<button class="item" data-a="sel" data-t="pack" data-id="' + p.id + '"><span class="f1">' + esc(p.nombre) + '<div class="sub" style="font-size:12px">Pack · ' + (p.items || []).length + ' piezas</div></span><span class="sub">' + eur(p.precioDia || 0) + '</span>' + ico('plus', 18) + '</button>'; });
  arts.forEach((a) => { if (a.cat !== last) { html += '<div class="sub" style="padding:10px 4px 2px;font-weight:600">' + esc(a.cat) + '</div>'; last = a.cat; } html += '<button class="item" data-a="sel" data-t="art" data-id="' + a.id + '"><span class="f1">' + esc(a.nombre) + '<div class="sub" style="font-size:12px">' + unidadesActivas(a).length + ' disponibles</div></span><span class="sub">' + (a.precioDia ? eur(a.precioDia) : '—') + '</span>' + ico('plus', 18) + '</button>'; });
  if (soloLista && $('#sel-list')) { $('#sel-list').innerHTML = html || '<span class="sub">Nada con esa búsqueda.</span>'; return; }
  hoja('<div class="between"><h2 style="font-size:20px">Añadir equipo</h2><button class="btn icon" data-a="cerrar" aria-label="Cerrar">' + ico('x') + '</button></div><input class="in" placeholder="Buscar" value="' + esc(UI.selQ) + '" data-in="selQ" id="sel-q" aria-label="Buscar equipo"><div class="list" id="sel-list">' + (html || '<span class="sub">No hay equipo. Añádelo en la sección Equipo.</span>') + '</div>');
}
function tarjetaEquipoFactura(f) {
  const eq = f.equipo || [];
  const enviada = f.estado !== 'borrador';
  return '<div class="card"><div class="between"><b>Equipo</b><div class="row"><button class="btn sm ghost" data-a="carga">Lista de carga</button><button class="btn sm" data-a="add-equipo">' + ico('plus', 14) + 'Añadir</button></div></div>' +
    (eq.length ? '' : '<span class="sub" style="font-size:13px">Añade el equipo que llevas: se calcula el precio con tus descuentos por días y sale en la factura como «Alquiler de equipo».</span>') +
    eq.map((e, i) => '<div style="background:var(--s1);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px"><div class="between"><b style="font-size:14px">' + esc(nombreEq(e)) + (e.tipo === 'pack' ? ' <span class="pill">pack</span>' : '') + '</b><button class="btn icon sm" data-a="quitar-eq" data-i="' + i + '" aria-label="Quitar">' + ico('x', 14) + '</button></div>' +
      '<div class="row wrap"><label class="f" style="flex:1 1 60px">Cantidad<input class="in" inputmode="numeric" value="' + e.qty + '" data-eq="' + i + '" data-k="qty"></label><label class="f" style="flex:1 1 60px">Días<input class="in" inputmode="numeric" value="' + e.dias + '" data-eq="' + i + '" data-k="dias"></label><label class="f" style="flex:1 1 90px">Precio €<input class="in" inputmode="decimal" value="' + (e.propio ? '' : String(e.precio || 0).replace('.', ',')) + '" ' + (e.propio ? 'disabled placeholder="—"' : '') + ' data-eq="' + i + '" data-k="precio" id="eqp-' + i + '"></label></div>' +
      '<div class="row wrap" style="gap:14px;font-size:13px"><label class="row" style="gap:6px"><input type="checkbox"' + (e.propio ? ' checked' : '') + ' data-eqc="' + i + '" data-k="propio">Uso propio (sin cobrar)</label>' + (enviada || e.incluido ? '<label class="row" style="gap:6px"><input type="checkbox"' + (e.incluido ? ' checked' : '') + ' data-eqc="' + i + '" data-k="incluido">Ya incluido en el importe</label>' : '') + (e.manual ? '<button class="btn sm ghost" data-a="eq-recalc" data-i="' + i + '">Precio de tarifa</button>' : '') + '</div></div>').join('') +
    (eq.length ? '<div class="between" style="font-size:14px"><span class="sub">Alquiler de equipo en la factura</span><b class="num" id="eq-total">' + eur(equipoCobrado(f)) + '</b></div>' : '') +
    (enviada ? '<span class="sub" style="font-size:12px">Factura ya enviada: lo que añadas se marca como «ya incluido» para no cambiar su importe, y solo cuenta para la rentabilidad.</span>' : '') + '</div>';
}
function precioTarifa(e) { if (e.propio) return 0; const x = e.tipo === 'pack' ? packDe(e.id) : artDe(e.id); return x ? precioAlquiler(x.precioDia || 0, e.dias, e.qty) : 0; }
function abrirCarga(f) {
  const items = [];
  (f.equipo || []).forEach((e) => {
    if (e.tipo === 'pack') { const p = packDe(e.id); (p ? p.items : []).forEach((it) => items.push({ k: e.id + ':' + it.art, n: ((artDe(it.art) || {}).nombre || '?'), q: (it.qty || 1) * (e.qty || 1), de: p.nombre })); }
    else items.push({ k: e.id, n: nombreEq(e), q: e.qty || 1 });
  });
  f.carga = f.carga || {};
  const ida = items.filter((i) => (f.carga[i.k] || {}).ida).length, vuelta = items.filter((i) => (f.carga[i.k] || {}).vuelta).length;
  hoja('<div class="between"><h2 style="font-size:20px">Lista de carga · ' + esc(f.num) + '</h2><button class="btn icon" data-a="cerrar" aria-label="Cerrar">' + ico('x') + '</button></div>' +
    (items.length ? '<div class="between sub"><span>Cargado ' + ida + '/' + items.length + '</span><span>Devuelto ' + vuelta + '/' + items.length + '</span></div>' +
      '<table class="t"><thead><tr><th>Equipo</th><th class="r">Ida</th><th class="r">Vuelta</th></tr></thead><tbody>' + items.map((i) => '<tr><td>' + (i.q > 1 ? i.q + '× ' : '') + esc(i.n) + (i.de ? '<div class="sub" style="font-size:11px">' + esc(i.de) + '</div>' : '') + '</td><td class="r"><input type="checkbox" style="width:22px;height:22px"' + ((f.carga[i.k] || {}).ida ? ' checked' : '') + ' data-carga="' + esc(i.k) + '" data-k="ida" aria-label="Cargado ' + esc(i.n) + '"></td><td class="r"><input type="checkbox" style="width:22px;height:22px"' + ((f.carga[i.k] || {}).vuelta ? ' checked' : '') + ' data-carga="' + esc(i.k) + '" data-k="vuelta" aria-label="Devuelto ' + esc(i.n) + '"></td></tr>').join('') + '</tbody></table>' +
      (vuelta === items.length ? '<div class="infobox" style="border-color:#1F5C3E;color:var(--ok)">Todo de vuelta en casa.</div>' : '') + '<button class="btn ghost sm" data-a="carga-reset">Desmarcar todo</button>'
      : '<span class="sub">Esta factura no tiene equipo. Añádelo primero.</span>'));
}
function preguntarInventario(m) {
  const base = r2(movCalc(m).base);
  UI.invMov = m.id;
  hoja('<div class="between"><h2 style="font-size:20px">¿Añadir al inventario?</h2><button class="btn icon" data-a="cerrar" aria-label="No, cerrar">' + ico('x') + '</button></div><p class="sub" style="margin:0">Has apuntado «' + esc(m.concepto) + '». Si es equipo, añádelo para seguir su rentabilidad. Se guarda con precio de compra ' + eur(base) + ' (sin IVA) y fecha ' + fechaES(m.fecha) + '.</p>' +
    '<button class="btn pri" data-a="inv-nuevo">Como equipo nuevo</button>' +
    (S.equipo.length ? '<label class="f">O como otra unidad de…<select class="in" id="inv-art"><option value="">Elige equipo</option>' + S.equipo.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((a) => '<option value="' + a.id + '">' + esc(a.nombre) + '</option>').join('') + '</select></label><button class="btn" data-a="inv-unidad">Añadir unidad</button>' : '') +
    '<button class="btn ghost" data-a="cerrar">No es equipo</button>');
}

/* ---------- Ajustes ---------- */
function vAjustes() {
  const a = S.ajustes;
  const inp = (k, l, ph) => '<label class="f">' + l + '<input class="in" value="' + esc(a[k]) + '" data-ax="' + k + '" placeholder="' + esc(ph || '') + '"></label>';
  return '<div class="top"><h1>Ajustes</h1></div><div class="grid home-grid">' +
    '<div class="card"><b>Tus datos fiscales</b>' + inp('nombre', 'Nombre completo') + inp('nif', 'NIF') + inp('direccion1', 'Dirección', 'Calle, número') + inp('direccion2', 'CP, ciudad, provincia') + inp('telefono', 'Teléfono') + inp('iban', 'IBAN') + inp('pieActividad', 'Actividad en el pie', 'PRODUCCIONES') + inp('origen', 'Salida habitual (kilometraje)', 'EL MOLAR') + '</div>' +
    '<div class="card"><b>Facturas</b><div class="row"><label class="f f1">Serie<input class="in" value="' + esc(a.serie) + '" data-ax="serie"></label><label class="f f1">Empezar en (solo sin facturas)<input class="in" inputmode="numeric" value="' + a.siguiente + '" data-ax="siguiente"></label></div><span class="sub" style="font-size:12px">Próxima factura: <b>' + esc(siguienteNum()) + '</b></span>' +
    '<div class="row"><label class="f f1">IVA %<input class="in" inputmode="numeric" value="' + a.ivaPct + '" data-ax="ivaPct"></label><label class="f f1">IRPF %<input class="in" inputmode="numeric" value="' + a.irpfPct + '" data-ax="irpfPct"></label><label class="f f1">Vence (meses)<input class="in" inputmode="numeric" value="' + a.venceMeses + '" data-ax="venceMeses"></label></div>' +
    '<div class="row"><label class="f f1">Difícil justificación %<input class="in" inputmode="decimal" value="' + a.gdjPct + '" data-ax="gdjPct"></label><label class="f f1">Máximo anual €<input class="in" inputmode="numeric" value="' + a.gdjMax + '" data-ax="gdjMax"></label></div>' +
    '<label class="btn ghost" style="cursor:pointer">' + ico('cam', 16) + (a.cabeceraFoto ? 'Cambiar cabecera de la factura' : 'Subir cabecera de la factura (JPG)') + '<input type="file" accept="image/jpeg" hidden data-file="cabecera"></label></div>' +
    '<div class="card"><b>Textos de los correos</b><span class="sub" style="font-size:12px">Puedes usar {numero}, {concepto}, {total}, {vencimiento} y {cliente}.</span>' +
    [['envio', 'Envío de factura'], ['venc', 'Día del vencimiento'], ['rec', 'Recordatorio cada 15 días']].map(([k, l]) => '<label class="f">' + l + ' · asunto<input class="in" value="' + esc(a.correo[k + 'Asunto']) + '" data-co="' + k + 'Asunto"></label><textarea class="in" rows="5" data-co="' + k + '" aria-label="' + l + ' · mensaje">' + esc(a.correo[k]) + '</textarea>').join('') + '</div>' +
    '<div class="card"><b>Categorías</b><span class="sub" style="font-size:12px">% de IVA y de gasto que se deduce, y límite mensual opcional (aviso al 85 %).</span><div class="scroll-x"><table class="t"><thead><tr><th>Categoría</th><th class="r">IVA %</th><th class="r">IRPF %</th><th class="r">Límite €/mes</th></tr></thead><tbody>' +
    CATS.filter((c) => !c.veh).map((c0) => { const c = cat(c0.id); return '<tr><td>' + esc(c.n) + '</td><td class="r"><input class="in" style="width:64px;min-height:36px" value="' + (c.sinIva ? '—' : c.iva || 0) + '" ' + (c.sinIva ? 'disabled' : '') + ' data-cat="' + c.id + '" data-k="iva" aria-label="IVA ' + esc(c.n) + '"></td><td class="r"><input class="in" style="width:64px;min-height:36px" value="' + (c.irpf || 0) + '" data-cat="' + c.id + '" data-k="irpf" aria-label="IRPF ' + esc(c.n) + '"></td><td class="r"><input class="in" style="width:80px;min-height:36px" value="' + (a.limites[c.id] || '') + '" data-lim="' + c.id + '" aria-label="Límite ' + esc(c.n) + '"></td></tr>'; }).join('') + '</tbody></table></div></div>' +
    '<div class="card"><b>Vehículos</b><div class="veh">' + S.vehiculos.map((v) => '<div class="vehcard"><div class="vehimg" data-foto="' + (v.foto || '') + '">' + (v.foto ? '' : VEH_SVG[v.tipo]) + '</div><div style="padding:10px;display:flex;flex-direction:column;gap:6px"><input class="in" value="' + esc(v.nombre) + '" data-vx="' + v.id + '" data-k="nombre" aria-label="Nombre"><input class="in" value="' + esc(v.modelo) + '" data-vx="' + v.id + '" data-k="modelo" aria-label="Modelo"><label class="f" style="font-size:12px">Consumo (L/100 km)<input class="in" inputmode="decimal" value="' + String(consumoDe(v)).replace('.', ',') + '" data-vx="' + v.id + '" data-k="consumo"></label><label class="row" style="font-size:13px;gap:6px"><input type="checkbox" ' + (v.propio ? 'checked' : '') + ' data-vprop="' + v.id + '">Es mío (deducible)</label><label class="btn ghost sm" style="cursor:pointer">' + ico('cam', 14) + 'Foto<input type="file" accept="image/*" hidden data-file="veh" data-id="' + v.id + '"></label></div></div>').join('') + '</div></div>' +
    '<div class="card"><b>Gastos recurrentes</b><span class="sub" style="font-size:12px">Se apuntan solos cada mes el día indicado.</span>' +
    S.recurrentes.map((r, i) => '<div style="background:var(--s1);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px"><div class="row"><label class="f f1">Nombre<input class="in" value="' + esc(r.concepto) + '" data-rx="' + i + '" data-k="concepto" placeholder="Netflix, alquiler, gimnasio…"></label><button class="btn icon sm" style="align-self:flex-end" data-a="quitar-rec" data-i="' + i + '" aria-label="Quitar ' + esc(r.concepto) + '">' + ico('x', 14) + '</button></div><div class="row wrap"><label class="f" style="flex:1 1 90px">Importe €<input class="in" inputmode="decimal" value="' + String(r.importe).replace('.', ',') + '" data-rx="' + i + '" data-k="importe"></label><label class="f" style="flex:0 1 70px">Día<input class="in" inputmode="numeric" value="' + (r.dia || 1) + '" data-rx="' + i + '" data-k="dia"></label><label class="f" style="flex:2 1 180px">Categoría<select class="in" data-rx="' + i + '" data-k="cat">' + CATS.map((c) => '<option value="' + c.id + '"' + (r.cat === c.id ? ' selected' : '') + '>' + esc(cat(c.id).n) + '</option>').join('') + '</select></label></div></div>').join('') +
    '<button class="btn dash sm" data-a="add-rec">+ Recurrente</button></div>' +
    '<div class="card"><b>Seguridad</b><span class="sub" style="font-size:12px">Bloquea la app al abrirla o tras 5 minutos fuera.</span><div class="row wrap"><button class="btn" data-a="pin">' + ico('lock', 16) + (a.pinHash ? 'Cambiar PIN' : 'Poner PIN') + '</button>' + (a.pinHash ? '<button class="btn" data-a="huella">' + ico('finger', 16) + (a.huella ? 'Huella activada ✓' : 'Activar huella') + '</button><button class="btn danger" data-a="quitar-pin">Quitar bloqueo</button>' : '') + '</div></div>' +
    '<div class="card"><b>Google · copia cifrada y Gmail</b><span class="sub" style="font-size:12px">Pega el ID de cliente OAuth que crearemos juntos en Google Cloud. La copia se cifra con una contraseña que solo sabes tú; si la olvidas, la copia no se puede abrir.</span>' + inp('googleId', 'ID de cliente de Google', 'xxxxxxxx.apps.googleusercontent.com') + '<button class="btn pri" data-a="sync">' + ico('sync', 16) + 'Sincronizar ahora</button>' + (a.ultimaSync ? '<span class="sub" style="font-size:12px">Última: ' + new Date(a.ultimaSync).toLocaleString('es-ES') + '</span>' : '') + '</div>' +
    '<div class="card"><b>Datos</b><label class="btn" style="cursor:pointer">' + ico('dl', 16) + 'Importar datos (datos-2026.json o una copia)<input type="file" accept="application/json,.json" hidden data-file="import"></label><button class="btn" data-a="backup">' + ico('dl', 16) + 'Descargar copia de seguridad</button><button class="btn danger" data-a="borrar-todo">Borrar todos los datos de este dispositivo</button><span class="sub" style="font-size:12px">' + S.movimientos.length + ' movimientos · ' + S.facturas.length + ' facturas · ' + S.clientes.length + ' clientes</span></div>' +
    '</div>';
}

/* ---------- Importar / sincronizar ---------- */
async function importar(obj) {
  if (obj.tipo === 'finanzas-osel-import') {
    const ya = S.movimientos.some((m) => m.origen === 'excel') || S.facturas.some((f) => f.origen === 'excel');
    if (ya) {
      if (obj.clientes) obj.clientes.forEach((c) => { if (!S.clientes.some((x) => x.id === c.id || x.nombre === c.nombre)) S.clientes.push(touch({ ...c })); });
      if (obj.ajustes) Object.entries(obj.ajustes).forEach(([k, v]) => { if (v && !S.ajustes[k]) S.ajustes[k] = v; });
      if (obj.cabecera && !S.ajustes.cabeceraFoto) { const id = 'cab-' + uid(); await DB.put('fotos', id, b64.dec(obj.cabecera)); S.ajustes.cabeceraFoto = id; }
      if (maxNum() >= S.ajustes.siguiente) S.ajustes.siguiente = maxNum() + 1;
      touch(S.ajustes); guardar(); toast('El Excel ya estaba importado: he restaurado tus datos fiscales, la cabecera y los clientes'); render();
      return;
    }
    obj.movimientos.forEach((m) => S.movimientos.push(touch({ ...m, id: uid() })));
    if (obj.clientes) obj.clientes.forEach((c) => { if (!S.clientes.some((x) => x.nombre === c.nombre)) S.clientes.push(touch({ ...c })); });
    obj.facturas.forEach((f) => {
      const nf = touch({ ...f, id: uid() });
      if (obj.asignar && obj.asignar[f.num]) nf.cliente = obj.asignar[f.num];
      S.facturas.push(nf);
    });
    if (obj.recurrentes && !S.recurrentes.length) { const ym = hoy().slice(0, 7); obj.recurrentes.forEach((r) => S.recurrentes.push(touch({ id: uid(), ...r, ultimo: ym }))); }
    if (obj.ajustes) { Object.entries(obj.ajustes).forEach(([k, v]) => { if (v && !S.ajustes[k]) S.ajustes[k] = v; }); }
    const max = Math.max(0, ...S.facturas.map((f) => { const m = /\.(\d+)$/.exec(f.num); return m && !f.num.startsWith('R') ? +m[1] : 0; }));
    if (max >= S.ajustes.siguiente) S.ajustes.siguiente = max + 1;
    if (obj.cabecera && !S.ajustes.cabeceraFoto) { const id = 'cab-' + uid(); await DB.put('fotos', id, b64.dec(obj.cabecera)); S.ajustes.cabeceraFoto = id; }
    touch(S.ajustes);
    guardar(); toast('Importado: ' + obj.movimientos.length + ' movimientos y ' + obj.facturas.length + ' facturas'); render();
    return;
  }
  if (obj.tipo === 'mc-equipo') {
    if (S.equipo.length && !confirm('Ya tienes equipo en la app. ¿Añadir también el del archivo? (no se borra nada)')) return;
    const nom = new Set(S.equipo.map((a) => a.nombre.toLowerCase()));
    let n = 0;
    obj.articulos.forEach((a) => { if (nom.has(a.nombre.toLowerCase())) return; S.equipo.push(touch({ id: uid(), nombre: a.nombre, cat: a.cat, precioDia: a.precioDia || 0, nota: a.nota || '', unidades: Array.from({ length: a.unidades || 1 }, () => ({ id: uid(), fecha: '', coste: 0, estado: 'activo' })) })); n++; });
    (obj.packs || []).forEach((p) => { if (!S.packs.some((x) => x.nombre === p.nombre)) S.packs.push(touch({ id: uid(), nombre: p.nombre, precioDia: p.precio || 0, items: [] })); });
    guardar(); render(); toast('Equipo importado: ' + n + ' artículos'); return;
  }
  if (obj.tipo === 'mc-viajes') {
    let nc = 0, nv = 0, na = 0;
    const idDe = {};
    obj.clientes.forEach((c) => {
      let ex = S.clientes.find((x) => (c.nif && x.nif && x.nif.toUpperCase() === c.nif.toUpperCase()) || x.nombre.toLowerCase() === c.nombre.toLowerCase());
      if (!ex) { ex = touch({ id: uid(), nombre: c.nombre, nif: c.nif, dir1: c.dir1, dir2: c.dir2, correos: [] }); S.clientes.push(ex); nc++; }
      idDe[c.key] = ex.id;
    });
    const tocadas = new Set();
    obj.viajes.forEach((v) => {
      const f = S.facturas.find((x) => x.num === v.num); if (!f) return;
      if (!tocadas.has(f.id)) { f.viajes = viajesDe(f).filter((x) => !x.importado); tocadas.add(f.id); }
      f.viajes.push({ id: uid(), fecha: v.fecha, destino: v.destino, km: v.km, iv: v.iv, veh: v.veh || '', importado: true }); nv++;
      if (!f.cliente && idDe[v.cliente]) { f.cliente = idDe[v.cliente]; na++; }
      touch(f);
    });
    guardar(); render(); toast('Kilometraje importado: ' + nv + ' días, ' + nc + ' clientes nuevos, ' + na + ' facturas con cliente asignado'); return;
  }
  if (obj.v && obj.ajustes && obj.movimientos) {
    if (!confirm('Esto reemplaza todos los datos de este dispositivo por la copia. ¿Seguir?')) return;
    S = { ...estadoInicial(), ...obj }; guardar(); toast('Copia restaurada'); render(); return;
  }
  toast('Archivo no reconocido');
}
function fusionar(remoto) {
  const bor = { ...remoto.borrados, ...S.borrados };
  Object.keys(remoto.borrados || {}).forEach((k) => { bor[k] = Math.max(remoto.borrados[k] || 0, S.borrados[k] || 0); });
  const cols = ['movimientos', 'facturas', 'presupuestos', 'clientes', 'recurrentes', 'vehiculos', 'equipo', 'packs'];
  const out = { ...S, borrados: bor };
  cols.forEach((col) => {
    const map = new Map();
    (remoto[col] || []).forEach((x) => map.set(x.id, x));
    (S[col] || []).forEach((x) => { const r = map.get(x.id); if (!r || (x.upd || 0) >= (r.upd || 0)) map.set(x.id, x); });
    out[col] = [...map.values()].filter((x) => !(bor[x.id] && bor[x.id] >= (x.upd || 0)));
  });
  const ra = remoto.ajustes || {}; const la = S.ajustes;
  const [nuevo, viejo] = (ra.upd || 0) > (la.upd || 0) ? [ra, la] : [la, ra];
  const aj = { ...viejo, ...nuevo };
  Object.keys(viejo).forEach((k) => { const v = aj[k]; if ((v === '' || v == null) && viejo[k] !== '' && viejo[k] != null) aj[k] = viejo[k]; });
  aj.correo = { ...(viejo.correo || {}), ...(nuevo.correo || {}) }; aj.cats = { ...(viejo.cats || {}), ...(nuevo.cats || {}) }; aj.limites = { ...(viejo.limites || {}), ...(nuevo.limites || {}) };
  aj.siguiente = Math.max(+la.siguiente || 1, +ra.siguiente || 1);
  aj.googleId = la.googleId || ra.googleId;
  out.ajustes = aj;
  return out;
}
async function sincronizar() {
  const a = S.ajustes;
  if (!a.googleId) { toast('Primero pon el ID de cliente de Google en Ajustes'); location.hash = 'ajustes'; return; }
  if (!UI.pass) {
    const p = prompt('Contraseña de cifrado de tu copia (la misma en todos tus dispositivos):');
    if (!p) return; UI.pass = p;
  }
  toast('Sincronizando…'); const bs = $('#btn-sync'); if (bs) bs.style.animation = 'spin 1s linear infinite';
  try {
    await G.auth(a.googleId);
    const f = await G.find('mis-cuentas.enc');
    if (f) {
      const txt = await G.download(f.id);
      let rem;
      try { rem = JSON.parse(new TextDecoder().decode(await descifrar(txt, UI.pass))); } catch (e) { UI.pass = null; throw new Error('Contraseña incorrecta: no se pudo abrir la copia de Drive'); }
      S = fusionar(rem);
      const prev = await G.find('mis-cuentas.prev.enc'); await G.put('mis-cuentas.prev.enc', txt, prev && prev.id);
    }
    S.ajustes.ultimaSync = Date.now();
    const data = await cifrar(new TextEncoder().encode(JSON.stringify(S)), UI.pass);
    await G.put('mis-cuentas.enc', data, f && f.id);
    // Fotos
    const remotos = new Set((await G.list()).map((x) => x.name));
    const locales = await DB.keys('fotos');
    for (const k of locales) { const n = 'foto-' + k + '.enc'; if (!remotos.has(n)) { const b = await DB.get('fotos', k); await G.put(n, await cifrar(new Uint8Array(b), UI.pass)); } }
    const usadas = new Set([S.ajustes.cabeceraFoto, ...S.movimientos.map((m) => m.foto), ...S.vehiculos.map((v) => v.foto), ...S.equipo.flatMap((a) => [a.foto, a.fotoPix])].filter(Boolean));
    const todos = await G.list();
    for (const id of usadas) { if (!locales.includes(id)) { const r = todos.find((x) => x.name === 'foto-' + id + '.enc'); if (r) { const t = await G.download(r.id); await DB.put('fotos', id, await descifrar(t, UI.pass)); } } }
    guardar(); render(); toast('Sincronizado');
  } catch (e) { toast(e.message.slice(0, 160)); const b2 = $('#btn-sync'); if (b2) b2.style.animation = ''; }
}

/* ---------- Bloqueo ---------- */
async function pedirPIN(titulo) {
  return new Promise((res) => {
    let v = '';
    const draw = () => { $('#layer').innerHTML = '<div class="lock"><h2>' + titulo + '</h2><div class="pins">' + [0, 1, 2, 3, 4, 5].map((i) => '<span class="' + (i < v.length ? 'on' : '') + '"></span>').join('') + '</div><div class="pinpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 'x', 0, 'ok'].map((k) => '<button data-k="' + k + '">' + (k === 'x' ? '⌫' : k === 'ok' ? 'OK' : k) + '</button>').join('') + '</div><button class="btn ghost sm" data-k="cancel">Cancelar</button></div>'; };
    draw();
    const h = (e) => { const b = e.target.closest('[data-k]'); if (!b) return; const k = b.getAttribute('data-k'); if (k === 'cancel') { done(null); return; } if (k === 'x') v = v.slice(0, -1); else if (k === 'ok') { if (v.length >= 4) return done(v); } else if (v.length < 6) v += k; draw(); };
    const done = (r) => { $('#layer').removeEventListener('click', h); $('#layer').innerHTML = ''; res(r); };
    $('#layer').addEventListener('click', h);
  });
}
async function bloquear() {
  if (!S.ajustes.pinHash || UI.locked) return;
  UI.locked = true;
  const a = S.ajustes;
  const tryHuella = async () => {
    if (!a.huella || !window.PublicKeyCredential) return false;
    try { await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: b64.dec(a.huella) }], userVerification: 'required', timeout: 60000 } }); return true; } catch (e) { return false; }
  };
  const ov = document.createElement('div'); ov.className = 'lock'; ov.id = 'lockov';
  let v = '';
  const draw = (msg) => { ov.innerHTML = '<span style="color:var(--ac)">' + ico('lock', 36) + '</span><h2>Mis cuentas</h2><div class="pins">' + [0, 1, 2, 3, 4, 5].map((i) => '<span class="' + (i < v.length ? 'on' : '') + '"></span>').join('') + '</div>' + (msg ? '<span style="color:var(--bad)">' + msg + '</span>' : '') + '<div class="pinpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 'h', 0, 'x'].map((k) => '<button data-k="' + k + '" aria-label="' + (k === 'h' ? 'Huella' : k === 'x' ? 'Borrar' : k) + '">' + (k === 'x' ? '⌫' : k === 'h' ? (a.huella ? ico('finger', 26) : '') : k) + '</button>').join('') + '</div>'; };
  draw(); document.body.appendChild(ov);
  const unlock = () => { ov.remove(); UI.locked = false; };
  ov.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-k]'); if (!b) return; const k = b.getAttribute('data-k');
    if (k === 'h') { if (await tryHuella()) unlock(); return; }
    if (k === 'x') v = v.slice(0, -1); else if (v.length < 6) v += k;
    if (v.length >= 4 && (await sha256hex(a.pinSalt + v)) === a.pinHash) return unlock();
    draw(v.length === 6 ? 'PIN incorrecto' : ''); if (v.length === 6) v = '';
  });
  if (a.huella && await tryHuella()) unlock();
}
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => { if (document.hidden) hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 5 * 60000) bloquear(); });

/* ---------- Eventos ---------- */
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 3200); }
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.getAttribute('data-a'); const id = el.getAttribute('data-id');
  if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault();
  if (a === 'cerrar-fondo') { if (e.target === el) cerrarHoja(); return; }
  const f = id ? S.facturas.find((x) => x.id === id) : null;
  switch (a) {
    case 'nuevo-gasto': abrirGasto(); break;
    case 'editar-mov': abrirGasto(id); break;
    case 'cerrar': cerrarHoja(); break;
    case 'periodo': UI.periodo = el.dataset.p; render(); break;
    case 'ref': { const d = parseD(UI.ref); const n = +el.dataset.d; if (UI.periodo === 'mes') d.setMonth(d.getMonth() + n); else if (UI.periodo === 'trim') d.setMonth(d.getMonth() + 3 * n); else d.setFullYear(d.getFullYear() + n); UI.ref = isoDate(d); render(); break; }
    case 'vista': { const o = ['lista', 'circulo', 'meses']; S.ajustes.vista = o[(o.indexOf(S.ajustes.vista || 'lista') + 1) % 3]; guardar(); render(); break; }
    case 'filtrar-cat': UI.filtro = 'cat:' + el.dataset.c; location.hash = 'movimientos'; break;
    case 'filtro': UI.filtro = el.dataset.f; render(); break;
    case 'g-tipo': G_EDIT.cat = el.dataset.t === 'ahorro' ? 'ahorro' : el.dataset.t === 'ingreso' ? 'ingreso' : 'gasolina'; if (G_EDIT.cat === 'ahorro') G_EDIT.cuenta = G_EDIT.cuenta || 'BBVA'; else if (G_EDIT.cat === 'ingreso') G_EDIT.tipoIng = G_EDIT.tipoIng || 'Regalo'; else G_EDIT.veh = G_EDIT.veh || ultimoVeh(); pintarGasto(); break;
    case 'g-cat': G_EDIT.cat = el.dataset.c; if (cat(G_EDIT.cat).veh && !G_EDIT.veh) G_EDIT.veh = ultimoVeh(); pintarGasto(); break;
    case 'g-veh': G_EDIT.veh = el.dataset.v; pintarGasto(); break;
    case 'g-guardar': {
      const g = G_EDIT; if (!(g.importe > 0)) return toast('Pon un importe');
      if (!g.concepto) g.concepto = g.cat === 'ahorro' ? 'Ahorro ' + (g.cuenta || '') : g.cat === 'ingreso' ? (g.tipoIng || 'Ingreso') : cat(g.cat).n;
      if (!cat(g.cat).veh) delete g.veh;
      if (g.fotoNueva) { const fid = 'tk-' + uid(); await DB.put('fotos', fid, g.fotoNueva); g.foto = fid; delete g.fotoNueva; }
      const yaTenia = !!g.yaTenia; delete g.yaTenia; if (g.id) { const i = S.movimientos.findIndex((x) => x.id === g.id); S.movimientos[i] = touch(g); } else { g.id = uid(); S.movimientos.push(touch(g)); }
      const nuevoEq = !yaTenia && (g.cat === 'material' || g.cat === 'equipo');
      guardar(); cerrarHoja(); toast('Guardado'); render(); if (nuevoEq) preguntarInventario(g); break;
    }
    case 'g-borrar': if (confirm('¿Borrar este movimiento?')) { borrar('movimientos', G_EDIT.id); guardar(); cerrarHoja(); render(); } break;
    case 'ver-foto': { const src = await fotoSrc(id); if (src) window.open(src, '_blank'); break; }
    case 'ftab': UI.ftab = el.dataset.t; render(); break;
    case 'ftab-cli': UI.ftab = 'clientes'; break;
    case 'nueva-factura': { const nf = nuevaFactura(); location.hash = 'factura/' + nf.id; break; }
    case 'ver-factura': location.hash = 'factura/' + id; break;
    case 'add-viaje': {
      const f = F_EDIT; f.viajes = viajesDe(f).slice(); const last = f.viajes[f.viajes.length - 1];
      let base = last ? { ...last, id: uid(), fecha: addDays(last.fecha, 1) } : null;
      if (!base) { const prev = S.facturas.filter((x) => x.id !== f.id && x.cliente && x.cliente === f.cliente).sort((a, b) => b.fecha.localeCompare(a.fecha)).flatMap((x) => viajesDe(x))[0]; const vl = S.facturas.flatMap((x) => viajesDe(x)).filter((x) => x.veh).sort((a, b) => b.fecha.localeCompare(a.fecha))[0]; base = { id: uid(), fecha: f.fecha, destino: prev ? prev.destino : '', km: prev ? prev.km : 0, iv: true, veh: prev && prev.veh ? prev.veh : vl ? vl.veh : '' }; }
      f.viajes.push(base); delete f.km; delete f.veh; touch(f); guardar(); render(); break;
    }
    case 'quitar-viaje': F_EDIT.viajes = viajesDe(F_EDIT).filter((x, i) => i !== +el.dataset.i); delete F_EDIT.km; touch(F_EDIT); guardar(); render(); break;
    case 'kms': kilometrajeXlsx(UI.anioH, +el.dataset.q).then((b) => download('Kilometraje ' + el.dataset.q + 'T ' + UI.anioH + '.xlsx', b, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')); break;
    case 'add-linea': F_EDIT.lineas.push({ c: '', imp: 0, det: '' }); touch(F_EDIT); guardar(); render(); break;
    case 'add-det': { const l = F_EDIT.lineas[F_EDIT.lineas.length - 1]; if (l) { l.showDet = true; render(); } break; }
    case 'quitar-linea': if (F_EDIT.lineas.length > 1) { versionar(F_EDIT); F_EDIT.lineas.splice(+el.dataset.i, 1); touch(F_EDIT); guardar(); render(); } break;
    case 'guardar-factura': touch(F_EDIT); guardar(); toast('Borrador guardado'); location.hash = 'facturas'; UI.ftab = 'borradores'; break;
    case 'pdf': if (faltanDatos().length && !confirm('Faltan datos (' + faltanDatos().join(', ') + '). ¿Descargar igualmente?')) break; download(nombrePDF(F_EDIT), await pdfDe(F_EDIT), 'application/pdf'); break;
    case 'duplicar': { const nf = nuevaFactura(F_EDIT); location.hash = 'factura/' + nf.id; toast('Duplicada como ' + nf.num); break; }
    case 'enviar': if (!F_EDIT.cliente) return toast('Elige un cliente'); if (faltanDatos().length) { toast('Antes completa en Ajustes: ' + faltanDatos().join(', ')); location.hash = 'ajustes'; break; } abrirEnvio(F_EDIT, 'envio'); break;
    case 'env-ok': enviarCorreo(S.facturas.find((x) => x.id === id), el.dataset.t); break;
    case 'recordar': { const dv = diasEntre(venceFactura(f), hoy()); abrirEnvio(f, dv === 0 ? 'venc' : 'rec'); break; }
    case 'marcar-enviada': F_EDIT.estado = 'enviada'; F_EDIT.fechaEnvio = hoy(); touch(F_EDIT); guardar(); render(); break;
    case 'cobrada': {
      const card = $('#pf-' + id);
      f.estado = 'cobrada'; f.fechaCobro = hoy(); touch(f); guardar();
      if (card) { card.classList.add('leaving'); setTimeout(render, 340); } else render();
      toast('Cobrada: ' + eur(totalesFactura(f).total) + ' apuntados como ingreso'); break;
    }
    case 'no-cobrada': F_EDIT.estado = 'enviada'; F_EDIT.fechaCobro = null; touch(F_EDIT); guardar(); render(); break;
    case 'borrar-factura': if (confirm(F_EDIT.estado === 'borrador' ? '¿Borrar este borrador?' : 'Esta factura ya está ' + F_EDIT.estado + '. Bórrala solo si es una prueba o un error. ¿Borrar?')) { borrar('facturas', F_EDIT.id); guardar(); location.hash = 'facturas'; } break;
    case 'rectificar': { const r = { id: uid(), num: siguienteRect(), fecha: hoy(), cliente: F_EDIT.cliente, lineas: JSON.parse(JSON.stringify(F_EDIT.lineas)), estado: 'borrador', rectificaDe: F_EDIT.id, versiones: [] }; S.facturas.push(touch(r)); guardar(); location.hash = 'factura/' + r.id; toast('Rectificativa ' + r.num + ' creada'); break; }
    case 'nuevo-cliente': { const c = touch({ id: uid(), nombre: '', nif: '', dir1: '', dir2: '', correos: [] }); S.clientes.push(c); const desde = el.dataset.desde; UI.volver = desde ? 'factura/' + desde : null; if (desde) { const ff = S.facturas.find((x) => x.id === desde); if (ff) { ff.cliente = c.id; touch(ff); } } guardar(); location.hash = 'cliente/' + c.id; break; }
    case 'ver-art': if (el.classList.contains('slot') && !matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('jump'); setTimeout(() => { location.hash = 'art/' + id; }, 260); } else location.hash = 'art/' + id; break;
    case 'inv-todo': UI.invTodo = !UI.invTodo; render(); break;
    case 'ver-pack': location.hash = 'pack/' + id; break;
    case 'eqcat': UI.eqCat = el.dataset.c; render(); break;
    case 'nuevo-art': { const a = touch({ id: uid(), nombre: '', cat: UI.eqCat && UI.eqCat !== 'todos' ? UI.eqCat : 'Cámaras', precioDia: 0, nota: '', unidades: [{ id: uid(), fecha: '', coste: 0, estado: 'activo' }] }); S.equipo.push(a); guardar(); location.hash = 'art/' + a.id; break; }
    case 'nuevo-pack': { const pk = touch({ id: uid(), nombre: '', precioDia: 0, items: [] }); S.packs.push(pk); guardar(); location.hash = 'pack/' + pk.id; break; }
    case 'borrar-art': if (confirm('¿Borrar este equipo y su historial de rentabilidad? Las facturas no cambian.')) { borrar('equipo', id); guardar(); location.hash = 'equipo'; } break;
    case 'borrar-pack': if (confirm('¿Borrar este pack?')) { borrar('packs', id); guardar(); location.hash = 'equipo'; } break;
    case 'add-unidad': { const a = artDe(ruta().id); a.unidades = a.unidades || []; a.unidades.push({ id: uid(), fecha: '', coste: 0, estado: 'activo' }); touch(a); guardar(); render(); break; }
    case 'quitar-unidad': { const a = artDe(ruta().id); if (confirm('¿Quitar esta unidad? Si la has vendido o se ha roto, mejor cambia su estado para conservar el historial.')) { a.unidades.splice(+el.dataset.i, 1); touch(a); guardar(); render(); } break; }
    case 'venta-ingreso': { const a = artDe(ruta().id); const u = a.unidades[+el.dataset.i]; const m = touch({ id: uid(), fecha: hoy(), concepto: 'Venta de ' + a.nombre, importe: +u.venta, cat: 'ingreso', tipoIng: 'Venta de algo' }); S.movimientos.push(m); u.ingreso = m.id; touch(a); guardar(); toast('Venta apuntada como ingreso'); render(); break; }
    case 'pack-add': abrirSelector('pack'); break;
    case 'pack-quitar': { const pk = packDe(ruta().id); pk.items.splice(+el.dataset.i, 1); touch(pk); guardar(); render(); break; }
    case 'add-equipo': UI.selQ = ''; abrirSelector('factura'); break;
    case 'sel': {
      if (UI.selDest === 'pack') { const pk = packDe(ruta().id); const ex = pk.items.find((it) => it.art === id); if (ex) ex.qty = (ex.qty || 1) + 1; else pk.items.push({ art: id, qty: 1 }); touch(pk); guardar(); cerrarHoja(); render(); toast('Añadido al pack'); break; }
      const f = F_EDIT; f.equipo = f.equipo || [];
      const dias = Math.max(1, viajesDe(f).length || 1);
      const e = { tipo: el.dataset.t, id, qty: 1, dias, precio: 0, incluido: f.estado !== 'borrador' };
      e.precio = precioTarifa(e); f.equipo.push(e); versionar(f); touch(f); guardar(); cerrarHoja(); render(); toast('Añadido: ' + nombreEq(e)); break;
    }
    case 'quitar-eq': F_EDIT.equipo.splice(+el.dataset.i, 1); touch(F_EDIT); guardar(); render(); break;
    case 'eq-recalc': { const e = F_EDIT.equipo[+el.dataset.i]; e.manual = false; e.precio = precioTarifa(e); touch(F_EDIT); guardar(); render(); break; }
    case 'carga': abrirCarga(F_EDIT); break;
    case 'carga-reset': F_EDIT.carga = {}; touch(F_EDIT); guardar(); abrirCarga(F_EDIT); break;
    case 'inv-nuevo': { const m = S.movimientos.find((x) => x.id === UI.invMov); const a = touch({ id: uid(), nombre: m.concepto, cat: 'Otros', precioDia: 0, nota: '', unidades: [{ id: uid(), fecha: m.fecha, coste: r2(movCalc(m).base), estado: 'activo', mov: m.id }] }); S.equipo.push(a); guardar(); cerrarHoja(); location.hash = 'art/' + a.id; toast('Añadido al inventario: ponle categoría y precio de alquiler'); break; }
    case 'inv-unidad': { const sel = $('#inv-art'); if (!sel || !sel.value) return toast('Elige el equipo'); const m = S.movimientos.find((x) => x.id === UI.invMov); const a = artDe(sel.value); a.unidades.push({ id: uid(), fecha: m.fecha, coste: r2(movCalc(m).base), estado: 'activo', mov: m.id }); touch(a); guardar(); cerrarHoja(); toast('Unidad añadida a ' + a.nombre); break; }
    case 'ver-cliente': UI.volver = null; location.hash = 'cliente/' + id; break;
    case 'editar-cliente': UI.volver = 'factura/' + el.dataset.desde; location.hash = 'cliente/' + id; break;
    case 'guardar-cliente': { const c = S.clientes.find((x) => x.id === id); if (c && !c.nombre.trim()) return toast('Pon al menos el nombre del cliente'); guardar(); toast('Cliente guardado'); const v = UI.volver; UI.volver = null; if (v) location.hash = v; else { UI.ftab = 'clientes'; location.hash = 'facturas'; } break; }
    case 'borrar-cliente': if (confirm('¿Borrar este cliente? Sus facturas se quedan sin cliente.')) { S.facturas.forEach((x) => { if (x.cliente === id) { x.cliente = ''; touch(x); } }); borrar('clientes', id); guardar(); UI.ftab = 'clientes'; location.hash = 'facturas'; } break;
    case 'orden': UI.orden = el.dataset.o; render(); break;
    case 'nuevo-presu': { const p = touch({ id: uid(), ref: 'P-' + Math.random().toString(36).slice(2, 6).toUpperCase(), fecha: hoy(), cliente: '', lineas: [{ c: '', imp: 0 }], estado: 'pendiente' }); S.presupuestos.push(p); guardar(); location.hash = 'presupuesto/' + p.id; break; }
    case 'ver-presu': location.hash = 'presupuesto/' + id; break;
    case 'pdf-presu': { const p = F_EDIT; download('Presupuesto ' + p.ref + '.pdf', await pdfDe({ ...p, num: p.ref, esPresu: true }), 'application/pdf'); break; }
    case 'presu-a-factura': { const p = F_EDIT; const nf = nuevaFactura(p); p.estado = 'aceptado'; touch(p); guardar(); location.hash = 'factura/' + nf.id; break; }
    case 'borrar-presu': if (confirm('¿Borrar presupuesto?')) { borrar('presupuestos', F_EDIT.id); guardar(); location.hash = 'facturas'; } break;
    case 'anioH': UI.anioH += +el.dataset.d; render(); break;
    case 'exportar': exportar(UI.anioH, +el.dataset.q); break;
    case 'resumen-anual': resumenAnual(UI.anioH); break;
    case 'pagado': { const q = el.dataset.q, m = el.dataset.m; S.movimientos.push(touch({ id: uid(), fecha: hoy(), concepto: 'Modelo ' + m + ' ' + q + 'T ' + UI.anioH, importe: +el.dataset.v, cat: 'hacienda', ref: UI.anioH + 'T' + q + m })); guardar(); toast('Apuntado el pago del ' + m); render(); break; }
    case 'add-rec': S.recurrentes.push(touch({ id: uid(), concepto: '', importe: 0, cat: 'fijos', dia: 1, ultimo: hoy().slice(0, 7) })); guardar(); render(); break;
    case 'quitar-rec': { const r = S.recurrentes[+el.dataset.i]; borrar('recurrentes', r.id); guardar(); render(); break; }
    case 'pin': { const p1 = await pedirPIN('Nuevo PIN (4 a 6 cifras)'); if (!p1) break; const p2 = await pedirPIN('Repite el PIN'); if (p1 !== p2) { toast('Los PIN no coinciden'); break; } S.ajustes.pinSalt = uid(); S.ajustes.pinHash = await sha256hex(S.ajustes.pinSalt + p1); touch(S.ajustes); guardar(); toast('PIN guardado'); render(); break; }
    case 'quitar-pin': S.ajustes.pinHash = ''; S.ajustes.huella = null; touch(S.ajustes); guardar(); render(); break;
    case 'huella': {
      if (!window.PublicKeyCredential) return toast('Este dispositivo no permite huella en la web');
      try {
        const cred = await navigator.credentials.create({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: 'Mis cuentas' }, user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'yo', displayName: 'Mis cuentas' }, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }], authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }, timeout: 60000 } });
        S.ajustes.huella = b64.enc(cred.rawId); touch(S.ajustes); guardar(); toast('Huella activada'); render();
      } catch (err) { toast('No se pudo activar: ' + err.message); }
      break;
    }
    case 'desglose': {
      const y = new Date().getFullYear(); const ry = resumen(y + '-01-01', y + '-12-31'); const res = reservar();
      const pagHac = S.movimientos.filter((m) => m.cat === 'hacienda' && m.fecha.startsWith(String(y))).reduce((s2, m) => s2 + m.importe, 0);
      const pend = S.facturas.filter(pendiente).reduce((s2, f2) => s2 + totalesFactura(f2).total, 0);
      const libre = ry.balance - ry.ahorrado - res.total;
      const fila = (l, v, extra) => '<div class="between" style="font-size:15px' + (extra || '') + '"><span>' + l + '</span><span class="num" style="white-space:nowrap">' + v + '</span></div>';
      hoja('<div class="between"><h2 style="font-size:20px">Te queda este año</h2><button class="btn icon" data-a="cerrar" aria-label="Cerrar">' + ico('x') + '</button></div>' +
        '<div class="card" style="gap:10px">' + fila('Cobrado en ' + y, eur(ry.cobrado)) + fila('Gastado', '−' + eur(ry.gastado)) +
        (pagHac ? '<span class="sub" style="font-size:12px;margin-top:-6px">Incluye ' + eur(pagHac) + ' de pagos a Hacienda ya hechos</span>' : '') +
        fila('Pasado a ahorro', '−' + eur(ry.ahorrado)) + fila('Apartar para Hacienda (trimestre en curso)', '−' + eur(res.total)) +
        fila('<b>Te queda</b>', '<b>' + eur(libre) + '</b>', ';border-top:1px solid var(--line);padding-top:10px;font-size:17px') + '</div>' +
        '<div class="infobox">Es lo que te queda de lo apuntado en la app, no tu saldo del banco. Para que sea exacto, cuando pagues el 303 o el 130 márcalo como pagado en Hacienda.' + (pend ? '<br><br>Además tienes <b>' + eur(pend) + '</b> en facturas pendientes de cobro que aún no cuentan aquí.' : '') + '</div>');
      break;
    }
    case 'privado': PRIV = !PRIV; try { localStorage.setItem('mc-privado', PRIV ? '1' : '0'); } catch (err) { } UI.shown = UI.target || 0; render(); toast(PRIV ? 'Cantidades ocultas' : 'Cantidades visibles'); break;
    case 'sync': sincronizar(); break;
    case 'backup': download('mis-cuentas-copia-' + hoy() + '.json', JSON.stringify(S), 'application/json'); break;
    case 'borrar-todo': if (confirm('¿Borrar TODOS los datos de este dispositivo? No afecta a la copia de Drive.') && confirm('¿Seguro? No se puede deshacer.')) { S = estadoInicial(); guardar(); render(); } break;
  }
});
document.addEventListener('input', (e) => {
  const el = e.target; const d = el.dataset;
  if (d.g !== undefined && G_EDIT) { G_EDIT[d.g] = d.g === 'importe' || d.g === 'litros' ? parseEur(el.value) : el.value; if (d.g === 'importe' || d.g === 'concepto') refrescarGasto(); return; }
  if (d.in === 'eqQ') { UI.eqQ = el.value; clearTimeout(render.t); render.t = setTimeout(() => { const tmp = document.createElement('div'); tmp.innerHTML = vEquipo(); const n = tmp.querySelector('#eq-res'), o = $('#eq-res'); if (n && o) o.replaceWith(n); }, 250); return; }
  if (d.in === 'selQ') { UI.selQ = el.value; clearTimeout(render.t); render.t = setTimeout(() => abrirSelector(UI.selDest, true), 200); return; }
  if (d.eq !== undefined && F_EDIT) {
    const e = F_EDIT.equipo[+d.eq]; if (!e) return;
    if (d.k === 'precio') { e.precio = parseEur(el.value); e.manual = true; }
    else { e[d.k] = Math.max(1, parseInt(el.value, 10) || 1); if (!e.manual) { e.precio = precioTarifa(e); const pi = $('#eqp-' + d.eq); if (pi) pi.value = String(e.precio).replace('.', ','); } }
    touch(F_EDIT); guardar(); refrescarTotales(); return;
  }
  if (d.ex) { const a = artDe(ruta().id); if (a) { a[d.ex] = d.ex === 'precioDia' ? parseEur(el.value) : el.value; touch(a); guardar(); } return; }
  if (d.ux !== undefined) { const a = artDe(ruta().id); const u = a && a.unidades[+d.ux]; if (u && d.k !== 'estado') { u[d.k] = d.k === 'coste' || d.k === 'venta' ? parseEur(el.value) : el.value; touch(a); guardar(); } return; }
  if (d.px) { const pk = packDe(ruta().id); if (pk) { pk[d.px] = d.px === 'precioDia' ? parseEur(el.value) : el.value; touch(pk); guardar(); } return; }
  if (d.pq !== undefined) { const pk = packDe(ruta().id); if (pk) { pk.items[+d.pq].qty = Math.max(1, parseInt(el.value, 10) || 1); touch(pk); guardar(); } return; }
  if (d.in === 'q') { UI.q = el.value; clearTimeout(render.t); render.t = setTimeout(() => { const tmp = document.createElement('div'); tmp.innerHTML = vMovimientos(); const n = tmp.querySelector('#mov-res'), o = $('#mov-res'); if (n && o) o.replaceWith(n); }, 250); return; }
  if (d.in) { UI[d.in] = el.value; clearTimeout(render.t); render.t = setTimeout(() => { const pos = el.selectionStart; render(); const n = document.querySelector('[data-in="' + d.in + '"]'); if (n && n.tagName === 'INPUT') { n.focus(); n.setSelectionRange(pos, pos); } }, 250); return; }
  if (d.ln !== undefined && F_EDIT) { versionar(F_EDIT); const l = F_EDIT.lineas[+d.ln]; l[d.k] = d.k === 'imp' ? parseEur(el.value) : el.value; touch(F_EDIT); guardar(); refrescarTotales(); return; }
  if (d.vj !== undefined && F_EDIT) { F_EDIT.viajes = viajesDe(F_EDIT); delete F_EDIT.km; const v = F_EDIT.viajes[+d.vj]; v[d.k] = d.k === 'km' ? (parseInt(el.value, 10) || 0) : d.k === 'iv' ? el.checked : el.value; touch(F_EDIT); guardar(); return; }
  if (d.fx && F_EDIT) { if (d.fx !== 'km' && d.fx !== 'veh') versionar(F_EDIT); F_EDIT[d.fx] = d.fx === 'km' ? (parseInt(el.value, 10) || 0) : el.value; touch(F_EDIT); guardar(); refrescarTotales(); return; }
  if (d.cx) { const c = S.clientes.find((x) => x.id === ruta().id); if (c) { c[d.cx] = d.cx === 'correos' ? el.value.split(/[,;\s]+/).filter(Boolean) : el.value; touch(c); guardar(); } return; }
  if (d.ax) { const num = ['siguiente', 'ivaPct', 'irpfPct', 'venceMeses', 'gdjPct', 'gdjMax'].includes(d.ax); S.ajustes[d.ax] = num ? parseEur(el.value) : el.value; touch(S.ajustes); guardar(); return; }
  if (d.co) { S.ajustes.correo[d.co] = el.value; touch(S.ajustes); guardar(); return; }
  if (d.cat) { S.ajustes.cats[d.cat] = S.ajustes.cats[d.cat] || {}; S.ajustes.cats[d.cat][d.k] = parseEur(el.value); touch(S.ajustes); guardar(); return; }
  if (d.lim) { S.ajustes.limites[d.lim] = parseEur(el.value); touch(S.ajustes); guardar(); return; }
  if (d.vx) { const v = veh(d.vx); v[d.k] = d.k === 'consumo' ? parseEur(el.value) : el.value; touch(v); guardar(); return; }
  if (d.vpct) { const v = veh(d.vpct); v.pct = Math.max(0, Math.min(100, parseEur(el.value))); touch(v); guardar(); return; }
  if (d.rx !== undefined) { const r = S.recurrentes[+d.rx]; r[d.k] = d.k === 'importe' ? parseEur(el.value) : d.k === 'dia' ? (parseInt(el.value, 10) || 1) : el.value; touch(r); guardar(); return; }
});
document.addEventListener('change', async (e) => {
  const el = e.target; const d = el.dataset;
  if (d.eqc !== undefined && F_EDIT) { const e = F_EDIT.equipo[+d.eqc]; e[d.k] = el.checked; if (d.k === 'propio') e.precio = el.checked ? 0 : precioTarifa(e); touch(F_EDIT); guardar(); render(); return; }
  if (d.ux !== undefined && d.k === 'estado') { const a = artDe(ruta().id); a.unidades[+d.ux].estado = el.value; if (el.value !== 'activo') a.unidades[+d.ux].fechaBaja = hoy(); touch(a); guardar(); render(); return; }
  if (d.carga && F_EDIT) { F_EDIT.carga = F_EDIT.carga || {}; const o = F_EDIT.carga[d.carga] || (F_EDIT.carga[d.carga] = {}); o[d.k] = el.checked; touch(F_EDIT); guardar(); abrirCarga(F_EDIT); return; }
  if (d.ex === 'cat') { render(); return; }
  if (d.in === 'eqOrden') { UI.eqOrden = el.value; render(); return; }
  if (d.in === 'filtro' || d.in === 'mesFiltro' || d.in === 'anioCli') { UI[d.in] = el.value || (d.in === 'filtro' ? 'todos' : ''); render(); return; }
  if (d.fx === 'cliente' && F_EDIT) render();
  if (d.vj !== undefined && F_EDIT && (d.k === 'iv' || d.k === 'veh' || d.k === 'fecha')) { const v = viajesDe(F_EDIT)[+d.vj]; if (v) { v[d.k] = d.k === 'iv' ? el.checked : el.value; F_EDIT.viajes = viajesDe(F_EDIT); touch(F_EDIT); guardar(); } return; }
  if (d.vprop) { const v = veh(d.vprop); v.propio = el.checked; touch(v); guardar(); return; }
  if (d.g === 'trabajo' || d.g === 'fecha' || d.g === 'cuenta') return;
  if (d.file) {
    const file = el.files && el.files[0]; if (!file) return;
    if (d.file === 'ticket') { G_EDIT.fotoNueva = await comprimir(file); pintarGasto(); return; }
    if (d.file === 'cabecera') { const id = 'cab-' + uid(); await DB.put('fotos', id, await fileBytes(file)); S.ajustes.cabeceraFoto = id; touch(S.ajustes); guardar(); toast('Cabecera guardada'); render(); return; }
    if (d.file === 'art') {
      const a = artDe(ruta().id); const id = 'art-' + uid(); await DB.put('fotos', id, await comprimir(file, 700));
      const pix = 'pix-' + uid(); await DB.put('fotos', pix, await comprimir(file, 56)); a.foto = id; a.fotoPix = pix; touch(a); guardar(); render(); toast('Foto guardada'); return;
    }
    if (d.file === 'veh') { const id = 'veh-' + uid(); await DB.put('fotos', id, await comprimir(file, 900)); const v = veh(d.id); v.foto = id; touch(v); guardar(); render(); return; }
    if (d.file === 'import') { try { await importar(JSON.parse(await file.text())); } catch (err) { toast('No se pudo leer: ' + err.message); } el.value = ''; return; }
  }
});
let anchoPC = window.innerWidth >= 900;
window.addEventListener('resize', () => { const pc = window.innerWidth >= 900; if (pc !== anchoPC) { anchoPC = pc; if (ruta().v === 'equipo') render(); } });
window.addEventListener('hashchange', () => { cerrarHoja(); render(); window.scrollTo(0, 0); });

/* ---------- Arranque ---------- */
(async function init() {
  try {
    await DB.open();
    const st = await DB.get('kv', 'estado');
    if (st) { const base = estadoInicial(); S = { ...base, ...st, ajustes: { ...base.ajustes, ...st.ajustes, correo: { ...base.ajustes.correo, ...(st.ajustes || {}).correo } } }; }
  } catch (e) { toast('Este navegador no permite guardar datos: ' + e.message); }
  aplicarRecurrentes();
  render();
  bloquear();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
