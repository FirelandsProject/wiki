---
title: 'Base de Datos'
description: 'Esquema, migraciones y adaptadores de persistencia'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Base de Datos

Firelands usa **MySQL 8.0 / MariaDB** con tres bases de datos lógicas. Los adaptadores en `src/infrastructure/persistence/` implementan los ports de repositorio como clases `MySql*`.

## Bases de Datos

| Base de Datos | Propósito |
|---------------|-----------|
| `firelands_auth` | Cuentas (SRP-6a), lista de reinos, sesiones, migraciones |
| `firelands_characters` | Personajes, hechizos, cooldowns, correo, tickets GM |
| `firelands_world` | Datos estáticos: spawns, gossip, misiones, `playercreateinfo` |

## Desarrollo Local
```bash
docker-compose up -d db
```

- **Imagen**: mysql:8.0
- **Puerto**: 3306
- **Root**: root/root
- **Usuario**: firelands/firelands
- El esquema bundled se carga desde `sql/bundled/` al crear el contenedor

## Archivos SQL

```
sql/
├── init/           # Esquema base (auth_schema, characters_schema, world_schema)
├── migrations/     # Cambios incrementales (prefijos numerados, ~26 archivos)
└── bundled/        # Esquema fusionado para Docker e instalaciones nuevas
```

### Esquema Bundled

- `firelands_auth.sql`
- `firelands_characters.sql`
- `firelands_world.sql`
- `zz_seed_schema_migrations.sql` — siembra el seguimiento de migraciones en Docker

### Fusionar Migraciones
```bash
python3 tools/merge_migrations.py
# or
cmake --build build --target merge-migrations
```

## Migraciones en Tiempo de Ejecución

`DatabaseMigrator` se ejecuta al arrancar **auth** y **world** en este orden:

1. `sql/bundled/*.sql` (omite archivos con prefijo `zz_*.sql` en aplicación normal)
2. `sql/init/*.sql`
3. `sql/migrations/*.sql` (orden lexicográfico)

Los archivos aplicados se registran en `firelands_auth.schema_migrations`. Cada sentencia se divide y ejecuta de forma segura.

## Base Auth (`firelands_auth`)

| Tabla | Propósito |
|-------|-----------|
| `account` | Cuentas — salt/verifier SRP (nunca se guarda la contraseña), nivel de acceso, bloqueo |
| `realmlist` | Nombre, dirección, puerto, icono, población del reino |
| `account_session` | Claves de sesión activas |
| `account_data` | Datos UI del cliente en caché (macros, keybinds) |
| `schema_migrations` | Seguimiento de migraciones aplicadas |

La autenticación usa **SRP-6a** vía `SRPService` + `MySqlAccountRepository`. Los comandos `.account` de consola modifican esta BD.

## Base Characters (`firelands_characters`)

| Tabla | Propósito |
|-------|-----------|
| `characters` | Fila principal: posición, dinero, nivel, apariencia, stats |
| `character_spell` | Hechizos extra (p. ej. `.learn`) |
| `character_spell_cooldown` | Cooldowns de hechizo y categoría persistidos |
| `gm_ticket` | Tickets de ayuda y respuestas GM |
| `mail` / `mail_items` | Correo en juego |

## Base World (`firelands_world`)

| Tabla | Propósito |
|-------|-----------|
| `playercreateinfo` | Posición inicial por raza/clase |
| `playercreateinfo_spell` / `playercreateinfo_skill` | Hechizos y skills iniciales (filtrados por nivel al login) |
| `creature_template` | Plantillas NPC (`gossip_menu_id`, stats, flags) |
| `creature` | Filas de spawn de criaturas |
| `gossip_menu`, `gossip_menu_option`, … | Menús gossip |
| `npc_text` | Texto de diálogo |
| `quest_template`, `creature_queststarter` | Líneas de misiones (máscaras clase/raza) |
| `phase_area` | Área → IDs de fase del jugador |
| `phase_x_phase_group` | PhaseGroup → fases miembro |
| `conditions` (tipo 26) | Puertas misión/aura para `phase_area` |

Las tablas de misiones en characters alimentan las condiciones de fase. Ver [Sistema de Fases](/wiki/es/docs/phase-system/).

Datos world regenerables con scripts de importación:

```bash
python3 tools/sql/import_ref_gossip.py      # → migración 35
python3 tools/sql/import_ref_npc_text.py    # → migración 34
python3 tools/sql/import_ref_quest_gossip.py # → migración 38
python3 tools/sql/import_ref_phase_data.py       # → migración 55
python3 tools/sql/import_ref_phase_conditions.py # → migración 57
```

## Mapeo de Repositorios

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
| `IPhaseAreaCatalogRepository` | `MySqlPhaseAreaCatalogRepository` | world |
| `IPhaseConditionRepository` | `MySqlPhaseConditionRepository` | world |
| `IPhaseGroupCatalogRepository` | `MySqlPhaseGroupCatalogRepository` | world |
| `IPlayerQuestProgressRepository` | `MySqlPlayerQuestProgressRepository` | characters |

## Buenas prácticas de migraciones

- Usar `IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`
- Nunca `DROP TABLE` en migraciones
- Prefijos numéricos: `001_`, `002_`, …
- Tras cambios: `cmake --build build --target merge-migrations`

## Consultas locales

```bash
mysql -u firelands -p firelands_auth
docker exec -it firelands-db-1 mysql -u firelands -p
```

## Relacionado

- [Sistema de Fases](/wiki/es/docs/phase-system/)
- [Gossip y npc_text](/wiki/es/docs/gossip-npc-text/)
- [Tickets GM](/wiki/es/docs/gm-tickets/)
- [Módulo: Infrastructure](/wiki/es/docs/modules-infrastructure/)
