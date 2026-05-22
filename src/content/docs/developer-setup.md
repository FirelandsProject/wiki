---
title: 'Developer Setup'
description: 'How to set up the development environment'
pubDate: '2025-01-01'
updatedDate: '2026-05-21'
---

# <span class="lang-en">Developer Setup</span><span class="lang-es">Configuración de Desarrollador</span>

## <span class="lang-en">Prerequisites</span><span class="lang-es">Prerrequisitos</span>

<span class="lang-en">

- CMake 3.20+
- C++20 compiler (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- Ninja build system
- Python 3.8+ (SQL merge scripts)
- MySQL 8.0 (via Docker)
- Git

</span>
<span class="lang-es">

- CMake 3.20+
- Compilador C++20 (Clang 15+, GCC 12+, MSVC 2022 17.4+)
- Sistema de construcción Ninja
- Python 3.8+ (scripts de fusión SQL)
- MySQL 8.0 (vía Docker)
- Git

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

Notes:
- **Generator**: MUST use Ninja (not Make)
- **ccache**: Auto-detected and enabled if installed

</span>
<span class="lang-es">

Notas:
- **Generador**: DEBE usar Ninja (no Make)
- **ccache**: Auto-detectado y habilitado si está instalado

</span>

### <span class="lang-en">3. Build</span><span class="lang-es">3. Construir</span>

```bash
ninja -C build                         # Full build
ninja -C build auth world              # Auth and world servers
ninja -C build FirelandsDevTools       # CLI account/realm tool
```

<span class="lang-en">

Full build / Build auth and world servers

</span>
<span class="lang-es">

Construcción completa / Construir servidores auth y world

</span>

### <span class="lang-en">4. Start Database</span><span class="lang-es">4. Iniciar Base de Datos</span>

```bash
docker-compose up -d db
```

<span class="lang-en">

Database credentials:
- MySQL: `mysql:8.0`
- Port: `3306`
- Root: `root/root`
- User: `firelands/firelands`
- Databases: `firelands_auth`, `firelands_characters`, `firelands_world`

</span>
<span class="lang-es">

Credenciales de base de datos:
- MySQL: `mysql:8.0`
- Puerto: `3306`
- Root: `root/root`
- Usuario: `firelands/firelands`
- Bases de datos: `firelands_auth`, `firelands_characters`, `firelands_world`

</span>

### <span class="lang-en">5. Run Servers</span><span class="lang-es">5. Ejecutar Servidores</span>

```bash
./build/bin/auth    # Auth server (config: authserver.yaml)
./build/bin/world   # World server (config: worldserver.yaml)
```

<span class="lang-en">

Override config paths with `FIRELANDS_AUTH_CONFIG` and `FIRELANDS_WORLD_CONFIG`. Both servers use an FTXUI-based interactive console when attached to a TTY.

</span>
<span class="lang-es">

Sobrescribe la configuración con `FIRELANDS_AUTH_CONFIG` y `FIRELANDS_WORLD_CONFIG`. Ambos servidores usan consola interactiva FTXUI cuando hay TTY.

</span>

<span class="lang-en">

Auth server / World server

</span>
<span class="lang-es">

Servidor auth / Servidor world

</span>

## <span class="lang-en">Building Tests</span><span class="lang-es">Construir Pruebas</span>

```bash
cmake -B build -G Ninja -DFIRELANDS_BUILD_TESTS=ON
ninja -C build
ctest --test-dir build           # Run all tests
ctest --test-dir build -R <pattern>  # Run specific tests
```

<span class="lang-en">

Run all tests / Run specific tests

</span>
<span class="lang-es">

Ejecutar todas las pruebas / Ejecutar pruebas específicas

</span>

## <span class="lang-en">Dependencies (Fetched via CMake)</span><span class="lang-es">Dependencias (Obtenidas vía CMake)</span>

<span class="lang-en">

| Library | Version | Purpose |
|---------|---------|---------|
| Boost | (system) | Asio networking (C++20 coroutines) |
| GoogleTest | 1.14.0 | Testing |
| spdlog | 1.14.1 | Logging |
| MariaDB Connector/C | 3.3.8 | MySQL client |
| MariaDB Connector/C++ | 1.1.7 | MySQL C++ |
| nlohmann/json | 3.11.2 | JSON parsing |
| yaml-cpp | 0.8.0 | YAML config |
| Lua | 5.4.7 | Gameplay scripting |
| FTXUI | 5.0.0 | Console UI |
| StormLib | 9.26 | MPQ archive handling |

</span>
<span class="lang-es">

| Librería | Versión | Propósito |
|---------|---------|----------|
| Boost | (sistema) | Red Asio (corrutinas C++20) |
| GoogleTest | 1.14.0 | Pruebas |
| spdlog | 1.14.1 | Registro |
| MariaDB Connector/C | 3.3.8 | Cliente MySQL |
| MariaDB Connector/C++ | 1.1.7 | MySQL C++ |
| nlohmann/json | 3.11.2 | Análisis JSON |
| yaml-cpp | 0.8.0 | Configuración YAML |
| Lua | 5.4.7 | Scripting de juego |
| FTXUI | 5.0.0 | Interfaz de consola |
| StormLib | 9.26 | Manejo de archivos MPQ |

</span>

## <span class="lang-en">Cross-Platform</span><span class="lang-es">Multiplataforma</span>

<span class="lang-en">

- **Windows**: MSVC or MinGW
- **Linux**: GCC or Clang
- **macOS**: Clang (Apple Clang)

Use `std::filesystem` for paths and `std::thread` for threading.

</span>
<span class="lang-es">

- **Windows**: MSVC o MinGW
- **Linux**: GCC o Clang
- **macOS**: Clang (Apple Clang)

Usar `std::filesystem` para rutas y `std::thread` para hilos.

</span>