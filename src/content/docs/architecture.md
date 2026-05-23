---
title: 'Architecture'
description: 'Hexagonal architecture, layers, ports, and domain model'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Hexagonal Architecture</span><span class="lang-es">Arquitectura Hexagonal</span>

<span class="lang-en">

**firelands-next** implements **Hexagonal Architecture** (Ports & Adapters). Business rules live at the center; databases, sockets, Lua, and DBC files plug in through interfaces. The client target is **WoW Cataclysm 4.3.4 (build 15595)**.

</span>
<span class="lang-es">

**firelands-next** implementa la **Arquitectura Hexagonal** (Ports & Adapters). Las reglas de negocio están en el centro; bases de datos, sockets, Lua y archivos DBC se conectan mediante interfaces. El cliente objetivo es **WoW Cataclysm 4.3.4 (build 15595)**.

</span>

## <span class="lang-en">Core Definitions</span><span class="lang-es">Definiciones Clave</span>

<span class="lang-en">

| Term | Meaning in Firelands |
|------|---------------------|
| **Port** | Abstract interface the core depends on (e.g. `ICharacterRepository`, `IGameScriptHost`). Domain and application layers define ports; infrastructure implements them. |
| **Adapter** | Concrete implementation of a port (e.g. `MySqlCharacterRepository`, `LuaGameScriptHost`). Lives in `infrastructure/`. |
| **Entity** | Mutable object with identity and lifecycle (e.g. `Player`, `Creature`, `Character`). |
| **Value Object** | Immutable data without identity (e.g. coordinates, spell cooldown snapshots, GUID wrappers). |
| **Use Case / Service** | Application-layer orchestration (e.g. `CharacterService`, `CommandService`) that coordinates domain objects through ports. |
| **Composition Root** | Executable entry point (`auth`, `world`) that wires concrete adapters to ports at startup. |
| **Repository** | Port for persistence; domain declares `I*Repository`, infrastructure provides `MySql*`. |

</span>
<span class="lang-es">

| Término | Significado en Firelands |
|---------|-------------------------|
| **Port** | Interfaz abstracta de la que depende el núcleo (p. ej. `ICharacterRepository`, `IGameScriptHost`). Las capas domain y application definen ports; infrastructure los implementa. |
| **Adapter** | Implementación concreta de un port (p. ej. `MySqlCharacterRepository`, `LuaGameScriptHost`). Vive en `infrastructure/`. |
| **Entity** | Objeto mutable con identidad y ciclo de vida (p. ej. `Player`, `Creature`, `Character`). |
| **Value Object** | Dato inmutable sin identidad (p. ej. coordenadas, snapshots de cooldown, GUIDs). |
| **Use Case / Service** | Orquestación en application (p. ej. `CharacterService`, `CommandService`) que coordina el dominio vía ports. |
| **Composition Root** | Punto de entrada ejecutable (`auth`, `world`) que conecta adaptadores concretos a ports al arrancar. |
| **Repository** | Port de persistencia; domain declara `I*Repository`, infrastructure provee `MySql*`. |

</span>

## <span class="lang-en">Layer Structure</span><span class="lang-es">Estructura de Capas</span>

```
src/
├── shared/           # FirelandsShared — config, logging, crypto, DBC, wire formats
├── domain/           # FirelandsDomain — entities, world model, combat, repository ports
├── application/      # FirelandsApplication — use cases, services, application ports
├── infrastructure/   # FirelandsInfrastructure — MySQL, ASIO, Lua, DBC stores, REST
├── auth/             # Auth server composition root
├── world/            # World server composition root
└── tools/            # FirelandsDevTools CLI
```

<span class="lang-en">

**CMake link order:** `FirelandsShared` → `FirelandsDomain` → `FirelandsApplication` → `FirelandsInfrastructure` → executables.

</span>
<span class="lang-es">

**Orden de enlace CMake:** `FirelandsShared` → `FirelandsDomain` → `FirelandsApplication` → `FirelandsInfrastructure` → ejecutables.

</span>

## <span class="lang-en">Dependency Rule</span><span class="lang-es">Regla de Dependencias</span>

<span class="lang-en">

- `domain/` must **not** import from `application/` or `infrastructure/`.
- `application/` depends on `domain/` + `shared/` only — no concrete MySQL or Boost.Asio headers.
- External dependencies flow inward: **Infrastructure → Application → Domain → Shared**.
- Communication across boundaries uses abstract ports, injected at startup in `auth/main.cpp` and `world/main.cpp`.

</span>
<span class="lang-es">

- `domain/` **no** debe importar de `application/` ni `infrastructure/`.
- `application/` depende solo de `domain/` + `shared/` — sin headers concretos de MySQL o Boost.Asio.
- Las dependencias externas fluyen hacia adentro: **Infrastructure → Application → Domain → Shared**.
- La comunicación entre capas usa ports abstractos, inyectados al arrancar en `auth/main.cpp` y `world/main.cpp`.

</span>

## <span class="lang-en">Shared Layer (`FirelandsShared`)</span><span class="lang-es">Capa Shared (`FirelandsShared`)</span>

<span class="lang-en">

Lowest library; no game services or persistence. Add code here only when multiple layers need it and it has no MariaDB/ASIO dependency.

| Area | Path | Purpose |
|------|------|---------|
| Config | `shared/Config.{h,cpp}` | YAML loading (`authserver.yaml`, `worldserver.yaml`); env overrides `FIRELANDS_AUTH_CONFIG` / `FIRELANDS_WORLD_CONFIG` |
| Logging | `shared/Logger.h` | spdlog wrapper; always include via this header for `SPDLOG_LEVEL_NAMES` |
| Crypto / SRP | `shared/Crypto.h`, `SRPConstants.h`, `BigInt.h` | SRP-6a math for authentication |
| Networking | `shared/network/` | `ByteBuffer`, `WorldPacket`, opcodes (`WorldOpcodes.h`), wire codecs (`SpellCastWire`, gossip packets), `WorldCrypt.h` |
| DBC | `shared/dbc/DbcReader.cpp` | Client `.dbc`-style binary table reader |
| Game helpers | `shared/game/` | Access levels, permissions, GM appearance, experience tables |
| TUI | `shared/tui/` | FTXUI helpers for interactive consoles |

</span>
<span class="lang-es">

Biblioteca más baja; sin servicios de juego ni persistencia. Añade código aquí solo cuando varias capas lo necesiten y no dependa de MariaDB/ASIO.

| Área | Ruta | Propósito |
|------|------|-----------|
| Config | `shared/Config.{h,cpp}` | Carga YAML; overrides `FIRELANDS_AUTH_CONFIG` / `FIRELANDS_WORLD_CONFIG` |
| Logging | `shared/Logger.h` | Wrapper spdlog; incluir siempre vía este header |
| Crypto / SRP | `shared/Crypto.h`, `SRPConstants.h`, `BigInt.h` | Matemática SRP-6a para autenticación |
| Red | `shared/network/` | `ByteBuffer`, `WorldPacket`, opcodes, codecs wire, `WorldCrypt.h` |
| DBC | `shared/dbc/DbcReader.cpp` | Lector de tablas binarias estilo `.dbc` |
| Helpers de juego | `shared/game/` | Niveles de acceso, permisos, apariencia GM, tablas de experiencia |
| TUI | `shared/tui/` | Helpers FTXUI para consolas interactivas |

</span>

## <span class="lang-en">Domain Layer (`FirelandsDomain`)</span><span class="lang-es">Capa de Dominio (`FirelandsDomain`)</span>

<span class="lang-en">

Models **what** the emulator manipulates — not **how** data is stored or packets are sent.

### World entities (`domain/world/`)

| Type | File | Role |
|------|------|------|
| `WorldObject` | `WorldObject.h` | Base: GUID, `MovementInfo` position |
| `Player` | `Player.{h,cpp}` | Live health/power, auras, map notifications |
| `Creature` | `Creature.{h,cpp}` | NPC entry, faction, flags, combat XP |
| `GameObject` | `GameObject.{h,cpp}` | World object placement |
| `Map` | `Map.{h,cpp}` | Object grid / spatial indexing |
| `Aura` | `Aura.h`, `UnitAuraState.*` | Buff/debuff state on units |

### Account / data models (`domain/models/`)

`Character`, `Realm`, `PlayerCreateInfo`, `GmTicket`, `GossipMenu`, `NpcText`, `QuestGossip`, `SpellDefinition`, `WebSession`, `Chat`, and `Account` (via `IAccountRepository.h`).

### Combat domain (`domain/combat/`)

| Component | Role |
|-----------|------|
| `CombatEngine` | Core combat resolution |
| `DamageCalculator` | Damage formulas |
| `ICombatEntity` | Combat-capable entity contract |
| `IThreatManager` | Threat table port |
| `ISpellProcessor` | Spell processing port |

### Repository ports (`domain/repositories/`)

| Port | Purpose |
|------|---------|
| `IAccountRepository` | Accounts, SRP verifiers, session keys |
| `IRealmRepository` | Realm list rows |
| `ICharacterRepository` | Character CRUD and online state |
| `IPlayerCreateInfoRepository` | Starter positions, spells, skills |
| `IWebSessionRepository` | REST session tracking |
| `IGmTicketRepository` | GM help tickets |
| `IGossipRepository` | Gossip menu data |
| `INpcTextRepository` | NPC dialog text |
| `IQuestGossipRepository` | Quest gossip lines |
| `ICreatureSpawnRepository` | Creature spawn rows |
| `ICreatureClassLevelStatsRepository` | NPC level stats |
| `INpcTemplateSearchRepository` | `.npc search` template lookup |
| `ISpellDefinitionStore` | Spell metadata |
| `ISpellCastTables` | Cast-time / power cost tables |

</span>
<span class="lang-es">

Modela **qué** manipula el emulador — no **cómo** se almacenan datos o se envían paquetes.

### Entidades de mundo (`domain/world/`)

| Tipo | Archivo | Rol |
|------|---------|-----|
| `WorldObject` | `WorldObject.h` | Base: GUID, posición `MovementInfo` |
| `Player` | `Player.{h,cpp}` | Salud/poder en vivo, auras, notificaciones de mapa |
| `Creature` | `Creature.{h,cpp}` | Entry NPC, facción, flags, XP de combate |
| `GameObject` | `GameObject.{h,cpp}` | Colocación de objetos de mundo |
| `Map` | `Map.{h,cpp}` | Cuadrícula / indexado espacial |
| `Aura` | `Aura.h`, `UnitAuraState.*` | Estado de buffs/debuffs |

### Modelos de cuenta/datos (`domain/models/`)

`Character`, `Realm`, `PlayerCreateInfo`, `GmTicket`, `GossipMenu`, `NpcText`, `QuestGossip`, `SpellDefinition`, `WebSession`, `Chat`, y `Account` (vía `IAccountRepository.h`).

### Dominio de combate (`domain/combat/`)

| Componente | Rol |
|------------|-----|
| `CombatEngine` | Resolución central de combate |
| `DamageCalculator` | Fórmulas de daño |
| `ICombatEntity` | Contrato de entidad en combate |
| `IThreatManager` | Port de tabla de amenaza |
| `ISpellProcessor` | Port de procesamiento de hechizos |

### Ports de repositorio (`domain/repositories/`)

| Port | Propósito |
|------|-----------|
| `IAccountRepository` | Cuentas, verificadores SRP, claves de sesión |
| `IRealmRepository` | Filas de lista de reinos |
| `ICharacterRepository` | CRUD de personajes y estado online |
| `IPlayerCreateInfoRepository` | Posiciones, hechizos y skills iniciales |
| `IWebSessionRepository` | Seguimiento de sesiones REST |
| `IGmTicketRepository` | Tickets de ayuda GM |
| `IGossipRepository` | Datos de menús gossip |
| `INpcTextRepository` | Texto de diálogo NPC |
| `IQuestGossipRepository` | Líneas gossip de misiones |
| `ICreatureSpawnRepository` | Filas de spawn de criaturas |
| `ICreatureClassLevelStatsRepository` | Stats de nivel NPC |
| `INpcTemplateSearchRepository` | Búsqueda `.npc search` |
| `ISpellDefinitionStore` | Metadatos de hechizos |
| `ISpellCastTables` | Tablas de cast / coste de poder |

</span>

## <span class="lang-en">Application Layer (`FirelandsApplication`)</span><span class="lang-es">Capa de Aplicación (`FirelandsApplication`)</span>

<span class="lang-en">

Use cases and orchestration without knowing MariaDB or socket details.

### Services (`application/services/`)

| Service | Role |
|---------|------|
| `AuthService` | Account lookup, SRP verification, session keys |
| `SRPService` | SRP-6a verification helpers |
| `CharacterService` | Character list and persistence |
| `PlayerCreateInfoService` | Character creation templates |
| `RealmListService` | Realm list + live population via `IRealmLiveState` |
| `WorldService` | Runtime world façade: maps, players, creatures, Lua host, collision port |
| `CommandService` | Staff `.` commands and console dispatch |
| `GmTicketService` | Ticket queue, assignment, replies |
| `OnlineCharacterSessionRegistry` | Online name → session for console targeting |
| `WebSessionService` | REST login/session flows |

### Spell & combat (`application/spell/`, `application/combat/`)

`SpellManager` and spell effect modules; `CombatService`, hostility, chase logic.

### Application ports (`application/ports/`)

| Port | Implemented by |
|------|----------------|
| `INetworkServer` | `AsyncNetworkServer` |
| `IAuthSession` | `AuthSession` |
| `ICommandService` / `ICommandSession` | `CommandService` / `WorldSession` |
| `IGameScriptHost` | `LuaGameScriptHost` |
| `IMapCollisionQueries` | `MapCollisionQueriesStub` (vmap planned) |
| `IMapNotifier` | Map/player update notifications |
| `IRealmLiveState` | `RealmLiveRegistry` + realm-link |

</span>
<span class="lang-es">

Casos de uso y orquestación sin conocer MariaDB ni detalles de sockets.

### Servicios (`application/services/`)

| Servicio | Rol |
|----------|-----|
| `AuthService` | Búsqueda de cuenta, verificación SRP, claves de sesión |
| `SRPService` | Helpers de verificación SRP-6a |
| `CharacterService` | Lista y persistencia de personajes |
| `PlayerCreateInfoService` | Plantillas de creación de personaje |
| `RealmListService` | Lista de reinos + población en vivo vía `IRealmLiveState` |
| `WorldService` | Fachada del mundo: mapas, jugadores, criaturas, host Lua, colisiones |
| `CommandService` | Comandos `.` de staff y consola |
| `GmTicketService` | Cola de tickets, asignación, respuestas |
| `OnlineCharacterSessionRegistry` | Nombre online → sesión para consola |
| `WebSessionService` | Flujos REST de login/sesión |

### Hechizos y combate (`application/spell/`, `application/combat/`)

`SpellManager` y módulos de efectos; `CombatService`, hostilidad, persecución.

### Ports de aplicación (`application/ports/`)

| Port | Implementado por |
|------|------------------|
| `INetworkServer` | `AsyncNetworkServer` |
| `IAuthSession` | `AuthSession` |
| `ICommandService` / `ICommandSession` | `CommandService` / `WorldSession` |
| `IGameScriptHost` | `LuaGameScriptHost` |
| `IMapCollisionQueries` | `MapCollisionQueriesStub` (vmap planificado) |
| `IMapNotifier` | Notificaciones de mapa/jugador |
| `IRealmLiveState` | `RealmLiveRegistry` + realm-link |

</span>

## <span class="lang-en">Infrastructure Layer (`FirelandsInfrastructure`)</span><span class="lang-es">Capa de Infraestructura (`FirelandsInfrastructure`)</span>

<span class="lang-en">

Wires the emulator to the outside world. All socket I/O uses **C++20 coroutines** (`co_await`, `boost::asio::use_awaitable`).

### Persistence (`infrastructure/persistence/`)

| Adapter | Port |
|---------|------|
| `DatabaseMigrator` | Runs `sql/bundled/` → `sql/init/` → `sql/migrations/`; tracks `schema_migrations` |
| `MySqlAccountRepository` | `IAccountRepository` |
| `MySqlRealmRepository` | `IRealmRepository` |
| `MySqlCharacterRepository` | `ICharacterRepository` |
| `MySqlPlayerCreateInfoRepository` | `IPlayerCreateInfoRepository` |
| `MySqlGmTicketRepository` | `IGmTicketRepository` |
| `MySqlGossipRepository`, `MySqlNpcTextRepository`, `MySqlQuestGossipRepository` | Gossip ports |
| `MySqlCreatureSpawnRepository`, `MySqlCreatureClassLevelStatsRepository` | Spawn/stats |
| `MemoryWebSessionRepository` | `IWebSessionRepository` (in-memory) |
| `InMemoryThreatManager`, `MySqlThreatManager`, `MySqlSpellProcessor` | Combat ports |

### Network (`infrastructure/network/`)

| Component | Role |
|-----------|------|
| `AsyncNetworkServer` | Coroutine accept loop; `Update()` polls `io_context` |
| `AuthSession` | Auth client read/write loops |
| `WorldSession` | World client; split handlers under `worldsession/*.cpp` |
| `RestAuthServer` | REST login on `Network.RestPort` |
| `RealmLinkSession` / `RealmLinkOutbound` | Auth ↔ world live realm metrics |

### Other adapters

| Component | Role |
|-----------|------|
| `LuaGameScriptHost` | Lua 5.4 scripting under `Scripting.ScriptsDirectory` |
| `SpellEntryDbcStore`, `SpellCastTablesDbc` | Client DBC spell data |
| `MapCollisionQueriesStub` | Placeholder until full vmap integration |

</span>
<span class="lang-es">

Conecta el emulador con el mundo exterior. Todo I/O de sockets usa **corrutinas C++20** (`co_await`, `boost::asio::use_awaitable`).

### Persistencia (`infrastructure/persistence/`)

| Adaptador | Port |
|-----------|------|
| `DatabaseMigrator` | Ejecuta `sql/bundled/` → `sql/init/` → `sql/migrations/`; rastrea `schema_migrations` |
| `MySqlAccountRepository` | `IAccountRepository` |
| `MySqlRealmRepository` | `IRealmRepository` |
| `MySqlCharacterRepository` | `ICharacterRepository` |
| `MySqlPlayerCreateInfoRepository` | `IPlayerCreateInfoRepository` |
| `MySqlGmTicketRepository` | `IGmTicketRepository` |
| `MySqlGossipRepository`, `MySqlNpcTextRepository`, `MySqlQuestGossipRepository` | Ports gossip |
| `MySqlCreatureSpawnRepository`, `MySqlCreatureClassLevelStatsRepository` | Spawn/stats |
| `MemoryWebSessionRepository` | `IWebSessionRepository` (en memoria) |
| `InMemoryThreatManager`, `MySqlThreatManager`, `MySqlSpellProcessor` | Ports de combate |

### Red (`infrastructure/network/`)

| Componente | Rol |
|------------|-----|
| `AsyncNetworkServer` | Bucle accept con corrutinas; `Update()` hace poll de `io_context` |
| `AuthSession` | Bucles read/write del cliente auth |
| `WorldSession` | Cliente world; handlers en `worldsession/*.cpp` |
| `RestAuthServer` | Login REST en `Network.RestPort` |
| `RealmLinkSession` / `RealmLinkOutbound` | Métricas auth ↔ world en vivo |

### Otros adaptadores

| Componente | Rol |
|------------|-----|
| `LuaGameScriptHost` | Scripting Lua 5.4 bajo `Scripting.ScriptsDirectory` |
| `SpellEntryDbcStore`, `SpellCastTablesDbc` | Datos DBC de hechizos |
| `MapCollisionQueriesStub` | Placeholder hasta integración vmap completa |

</span>

## <span class="lang-en">Executables (Composition Roots)</span><span class="lang-es">Ejecutables (Composition Roots)</span>

<span class="lang-en">

| Target | Binary | Startup summary |
|--------|--------|-----------------|
| `auth` | `build/bin/auth` | Load `authserver.yaml` → migrate DB → wire MySQL repos → start auth TCP (3724), optional realm-link + REST (8081) |
| `world` | `build/bin/world` | Load `worldserver.yaml` → init Lua + fire `world_startup` → migrate DB → connect auth/characters/world DBs → start world TCP (8085) + interactive console |
| `FirelandsDevTools` | `build/bin/FirelandsDevTools` | CLI for accounts and realm management |

**Operational flow:** clients authenticate on **auth** (SRP-6a, realm list), then connect to **world** with session-derived crypto. **Realm-link** syncs live population/load from world to auth when configured.

</span>
<span class="lang-es">

| Objetivo | Binario | Resumen de arranque |
|----------|---------|---------------------|
| `auth` | `build/bin/auth` | Carga `authserver.yaml` → migra BD → conecta repos MySQL → TCP auth (3724), realm-link + REST opcional (8081) |
| `world` | `build/bin/world` | Carga `worldserver.yaml` → init Lua + `world_startup` → migra BD → conecta BD auth/characters/world → TCP world (8085) + consola |
| `FirelandsDevTools` | `build/bin/FirelandsDevTools` | CLI de cuentas y reinos |

**Flujo operativo:** los clientes se autentican en **auth** (SRP-6a, lista de reinos), luego conectan a **world** con cripto derivada de sesión. **Realm-link** sincroniza población/carga en vivo de world a auth si está configurado.

</span>

## <span class="lang-en">Wire Format</span><span class="lang-es">Formato de Red</span>

<span class="lang-en">

Packet layouts and opcodes target **WoW Cataclysm 4.3.4 (build 15595)**. Shared builders live under `src/shared/network/` (e.g. `SpellCooldownWire`, `KnownSpellsWire`, gossip packets). `ByteBuffer` uses C++20 `std::span` helpers for safe reads and writes. `WorldSession` handlers are split by concern: movement, spells, gossip, GM state, tickets, object updates.

</span>
<span class="lang-es">

Paquetes y opcodes apuntan a **WoW Cataclysm 4.3.4 (build 15595)**. Builders compartidos en `src/shared/network/`. `ByteBuffer` usa helpers `std::span` de C++20. Los handlers de `WorldSession` se reparten por tema: movimiento, hechizos, gossip, estado GM, tickets, updates de objetos.

</span>

## <span class="lang-en">Precompiled Headers (PCH)</span><span class="lang-es">Encabezados Precompilados (PCH)</span>

<span class="lang-en">

Heavy headers precompiled for faster builds: STL containers, spdlog, nlohmann/json, `shared/Common.h`, `shared/Logger.h`. When adding targets:

```cmake
target_precompile_headers(<target_name> PRIVATE ${PROJECT_PCH_HEADERS})
```

**Important:** spdlog MUST be included via `<shared/Logger.h>`. `LuaGameScriptHost.cpp` skips PCH for toolchain compatibility.

</span>
<span class="lang-es">

Encabezados pesados precompilados: contenedores STL, spdlog, nlohmann/json, `shared/Common.h`, `shared/Logger.h`. Al añadir targets:

```cmake
target_precompile_headers(<target_name> PRIVATE ${PROJECT_PCH_HEADERS})
```

**Importante:** spdlog DEBE incluirse vía `<shared/Logger.h>`. `LuaGameScriptHost.cpp` omite PCH por compatibilidad del toolchain.

</span>

## <span class="lang-en">C++ Conventions</span><span class="lang-es">Convenciones C++</span>

<span class="lang-en">

| Rule | Detail |
|------|--------|
| Standard | C++20 (`std::filesystem`, `std::optional`, `std::variant`, `std::span`, coroutines in network code) |
| Naming | `snake_case` functions/variables; `PascalCase` types; `UPPER_SNAKE_CASE` constants; **kebab-case** file names |
| Language | English only for code, comments, and commits |
| WoW terms | Use Blizzard nomenclature: `Aura`, `Unit`, `SpellEffect`, etc. |
| Logging | Always via `<shared/Logger.h>` |
| Threading | `std::thread` in business code |
| Commits | `type(scope): description` — types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf` |
| TDD | Red → Green → Refactor for all new behavior |

</span>
<span class="lang-es">

| Regla | Detalle |
|-------|---------|
| Estándar | C++20 (`std::filesystem`, `std::optional`, `std::variant`, `std::span`, corrutinas en red) |
| Nombres | `snake_case` funciones/variables; `PascalCase` tipos; `UPPER_SNAKE_CASE` constantes; archivos en **kebab-case** |
| Idioma | Solo inglés en código, comentarios y commits |
| Términos WoW | Nomenclatura Blizzard: `Aura`, `Unit`, `SpellEffect`, etc. |
| Logging | Siempre vía `<shared/Logger.h>` |
| Hilos | `std::thread` en código de negocio |
| Commits | `type(scope): description` — tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf` |
| TDD | Rojo → Verde → Refactor para comportamiento nuevo |

</span>
