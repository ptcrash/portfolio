import type { ImageMetadata } from 'astro';

// Every photo under src/assets/photos/<album>/ is imported at build time.
// Astro resizes and converts them, so drop in full-resolution originals.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

export type Photo = { src: ImageMetadata; alt: string; file: string };

/** A titled group of photos. Albums without subfolders have one untitled section. */
export type PhotoSection = { id: string; title: string; photos: Photo[] };

// Camera-style names ("DSC04462", "rome-012", "IMG_0031") carry no meaning,
// so they get an empty alt and the gallery falls back to a positional caption.
const isCameraName = (name: string) => /^(?:[a-z]+\s?)?\d+$/i.test(name);

/** "03-market-stall.jpg" -> "market stall"; "rome-012.jpg" -> "". */
function altFromFilename(file: string): string {
  const name = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_ ]?/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return isCameraName(name) ? '' : name;
}

/** "03-fussen" -> "Fussen"; overrides let frontmatter fix spelling like "Füssen". */
function sectionTitle(folder: string, overrides: Record<string, string> = {}): string {
  const slug = folder.replace(/^\d+[-_ ]?/, '');
  if (overrides[folder]) return overrides[folder];
  if (overrides[slug]) return overrides[slug];
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function entriesForAlbum(album: string): [string, ImageMetadata][] {
  const prefix = `/src/assets/photos/${album}/`;
  return Object.entries(modules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, mod]) => [path.slice(prefix.length), mod.default]);
}

/** All photos for one album, flat, sorted by path. Album id = folder name. */
export function photosForAlbum(album: string): Photo[] {
  return entriesForAlbum(album).map(([file, src]) => ({ src, alt: altFromFilename(file), file }));
}

/**
 * Photos grouped by subfolder. Subfolders sort by name, so prefix them with
 * numbers to control order ("01-rome", "02-venice"). Files directly in the
 * album folder form an untitled section that comes first.
 */
export function sectionsForAlbum(
  album: string,
  titles: Record<string, string> = {},
): PhotoSection[] {
  const sections = new Map<string, PhotoSection>();
  for (const [rel, src] of entriesForAlbum(album)) {
    const slash = rel.indexOf('/');
    const folder = slash === -1 ? '' : rel.slice(0, slash);
    const file = slash === -1 ? rel : rel.slice(slash + 1);
    if (!sections.has(folder)) {
      sections.set(folder, {
        id: folder.replace(/^\d+[-_ ]?/, '') || 'photos',
        title: folder ? sectionTitle(folder, titles) : '',
        photos: [],
      });
    }
    sections.get(folder)!.photos.push({ src, alt: altFromFilename(file), file });
  }
  return [...sections.values()];
}
