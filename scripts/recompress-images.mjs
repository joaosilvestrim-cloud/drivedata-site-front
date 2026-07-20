// Recompressão in-place das imagens pesadas do /public.
// Mantém nome e formato (zero edição de código). Usa quantização palette nos
// PNG (mesma técnica do pngquant): quase imperceptível, sobretudo em imagens de
// fundo sob gradiente/overlay, e corta 80-95% do peso. O git guarda os originais.
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve('public');

// Largura máxima por papel da imagem. Fundo de tela não precisa passar de 1920.
const SMALL = { 'drive-data-icon.png': 600, 'tamires-avatar.png': 256 };
const DEFAULT_MAXW = 1920;
const MIN_BYTES = 500 * 1024; // só mexe em arquivos > 500KB

const fmt = (b) => (b / 1024).toFixed(0) + 'KB';

async function processFile(file) {
  const full = path.join(PUBLIC, file);
  const s = await stat(full);
  if (s.size < MIN_BYTES) return null;

  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const img = sharp(full, { failOn: 'none' });
  const meta = await img.metadata();
  const maxW = SMALL[file] ?? DEFAULT_MAXW;
  const targetW = meta.width && meta.width > maxW ? maxW : meta.width;

  let pipe = sharp(full, { failOn: 'none' });
  if (targetW && targetW !== meta.width) pipe = pipe.resize({ width: targetW });

  if (ext === '.png') {
    pipe = pipe.png({ palette: true, quality: 82, effort: 9, compressionLevel: 9 });
  } else {
    pipe = pipe.jpeg({ quality: 80, mozjpeg: true });
  }

  const tmp = full + '.tmp';
  await pipe.toFile(tmp);
  const ns = await stat(tmp);

  // Só adota se ficou menor. Senão descarta o tmp e mantém o original.
  if (ns.size < s.size) {
    await unlink(full);
    await rename(tmp, full);
    return { file, before: s.size, after: ns.size, w: `${meta.width}→${targetW}` };
  } else {
    await unlink(tmp);
    return { file, before: s.size, after: s.size, w: 'sem ganho', skipped: true };
  }
}

const files = await readdir(PUBLIC);
let totalBefore = 0, totalAfter = 0;
for (const f of files.sort()) {
  try {
    const r = await processFile(f);
    if (!r) continue;
    totalBefore += r.before; totalAfter += r.after;
    const pct = r.skipped ? '' : `  (-${(100 * (1 - r.after / r.before)).toFixed(0)}%)`;
    console.log(`${r.file.padEnd(52)} ${fmt(r.before).padStart(8)} → ${fmt(r.after).padStart(8)}${pct}  [${r.w}]`);
  } catch (e) {
    console.log(`ERRO ${f}: ${e.message}`);
  }
}
console.log('─'.repeat(80));
console.log(`TOTAL ${fmt(totalBefore)} → ${fmt(totalAfter)}  (-${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`);
