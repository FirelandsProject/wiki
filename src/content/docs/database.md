---
title: 'Database'
description: 'Database schema and migrations'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Database</span><span class="lang-es">Base de Datos</span>

<span class="lang-en">

Firelands uses **MySQL 8.0 / MariaDB** with three logical databases. Persistence adapters in `src/infrastructure/persistence/` implement domain repository ports as `MySql*` classes.

</span>
<span class="lang-es">

Firelands usa **MySQL 8.0 / MariaDB** con tres bases de datos lógicas. Los adaptadores en `src/infrastructure/persistence/` implementan los ports de repositorio como clases `MySql*`.

</span>

## <span class="lang-en">Databases</span><span class="lang-es">Bases de Datos</span>

<span class="lang-en">

| Database | Purpose |
|----------|---------|
| `firelands_auth` | Accounts (SRP-6a), realm list, sessions, schema migrations |
| `firelands_characters` | Characters, spells, cooldowns, mail, GM tickets |
| `firelands_world` | Static data: spawns, gossip, quests, `playercreateinfo` |

</span>
<span class="lang-es">

| Base de Datos | Propósito |
|---------------|-----------|
| `firelands_auth` | Cuentas (SRP-6a), lista de reinos, sesiones, migraciones |
| `firelands_characters` | Personajes, hechizos, cooldowns, correo, tickets GM |
| `firelands_world` | Datos estáticos: spawns, gossip, misiones, `playercreateinfo` |

</span>

## <span class="lang-en">Local Development</span><span class="lang-es">Desarrollo Local</span>

```bash
docker-compose up -d db
```

<span class="lang-en">

- **Image**: mysql:8.0
- **Port**: 3306
- **Root**: root/root
- **User**: firelands/firelands
- Bundled schema loads from `sql/bundled/` on first container start

</span>
<span class="lang-es">

- **Imagen**: mysql:8.0
- **Puerto**: 3306
- **Root**: root/root
- **Usuario**: firelands/firelands
- El esquema bundled se carga desde `sql/bundled/` al crear el contenedor

</span>

## <span class="lang-en">SQL Files</span><span class="lang-es">Archivos SQL</span>

<span class="lang-en">

```
sql/
├── init/           # Base schema (auth_schema, characters_schema, world_schema)
├── migrations/     # Incremental changes (numbered prefixes, ~26 files)
└── bundled/        # Merged schema for Docker and fresh installs
```

</span>
<span class="lang-es">

```
sql/
├── init/           # Esquema base (auth_schema, characters_schema, world_schema)
├── migrations/     # Cambios incrementales (prefijos numerados, ~26 archivos)
└── bundled/        # Esquema fusionado para Docker e instalaciones nuevas
```

</span>

### <span class="lang-en">Bundled Schema</span><span class="lang-es">Esquema Bundled</span>

<span class="lang-en">

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql` — seeds migration tracking for Docker

</span>
<span class="lang-es">

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql` — siembra el seguimiento de migraciones en Docker

</span>

### <span class="lang-en">Merging Migrations</span><span class="lang-es">Fusionar Migraciones</span>

```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## <span class="lang-en">Migrations at Runtime</span><span class="lang-es">Migraciones en Tiempo de Ejecución</span>

<span class="lang-en">

`DatabaseMigrator` runs on **auth** and **world** startup in this order:

1. `sql/bundled/*.sql` (skips `zz_*.sql` prefix files during normal apply)
2. `sql/init/*.sql`
3. `sql/migrations/*.sql` (lexicographic order)

Applied files are tracked in `firelands_auth.schema_migrations`. Each statement is split and executed safely.

</span>
<span class="lang-es">

`DatabaseMigrator` se ejecuta al arrancar **auth** y **world** en este orden:

1. `sql/bundled/*.sql` (omite archivos con prefijo `zz_*.sql` en aplicación normal)
2. `sql/init/*.sql`
3. `sql/migrations/*.sql` (orden lexicográfico)

Los archivos aplicados se registran en `firelands_auth.schema_migrations`. Cada sentencia se divide y ejecuta de forma segura.

</span>

## <span class="lang-en">Auth Database (`firelands_auth`)</span><span class="lang-es">Base Auth (`firelands_auth`)</span>

<span class="lang-en">

| Table | Purpose |
|-------|---------|
| `account` | User accounts — SRP salt/verifier (password never stored), access level, lock flag |
| `realmlist` | Realm name, address, port, icon, population |
| `account_session` | Active session keys for logged-in accounts |
| `account_data` | Cached client UI data (macros, keybinds) |
| `schema_migrations` | Applied migration file tracking |

Password auth uses **SRP-6a** via `SRPService` + `MySqlAccountRepository`. Console `.account` commands modify this database.

</span>
<span class="lang-es">

| Tabla | Propósito |
|-------|-----------|
| `account` | Cuentas — salt/verifier SRP (nunca se guarda la contraseña), nivel de acceso, bloqueo |
| `realmlist` | Nombre, dirección, puerto, icono, población del reino |
| `account_session` | Claves de sesión activas |
| `account_data` | Datos UI del cliente en caché (macros, keybinds) |
| `schema_migrations` | Seguimiento de migraciones aplicadas |

La autenticación usa **SRP-6a** vía `SRPService` + `MySqlAccountRepository`. Los comandos `.account` de consola modifican esta BD.

</span>

## <span class="lang-en">Characters Database (`firelands_characters`)</span><span class="lang-es">Base Characters (`firelands_characters`)</span>

<span class="lang-en">

| Table | Purpose |
|-------|---------|
| `characters` | Core row: position, money, level, appearance, stats |
| `character_spell` | Extra spells (e.g. from `.learn`) |
| `character_spell_cooldown` | Persisted spell and category cooldowns |
| `gm_ticket` | Player help tickets and GM replies |
| `mail` / `mail_items` | In-game mail |

</span>
<span class="lang-es">

| Tabla | Propósito |
|-------|-----------|
| `characters` | Fila principal: posición, dinero, nivel, apariencia, stats |
| `character_spell` | Hechizos extra (p. ej. `.learn`) |
| `character_spell_cooldown` | Cooldowns de hechizo y categoría persistidos |
| `gm_ticket` | Tickets de ayuda y respuestas GM |
| `mail` / `mail_items` | Correo en juego |

</span>

## <span class="lang-en">World Database (`firelands_world`)</span><span class="lang-es">Base World (`firelands_world`)</span>

<span class="lang-en">

| Table | Purpose |
|-------|---------|
| `playercreateinfo` | Starter position per race/class |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Starter spells and skills (level-gated on login) |
| `creature_template` | NPC templates (`gossip_menu_id`, stats, flags) |
| `creature` | Creature spawn rows |
| `gossip_menu`, `gossip_menu_option`, `gossip_menu_option_action` | NPC gossip menus |
| `npc_text` | Dialog copy for `SMSG_NPC_TEXT_UPDATE` |
| `quest_template`, `creature_queststarter` | Quest gossip lines (class/race masks) |

Reference data can be imported from a local Cataclysm reference clone:

```bash
python3 tools/sql/import_ref_gossip.py      # → migration 35
python3 tools/sql/import_ref_npc_text.py    # → migration 34
python3 tools/sql/import_ref_quest_gossip.py # → migration 38
```

</span>
<span class="lang-es">

| Tabla | Propósito |
|-------|-----------|
| `playercreateinfo` | Posición inicial por raza/clase |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Hechizos y skills iniciales (filtrados por nivel al login) |
| `creature_template` | Plantillas NPC (`gossip_menu_id`, stats, flags) |
| `creature` | Filas de spawn de criaturas |
| `gossip_menu`, `gossip_menu_option`, … | Menús gossip |
| `npc_text` | Texto de diálogo |
| `quest_template`, `creature_queststarter` | Líneas de misiones (máscaras clase/raza) |

Datos de referencia desde un clone Cataclysm local:

```bash
python3 tools/sql/import_ref_gossip.py      # → migración 35
python3 tools/sql/import_ref_npc_text.py    # → migración 34
python3 tools/sql/import_ref_quest_gossip.py # → migración 38
```

</span>

## <span class="lang-en">Repository Mapping</span><span class="lang-es">Mapeo de Repositorios</span>

<span class="lang-en">

| Domain Port | Infrastructure Adapter | Database |
|-------------|------------------------|----------|
| `IAccountRepository` | `MySqlAccountRepository` | auth |
| `IRealmRepository` | `MySqlRealmRepository` | auth |
| `ICharacterRepository` | `MySqlCharacterRepository` | characters |
| `IGmTicketRepository` | `MySqlGmTicketRepository` | characters |
| `IPlayerCreateInfoRepository` | `MySqlPlayerCreateInfoRepository` | world |
| `IGossipRepository` | `MySqlGossipRepository` | world |
| `INpcTextRepository` | `MySqlNpcTextRepository` | world |
| `IQuestGossipRepository` | `MySqlQuestGossipRepository` | world |
| `ICreatureSpawnRepository` | `MySqlCreatureSpawnRepository` | world |

</span>
<span class="lang-es">

| Port de Dominio | Adaptador Infrastructure | Base de datos |
|-----------------|---------------------------|---------------|
| `IAccountRepository` | `MySqlAccountRepository` | auth |
| `IRealmRepository` | `MySqlRealmRepository` | auth |
| `ICharacterRepository` | `MySqlCharacterRepository` | characters |
| `IGmTicketRepository` | `MySqlGmTicketRepository` | characters |
| `IPlayerCreateInfoRepository` | `MySqlPlayerCreateInfoRepository` | world |
| `IGossipRepository` | `MySqlGossipRepository` | world |
| `INpcTextRepository` | `MySqlNpcTextRepository` | world |
| `IQuestGossipRepository` | `MySqlQuestGossipRepository` | world |
| `ICreatureSpawnRepository` | `MySqlCreatureSpawnRepository` | world |

</span>
