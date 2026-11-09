import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://chinglamchoi.github.io',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
