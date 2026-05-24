---
title: Player Create Info
description: Posiciones, hechizos y skills iniciales para personajes nuevos (tablas playercreateinfo).
pubDate: 2026-05-23
---

Los personajes nuevos reciben posición de spawn, hechizos conocidos y ranks de skills desde tablas en **`firelands_world`**, alineadas con la referencia Cataclysm 4.3.4. El world server lee estos datos vía `IPlayerCreateInfoRepository` / `MySqlPlayerCreateInfoRepository` y `PlayerCreateInfoService` — no hay listas hardcodeadas por raza/clase en runtime.

## Tablas

| Tabla | Propósito |
|-------|-----------|
| `playercreateinfo` | Mapa, zona y posición por `(race, class)` |
| `playercreateinfo_spell` | Hechizos iniciales (`raceMask`, `classMask`, `spellId`) |
| `playercreateinfo_skill` | Líneas de skill y rank inicial |
| `playercreateinfo_item` | Items extra tras CharStartOutfit |
| `playercreateinfo_visual_items` | Overrides de outfit (si no se usa DBC) |

### Columnas mask

`playercreateinfo_spell` y `playercreateinfo_skill` usan máscaras como `AllowableRaces` / `AllowableClasses` en misiones:

- **`raceMask = 0`** — todas las razas
- **`classMask = 0`** — todas las clases
- Si no, la fila aplica cuando `(raceMask & playerRaceMask) != 0` y `(classMask & playerClassMask) != 0`

Ejemplo: `(0, 1, 6603)` da **Attack** a todos los warriors; `(2, 1, 20572)` da **Blood Fury** solo a orc warriors.

## Contenido de `playercreateinfo_spell`

Dos fuentes:

1. **SQL de referencia** — `playercreateinfo_spell_custom` de `firelands-cata-ref` (hechizos de clase; sin riding ni invocaciones de brujo por quest).
2. **Suplemento DBC** — pasivas de armas/armadura/idioma, raciales y hechizos learn-on-skill de tabs de clase desde `SkillLineAbility.dbc` + `SkillRaceClassInfo.dbc` (migración `62_world_playercreateinfo_dbc_spells.sql`).

En login, `PlayerSpellbook::BuildKnownSpells` carga desde el repositorio, quita riding/transporte y filtra por nivel con `Spell.dbc`.

Las filas solo raciales (`raceMask != 0`) también se consultan para cooldowns (`GetRacialStarterSpells`).

## Regenerar datos

Desde la raíz de **firelands-next** (requiere `firelands-cata-ref` y DBCs en `data/dbc/`):

```bash
python3 tools/sql/import_ref_playercreateinfo.py
python3 tools/sql/generate_playercreateinfo_dbc_spells.py
```

Tras editar migraciones:

```bash
cmake --build build --target merge-migrations
```

Reinicia el world server para aplicar cambios en `playercreateinfo_*`.

## Migraciones relacionadas

| Migración | Rol |
|-----------|------|
| `42`–`45` | DDL y datos ref de spawn/hechizos/skills |
| `46`–`51` | Ajustes (riding, openers, brujo) |
| `61` | Learn-on-skill (subset; `62` cubre el set DBC completo) |
| `62` | Filas DBC completas de hechizos iniciales |

## Flujo de código

```
MySqlPlayerCreateInfoRepository::GetStarterSpells
  → PlayerCreateInfoService::GetStarterSpells (quita riding)
    → PlayerSpellbook::BuildKnownSpells (nivel + filtros profesión)
```

Hechizos de profesión y perks de guild se bloquean con `IsSpellFromExcludedSkillLine` (índice `SkillLineAbility.dbc` al arrancar world), no con filas de starter.

Ver también: [Base de datos](/wiki/es/docs/database/), [Arquitectura](/wiki/es/docs/architecture/).
