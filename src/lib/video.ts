export type VideoInfo = {
  provider: 'youtube' | 'vimeo';
  id: string;
  /** Privacy-friendly embed URL with autoplay, used after the poster is clicked. */
  embed: string;
  /** Poster image, when the provider offers a predictable thumbnail URL. */
  poster?: string;
};

/**
 * Accepts the usual YouTube and Vimeo link formats and returns what the
 * embed component needs. Throws on anything else so bad frontmatter fails
 * the build instead of silently producing a broken player.
 */
export function parseVideoUrl(input: string): VideoInfo {
  const yt = input.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) {
    const id = yt[1];
    return {
      provider: 'youtube',
      id,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeo = input.match(/vimeo\.com\/(?:video\/|channels\/[\w-]+\/)?(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    return {
      provider: 'vimeo',
      id,
      embed: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
    };
  }

  throw new Error(`Unsupported video URL: ${input}. Use a YouTube or Vimeo link.`);
}
