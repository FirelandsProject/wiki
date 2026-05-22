# AGENTS.md - Firelands Wiki

## Quick Start
- Run `pnpm install` to install dependencies
- Run `pnpm dev` to start dev server at `localhost:4321`
- Run `pnpm build` to build for production
- Run `pnpm preview` to preview the built site

## Key Facts
- **Framework**: Astro with MDX and sitemap integrations
- **Package Manager**: pnpm (not npm/yarn)
- **TypeScript**: Strict mode enabled
- **Content**: Markdown/MDX files in `src/content/docs/`
- **Site URL**: `https://firelands-core.github.io/wiki` (base: `/wiki`)

## Project Structure
```
src/
├── content/docs/    # Documentation pages (MDX files)
├── components/      # Astro components
├── layouts/         # Page layouts
├── pages/           # Route definitions
└── styles/         # Global styles
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
- `developer-setup.md` - Environment setup and build
- `architecture.md` - Hexagonal architecture
- `database.md` - Schema and migrations
- `lua-scripting.md` - Gameplay scripting
- `testing.md` - TDD and unit tests
- `gm-commands.md` - GM command reference

## No Test/Lint Scripts
This is a simple Astro project with no configured linting or testing. Focus on content and build verification.

## Deployment
- Deploys to GitHub Pages automatically on push to `main` branch
- Uses Astro action with `pnpm` automatically detected from lockfile

## Content Collections
- Use `getCollection('docs')` to retrieve documents
- Frontmatter schemas are defined in `src/content.config.ts`