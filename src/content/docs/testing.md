---
title: 'Testing'
description: 'Testing strategies and workflows'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Testing</span><span class="lang-es">Pruebas</span>

<span class="lang-en">

Firelands follows **Test-Driven Development (TDD)** for all new behavior: write a failing test first, implement the minimum code to pass, then refactor.

</span>
<span class="lang-es">

Firelands sigue el **Desarrollo Guiado por Pruebas (TDD)** para todo comportamiento nuevo: escribir primero una prueba que falle, implementar el mínimo para pasar, luego refactorizar.

</span>

## <span class="lang-en">Testing Framework</span><span class="lang-es">Framework de Pruebas</span>

<span class="lang-en">

- **Framework**: GoogleTest 1.14.0 + GMock
- **Binary**: `FirelandsUnitTests` (built by default)
- **Location**: `tests/`

</span>
<span class="lang-es">

- **Framework**: GoogleTest 1.14.0 + GMock
- **Binario**: `FirelandsUnitTests` (se construye por defecto)
- **Ubicación**: `tests/`

</span>

## <span class="lang-en">Building Tests</span><span class="lang-es">Construir Pruebas</span>

```bash
ninja -C build FirelandsUnitTests
```

## <span class="lang-en">Running Tests</span><span class="lang-es">Ejecutar Pruebas</span>

<span class="lang-en">

```bash
# Run all tests
ctest --test-dir build

# Run tests matching pattern
ctest --test-dir build -R <pattern>

# Run specific test suite
ctest --test-dir build -R CharacterService
```

</span>
<span class="lang-es">

```bash
# Ejecutar todas las pruebas
ctest --test-dir build

# Ejecutar pruebas que coincidan con el patrón
ctest --test-dir build -R <pattern>

# Ejecutar suite específica
ctest --test-dir build -R CharacterService
```

</span>

## <span class="lang-en">Test Structure</span><span class="lang-es">Estructura de Pruebas</span>

<span class="lang-en">

```
tests/
├── unit/
│   ├── shared/           # ByteBuffer, wire formats, GUIDs, config
│   ├── domain/           # Domain entity and combat logic
│   ├── application/      # Services (Auth, Character, Command, Spell)
│   ├── infrastructure/   # MySQL adapters, Lua host, network sessions
│   └── combat/           # Combat engine, damage, threat
├── integration/
│   └── combat/           # End-to-end combat scenarios
├── fixtures/vmap/        # VMap test fixtures
└── data/                 # YAML and test data files
```

Approximately **90 test files** cover SRP/auth flows, character services, spell effects, gossip packets, GM tickets, movement checks, permissions, and wire format encoding.

MySQL repository tests benefit from a running Docker MySQL instance.

</span>
<span class="lang-es">

```
tests/
├── unit/
│   ├── shared/           # ByteBuffer, wire formats, GUIDs, config
│   ├── domain/           # Entidades de dominio y combate
│   ├── application/      # Servicios (Auth, Character, Command, Spell)
│   ├── infrastructure/   # Adaptadores MySQL, host Lua, sesiones de red
│   └── combat/           # Motor de combate, daño, amenaza
├── integration/
│   └── combat/           # Escenarios de combate end-to-end
├── fixtures/vmap/        # Fixtures VMap
└── data/                 # YAML y datos de prueba
```

Aproximadamente **90 archivos de prueba** cubren flujos SRP/auth, servicios de personaje, efectos de hechizo, paquetes gossip, tickets GM, movimiento, permisos y codificación wire.

Las pruebas de repositorios MySQL se benefician de una instancia Docker MySQL en ejecución.

</span>

## <span class="lang-en">TDD Workflow</span><span class="lang-es">Flujo de TDD</span>

<span class="lang-en">

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Clean up while keeping all tests green

Place tests in the layer that owns the behavior. Mock repository ports with GMock when testing application services in isolation.

</span>
<span class="lang-es">

1. **Rojo**: Escribir una prueba que falle describiendo el comportamiento deseado
2. **Verde**: Escribir el código mínimo para que pase
3. **Refactorizar**: Limpiar manteniendo todas las pruebas verdes

Coloca las pruebas en la capa que posee el comportamiento. Simula ports de repositorio con GMock al probar servicios de application aisladamente.

</span>

## <span class="lang-en">Example Test</span><span class="lang-es">Ejemplo de Prueba</span>

```cpp
#include <gtest/gtest.h>
#include "CharacterService.h"

class CharacterServiceTest : public ::testing::Test {
protected:
    CharacterService service;
};

TEST_F(CharacterServiceTest, CreateCharacter_Success) {
    PlayerCreateInfo createInfo;
    createInfo.race = RACE_HUMAN;
    createInfo.class_ = CLASS_WARRIOR;

    EXPECT_TRUE(service.CanCreateCharacter(createInfo));
}
```

## <span class="lang-en">Mocking</span><span class="lang-es">Mocking</span>

<span class="lang-en">

Use GMock to create mock implementations of domain ports:

</span>
<span class="lang-es">

Usa GMock para crear implementaciones mock de ports de dominio:

</span>

```cpp
#include <gmock/gmock.h>
#include "CharacterRepository.h"

class MockCharacterRepository : public ICharacterRepository {
public:
    MOCK_METHOD(std::optional<Character>, FindById, (uint32 id), (override));
    MOCK_METHOD(bool, Save, (const Character& character), (override));
};
```

## <span class="lang-en">What to Test</span><span class="lang-es">Qué Probar</span>

<span class="lang-en">

| Layer | Examples |
|-------|----------|
| **Domain** | Combat formulas, aura stacking rules, entity state transitions |
| **Application** | Service orchestration with mocked ports |
| **Infrastructure** | Wire packet round-trips, SQL adapter queries, Lua event firing |
| **Shared** | ByteBuffer read/write, opcode constants, config parsing |

</span>
<span class="lang-es">

| Capa | Ejemplos |
|------|----------|
| **Domain** | Fórmulas de combate, reglas de auras, transiciones de estado |
| **Application** | Orquestación de servicios con ports simulados |
| **Infrastructure** | Round-trip de paquetes wire, consultas SQL, eventos Lua |
| **Shared** | Lectura/escritura ByteBuffer, opcodes, parsing de config |

</span>
