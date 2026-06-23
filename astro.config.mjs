import { defineConfig } from 'astro/config';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGithubPages ? 'https://xacobe.github.io' : 'https://tamaramarguenda.com',
  base: isGithubPages ? '/peluqueria-tamara/' : '/',
});
