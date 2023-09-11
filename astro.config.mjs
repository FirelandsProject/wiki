import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://firelands-core.github.io',
	base: '/wiki',
	integrations: [mdx(), sitemap()],
});
