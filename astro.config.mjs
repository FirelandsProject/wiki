import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import { rehypeWrapMermaid } from './src/lib/rehype-wrap-mermaid.mjs';

export default defineConfig({
	site: 'https://firelands-core.github.io',
	base: '/wiki',
	markdown: {
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: ['mermaid'],
		},
		rehypePlugins: [
			[
				rehypeMermaid,
				{
					strategy: 'inline-svg',
					mermaidConfig: {
						theme: 'base',
						flowchart: {
							useMaxWidth: false,
							wrappingWidth: 280,
							padding: 20,
							nodeSpacing: 48,
							rankSpacing: 56,
							htmlLabels: true,
						},
						themeVariables: {
							darkMode: true,
							background: '#141414',
							mainBkg: '#1a1a1a',
							primaryColor: '#ff7b00',
							primaryTextColor: '#e0e0e0',
							primaryBorderColor: '#ff7b00',
							secondaryColor: '#2a1b1b',
							tertiaryColor: '#1a1a1a',
							lineColor: '#979797',
							textColor: '#e0e0e0',
							fontFamily: 'Inter, sans-serif',
						},
					},
				},
			],
			rehypeWrapMermaid,
		],
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'es'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: {
					en: 'en',
					es: 'es',
				},
			},
		}),
	],
});
