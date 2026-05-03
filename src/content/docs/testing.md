---
title: 'Testing'
description: 'Testing strategies and workflows'
pubDate: '2025-01-01'
---

# Testing

Firelands follows **Test-Driven Development (TDD)** for code quality.

## Testing Framework

- **Framework**: GoogleTest (gtest/gmock)
- **Location**: `tests/unit/`

## Building Tests

```bash
cmake -B build -G Ninja -DFIRELANDS_BUILD_TESTS=ON
ninja -C build
```

## Running Tests

```bash
# Run all tests
ctest --test-dir build

# Run tests matching pattern
ctest --test-dir build -R <pattern>

# Run specific test
ctest --test-dir build -R CharacterService
```

## Test Structure

Tests are organized by layer:
- `tests/unit/domain/` - Domain entity tests
- `tests/unit/application/` - Service tests
- `tests/unit/infrastructure/` - Adapter tests
- `tests/unit/shared/` - Shared utilities tests

## TDD Workflow

1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Clean up while keeping tests green

## Example Test

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

## Mocking

Use GMock to create mock implementations:

```cpp
#include <gmock/gmock.h>
#include "CharacterRepository.h"

class MockCharacterRepository : public ICharacterRepository {
public:
    MOCK_METHOD(std::optional<Character>, FindById, (uint32 id), (override));
    MOCK_METHOD(bool, Save, (const Character& character), (override));
};
```