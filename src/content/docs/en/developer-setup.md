---
title: 'Developer Setup'
description: 'Environment setup, build, configuration, and deployment'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Developer Setup
## Prerequisites

- CMake 3.10+ (3.20+ recommended)
- C++20 compiler (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- **Ninja** build system (required — do not use Make)
- Python 3.8+ (SQL merge and import scripts)
- MySQL 8.0 / MariaDB (via Docker recommended)
- Git
- Optional: **ccache** (auto-detected), **Docker** for database

## Quick Start
### 1. Clone the Repository
```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
```

### 2. Configure the Build
```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
```

- **Generator**: MUST use Ninja
- **ccache**: Auto-detected and enabled if installed
- **Unity builds**: Optional via `-DENABLE_UNITY_BUILD=ON`
- Tests are built by default as target `FirelandsUnitTests`

### 3. Build
```bash
ninja -C build                         # Full build + tests
ninja -C build auth world              # Auth and world servers
ninja -C build FirelandsDevTools       # CLI account/realm tool
```

### 4. Start Database
```bash
docker-compose up -d db
```

Database credentials (Docker):

| Setting | Value |
|---------|-------|
| Image | `mysql:8.0` |
| Port | `3306` |
| Root | `root` / `root` |
| App user | `firelands` / `firelands` |
| Databases | `firelands_auth`, `firelands_characters`, `firelands_world` |

On first boot, bundled SQL from `sql/bundled/` is loaded automatically.

### 5. Run Servers
```bash
./build/bin/auth    # Auth server (config: authserver.yaml)
./build/bin/world   # World server (config: worldserver.yaml)
```

Override config paths:

```bash
export FIRELANDS_AUTH_CONFIG=/path/to/authserver.yaml
export FIRELANDS_WORLD_CONFIG=/path/to/worldserver.yaml
```

Both servers use an **FTXUI-based interactive console** when attached to a TTY. Logs default to `logs/firelands-auth.log` and `logs/firelands-world.log`.

## Configuration Files
### `authserver.yaml`

| Section | Purpose |
|---------|---------|
| `Network.Port` | Auth TCP port (default 3724) |
| `Network.RestPort` | REST login port (default 8081) |
| `RealmLink.*` | Optional realm-link listener for live metrics |
| `Database.*` | JDBC URI for auth database |
| `Log.*` | File rotation, log level |

### `worldserver.yaml`

| Section | Purpose |
|---------|---------|
| `Network.Port` | World TCP port (default 8085) |
| `RealmLink.*` | Outbound connection to auth realm-link |
| `Database.AuthUri` / `CharactersUri` / `WorldUri` | Three database connections |
| `Scripting.ScriptsDirectory` | Lua scripts path (default `scripts/lua`) |
| `Data.DbcPath` | Client DBC files for spell/item data |
| `Rates.*` | XP, drop, and other rate multipliers |
| `Collision.DataRoot` | VMap/collision data path |
| `Console.*` | Interactive console settings |

## Building Tests
```bash
ninja -C build FirelandsUnitTests
ctest --test-dir build           # Run all tests
ctest --test-dir build -R <pattern>  # Run specific tests
```

## SQL Tools
```bash
# Merge migrations into bundled schema
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations

# Import reference data from local Cataclysm clone
python3 tools/sql/import_ref_gossip.py
python3 tools/sql/import_ref_npc_text.py
python3 tools/sql/import_ref_quest_gossip.py
```

## Dependencies (Fetched via CMake)

| Library | Version | Purpose |
|---------|---------|---------|
| OpenSSL | (system/FetchContent) | SRP-6a, encryption |
| Boost.Thread | (FetchContent) | Asio networking (C++20 coroutines) |
| GoogleTest | 1.14.0 | Unit and integration tests |
| spdlog | 1.14.1 | Logging |
| MariaDB Connector/C | 3.3.8 | MySQL client |
| MariaDB Connector/C++ | 1.1.7 | MySQL C++ |
| nlohmann/json | 3.11.2 | JSON parsing |
| yaml-cpp | 0.8.0 | YAML configuration |
| Lua | 5.4.7 | Gameplay scripting |
| FTXUI | 5.0.0 | Console UI |
| StormLib | 9.26 | MPQ archive handling (extractors) |

## Cross-Platform

- **Windows**: MSVC or MinGW
- **Linux**: GCC or Clang
- **macOS**: Apple Clang

Use `std::filesystem` for paths and `std::thread` for threading. Platform `#ifdef` only in infrastructure adapters when unavoidable.

## Project Layout

| Path | Contents |
|------|----------|
| `src/` | All C++ source (layers + executables) |
| `tests/` | GoogleTest unit + integration tests (~90 files) |
| `sql/init/` | Base schema per database |
| `sql/migrations/` | Incremental migrations (~26 files) |
| `sql/bundled/` | Merged deploy bundles |
| `scripts/lua/` | Gameplay Lua scripts |
| `tools/extractors/` | Client data extractors |
| `tools/vmap/` | VMap pipeline (map_extractor, vmap4_*) |
| `data/` | Client DBC path reference |
| `docker/` | MySQL init grants |

## Platform-specific prerequisites

### macOS

```bash
brew install cmake ninja python3 git mariadb
brew install ccache   # optional
docker-compose up -d db   # optional database
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y cmake ninja-build python3 git mariadb-server libmariadb-dev zlib1g-dev libbz2-dev liblua5.4-dev
sudo apt install -y ccache   # optional
```

### Windows

1. Visual Studio 2022+ with "Desktop development with C++"
2. CMake from https://cmake.org/download
3. Ninja from https://ninja-build.org
4. Docker Desktop for local database

## IDE integration

### VSCode

Project includes `.clangd` for IntelliSense. Install the C/C++ extension; `compile_commands.json` is generated by CMake (symlink at repo root → `build/`).

### CLion

Open `CMakeLists.txt` as project model; auto-detects build directory.

## Common development tasks

### Adding a migration

1. Create `sql/migrations/NNN_description.sql` with idempotent SQL
2. `DatabaseMigrator` applies in lexicographic order on server startup
3. Regenerate bundles: `cmake --build build --target merge-migrations`

### Adding a GM command

1. Permission in `src/shared/game/Permissions.h`
2. Register in `CommandService.cpp`
3. Implement on `WorldSession` via `ICommandSession`
4. Document in [GM Commands](/wiki/docs/gm-commands/)

### Adding a DBC file

1. Place `.dbc` / `.db2` in `data/dbc/` (extract with [Extractors](/wiki/docs/extractors/))
2. Create reader in `infrastructure/dbc/` or `shared/dbc/`
3. Add to world startup loading sequence

### Running DevTools

```bash
./build/bin/FirelandsDevTools account admin password admin@example.com 3
./build/bin/FirelandsDevTools realm 1 "Firelands Test" 127.0.0.1 8085
```

See [DevTools](/wiki/docs/devtools/) for full reference.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build errors / PCH | Clean: `rm -rf build && cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug` |
| DB connection | Verify Docker: `docker-compose ps`; match YAML credentials |
| Client won't connect | Client must be **4.3.4 build 15595**; open ports 3724 (auth) and 8085 (world) |

## Next steps

- [Architecture](/wiki/docs/architecture/) and [module guides](/wiki/docs/modules-shared/)
- [Database](/wiki/docs/database/) schema reference
- [Contributing](/wiki/docs/contributing/) workflow
- [Roadmap](/wiki/docs/roadmap/) for current priorities
