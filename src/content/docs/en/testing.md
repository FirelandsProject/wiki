---
title: 'Testing'
description: 'TDD workflow, GoogleTest, and test layout'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Testing

Firelands follows **Test-Driven Development (TDD)** for all new behavior: write a failing test first, implement the minimum code to pass, then refactor.

## Testing Framework

- **Framework**: GoogleTest 1.14.0 + GMock
- **Binary**: `FirelandsUnitTests` (built by default)
- **Location**: `tests/`

## Building Tests
```bash
ninja -C build FirelandsUnitTests
```

## Running Tests

```bash
# Run all tests
ctest --test-dir build

# Run tests matching pattern
ctest --test-dir build -R <pattern>

# Run specific test suite
ctest --test-dir build -R CharacterService
```

## Test Structure

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

## TDD Workflow

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Clean up while keeping all tests green

Place tests in the layer that owns the behavior. Mock repository ports with GMock when testing application services in isolation.

## Example Test
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

Use GMock to create mock implementations of domain ports:

```cpp
#include <gmock/gmock.h>
#include "CharacterRepository.h"

class MockCharacterRepository : public ICharacterRepository {
public:
    MOCK_METHOD(std::optional<Character>, FindById, (uint32 id), (override));
    MOCK_METHOD(bool, Save, (const Character& character), (override));
};
```

## What to Test

| Layer | Examples |
|-------|----------|
| **Domain** | Combat formulas, aura stacking rules, entity state transitions |
| **Application** | Service orchestration with mocked ports |
| **Infrastructure** | Wire packet round-trips, SQL adapter queries, Lua event firing |
| **Shared** | ByteBuffer read/write, opcode constants, config parsing |

## Assertions reference

| Assertion | Description |
|-----------|-------------|
| `EXPECT_EQ(a, b)` | Equality |
| `EXPECT_NE(a, b)` | Inequality |
| `EXPECT_TRUE(a)` / `EXPECT_FALSE(a)` | Boolean |
| `EXPECT_FLOAT_EQ(a, b)` | Approximate float |
| `EXPECT_THROW(code, type)` | Exception thrown |
| `EXPECT_CALL(mock, Method(...))` | GMock expectation |

## Best practices

- Name tests: `ClassName_Method_ExpectedBehavior`
- AAA pattern: Arrange, Act, Assert
- One behavior per test; keep tests independent
- Test edge cases: empty input, boundaries, invalid input
- Mock external I/O; use Docker MySQL for integration repository tests

## Code coverage (optional)

```bash
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug \
  -DCMAKE_CXX_FLAGS="-fprofile-arcs -ftest-coverage"
ninja -C build && ctest --test-dir build
# lcov + genhtml for HTML report
```

## Related

- [Contributing](/wiki/docs/contributing/) — TDD requirement
- [Tools & build](/wiki/docs/modules-tools-build/) — test targets
- [GoogleTest documentation](https://google.github.io/googletest/)
