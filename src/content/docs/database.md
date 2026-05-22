---
title: 'Database'
description: 'Database schema and migrations'
pubDate: '2025-01-01'
updatedDate: '2026-05-21'
---

# <span class="lang-en">Database</span><span class="lang-es">Base de Datos</span>

<span class="lang-en">

Firelands uses MySQL 8.0 with three logical databases:

</span>
<span class="lang-es">

Firelands usa MySQL 8.0 con tres bases de datos lógicas:

</span>

## <span class="lang-en">Databases</span><span class="lang-es">Bases de Datos</span>

<span class="lang-en">

| Database | Purpose |
|----------|---------|
| `firelands_auth` | Accounts (SRP-6a), realm list, sessions |
| `firelands_characters` | Characters, spells, cooldowns, mail, GM tickets |
| `firelands_world` | Static data: spawns, gossip, quests, `playercreateinfo` |

</span>
<span class="lang-es">

| Base de Datos | Propósito |
|---------------|-----------|
| `firelands_auth` | Cuentas (SRP-6a), lista de reinos, sesiones |
| `firelands_characters` | Personajes, hechizos, cooldowns, correo, tickets GM |
| `firelands_world` | Datos estáticos: spawns, gossip, misiones, `playercreateinfo` |

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
- Bundled schema loads from `sql/bundled/` on first container start

</span>
<span class="lang-es">

Configuración:
- **Imagen**: mysql:8.0
- **Puerto**: 3306
- **Root**: root/root
- **Usuario**: firelands/firelands
- El esquema bundled se carga desde `sql/bundled/` al crear el contenedor

</span>

## <span class="lang-en">SQL Files</span><span class="lang-es">Archivos SQL</span>

<span class="lang-en">

- `sql/init/` — Initial schema (`auth_schema.sql`, `characters_schema.sql`, `world_schema.sql`)
- `sql/migrations/` — Ordered incremental migrations
- `sql/bundled/` — Merged schema for Docker and fresh installs

</span>
<span class="lang-es">

- `sql/init/` — Esquema inicial
- `sql/migrations/` — Migraciones incrementales ordenadas
- `sql/bundled/` — Esquema fusionado para Docker e instalaciones nuevas

</span>

### <span class="lang-en">Bundled Schema</span><span class="lang-es">Esquema Bundled</span>

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql`

### <span class="lang-en">Merging Migrations</span><span class="lang-es">Fusionar Migraciones</span>

```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## <span class="lang-en">Migrations at Runtime</span><span class="lang-es">Migraciones en Tiempo de Ejecución</span>

<span class="lang-en">

`DatabaseMigrator` runs on auth and world startup:

1. `sql/init/*.sql` (if needed)
2. `sql/migrations/*.sql` in lexicographic order

</span>
<span class="lang-es">

`DatabaseMigrator` se ejecuta al arrancar auth y world:

1. `sql/init/*.sql` (si aplica)
2. `sql/migrations/*.sql` en orden lexicográfico

</span>

## <span class="lang-en">Notable Tables</span><span class="lang-es">Tablas Destacadas</span>

### <span class="lang-en">Characters (`firelands_characters`)</span><span class="lang-es">Personajes</span>

<span class="lang-en">

| Table | Purpose |
|-------|---------|
| `characters` | Core character row (position, money, level, appearance) |
| `character_spell` | Extra spells (e.g. from `.learn`) |
| `character_spell_cooldown` | Persisted spell and category cooldowns |
| `gm_ticket` | Player help tickets and GM replies |
| `mail` / `mail_items` | In-game mail |

</span>
<span class="lang-es">

| Tabla | Propósito |
|-------|-----------|
| `characters` | Fila principal del personaje |
| `character_spell` | Hechizos extra (p. ej. `.learn`) |
| `character_spell_cooldown` | Cooldowns de hechizo y categoría persistidos |
| `gm_ticket` | Tickets de ayuda y respuestas GM |
| `mail` / `mail_items` | Correo en juego |

</span>

### <span class="lang-en">World (`firelands_world`)</span><span class="lang-es">Mundo</span>

<span class="lang-en">

| Table | Purpose |
|-------|---------|
| `playercreateinfo` | Starter position per race/class |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Starter spells and skills (level-gated on login) |
| `creature_template` | NPC templates (`gossip_menu_id`) |
| `gossip_menu`, `gossip_menu_option`, `gossip_menu_option_action` | NPC gossip menus |
| `npc_text` | Dialog copy for `SMSG_NPC_TEXT_UPDATE` |
| `quest_template`, `creature_queststarter` | Quest gossip lines (class/race masks) |

Reference data can be imported from a local Cataclysm reference clone:

```bash
python3 tools/sql/import_ref_gossip.py
python3 tools/sql/import_ref_npc_text.py
python3 tools/sql/import_ref_quest_gossip.py
```

</span>
<span class="lang-es">

| Tabla | Propósito |
|-------|-----------|
| `playercreateinfo` | Posición inicial por raza/clase |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Hechizos y skills iniciales (filtrados por nivel al login) |
| `creature_template` | Plantillas NPC (`gossip_menu_id`) |
| `gossip_menu`, `gossip_menu_option`, … | Menús gossip |
| `npc_text` | Texto de diálogo |
| `quest_template`, `creature_queststarter` | Líneas de misiones en gossip (máscaras clase/raza) |

Datos de referencia desde un clone Cataclysm local:

```bash
python3 tools/sql/import_ref_gossip.py
python3 tools/sql/import_ref_npc_text.py
python3 tools/sql/import_ref_quest_gossip.py
```

</span>
