---
title: 'Database'
description: 'Database schema and migrations'
pubDate: '2025-01-01'
---

# Database

Firelands uses MySQL 8.0 with three separate databases:

## Databases

| Database | Purpose |
|----------|---------|
| `auth` | Authentication data, accounts, sessions |
| `characters` | Character data, inventory, quests |
| `world` | Game data, mobs, items, spells, world state |

## Local Development

Start MySQL with Docker:

```bash
docker-compose up -d db
```

Configuration:
- **Image**: mysql:8.0
- **Port**: 3306
- **Root**: root/root
- **User**: firelands/firelands
- **Databases**: auth, characters, world

## SQL Files

- `sql/init/` - Initial schema scripts
- `sql/migrations/` - Migration scripts
- `sql/bundled/` - Bundled schema for distribution

### Bundled Schema
- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql`

### Merging Migrations
Regenerate bundled schema:
```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## Migrations at Runtime

The `DatabaseMigrator` applies:
1. `sql/init/*.sql`
2. Optional `sql/migrations/*.sql`