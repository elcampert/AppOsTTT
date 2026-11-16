/* Excel (.xlsx) mínimo: una hoja, textos, números, fechas, negritas y celdas con varias líneas. Usa makeZip de zip.js. */
function xlsxEsc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ''); }
function xlsxCol(i) { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
function xlsxSerial(iso) { const [y, m, d] = iso.split('-').map(Number); return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000; }
/* rows: array de filas; cada celda: null | string | number | {v, s, date:true, f:'fórmula'}
   estilos s: 0 normal, 1 cabecera, 2 fecha, 3 texto con saltos, 4 número 0,00, 5 negrita, 6 título, 7 número entero */
function makeXlsx(sheetName, rows, opts) {
  opts = opts || {};
  const enc = new TextEncoder();
  let data = '';
  rows.forEach((row, r) => {
    if (!row) return;
    let cells = '';
    row.forEach((cell, c) => {
      if (cell == null || cell === '') return;
      const ref = xlsxCol(c) + (r + 1);
      const o = typeof cell === 'object' ? cell : { v: cell };
      let s = o.s || 0;
      if (o.date) { s = s || 2; cells += '<c r="' + ref + '" s="' + s + '"><v>' + xlsxSerial(o.v) + '</v></c>'; return; }
      if (o.f) { cells += '<c r="' + ref + '" s="' + s + '"><f>' + xlsxEsc(o.f) + '</f></c>'; return; }
      if (typeof o.v === 'number') { cells += '<c r="' + ref + '" s="' + s + '"><v>' + o.v + '</v></c>'; return; }
      if (String(o.v).includes('\n') && !o.s) s = 3;
      cells += '<c r="' + ref + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + xlsxEsc(o.v) + '</t></is></c>';
    });
    data += '<row r="' + (r + 1) + '">' + cells + '</row>';
  });
  const cols = (opts.widths || []).map((w, i) => w ? '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>' : '').join('');
  const merges = (opts.merges || []).length ? '<mergeCells count="' + opts.merges.length + '">' + opts.merges.map((m) => '<mergeCell ref="' + m + '"/>').join('') + '</mergeCells>' : '';
  const sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"' + (opts.freeze ? '><pane ySplit="' + opts.freeze + '" topLeftCell="A' + (opts.freeze + 1) + '" activePane="bottomLeft" state="frozen"/></sheetView>' : '/>') + '</sheetViews>' + (cols ? '<cols>' + cols + '</cols>' : '') + '<sheetData>' + data + '</sheetData>' + merges + '</worksheet>';
  const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/></numFmts>' +
    '<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="12"/><name val="Calibri"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3A1430"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="8">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1"><alignment vertical="top"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '<xf numFmtId="4" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1"/>' +
    '<xf numFmtId="1" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  const files = [
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + xlsxEsc(sheetName.slice(0, 31)) + '" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/styles.xml', styles],
    ['xl/worksheets/sheet1.xml', sheet]
  ];
  return makeZip(files.map(([name, txt]) => ({ name, data: enc.encode(txt) })));
}
