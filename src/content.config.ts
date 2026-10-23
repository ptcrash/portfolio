import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Dev projects: one markdown file per project in src/content/projects/.
// The file body is the write-up shown on the project page.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// Photography: one markdown file per album in src/content/photography/.
// The photos themselves live in src/assets/photos/<album-id>/ and are picked
// up automatically, sorted by filename.
const photography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photography' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      location: z.string().optional(),
      cover: image(),
      // Optional display names for subfolder sections, keyed by folder name
      // without its numeric prefix, e.g. { fussen: "Füssen" }.
      sections: z.record(z.string()).optional(),
      draft: z.boolean().default(false),
    }),
});

// Videography: one markdown file per video in src/content/videography/.
// `url` is a YouTube or Vimeo link. The body is an optional description.
const videography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videography' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      url: z.string().url(),
      role: z.string().optional(),
      thumbnail: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, photography, videography };
