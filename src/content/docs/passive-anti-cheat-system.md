---
title: "🛡️ Passive Anti-Cheat System"
author: "M'Dic"
description: "Comprehensive guide to configuring and deploying the Firelands Passive Anti-Cheat system."
pubDate: "Sep 11 2023"
---

# 🛡️ Tome of Protection: Passive Anti-Cheat

Welcome, Guardian of the Realm. To maintain the sanctity of Firelands, we employ a sophisticated **Passive Anti-Cheat System**. This guide provides the knowledge required to configure, deploy, and master this defensive ritual.

---

## 📜 Chapter 1: The Guard's Arsenal (Features)

The Passive Anti-Cheat has been meticulously refined to ensure fair play while minimizing false judgments.

> [!NOTE]
> Ported and continued by **M'Dic** (acidmanifesto || c4eva).
> Original implementation by **LordPsyian** (TC TBC Era to TC WOTLK).

- **⚖️ Automatic Moderation**: Options for automated justice (jail, kick, ban).
- **🎯 Precision Detections**: Drastically improved detection logic to reduce false positives.
- **👁️ GM Oversight**: Real-time reporting to online Game Masters.
- **🌀 Teleport Helpers**: Advanced detection for non-legal movement rituals.
- **🛠️ Dynamic Re-tuning**: Configuration reloadable via `.reload conf` without a server restart.
- **🧪 Experimental Countermeasures**: Cutting-edge defenses for emerging threats.

![Anti-Cheat Dashboard](https://user-images.githubusercontent.com/16887899/166107795-c757eaf9-1290-4d23-98ad-1c32753e521a.png)

---

## 🔍 Chapter 2: The Eye of Scrutiny (Detections)

The system monitors for various forbidden arts (hacks) that disrupt the balance of the world.

### 🚫 Forbidden Movements
- **Fly Hack** & **Jump Hack**
- **Speed Hack** & **Anti-Swim Hack**
- **Water Walk Hack** & **Gravity Hack**
- **No Fall Damage** & **Anti-Knock Back**

### 🌀 Dimensional Breaches
- **Teleport Hack** (including Z-pane and Z-axis)
- **BG Start Exploit**: Preventing early exits from Battleground gates.
- **Ignore Control**: Moving while rooted or stunned.

### 🧪 Arcane Manipulation
- **Op Ack Hack**
- **LUA Private Function Spell Casting** (Log Only)

---

## 🔨 Chapter 3: The Hammer of Justice (Countermeasures)

When a violation is detected, the system can invoke immediate countermeasures to stabilize the reality.

| Countermeasure | Target Hack |
| :--- | :--- |
| **Time Stabilization** | Time Manipulation |
| **Zone Recalling** | BG Start Spot Exploits |
| **Position Reset** | Teleport & Fly Hacks |
| **Gravity Enforcement** | Jump & Ignore Z Hacks |
| **Velocity Capping** | Speed Hacks |

![Countermeasures in Action](https://user-images.githubusercontent.com/16887899/162586689-949ef045-5547-4b58-8957-aad012cd8eae.png)

---

## ⚠️ Chapter 4: The Sage's Warning (Known Limitations)

Even the most powerful magic has limits. Be aware of these potential "false echoes."

> [!WARNING]
> **Excessive Latency**: High lag may cause false flags for "Ignore Control" detections.
> **Custom Maps**: Unique handling of floor heights in custom maps may trigger "Teleport to Pane" or "Ignore Z Axis" hits.

### 🕵️ Common Scenarios
- **The DK's Trial**: Death Knights in their starting area are shackled instead of teleported if flagged.
- **The GM's Touch**: Using `.sum` (Summon) by a GM can "jailbreak" a player.
- **Sturdy Potholes**: Minor map inconsistencies may occasionally trigger Z-Axis warnings.

---

## 📓 Chapter 5: The Archivist's Ledgers (Database)

Detection data is stored within the `Characters` database for long-term tracking.

- **`players_reports_status`**: Active session stats for online players.
- **`daily_players_reports`**: Life-time statistics (until purged).

![Report Tables](https://user-images.githubusercontent.com/16887899/166588074-758e833a-f070-4e66-a322-55e9b168ab8d.png)

---

## 🕹️ Chapter 6: Commands of the High Guard (GM Commands)

GMs can interact with the system using these sacred commands.

| Command | Effect |
| :--- | :--- |
| **`.anticheat global`** | Check if the system is currently active. |
| **`.anticheat player`** | Review current reports for a targeted player. |
| **`.anticheat warn`** | Send a warning scroll to a suspicious player. |
| **`.anticheat jail`** | Banish a player to the GM Jail. |
| **`.anticheat parole`** | Release a player and restore their hearthstone. |
| **`.anticheat delete [Name]`** | Clear records for a specific player. |
| **`.anticheat purge`** | Completely wipe the daily report archives. |

![Admin Interface](https://user-images.githubusercontent.com/16887899/166107956-b8c16ca2-83d3-4d2f-b10e-3e62c0a8e826.png)

---

## ⚙️ Chapter 7: The Master Blueprint (Configuration)

Adjust the tuning of the Anti-Cheat in your `worldserver.conf`.

### 🛠️ Strategic Settings

```conf
# Enable/Disable the entire system
Anticheat.Enable = 1

# Detection Threshholds (Recommended: 70+)
Anticheat.ReportsForIngameWarnings = 70
Anticheat.MaxReportsForDailyReport = 70

# Auto-Moderation (Set to 1 to enable)
Anticheat.KickPlayer = 0
Anticheat.BanPlayer = 0
Anticheat.JailPlayer = 0

# Countermeasures (Always recommended)
Anticheat.CM.TIMEMANIPULATION = 1
Anticheat.CM.Teleport = 1
Anticheat.CM.FLYHACK = 1
```

> [!TIP]
> Use `.reload conf` after editing to apply changes immediately without a restart!

---

## 🚧 Final Notes & Future Rituals (TODO)

- [ ] **Localization**: Translate the Anti-Cheat's whispers into other tongues.
- [ ] **Refinement**: Improve Water Walking and Climb Hack precision during knockbacks.
- [ ] **Zone Exclusion**: Identify specific zones that require detection exceptions.

### 🌍 Localization Progress
- [x] English (enUS)
- [ ] Russian (ruRU)
- [ ] Spanish (esES/esMX)
- [ ] German (deDE)
- [ ] Korean (koKR)
- [ ] Chinese (zhCN/zhTW)