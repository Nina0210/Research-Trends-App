import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isExpired(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return Date.now() - stat.mtimeMs > TTL_MS;
  } catch {
    return true;
  }
}

// --- Text summaries ---

export function getCachedSummary(paperId: string): object | null {
  const file = path.join(CACHE_DIR, 'summaries', `${paperId}.json`);
  if (!fs.existsSync(file)) return null;
  if (isExpired(file)) {
    fs.unlinkSync(file);
    return null;
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function setCachedSummary(paperId: string, data: object) {
  const dir = path.join(CACHE_DIR, 'summaries');
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${paperId}.json`), JSON.stringify(data));
}

// --- Podcasts ---

export function getCachedPodcast(paperId: string): Buffer | null {
  const file = path.join(CACHE_DIR, 'podcasts', `${paperId}.mp3`);
  if (!fs.existsSync(file)) return null;
  if (isExpired(file)) {
    fs.unlinkSync(file);
    return null;
  }
  return fs.readFileSync(file);
}

export function setCachedPodcast(paperId: string, audio: Buffer) {
  const dir = path.join(CACHE_DIR, 'podcasts');
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${paperId}.mp3`), audio);
}
