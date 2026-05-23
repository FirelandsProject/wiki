---
title: 'Tools, SQL & Build'
description: 'CMake layout, SQL migrations, tests, DevTools, and extractor targets'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Tools, SQL migrations, tests, and build

## CMake / build (`CMakeLists.txt`)

- **C++20** project **Firelands** with FetchContent: googletest, spdlog, MariaDB C/C++, nlohmann_json, yaml-cpp, Lua, StormLib, FTXUI
- **Libraries:** `FirelandsShared` → `FirelandsDomain` → `FirelandsApplication` → `FirelandsInfrastructure`
- **Executables:** `auth`, `world`, `FirelandsDevTools`
- **Optional:** `merge-migrations` runs `tools/merge_migrations.py` → refreshes `sql/bundled/`
- **Includes:** `${PROJECT_SOURCE_DIR}/src` — use `#include <application/...>` style

### Build commands

```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
ninja -C build                    # Full build + tests
ninja -C build auth world         # Servers only
ninja -C build FirelandsUnitTests # Tests only
ctest --test-dir build            # Run tests
```

### Precompiled headers

Heavy headers precompiled for faster builds. **spdlog** must be included via `<shared/Logger.h>`. `LuaGameScriptHost.cpp` skips PCH.

## SQL (`sql/`)

| Directory | Purpose |
|-----------|---------|
| `sql/init/` | Base schema per database |
| `sql/migrations/` | Incremental changes (lexicographic order) |
| `sql/bundled/` | Merged deploy bundles for Docker |

`DatabaseMigrator` runs on auth/world startup; tracks applied files in `firelands_auth.schema_migrations`.

```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## Tools

| Path | Purpose |
|------|---------|
| `src/tools/DevTools.cpp` | [DevTools](/wiki/docs/devtools/) CLI |
| `tools/extractors/` | [Extractors](/wiki/docs/extractors/) — MPQ/DBC |
| `tools/vmap/` | [VMap pipeline](/wiki/docs/vmap-pipeline/) |
| `tools/sql/import_ref_*.py` | World seed SQL → migrations (gossip, npc_text, quests, phases) |

## Tests (`tests/`)

GoogleTest targets mirror layers under `tests/unit/` and `tests/integration/`. ~90 test files. See [Testing](/wiki/docs/testing/).

MySQL repository tests benefit from Docker MySQL (`docker-compose up -d db`).

## Related

- [Developer Setup](/wiki/docs/developer-setup/)
- [Database](/wiki/docs/database/)
- [Contributing](/wiki/docs/contributing/)
