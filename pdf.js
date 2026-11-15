const PDF_W={H:[278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 350, 556, 350, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 350, 611, 350, 350, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 350, 500, 667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500],B:[278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 350, 556, 350, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 350, 611, 350, 350, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 350, 500, 667, 278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556]};
/* Generador mínimo de PDF (A4) para las facturas. Sin dependencias. */
const CP1252 = {'€':0x80,'‚':0x82,'„':0x84,'…':0x85,'‘':0x91,'’':0x92,'“':0x93,'”':0x94,'•':0x95,'–':0x96,'—':0x97,'™':0x99,'−':0x2d};
function pdfEnc(str) {
  const out = [];
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if (CP1252[ch] !== undefined) out.push(CP1252[ch]);
    else if (c >= 32 && c < 127) out.push(c);
    else if (c >= 0xa0 && c <= 0xff) out.push(c);
    else if (c === 10 || c === 13) continue;
    else out.push(63);
  }
  return out;
}
function pdfWidth(str, font, size, cs) {
  const t = PDF_W[font === 'B' ? 'B' : 'H'];
  const b = pdfEnc(str);
  let w = 0;
  for (const x of b) w += (x >= 32 ? t[x - 32] : 0) || 500;
  return w * size / 1000 + (cs || 0) * b.length;
}
function pdfStr(str) {
  return pdfEnc(str).map((b) => {
    if (b === 40 || b === 41 || b === 92) return '\\' + String.fromCharCode(b);
    if (b < 32 || b > 126) return '\\' + b.toString(8).padStart(3, '0');
    return String.fromCharCode(b);
  }).join('');
}
function jpegInfo(bytes) {
  let i = 2;
  while (i < bytes.length) {
    if (bytes[i] !== 0xff) { i++; continue; }
    const m = bytes[i + 1];
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    if (m >= 0xc0 && m <= 0xc3) {
      return { h: (bytes[i + 5] << 8) | bytes[i + 6], w: (bytes[i + 7] << 8) | bytes[i + 8], comp: bytes[i + 9] };
    }
    i += 2 + len;
  }
  return null;
}
function pdfBuild(content, image) {
  // content: string of PDF operators (ASCII only); image: {bytes,w,h,comp} | null
  const enc = new TextEncoder();
  const parts = []; const offsets = []; let pos = 0;
  const push = (x) => { const b = typeof x === 'string' ? latin1(x) : x; parts.push(b); pos += b.length; };
  function latin1(s) { const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 255; return a; }
  const obj = (n, body) => { offsets[n] = pos; push(n + ' 0 obj\n'); if (Array.isArray(body)) body.forEach(push); else push(body); push('\nendobj\n'); };
  push('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
  const fonts = '/F1 5 0 R /F2 6 0 R';
  const xo = image ? '/XObject << /Im1 7 0 R >>' : '';
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << ' + fonts + ' >> ' + xo + ' >> /Contents 4 0 R >>');
  obj(4, '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');
  obj(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  obj(6, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  let n = 6;
  if (image) {
    n = 7;
    const cs = image.comp === 1 ? '/DeviceGray' : image.comp === 4 ? '/DeviceCMYK' : '/DeviceRGB';
    obj(7, ['<< /Type /XObject /Subtype /Image /Width ' + image.w + ' /Height ' + image.h + ' /ColorSpace ' + cs + ' /BitsPerComponent 8 /Filter /DCTDecode' + (image.comp === 4 ? ' /Decode [1 0 1 0 1 0 1 0]' : '') + ' /Length ' + image.bytes.length + ' >>\nstream\n', image.bytes, '\nendstream']);
  }
  const xref = pos;
  let x = 'xref\n0 ' + (n + 1) + '\n0000000000 65535 f \n';
  for (let i = 1; i <= n; i++) x += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  push(x + 'trailer\n<< /Size ' + (n + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
  const out = new Uint8Array(pos); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
/* Factura con la maqueta de la plantilla de Canva. Medidas en puntos desde arriba. */
function facturaPDF(f, cli, aj, cabecera) {
  const H = 841.89, W = 595.28;
  let c = '';
  const Y = (y) => (H - y).toFixed(2);
  const txt = (s, x, y, size, font, opts) => {
    opts = opts || {};
    const cs = opts.cs || 0;
    let xx = x;
    if (opts.align === 'right') xx = x - pdfWidth(s, font, size, cs) + cs;
    if (opts.align === 'center') xx = x - (pdfWidth(s, font, size, cs) - cs) / 2;
    const col = opts.color || '0.12 0.12 0.12';
    c += 'BT ' + col + ' rg /' + (font === 'B' ? 'F2' : 'F1') + ' ' + size + ' Tf ' + cs + ' Tc ' + xx.toFixed(2) + ' ' + Y(y) + ' Td (' + pdfStr(s) + ') Tj ET\n';
  };
  const box = (x, y, w, h) => { c += '0.12 0.04 0.06 RG 2 w ' + x + ' ' + Y(y + h) + ' ' + w + ' ' + h + ' re S\n'; };
  const line = (x1, y, x2, wdt) => { c += '0.12 0.12 0.12 RG ' + (wdt || 2) + ' w ' + x1 + ' ' + Y(y) + ' m ' + x2 + ' ' + Y(y) + ' l S\n'; };
  // Cabecera
  let image = null;
  if (cabecera) {
    const info = jpegInfo(cabecera);
    if (info) {
      image = { bytes: cabecera, w: info.w, h: info.h, comp: info.comp };
      const hh = W * info.h / info.w;
      c += 'q ' + W.toFixed(2) + ' 0 0 ' + hh.toFixed(2) + ' 0 ' + (H - hh).toFixed(2) + ' cm /Im1 Do Q\n';
    }
  }
  if (!image) { c += '0.23 0.08 0.19 rg 0 ' + Y(121) + ' ' + W + ' 121 re f\n'; txt((aj.nombreComercial || aj.nombre || '').toUpperCase(), W / 2, 72, 30, 'B', { align: 'center', color: '1 1 1', cs: 1.5 }); }
  const cs = 0.6;
  // Nº y fecha
  box(309, 148, 158, 62);
  txt((f.esPresu ? 'Presupuesto: ' : 'Factura Nº: ') + f.num, 316, 172, 10.3, 'H', { cs });
  txt('Fecha: ' + fechaES(f.fecha), 316, 188, 10.3, 'H', { cs });
  // Emisor
  box(51.5, 225, 235, 93);
  txt(aj.nombre || '', 59, 243, 12, 'H', { cs });
  txt(aj.nif || '', 59, 259, 11, 'H', { cs });
  const dirE = [aj.direccion1, aj.direccion2].filter(Boolean);
  dirE.forEach((l, i) => txt(l, 59, 276 + i * 14, 9.5, 'H', { cs: 0.4 }));
  // Cliente
  box(308, 225, 235, 93);
  const lc = cli ? [cli.nombre, (cli.nif ? (/^[A-Z]/i.test(cli.nif) && !/^\d/.test(cli.nif) ? 'NIF: ' : 'NIF: ') + cli.nif : ''), cli.dir1, cli.dir2].filter(Boolean) : ['[Cliente]'];
  const lw = [];
  lc.forEach((l) => { let cur = ''; String(l).split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (pdfWidth(t, 'H', 12, cs) > 220 && cur) { lw.push(cur); cur = w; } else cur = t; }); if (cur) lw.push(cur); });
  const fs = lw.length > 5 ? 10.5 : 12, lh = lw.length > 5 ? 13.5 : 16.5;
  lw.slice(0, 6).forEach((l, i) => txt(cortar(l, 'H', fs, 220, cs), 315, 243 + i * lh, fs, 'H', { cs }));
  // Conceptos
  txt('CONCEPTO', 64, 366, 12, 'B', { cs: 1 });
  txt('IMPORTE', 543, 366, 12, 'B', { cs: 1, align: 'right' });
  line(64, 380, 535);
  let y = 403;
  for (const l of f.lineas) {
    if (y > 570) break;
    txt('- ' + cortar(l.c, 'H', 10.3, 390, cs), 64, y, 10.3, 'H', { cs });
    txt(eurPDF(l.imp), 536, y, 11.5, 'H', { cs, align: 'right' });
    y += 27;
    if (l.det) { txt(cortar(l.det, 'H', 10.3, 400, cs), 64, y - 0, 10.3, 'H', { cs }); y += 27; }
  }
  const t = totalesFactura(f, aj);
  const rowT = (lab, val, yy) => { txt(lab, 444, yy, 11, 'B', { cs: 0.8, align: 'right' }); txt(val, 536, yy, 12.5, 'H', { cs, align: 'right' }); };
  rowT('SUBTOTAL:', eurPDF(t.base), 600);
  rowT('IVA (' + aj.ivaPct + '%):', eurPDF(t.iva), 627);
  rowT('IRPF (' + aj.irpfPct + '%):', eurPDF(t.irpf), 655);
  rowT('TOTAL:', eurPDF(t.total), 683);
  line(63, 704, 529);

  c += circle(176, 720, 3.3) + circle(438, 720, 3.3);
  txt('Condiciones de pago:  TRANSFERENCIA', W / 2 + 4, 723, 9.5, 'H', { align: 'center', cs: 0.5 });
  txt(aj.iban || '', W / 2 + 4, 737, 9.5, 'B', { align: 'center', cs: 0.6 });
  if (!f.esPresu) txt('Plazo máximo de pago: ' + fechaES(venceFactura(f, aj)), W / 2 + 4, 752, 7.5, 'H', { align: 'center', cs: 0.4, color: '0.5 0.5 0.5' });
  // Pie oscuro
  c += '0.165 0.165 0.165 rg 0 0 ' + W + ' ' + (H - 770).toFixed(2) + ' re f\n';
  const p1 = [aj.telefono, (aj.nombre || '').toUpperCase(), aj.pieActividad || 'PRODUCCIONES'].filter(Boolean).join(' · ').toUpperCase();
  const p2 = [aj.nif, [aj.direccion1, aj.direccion2].filter(Boolean).join(', ')].filter(Boolean).join(' . ').toUpperCase();
  txt(p1, W / 2, 800, 7, 'H', { align: 'center', cs: 1.9, color: '0.93 0.93 0.93' });
  txt(p2, W / 2, 814, 7, 'H', { align: 'center', cs: 1.9, color: '0.93 0.93 0.93' });
  return pdfBuild(c, image);
  function circle(x, yTop, r) {
    const k = 0.5523 * r, yc = H - yTop;
    return (x + r) + ' ' + yc + ' m ' + (x + r) + ' ' + (yc + k) + ' ' + (x + k) + ' ' + (yc + r) + ' ' + x + ' ' + (yc + r) + ' c ' +
      (x - k) + ' ' + (yc + r) + ' ' + (x - r) + ' ' + (yc + k) + ' ' + (x - r) + ' ' + yc + ' c ' +
      (x - r) + ' ' + (yc - k) + ' ' + (x - k) + ' ' + (yc - r) + ' ' + x + ' ' + (yc - r) + ' c ' +
      (x + k) + ' ' + (yc - r) + ' ' + (x + r) + ' ' + (yc - k) + ' ' + (x + r) + ' ' + yc + ' c f\n';
  }
}
function cortar(s, font, size, max, cs) {
  s = String(s || '');
  if (pdfWidth(s, font, size, cs) <= max) return s;
  while (s.length > 1 && pdfWidth(s + '…', font, size, cs) > max) s = s.slice(0, -1);
  return s + '…';
}
function eurPDF(n) {
  const r = Math.round(n * 100) / 100;
  const s = Number.isInteger(r) ? String(r) : r.toFixed(2).replace('.', ',');
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '€';
}
