---
title: 'Configuración de Desarrollador'
description: 'Entorno, compilación, configuración y despliegue'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Configuración de Desarrollador
## Prerrequisitos

- CMake 3.10+ (3.20+ recomendado)
- Compilador C++20 (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- Sistema de build **Ninja** (obligatorio — no usar Make)
- Python 3.8+ (scripts de fusión e importación SQL)
- MySQL 8.0 / MariaDB (Docker recomendado)
- Git
- Opcional: **ccache** (auto-detectado), **Docker** para base de datos

## Inicio Rápido
### 1. Clonar el Repositorio
```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
```

### 2. Configurar la Construcción
```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
```

- **Generador**: DEBE usar Ninja
- **ccache**: Auto-detectado si está instalado
- **Unity builds**: Opcional con `-DENABLE_UNITY_BUILD=ON`
- Las pruebas se construyen por defecto como `FirelandsUnitTests`

### 3. Construir
```bash
ninja -C build                         # Full build + tests
ninja -C build auth world              # Auth and world servers
ninja -C build FirelandsDevTools       # CLI account/realm tool
```

### 4. Iniciar Base de Datos
```bash
docker-compose up -d db
```

Credenciales (Docker):

| Ajuste | Valor |
|--------|-------|
| Imagen | `mysql:8.0` |
| Puerto | `3306` |
| Root | `root` / `root` |
| Usuario app | `firelands` / `firelands` |
| Bases de datos | `firelands_auth`, `firelands_characters`, `firelands_world` |

En el primer arranque se cargan automáticamente los SQL bundled de `sql/bundled/`.

### 5. Ejecutar Servidores
```bash
./build/bin/auth    # Auth server (config: authserver.yaml)
./build/bin/world   # World server (config: worldserver.yaml)
```

Sobrescribir configuración:

```bash
export FIRELANDS_AUTH_CONFIG=/path/to/authserver.yaml
export FIRELANDS_WORLD_CONFIG=/path/to/worldserver.yaml
```

Ambos servidores usan **consola interactiva FTXUI** con TTY. Logs por defecto en `logs/firelands-auth.log` y `logs/firelands-world.log`.

## Archivos de Configuración
### `authserver.yaml`

| Sección | Propósito |
|---------|-----------|
| `Network.Port` | Puerto TCP auth (por defecto 3724) |
| `Network.RestPort` | Puerto REST login (por defecto 8081) |
| `RealmLink.*` | Listener realm-link opcional para métricas en vivo |
| `Database.*` | URI JDBC de base auth |
| `Log.*` | Rotación de archivos, nivel de log |

### `worldserver.yaml`

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

## Construir Pruebas
```bash
ninja -C build FirelandsUnitTests
ctest --test-dir build           # Run all tests
ctest --test-dir build -R <pattern>  # Run specific tests
```

## Herramientas SQL
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

## Dependencias (Obtenidas vía CMake)

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

## Multiplataforma

- **Windows**: MSVC o MinGW
- **Linux**: GCC o Clang
- **macOS**: Apple Clang

Usar `std::filesystem` para rutas y `std::thread` para hilos. `#ifdef` de plataforma solo en adaptadores de infrastructure cuando sea inevitable.

## Estructura del Proyecto

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

## Prerrequisitos por plataforma

### macOS

```bash
brew install cmake ninja python3 git mariadb
brew install ccache   # opcional
docker-compose up -d db
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y cmake ninja-build python3 git mariadb-server libmariadb-dev zlib1g-dev libbz2-dev liblua5.4-dev
```

### Windows

Visual Studio 2022+, CMake, Ninja, Docker Desktop.

## Integración con IDE

- **VSCode:** extensión C/C++ + `.clangd`; `compile_commands.json` generado por CMake
- **CLion:** abrir `CMakeLists.txt` como modelo de proyecto

## Tareas comunes

Ver [Contribuir](/wiki/es/docs/contributing/) para migraciones, comandos GM y flujo TDD.

```bash
./build/bin/FirelandsDevTools account admin password admin@example.com 3
./build/bin/FirelandsDevTools realm 1 "Firelands Test" 127.0.0.1 8085
```

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Errores de build / PCH | `rm -rf build && cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug` |
| Conexión BD | `docker-compose ps`; credenciales en YAML |
| Cliente no conecta | Cliente **4.3.4 build 15595**; puertos 3724 y 8085 |

## Siguientes pasos

- [Arquitectura](/wiki/es/docs/architecture/) y [módulos](/wiki/es/docs/modules-shared/)
- [Base de Datos](/wiki/es/docs/database/)
- [Roadmap](/wiki/es/docs/roadmap/)
