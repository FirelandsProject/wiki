---
title: 'Developer Setup'
description: 'How to set up the development environment'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Developer Setup</span><span class="lang-es">Configuración de Desarrollador</span>

## <span class="lang-en">Prerequisites</span><span class="lang-es">Prerrequisitos</span>

<span class="lang-en">

- CMake 3.10+ (3.20+ recommended)
- C++20 compiler (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- **Ninja** build system (required — do not use Make)
- Python 3.8+ (SQL merge and import scripts)
- MySQL 8.0 / MariaDB (via Docker recommended)
- Git
- Optional: **ccache** (auto-detected), **Docker** for database

</span>
<span class="lang-es">

- CMake 3.10+ (3.20+ recomendado)
- Compilador C++20 (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- Sistema de build **Ninja** (obligatorio — no usar Make)
- Python 3.8+ (scripts de fusión e importación SQL)
- MySQL 8.0 / MariaDB (Docker recomendado)
- Git
- Opcional: **ccache** (auto-detectado), **Docker** para base de datos

</span>

## <span class="lang-en">Quick Start</span><span class="lang-es">Inicio Rápido</span>

### <span class="lang-en">1. Clone the Repository</span><span class="lang-es">1. Clonar el Repositorio</span>

```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
```

### <span class="lang-en">2. Configure the Build</span><span class="lang-es">2. Configurar la Construcción</span>

```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
```

<span class="lang-en">

- **Generator**: MUST use Ninja
- **ccache**: Auto-detected and enabled if installed
- **Unity builds**: Optional via `-DENABLE_UNITY_BUILD=ON`
- Tests are built by default as target `FirelandsUnitTests`

</span>
<span class="lang-es">

- **Generador**: DEBE usar Ninja
- **ccache**: Auto-detectado si está instalado
- **Unity builds**: Opcional con `-DENABLE_UNITY_BUILD=ON`
- Las pruebas se construyen por defecto como `FirelandsUnitTests`

</span>

### <span class="lang-en">3. Build</span><span class="lang-es">3. Construir</span>

```bash
ninja -C build                         # Full build + tests
ninja -C build auth world              # Auth and world servers
ninja -C build FirelandsDevTools       # CLI account/realm tool
```

### <span class="lang-en">4. Start Database</span><span class="lang-es">4. Iniciar Base de Datos</span>

```bash
docker-compose up -d db
```

<span class="lang-en">

Database credentials (Docker):

| Setting | Value |
|---------|-------|
| Image | `mysql:8.0` |
| Port | `3306` |
| Root | `root` / `root` |
| App user | `firelands` / `firelands` |
| Databases | `firelands_auth`, `firelands_characters`, `firelands_world` |

On first boot, bundled SQL from `sql/bundled/` is loaded automatically.

</span>
<span class="lang-es">

Credenciales (Docker):

| Ajuste | Valor |
|--------|-------|
| Imagen | `mysql:8.0` |
| Puerto | `3306` |
| Root | `root` / `root` |
| Usuario app | `firelands` / `firelands` |
| Bases de datos | `firelands_auth`, `firelands_characters`, `firelands_world` |

En el primer arranque se cargan automáticamente los SQL bundled de `sql/bundled/`.

</span>

### <span class="lang-en">5. Run Servers</span><span class="lang-es">5. Ejecutar Servidores</span>

```bash
./build/bin/auth    # Auth server (config: authserver.yaml)
./build/bin/world   # World server (config: worldserver.yaml)
```

<span class="lang-en">

Override config paths:

```bash
export FIRELANDS_AUTH_CONFIG=/path/to/authserver.yaml
export FIRELANDS_WORLD_CONFIG=/path/to/worldserver.yaml
```

Both servers use an **FTXUI-based interactive console** when attached to a TTY. Logs default to `logs/firelands-auth.log` and `logs/firelands-world.log`.

</span>
<span class="lang-es">

Sobrescribir configuración:

```bash
export FIRELANDS_AUTH_CONFIG=/path/to/authserver.yaml
export FIRELANDS_WORLD_CONFIG=/path/to/worldserver.yaml
```

Ambos servidores usan **consola interactiva FTXUI** con TTY. Logs por defecto en `logs/firelands-auth.log` y `logs/firelands-world.log`.

</span>

## <span class="lang-en">Configuration Files</span><span class="lang-es">Archivos de Configuración</span>

### <span class="lang-en">`authserver.yaml`</span><span class="lang-es">`authserver.yaml`</span>

<span class="lang-en">

| Section | Purpose |
|---------|---------|
| `Network.Port` | Auth TCP port (default 3724) |
| `Network.RestPort` | REST login port (default 8081) |
| `RealmLink.*` | Optional realm-link listener for live metrics |
| `Database.*` | JDBC URI for auth database |
| `Log.*` | File rotation, log level |

</span>
<span class="lang-es">

| Sección | Propósito |
|---------|-----------|
| `Network.Port` | Puerto TCP auth (por defecto 3724) |
| `Network.RestPort` | Puerto REST login (por defecto 8081) |
| `RealmLink.*` | Listener realm-link opcional para métricas en vivo |
| `Database.*` | URI JDBC de base auth |
| `Log.*` | Rotación de archivos, nivel de log |

</span>

### <span class="lang-en">`worldserver.yaml`</span><span class="lang-es">`worldserver.yaml`</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| Sección | Propósito |
|---------|-----------|
| `Network.Port` | Puerto TCP world (por defecto 8085) |
| `RealmLink.*` | Conexión saliente al realm-link de auth |
| `Database.AuthUri` / `CharactersUri` / `WorldUri` | Tres conexiones de BD |
| `Scripting.ScriptsDirectory` | Ruta scripts Lua (por defecto `scripts/lua`) |
| `Data.DbcPath` | DBC del cliente para hechizos/objetos |
| `Rates.*` | Multiplicadores de XP, drop, etc. |
| `Collision.DataRoot` | Ruta de datos vmap/colisiones |
| `Console.*` | Ajustes de consola interactiva |

</span>

## <span class="lang-en">Building Tests</span><span class="lang-es">Construir Pruebas</span>

```bash
ninja -C build FirelandsUnitTests
ctest --test-dir build           # Run all tests
ctest --test-dir build -R <pattern>  # Run specific tests
```

## <span class="lang-en">SQL Tools</span><span class="lang-es">Herramientas SQL</span>

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

## <span class="lang-en">Dependencies (Fetched via CMake)</span><span class="lang-es">Dependencias (Obtenidas vía CMake)</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| Librería | Versión | Propósito |
|---------|---------|----------|
| OpenSSL | (system/FetchContent) | SRP-6a, cifrado |
| Boost.Thread | (FetchContent) | Red Asio (corrutinas C++20) |
| GoogleTest | 1.14.0 | Pruebas unitarias e integración |
| spdlog | 1.14.1 | Registro |
| MariaDB Connector/C | 3.3.8 | Cliente MySQL |
| MariaDB Connector/C++ | 1.1.7 | MySQL C++ |
| nlohmann/json | 3.11.2 | Análisis JSON |
| yaml-cpp | 0.8.0 | Configuración YAML |
| Lua | 5.4.7 | Scripting de juego |
| FTXUI | 5.0.0 | Interfaz de consola |
| StormLib | 9.26 | Archivos MPQ (extractores) |

</span>

## <span class="lang-en">Cross-Platform</span><span class="lang-es">Multiplataforma</span>

<span class="lang-en">

- **Windows**: MSVC or MinGW
- **Linux**: GCC or Clang
- **macOS**: Apple Clang

Use `std::filesystem` for paths and `std::thread` for threading. Platform `#ifdef` only in infrastructure adapters when unavoidable.

</span>
<span class="lang-es">

- **Windows**: MSVC o MinGW
- **Linux**: GCC o Clang
- **macOS**: Apple Clang

Usar `std::filesystem` para rutas y `std::thread` para hilos. `#ifdef` de plataforma solo en adaptadores de infrastructure cuando sea inevitable.

</span>

## <span class="lang-en">Project Layout</span><span class="lang-es">Estructura del Proyecto</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| Ruta | Contenido |
|------|-----------|
| `src/` | Todo el código C++ (capas + ejecutables) |
| `tests/` | Pruebas unitarias e integración (~90 archivos) |
| `sql/init/` | Esquema base por base de datos |
| `sql/migrations/` | Migraciones incrementales (~26 archivos) |
| `sql/bundled/` | Bundles de despliegue fusionados |
| `scripts/lua/` | Scripts Lua de gameplay |
| `tools/extractors/` | Extractores de datos del cliente |
| `tools/vmap/` | Pipeline VMap (map_extractor, vmap4_*) |
| `data/` | Referencia de ruta DBC del cliente |
| `docker/` | Grants de init MySQL |

</span>
