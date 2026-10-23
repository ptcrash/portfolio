/**
 * Prefix an internal path with the configured `base` so links work both
 * locally ("/") and on GitHub Pages ("/<repo>/").
 */
export function url(path: string = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
