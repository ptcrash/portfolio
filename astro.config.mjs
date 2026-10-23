// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages behind the custom domain ptcra.sh. The domain is
// pinned by public/CNAME, which lands in the build output on every deploy.
//
// If you ever drop the custom domain, set `site` to
// 'https://<username>.github.io' and `base` to '/<repo>' (or '/' for a repo
// named <username>.github.io).
export default defineConfig({
  site: 'https://ptcra.sh',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
