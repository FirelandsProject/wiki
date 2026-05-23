---
title: 'Migración C++20'
description: 'Plan de actualización del toolchain — Fase 1 completa, adopción de features Fase 2'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Plan de migración C++20

Plan de implementación para elevar firelands-next de C++17 a **C++20**.

**Estado:** Fase 1 **completa** (2026-05-18) — `CMAKE_CXX_STANDARD 20` en raíz; targets de tools usan `cxx_std_20`. Fase 2 (adopción incremental de features) **abierta**.

## Checklist Fase 1 ✅

- [x] `CMakeLists.txt` raíz: `CMAKE_CXX_STANDARD 20`
- [x] Todos los `CMakeLists.txt` de tools: `cxx_std_20`
- [x] Docs de desarrollador y guía de agentes actualizados
- [x] `SPDLOG_USE_STD_FORMAT` (fmt bundled en spdlog 1.14.1 falla en C++20 / Apple Clang)
- [x] Build de prueba: `auth` + `world` en macOS
- [x] `std::span` en `ByteBuffer` (`Append`/`Read`/`AsSpan`/`UnreadSpan`)
- [x] Coroutines Boost.Asio C++20 en `infrastructure/network/`
- [ ] Builds de prueba en matriz completa de compiladores (Linux GCC/Clang, Windows MSVC)
- [ ] Fase 2 restante: designated initializers, `using enum`

## Objetivos

| Objetivo | Justificación |
|----------|---------------|
| Estándar único | Un `CMAKE_CXX_STANDARD` para auth, world, bibliotecas, pruebas, tools |
| Código más seguro | Features C++20 reducen bugs sin cambiar arquitectura |
| Portabilidad | Windows (MSVC/MinGW), Linux (GCC/Clang), macOS (Apple Clang) |
| Despliegue incremental | Cambio de flag primero, features en PRs posteriores |

## No objetivos

- Migración C++23
- Refactors grandes "porque C++20 lo permite"
- `std::format` obligatorio en todas partes (mantener estilo fmt/spdlog inicialmente)
- Cambiar APIs C de terceros (límites MariaDB, Lua, StormLib sin cambios)

## Por qué migrar

| Área | Beneficio C++20 |
|------|-----------------|
| Red / paquetes | `std::span<const std::byte>` — menos pares puntero raw + longitud |
| Domain / ports | `concept` para restricciones de prueba (opcional) |
| Boilerplate | Designated initializers; `using enum` para opcodes |
| Concurrencia | `std::jthread` + stop tokens para nuevos workers |
| I/O de red | Coroutines reemplazan cadenas callback (**hecho** en infrastructure/network) |

## Matriz de compiladores (objetivo)

| Plataforma | Compilador | Mínimo |
|------------|------------|--------|
| Linux | GCC | 12 |
| Linux | Clang | 15 |
| macOS | Apple Clang | 15 (Xcode 15+) |
| Windows | MSVC | VS 2022 17.4+ |
| Windows | MinGW | GCC 12+ UCRT |

## Fase 2 — Adopción de features (incremental)

| Prioridad | Feature | Dónde |
|-----------|---------|-------|
| P1 ✅ | `std::span` | `shared/network/`, `ByteBuffer` |
| P1 | Designated initializers | Nuevos structs en `domain/`, DTOs de config |
| P2 | `using enum` | Headers opcode en `shared/network` |
| P2 | Expansión `constexpr` | Tamaños de paquete, constantes mágicas |
| P3 | `std::ranges` | Solo código nuevo |
| P3 | `std::format` | Formateo fuera de hot-path |
| P4 | `concept` | Test doubles en `tests/unit/` |
| P4 | `std::jthread` | Solo nuevas tareas en background |

### Coroutines (red — completo)

Todo I/O en `src/infrastructure/network/` usa `co_await` vía `AsioAwaitables.h`:

| Componente | Patrones |
|------------|----------|
| `AsyncNetworkServer` | `AcceptLoop` |
| `AuthSession` | `ReadLoop`, `WriteLoop` |
| `WorldSession` | `ReadLoop`, `WriteLoop`, `TimeSyncLoop`, hechizo diferido `co_await` |
| `RestAuthServer` | `async_read` / `async_write` |
| `RealmLinkSession` / `RealmLinkOutbound` | Bucles read/write + ping |

## Notas de dependencias

| Dependencia | Riesgo C++20 | Mitigación |
|-------------|--------------|------------|
| spdlog 1.14.1 | Medio | `SPDLOG_USE_STD_FORMAT` |
| FTXUI 5.0.0 | Medio | Trial-build consolas |
| GoogleTest, yaml-cpp, MariaDB, Lua, StormLib | Bajo | Límites API C sin cambios |

## Directrices de codificación (post-migración)

1. Código nuevo puede usar features Fase 2; no restilizar masivamente C++17 funcional
2. Reglas hexagonales **sin cambios** — sin headers infra en `domain/`
3. PCH: añadir headers C++20 a `PROJECT_PCH_HEADERS` solo si hay ganancia medida
4. Reviews: rechazar restyle solo-C++20 sin beneficio medible

## Rollback

Revertir PR Fase 1 (CMake + flags doc) — código sin sintaxis solo-C++20 compila como C++17 de nuevo.

## Relacionado

- [Configuración del desarrollador](/wiki/es/docs/developer-setup/)
- [Contribuir](/wiki/es/docs/contributing/)
- [Tools y build](/wiki/es/docs/modules-tools-build/)
