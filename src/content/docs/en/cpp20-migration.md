---
title: 'C++20 Migration'
description: 'Toolchain upgrade plan — Phase 1 complete, Phase 2 feature adoption'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# C++20 migration plan

Implementation plan for raising firelands-next from C++17 to **C++20**.

**Status:** Phase 1 **complete** (2026-05-18) — `CMAKE_CXX_STANDARD 20` at root; tool targets use `cxx_std_20`. Phase 2 (incremental feature adoption) **open**.

## Phase 1 checklist ✅

- [x] Root `CMakeLists.txt`: `CMAKE_CXX_STANDARD 20`
- [x] All tool `CMakeLists.txt`: `cxx_std_20`
- [x] Developer docs and agent guidance updated
- [x] `SPDLOG_USE_STD_FORMAT` (bundled fmt in spdlog 1.14.1 fails on C++20 / Apple Clang)
- [x] Trial build: `auth` + `world` on macOS
- [x] `std::span` on `ByteBuffer` (`Append`/`Read`/`AsSpan`/`UnreadSpan`)
- [x] Boost.Asio C++20 coroutines across `infrastructure/network/`
- [ ] Trial builds on full compiler matrix (Linux GCC/Clang, Windows MSVC)
- [ ] Phase 2 remaining: designated initializers, `using enum`

## Goals

| Goal | Rationale |
|------|-----------|
| Single standard | One `CMAKE_CXX_STANDARD` for auth, world, libraries, tests, tools |
| Safer code | C++20 features reduce bugs without changing architecture |
| Portability | Windows (MSVC/MinGW), Linux (GCC/Clang), macOS (Apple Clang) |
| Incremental rollout | Flag flip first, features in follow-up PRs |

## Non-goals

- C++23 migration
- Large refactors “because C++20 allows it”
- Mandatory `std::format` everywhere (keep spdlog fmt-style initially)
- Changing third-party C APIs (MariaDB, Lua, StormLib boundaries)

## Why migrate

| Area | C++20 benefit |
|------|---------------|
| Network / packets | `std::span<const std::byte>` — fewer raw pointer + length pairs |
| Domain / ports | `concept` for test constraints (optional) |
| Boilerplate | Designated initializers; `using enum` for opcodes |
| Concurrency | `std::jthread` + stop tokens for new workers |
| Network I/O | Coroutines replace callback chains ( **done** in infrastructure/network ) |

## Compiler matrix (target)

| Platform | Compiler | Minimum |
|----------|----------|---------|
| Linux | GCC | 12 |
| Linux | Clang | 15 |
| macOS | Apple Clang | 15 (Xcode 15+) |
| Windows | MSVC | VS 2022 17.4+ |
| Windows | MinGW | GCC 12+ UCRT |

## Phase 2 — Feature adoption (incremental)

| Priority | Feature | Where |
|----------|---------|-------|
| P1 ✅ | `std::span` | `shared/network/`, `ByteBuffer` |
| P1 | Designated initializers | New structs in `domain/`, config DTOs |
| P2 | `using enum` | Opcode headers in `shared/network` |
| P2 | `constexpr` expansion | Packet sizes, magic constants |
| P3 | `std::ranges` | New code only |
| P3 | `std::format` | Non-hot-path formatting |
| P4 | `concept` | Test doubles in `tests/unit/` |
| P4 | `std::jthread` | New background tasks only |

### Coroutines (network — complete)

All `src/infrastructure/network/` I/O uses `co_await` via `AsioAwaitables.h`:

| Component | Patterns |
|-----------|----------|
| `AsyncNetworkServer` | `AcceptLoop` |
| `AuthSession` | `ReadLoop`, `WriteLoop` |
| `WorldSession` | `ReadLoop`, `WriteLoop`, `TimeSyncLoop`, deferred spell `co_await` |
| `RestAuthServer` | `async_read` / `async_write` |
| `RealmLinkSession` / `RealmLinkOutbound` | Read/write + ping loops |

## Dependency notes

| Dependency | C++20 risk | Mitigation |
|------------|------------|------------|
| spdlog 1.14.1 | Medium | `SPDLOG_USE_STD_FORMAT` |
| FTXUI 5.0.0 | Medium | Trial-build consoles |
| GoogleTest, yaml-cpp, MariaDB, Lua, StormLib | Low | C API boundaries unchanged |

## Coding guidelines (post-migration)

1. New code may use Phase 2 features; do not mass-restylize working C++17
2. Hexagonal rules **unchanged** — no infra headers in `domain/`
3. PCH: add C++20 headers to `PROJECT_PCH_HEADERS` only if measured win
4. Reviews: reject C++20-only restyle without measurable benefit

## Rollback

Revert Phase 1 PR (CMake + doc flags) — code without C++20-only syntax compiles as C++17 again.

## Related

- [Developer Setup](/wiki/docs/developer-setup/)
- [Contributing](/wiki/docs/contributing/)
- [Tools & build](/wiki/docs/modules-tools-build/)
