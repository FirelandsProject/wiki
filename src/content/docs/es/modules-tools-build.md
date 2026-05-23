---
title: 'Tools, SQL y Build'
description: 'Layout CMake, migraciones SQL, pruebas, DevTools y targets de extractores'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Tools, migraciones SQL, pruebas y build

## CMake / build (`CMakeLists.txt`)

- Proyecto **C++20** **Firelands** con FetchContent: googletest, spdlog, MariaDB C/C++, nlohmann_json, yaml-cpp, Lua, StormLib, FTXUI
- **Bibliotecas:** `FirelandsShared` → `FirelandsDomain` → `FirelandsApplication` → `FirelandsInfrastructure`
- **Executables:** `auth`, `world`, `FirelandsDevTools`
- **Opcional:** `merge-migrations` ejecuta `tools/merge_migrations.py` → refresca `sql/bundled/`
- **Includes:** `${PROJECT_SOURCE_DIR}/src` — usa estilo `#include <application/...>`

### Comandos de build

```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
ninja -C build                    # Build completo + pruebas
ninja -C build auth world         # Solo servidores
ninja -C build FirelandsUnitTests # Solo pruebas
ctest --test-dir build            # Ejecutar pruebas
```

### Precompiled headers

Headers pesados precompilados para builds más rápidos. **spdlog** debe incluirse vía `<shared/Logger.h>`. `LuaGameScriptHost.cpp` omite PCH.

## SQL (`sql/`)

| Directorio | Propósito |
|------------|-----------|
| `sql/init/` | Esquema base por base de datos |
| `sql/migrations/` | Cambios incrementales (orden lexicográfico) |
| `sql/bundled/` | Bundles de despliegue fusionados para Docker |

`DatabaseMigrator` se ejecuta al arrancar auth/world; rastrea archivos aplicados en `firelands_auth.schema_migrations`.

```bash
python3 tools/merge_migrations.py
# o
cmake --build build --target merge-migrations
```

## Tools

| Ruta | Propósito |
|------|-----------|
| `src/tools/DevTools.cpp` | CLI [DevTools](/wiki/es/docs/devtools/) |
| `tools/extractors/` | [Extractores](/wiki/es/docs/extractors/) — MPQ/DBC |
| `tools/vmap/` | [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) |
| `tools/sql/import_ref_*.py` | SQL seed world → migraciones (gossip, npc_text, quests, fases) |

## Pruebas (`tests/`)

Targets GoogleTest reflejan capas bajo `tests/unit/` y `tests/integration/`. ~90 archivos de prueba. Ver [Pruebas](/wiki/es/docs/testing/).

Las pruebas de repositorio MySQL se benefician de MySQL con Docker (`docker-compose up -d db`).

## Relacionado

- [Configuración del desarrollador](/wiki/es/docs/developer-setup/)
- [Base de datos](/wiki/es/docs/database/)
- [Contribuir](/wiki/es/docs/contributing/)
