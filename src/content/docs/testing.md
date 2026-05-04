---
title: 'Testing'
description: 'Testing strategies and workflows'
pubDate: '2025-01-01'
---

# <span class="lang-en">Testing</span><span class="lang-es">Pruebas</span>

<span class="lang-en">

Firelands follows **Test-Driven Development (TDD)** for code quality.

</span>
<span class="lang-es">

Firelands sigue el **Desarrollo Guiado por Pruebas (TDD)** para la calidad del código.

</span>

## <span class="lang-en">Testing Framework</span><span class="lang-es">Framework de Pruebas</span>

<span class="lang-en">

- **Framework**: GoogleTest (gtest/gmock)
- **Location**: `tests/unit/`

</span>
<span class="lang-es">

- **Framework**: GoogleTest (gtest/gmock)
- **Ubicación**: `tests/unit/`

</span>

## <span class="lang-en">Building Tests</span><span class="lang-es">Construir Pruebas</span>

```bash
cmake -B build -G Ninja -DFIRELANDS_BUILD_TESTS=ON
ninja -C build
```

## <span class="lang-en">Running Tests</span><span class="lang-es">Ejecutar Pruebas</span>

<span class="lang-en">

```bash
# Run all tests
ctest --test-dir build

# Run tests matching pattern
ctest --test-dir build -R <pattern>

# Run specific test
ctest --test-dir build -R CharacterService
```

</span>
<span class="lang-es">

```bash
# Ejecutar todas las pruebas
ctest --test-dir build

# Ejecutar pruebas que coincidan con el patrón
ctest --test-dir build -R <pattern>

# Ejecutar prueba específica
ctest --test-dir build -R CharacterService
```

</span>

## <span class="lang-en">Test Structure</span><span class="lang-es">Estructura de Pruebas</span>

<span class="lang-en">

Tests are organized by layer:
- `tests/unit/domain/` - Domain entity tests
- `tests/unit/application/` - Service tests
- `tests/unit/infrastructure/` - Adapter tests
- `tests/unit/shared/` - Shared utilities tests

</span>
<span class="lang-es">

Las pruebas se organizan por capa:
- `tests/unit/domain/` - Pruebas de entidades del dominio
- `tests/unit/application/` - Pruebas de servicios
- `tests/unit/infrastructure/` - Pruebas de adaptadores
- `tests/unit/shared/` - Pruebas de utilidades compartidas

</span>

## <span class="lang-en">TDD Workflow</span><span class="lang-es">Flujo de TDD</span>

<span class="lang-en">

1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Clean up while keeping tests green

</span>
<span class="lang-es">

1. **Rojo**: Escribir prueba que falle primero
2. **Verde**: Escribir código mínimo para pasar
3. **Refactorizar**: Limpiar manteniendo las pruebas verdes

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
    // Arrange
    PlayerCreateInfo createInfo;
    createInfo.race = RACE_HUMAN;
    createInfo.class_ = CLASS_WARRIOR;
    
    // Act & Assert
    EXPECT_TRUE(service.CanCreateCharacter(createInfo));
}
```

<span class="lang-en">

Arrange / Act & Assert

</span>
<span class="lang-es">

Preparar / Actuar & Verificar

</span>

## <span class="lang-en">Mocking</span><span class="lang-es">Mocking</span>

<span class="lang-en">

Use GMock to create mock implementations:

</span>
<span class="lang-es">

Usar GMock para crear implementaciones mock:

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