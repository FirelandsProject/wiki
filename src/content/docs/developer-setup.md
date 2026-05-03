---
title: 'Developer Setup'
description: 'How to set up the development environment'
pubDate: '2025-01-01'
---

# Developer Setup

## Prerequisites

- CMake 3.10+
- C++17 compliant compiler (GCC, Clang, MSVC)
- Ninja build system
- MySQL 8.0 (via Docker)
- Git

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

Notes:
- **Generator**: MUST use Ninja (not Make)
- **ccache**: Auto-detected and enabled if installed

### 3. Build

```bash
ninja -C build                    # Full build
ninja -C build auth world         # Build auth and world servers
```

### 4. Start Database

```bash
docker-compose up -d db
```

Database credentials:
- MySQL: `mysql:8.0`
- Port: `3306`
- Root: `root/root`
- User: `firelands/firelands`
- Databases: `auth`, `characters`, `world`

### 5. Run Servers

```bash
./build/bin/auth    # Auth server
./build/bin/world   # World server
```

## Building Tests

```bash
cmake -B build -G Ninja -DFIRELANDS_BUILD_TESTS=ON
ninja -C build
ctest --test-dir build           # Run all tests
ctest --test-dir build -R <pattern>  # Run specific tests
```

## Dependencies (Fetched via CMake)

| Library | Version | Purpose |
|---------|---------|---------|
| Boost | (system) | Threading |
| GoogleTest | 1.14.0 | Testing |
| spdlog | 1.14.1 | Logging |
| MariaDB Connector/C | 3.3.8 | MySQL client |
| MariaDB Connector/C++ | 1.1.7 | MySQL C++ |
| nlohmann/json | 3.11.2 | JSON parsing |
| yaml-cpp | 0.8.0 | YAML config |
| Lua | 5.4.7 | Gameplay scripting |
| FTXUI | 5.0.0 | Console UI |
| StormLib | 9.26 | MPQ archive handling |

## Cross-Platform

- **Windows**: MSVC or MinGW
- **Linux**: GCC or Clang
- **macOS**: Clang (Apple Clang)

Use `std::filesystem` for paths and `std::thread` for threading.