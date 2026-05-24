# AGENTS.md - Firelands Wiki

## Quick Start
- **Node.js** `>=22.12.0` (Astro 6 requirement; see `.nvmrc`)
- Run `pnpm install` to install dependencies
- Run `pnpm exec playwright install chromium` once (required for Mermaid diagram builds)
- Run `pnpm dev` to start dev server at `localhost:4321`
- Run `pnpm build` to build for production
- Run `pnpm preview` to preview the built site

## Mermaid diagrams
Use fenced `mermaid` code blocks in `.md` / `.mdx` docs (see `phase-system.md`). Rendered at build time via `rehype-mermaid` + Playwright (`astro.config.mjs` → `markdown.rehypePlugins`). Wide SVGs are wrapped in `.mermaid-scroll` for horizontal pan on mobile.

## Key Facts
- **Framework**: Astro with MDX and sitemap integrations
- **Package Manager**: pnpm (not npm/yarn)
- **TypeScript**: Strict mode enabled
- **Content**: Markdown/MDX in `src/content/docs/en/` and `src/content/docs/es/`
- **i18n**: Astro routing — EN at `/wiki/…`, ES at `/wiki/es/…` (no client-side lang toggling)
- **Site URL**: `https://firelands-core.github.io/wiki` (base: `/wiki`)

## Project Structure
```
src/
├── content/docs/en/  # English documentation
├── content/docs/es/  # Spanish documentation
├── i18n/             # UI strings and locale helpers
├── components/       # Astro components
├── layouts/          # Page layouts
├── pages/            # Routes (EN default + es/ prefix)
└── styles/           # Global styles
```

## Documentation Content
The wiki documents **firelands-next**, a WoW Cataclysm emulator (4.3.4) with:
- Hexagonal Architecture
- C++20, CMake, Ninja build
- MySQL database
- Lua scripting
- GoogleTest testing

Current docs:
- `getting-started.md` - Project introduction
- `architecture.md` - Hexagonal architecture
- `contributing.md` - Contribution workflow and standards
- `developer-setup.md` - Environment setup and build
- `database.md` - Schema and migrations
- `modules-shared.md` … `modules-tools-build.md` - Layer/module deep-dives
- `gossip-npc-text.md` - NPC gossip, npc_text, quest lines
- `phase-system.md` - Zone phasing, PhaseShift, database and layer implementation
- `playercreateinfo.md` - Starter spawn, spells, skills (race/class masks, DBC import)
- `lua-scripting.md` - Gameplay scripting
- `testing.md` - TDD and unit tests
- `devtools.md` - FirelandsDevTools CLI
- `extractors.md` - MPQ/DBC client data extractors
- `vmap-pipeline.md` - Collision/mmap extraction plan
- `storm-lib.md` - StormLib extractor roadmap
- `gm-commands.md` - GM command reference
- `gm-tickets.md` - GM ticket system design
- `roadmap.md` - **Unified core roadmap** (phases, parity matrix, extractors, toolchain, status legend ✅/🔄/⏳)
- `cpp20-migration.md` - C++20 toolchain migration status

## No Test/Lint Scripts
This is a simple Astro project with no configured linting or testing. Focus on content and build verification.

## Deployment
- Deploys to GitHub Pages automatically on push to `main` branch
- Uses Astro action with `pnpm` automatically detected from lockfile

## Content Collections
- Use `getCollection('docs')` — entry IDs are `en/{slug}` or `es/{slug}`
- Filter by locale: `post.id.startsWith('en/')` or use helpers in `src/i18n/utils.ts`
- Frontmatter schemas are defined in `src/content.config.ts`
- To split legacy bilingual markdown: `node scripts/split-locale-content.mjs`