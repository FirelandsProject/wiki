---
title: 'Database'
description: 'Database schema and migrations'
pubDate: '2025-01-01'
---

# <span class="lang-en">Database</span><span class="lang-es">Base de Datos</span>

<span class="lang-en">

Firelands uses MySQL 8.0 with three separate databases:

</span>
<span class="lang-es">

Firelands usa MySQL 8.0 con tres bases de datos separadas:

</span>

## <span class="lang-en">Databases</span><span class="lang-es">Bases de Datos</span>

<span class="lang-en">

| Database | Purpose |
|----------|---------|
| `auth` | Authentication data, accounts, sessions |
| `characters` | Character data, inventory, quests |
| `world` | Game data, mobs, items, spells, world state |

</span>
<span class="lang-es">

| Base de Datos | Propósito |
|---------------|-----------|
| `auth` | Datos de autenticación, cuentas, sesiones |
| `characters` | Datos de personajes, inventario, misiones |
| `world` | Datos de juego, mobs, items, hechizos, estado del mundo |

</span>

## <span class="lang-en">Local Development</span><span class="lang-es">Desarrollo Local</span>

<span class="lang-en">

Start MySQL with Docker:

</span>
<span class="lang-es">

Iniciar MySQL con Docker:

</span>

```bash
docker-compose up -d db
```

<span class="lang-en">

Configuration:
- **Image**: mysql:8.0
- **Port**: 3306
- **Root**: root/root
- **User**: firelands/firelands
- **Databases**: auth, characters, world

</span>
<span class="lang-es">

Configuración:
- **Imagen**: mysql:8.0
- **Puerto**: 3306
- **Root**: root/root
- **Usuario**: firelands/firelands
- **Bases de datos**: auth, characters, world

</span>

## <span class="lang-en">SQL Files</span><span class="lang-es">Archivos SQL</span>

<span class="lang-en">

- `sql/init/` - Initial schema scripts
- `sql/migrations/` - Migration scripts
- `sql/bundled/` - Bundled schema for distribution

</span>
<span class="lang-es">

- `sql/init/` - Scripts de esquema inicial
- `sql/migrations/` - Scripts de migraciones
- `sql/bundled/` - Esquema bundled para distribución

</span>

### <span class="lang-en">Bundled Schema</span><span class="lang-es">Esquema Bundled</span>

<span class="lang-en">

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql`

</span>
<span class="lang-es">

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql`

</span>

### <span class="lang-en">Merging Migrations</span><span class="lang-es">Fusionar Migraciones</span>

<span class="lang-en">

Regenerate bundled schema:
```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

</span>
<span class="lang-es">

Regenerar esquema bundled:
```bash
python3 tools/merge_migrations.py
# o
cmake --build build --target merge-migrations
```

</span>

## <span class="lang-en">Migrations at Runtime</span><span class="lang-es">Migraciones en Tiempo de Ejecución</span>

<span class="lang-en">

The `DatabaseMigrator` applies:
1. `sql/init/*.sql`
2. Optional `sql/migrations/*.sql`

</span>
<span class="lang-es">

El `DatabaseMigrator` aplica:
1. `sql/init/*.sql`
2. Opcional `sql/migrations/*.sql`

</span>