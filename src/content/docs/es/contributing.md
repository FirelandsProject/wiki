---
title: 'Contribuir'
description: 'Flujo de desarrollo, estándares de código y directrices para pull requests'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Contribuir

Esta guía describe cómo contribuir a **firelands-next**, incluyendo el flujo de desarrollo, estándares de codificación y buenas prácticas.

## Prerrequisitos

Antes de contribuir, comprende:

1. **Arquitectura hexagonal** — [Arquitectura](/wiki/es/docs/architecture/) y [guías de módulos](/wiki/es/docs/modules-shared/)
2. **Flujo TDD** — [Pruebas](/wiki/es/docs/testing/)
3. **Sistema de build** — CMake + Ninja ([Configuración del desarrollador](/wiki/es/docs/developer-setup/))
4. **Idioma** — Todo el código, comentarios y commits de git en **inglés**

## Flujo de desarrollo

### 1. Encontrar trabajo

- Revisa el [Roadmap](/wiki/es/docs/roadmap/) para funcionalidades planificadas
- Busca issues en GitHub etiquetados como `good first issue`
- Revisa lagunas de documentación en esta wiki

### 2. Comenzar el trabajo

```bash
git checkout -b feature/my-new-feature
# o
git checkout -b fix/description-of-bug
```

Nomenclatura de ramas:

| Prefijo | Uso |
|---------|-----|
| `feature/` | Nuevas funcionalidades |
| `fix/` | Correcciones de bugs |
| `refactor/` | Refactorización de código |
| `docs/` | Solo documentación |

### 3. Proceso de desarrollo

1. **Escribe pruebas primero** (TDD)
2. Implementa la funcionalidad
3. Verifica que las pruebas pasen: `ctest --test-dir build`
4. Haz commit con mensajes claros
5. Abre un pull request

### 4. Mensajes de commit

```
<type>(<scope>): <description>

[cuerpo opcional]
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`

Ejemplos:

```
feat(auth): add SRP6a password reset flow
fix(world): correct spell damage for area spells
docs(database): document new migration schema
```

## Estándares de código

### Estilo C++

| Regla | Convención |
|-------|------------|
| Estándar | C++20 |
| Variables / funciones | `snake_case` |
| Tipos / clases | `PascalCase` |
| Constantes / enums | `UPPER_SNAKE_CASE` |
| Nombres de archivo | `kebab-case` |

### Reglas de arquitectura

**Dirección de dependencias:**

```
Infrastructure → Application → Domain → Shared
```

- `domain/` **no debe** importar de `application/` ni `infrastructure/`
- Usa **ports** (interfaces) en domain/application; implementa **adapters** en infrastructure
- Application depende solo de domain + shared — sin headers concretos de MySQL o Boost.Asio

### Logging

Siempre incluye spdlog vía `<shared/Logger.h>`:

```cpp
#include <shared/Logger.h>

LOG_INFO("Player {} logged in from {}", player.GetName(), ip_address);
```

### Manejo de errores

- Excepciones para situaciones excepcionales
- `std::optional<T>` cuando una operación puede legítimamente no encontrar nada
- Nunca concatenes cadenas SQL — usa consultas parametrizadas en infrastructure

## Estándares SQL

- Coloca migraciones en `sql/migrations/` con prefijos numéricos (`001_`, `002_`, …)
- Usa operaciones idempotentes (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`)
- Nunca `DROP TABLE` en migraciones
- Regenera el SQL bundled tras cambios de esquema: `cmake --build build --target merge-migrations`

## Estándares Lua

- Scripts en `scripts/lua/`
- Nombres de archivo descriptivos: `npc_9001_boss_karax.lua`
- Envuelve código riesgoso en `pcall`; agrupa handlers en tablas
- Consulta [Scripting Lua](/wiki/es/docs/lua-scripting/)

## Estándares de pruebas

- GoogleTest + GMock
- Un comportamiento por prueba; patrón AAA (Arrange, Act, Assert)
- Simula repository ports al probar application services
- Consulta [Pruebas](/wiki/es/docs/testing/)

## Tipos comunes de contribución

### Añadir una funcionalidad

1. Modelo de dominio (si es necesario)
2. Repository port + adapter de infrastructure
3. Application service
4. Conectar handlers (infrastructure)
5. Pruebas unitarias
6. Documentación en la wiki

### Añadir un comando GM

1. `Permission` en `shared/game/Permissions.h`
2. Registrar en `CommandService.cpp`
3. Implementar en `WorldSession` vía `ICommandSession`
4. Documentar en [Comandos GM](/wiki/es/docs/gm-commands/)

### Añadir una migración de base de datos

1. `sql/migrations/NNN_description.sql`
2. Actualizar modelos/repositorios C++ si es necesario
3. Ejecutar `merge-migrations` y probar en MySQL con Docker
4. Actualizar [Base de datos](/wiki/es/docs/database/)

## Revisión de código

**Revisores:** enfócate en lógica, arquitectura y estilo; sé constructivo.

**Autores:** responde a comentarios; mantén los PRs enfocados y de tamaño razonable.

## Obtener ayuda

- Esta wiki y `docs/` en el repositorio **firelands-next**
- Issues y discussions en GitHub
- Clon de implementación de referencia (`firelands-cata-ref/`, build 15595) para paridad de paquetes
