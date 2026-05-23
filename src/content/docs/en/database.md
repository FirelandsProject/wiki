---
title: 'Database'
description: 'Schema, migrations, and persistence adapters'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Database

Firelands uses **MySQL 8.0 / MariaDB** with three logical databases. Persistence adapters in `src/infrastructure/persistence/` implement domain repository ports as `MySql*` classes.

## Databases

| Database | Purpose |
|----------|---------|
| `firelands_auth` | Accounts (SRP-6a), realm list, sessions, schema migrations |
| `firelands_characters` | Characters, spells, cooldowns, mail, GM tickets |
| `firelands_world` | Static data: spawns, gossip, quests, `playercreateinfo` |

## Local Development
```bash
docker-compose up -d db
```

- **Image**: mysql:8.0
- **Port**: 3306
- **Root**: root/root
- **User**: firelands/firelands
- Bundled schema loads from `sql/bundled/` on first container start

## SQL Files

```
sql/
├── init/           # Base schema (auth_schema, characters_schema, world_schema)
├── migrations/     # Incremental changes (numbered prefixes, ~26 files)
└── bundled/        # Merged schema for Docker and fresh installs
```

### Bundled Schema

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql` — seeds migration tracking for Docker

### Merging Migrations
```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## Migrations at Runtime

`DatabaseMigrator` runs on **auth** and **world** startup in this order:

1. `sql/bundled/*.sql` (skips `zz_*.sql` prefix files during normal apply)
2. `sql/init/*.sql`
3. `sql/migrations/*.sql` (lexicographic order)

Applied files are tracked in `firelands_auth.schema_migrations`. Each statement is split and executed safely.

## Auth Database (`firelands_auth`)

### `account`

Stores user accounts. Uses **SRP-6a** — password never stored.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK | Auto-increment account ID |
| `username` | VARCHAR(32) | Unique login name |
| `salt` | BINARY(32) | SRP salt |
| `verifier` | BINARY(32) | SRP verifier |
| `email` | VARCHAR(255) | Account email |
| `joindate` | TIMESTAMP | Creation date |
| `last_ip` | VARCHAR(15) | Last login IP |
| `expansion` | TINYINT | 3 = Cataclysm |
| `locked` | TINYINT | 1 = banned / login lock |
| `access_level` | TINYINT | GM level 0–3 |

Adapter: `MySqlAccountRepository`. Console `.account` / `.ban` commands modify this table.

### `realmlist`

| Column | Description |
|--------|-------------|
| `id`, `name` | Realm ID and display name |
| `address`, `port` | World server endpoint |
| `icon`, `timezone` | Client realm list metadata |
| `allowedSecurityLevel` | Minimum access to join |
| `population` | Population float |

### `account_session`

Active session keys (`session_key` BINARY(40)) for logged-in accounts.

### `account_data`

Cached client UI data (macros, keybinds) — `type` 0–8, serialized BLOB.

### `schema_migrations`

Tracks applied migration filenames.

## Characters Database (`firelands_characters`)

### `characters`

Main player row.

| Column | Description |
|--------|-------------|
| `guid` | Character global unique ID |
| `account` | Owner account ID |
| `name` | Character name (max 12) |
| `race`, `class`, `gender` | Creation choices |
| `skin`, `face`, `hairStyle`, … | Appearance |
| `level`, `xp`, `money` | Progression |
| `mapId`, `zoneId`, `x`, `y`, `z`, `orientation` | Position |
| `live_health`, `live_power1` | Runtime vitals (nullable) |
| `equipmentCache` | JSON equipment snapshot |
| `tutorial0-7` | Tutorial flags |

Flows through `CharacterService` + `MySqlCharacterRepository`.

### `character_spell`

Extra spells (e.g. from `.learn`): `(guid, spell)` composite PK.

### `character_spell_cooldown`

Persisted spell and category cooldowns for `.cd` and relog.

### `gm_ticket`

| Column | Description |
|--------|-------------|
| `id` | Ticket ID |
| `account_id`, `character_guid` | Owner |
| `status` | Open / assigned / answered / closed |
| `message`, `gm_response` | Player text and staff reply |
| `assigned_account_id` | Claiming GM |
| `map_id`, `pos_*` | Snapshot at creation |

See [GM Tickets](/wiki/docs/gm-tickets/).

### `mail` / `mail_items`

In-game mail with optional item attachments (e.g. `.additem` overflow).

### Instance tables

`instance`, `instance_reset`, `character_instance`, `group_instance`, `account_instance_times`, `item_refund_instance` — raid/instance persistence (schema present; gameplay partial).

## World Database (`firelands_world`)

| Table | Purpose |
|-------|---------|
| `playercreateinfo` | Starter position per race/class |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Starter spells and skills (level-gated on login) |
| `creature_template` | NPC templates (`gossip_menu_id`, stats, flags) |
| `creature` | Creature spawn rows |
| `gossip_menu`, `gossip_menu_option`, `gossip_menu_option_action` | NPC gossip menus |
| `npc_text` | Dialog copy for `SMSG_NPC_TEXT_UPDATE` |
| `quest_template`, `creature_queststarter` | Quest gossip lines (class/race masks) |
| `phase_area` | Area → player phase IDs |
| `phase_x_phase_group` | PhaseGroup → member phase IDs |
| `conditions` (type 26) | Quest/aura gates for `phase_area` rows |

Character DB quest tables (`character_queststatus`, `character_queststatus_rewarded`) back phase condition checks. See [Phase System](/wiki/docs/phase-system/).

World seed data can be regenerated with import scripts:

```bash
python3 tools/sql/import_ref_gossip.py      # → migration 35
python3 tools/sql/import_ref_npc_text.py    # → migration 34
python3 tools/sql/import_ref_quest_gossip.py # → migration 38
python3 tools/sql/import_ref_phase_data.py       # → migration 55
python3 tools/sql/import_ref_phase_conditions.py # → migration 57
```

## Repository Mapping

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
| `IPhaseAreaCatalogRepository` | `MySqlPhaseAreaCatalogRepository` | world |
| `IPhaseConditionRepository` | `MySqlPhaseConditionRepository` | world |
| `IPhaseGroupCatalogRepository` | `MySqlPhaseGroupCatalogRepository` | world |
| `IPlayerQuestProgressRepository` | `MySqlPlayerQuestProgressRepository` | characters |

## Migration best practices

- Use `IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`
- Never `DROP TABLE` in migrations
- Prefix files for ordering: `001_`, `002_`, …
- After changes: `cmake --build build --target merge-migrations`

## Querying locally

```bash
mysql -u firelands -p firelands_auth
docker exec -it firelands-db-1 mysql -u firelands -p
```

## Related

- [Phase System](/wiki/docs/phase-system/) — zone phasing tables and visibility
- [Gossip & NPC text](/wiki/docs/gossip-npc-text/) — world gossip tables
- [GM Tickets](/wiki/docs/gm-tickets/)
- [Module: Infrastructure](/wiki/docs/modules-infrastructure/) — repository adapters
