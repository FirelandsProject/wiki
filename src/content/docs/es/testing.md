---
title: 'Pruebas'
description: 'Flujo TDD, GoogleTest y estructura de pruebas'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Pruebas

Firelands sigue el **Desarrollo Guiado por Pruebas (TDD)** para todo comportamiento nuevo: escribir primero una prueba que falle, implementar el mínimo para pasar, luego refactorizar.

## Framework de Pruebas

- **Framework**: GoogleTest 1.14.0 + GMock
- **Binario**: `FirelandsUnitTests` (se construye por defecto)
- **Ubicación**: `tests/`

## Construir Pruebas
```bash
ninja -C build FirelandsUnitTests
```

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
ctest --test-dir build

# Ejecutar pruebas que coincidan con el patrón
ctest --test-dir build -R <pattern>

# Ejecutar suite específica
ctest --test-dir build -R CharacterService
```

## Estructura de Pruebas

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

## Flujo de TDD

1. **Rojo**: Escribir una prueba que falle describiendo el comportamiento deseado
2. **Verde**: Escribir el código mínimo para que pase
3. **Refactorizar**: Limpiar manteniendo todas las pruebas verdes

Coloca las pruebas en la capa que posee el comportamiento. Simula ports de repositorio con GMock al probar servicios de application aisladamente.

## Ejemplo de Prueba
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

## Mocking

Usa GMock para crear implementaciones mock de ports de dominio:

```cpp
#include <gmock/gmock.h>
#include "CharacterRepository.h"

class MockCharacterRepository : public ICharacterRepository {
public:
    MOCK_METHOD(std::optional<Character>, FindById, (uint32 id), (override));
    MOCK_METHOD(bool, Save, (const Character& character), (override));
};
```

## Qué Probar

| Capa | Ejemplos |
|------|----------|
| **Domain** | Fórmulas de combate, reglas de auras, transiciones de estado |
| **Application** | Orquestación de servicios con ports simulados |
| **Infrastructure** | Round-trip de paquetes wire, consultas SQL, eventos Lua |
| **Shared** | Lectura/escritura ByteBuffer, opcodes, parsing de config |
