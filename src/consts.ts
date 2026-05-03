// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Firelands Wiki';
export const SITE_DESCRIPTION = 'Documentation for firelands-next - WoW Cataclysm Emulator (4.3.4)';

// Helper to get base path dynamically
export function getBasePath(): string {
  const siteUrl = import.meta.env.SITE || '';
  return siteUrl.includes('firelands-core.github.io') ? '/wiki' : '';
}
