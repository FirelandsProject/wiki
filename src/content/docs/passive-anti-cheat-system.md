---
title: "Passive Anti Cheat System Documentation"
description: "How to configure and use the passive anti cheat system"
pubDate: "Sep 11 2023"
---

## Fireland Passive Anticheat

### **Features**

Ported and continued by M'Dic (acidmanifesto || c4eva)
Original implementation LordPsyian (TC TBC Era to TC WOTLK)

- Passive Anticheat implemented and updated
- Automatic Moderation options
- False Positives Reduced Greatly
- Reports to GM's online or Automatically takes actions thru jail\kick\ban. 
- Teleport Helpers Added in for detecting of none legal teleports
- Actual Detections improved upon drastically 
- If you are in .GM on it should not flag you or report you.
- Configuration reloadable via .reload conf gm cmd
- Experimental Countermeasure is implemented.

![image](https://user-images.githubusercontent.com/16887899/166107795-c757eaf9-1290-4d23-98ad-1c32753e521a.png)

### Detections Provided

- Fly hack
- Teleport Hack
- Jump Hack
- Speed Hack
- Ignore Control (Move while rooted) Hack
- Water Walk Hack
- Teleport Z pane Hack
- Ignore Z Axis Hack
- Anti-Swim Hack
- Gravity Hack
- Anti-Knock Back
- No Fall Damage
- BG Start Exploit\Hack
- Op Ack Hack
- LUA Private Function Spell Casting (Log only)

### Counter Measures Provided

- Time Manipulation
- BG Start Spot Teleport\Exploit
- Teleport Hack
- Fly Hack
- Jump Hack
- Advance Jump Hack
- Ignore Z
- Speed hack
- LUA Private Function Spell Cast

![image](https://user-images.githubusercontent.com/16887899/162586689-949ef045-5547-4b58-8957-aad012cd8eae.png)

### Know false positives \ Feature Concerns

- Ignore Control:
Excessive Latency will cause false flags, if the lag is that bad they shouldnt even be playing on the server but it was shown that was the case in CC

- Ignore Z-Axis Hack:
On occasion depending on player's build at times the player may get hit with a false positive based on if there are "potholes" in the maps\vmaps. Updating maps\vmaps ot latest will help reduce this, ensure compile and maps are at latest.

- Auto Moderation Jail Feature
If offender is a DK in the DK Starter Area they will be shackled on the spot and not teleported. Its the way the core handles keeping the DK in it's zone until successifully completed.

- Summoned by a GM (.sum) will Jail Break a player out:

### Common Sense Notice

This anticheat is designed to operate with none modded characters. Modding characters beyond the basic stats of what they are suppose to have possible will cause issues in some cases with false flags. 
Using select GM CMDS while not in .gm on may cause flags as well. It goes back to the character being modified for that moment outside of stock.

### Custom Map Notice

Due to the unique handling and creation methods of custom maps with the GroundZ + FloorZ and player Z handling,
You may experience false detection hits for Teleport to Pane and Ignore Z Axis.

### Understanding the Report Tables

Characters DB:
players_reports_status Table:  is that logged anticheat stats for the players current active sessions.
daily_players_reports Table: is the log of the players life time anticheat stats that is logged until purged.

![image](https://user-images.githubusercontent.com/16887899/166588074-758e833a-f070-4e66-a322-55e9b168ab8d.png)

### GM CMDS Included

- **.anticheat global**     Informs you if anticheat is turned on
- **.anticheat player**     Tells you current auto reports
- **.anticheat delete PLAYERNAME**     Deletes reports on player from anticheat system
- **.anticheat purge**      completely clears the player_daily_reports table    
- **.anticheat jail**           Sends Player to gm jail which then shackles them and hearthstone binds them to gm jail while applying a indef deserter aura to prevent queuing jailbreaks
- **.anticheat parole**   Recommended to be used in gm jail, teles to faction capital and rebinds hearthstone there while clearing 
                              their reports and removing indef deserter auras
- **.anticheat warn**       Sends player warning message that they are being monitored
- **.anticheat handle 0/1** Zero turns off anticheat, 1 turns on anticheat.

![image](https://user-images.githubusercontent.com/16887899/166107956-b8c16ca2-83d3-4d2f-b10e-3e62c0a8e826.png)

### World Console and Logging
Anticheat Logging\Appenders
Currently spams into its own file
If you want world console spam just use Logger.anticheat=3,Console Server Anticheat
Thanks to Smerdokryl from TC Discord

Appender.Anticheat=2,3,15,anticheat.log,a
Logger.anticheat=3,Server Anticheat

![image](https://user-images.githubusercontent.com/16887899/162455699-a9da099c-72f0-4652-8363-37341931a855.png)

### Understanding the Anticheat Player Output

The gm cmd .anticheat player will be the most powerful reporting gm command a gm (level 2 or 3) will have available at their gm level. 
Typing .anticheat player while the player is targeted or typing .anticheat player PLAYERNAME will Show the following

![image](https://user-images.githubusercontent.com/16887899/230483338-009ffaab-f668-4350-bfb1-6f8436a211fc.png)

![image](https://user-images.githubusercontent.com/16887899/208321021-bd1fe0ac-7947-47f6-bf94-24c1c863bb7b.png)

Information Provided is as follows currently:

Targeted Player Name: Name of the Player the Output report is for.

IP Address: Ip address of the Player the Output report is for.

Latency: Latency (lag) the Output report is for.

Account Previously Banned: Does the account have a previous ban on record, if yes will show reason and when ban ended.

Character Previously Banned: Does the character have a previous ban on record, if yes will show reason and when ban ended.

Macro Requiring Lua Unlock Detected: If Lua Unlocked only Macros are detected it will output as yes.

Counter Measures Deployed: The Current number of Countermeasures deployed for the players online session

Average: Average amount of cheating down with in a minutes time.

Total Reports: Total Amount of ALL Cheats Reported by the anticheat.

Speed Reports: Total Amount of ALL Speed Hacks Reported by the anticheat.

Fly Reports: Total Amount of ALL Fly and Advance Fly Hacks Reported by the anticheat.

Jump Reports: Total Amount of ALL Jump and Advance Jump Hacks Reported by the anticheat.

Walk on Water Reports: Total Amount of ALL Walk on Water Hacks Reported by the anticheat.

Teleport To Plane Reports: Total Amount of ALL Teleport to Plane Reported by the anticheat.

Teleport Reports: Total Amount of ALL Teleport Hacks and Duel Teleport Hacks Reported by the anticheat.

Climb Reports: Total Amount of ALL Climb Hacks Reported by the anticheat.

Ignore Control Reports: Total Amount of ALL Ignore Control Hacks Reported by the anticheat.

Ignore Z-Axis Reports: Total Amount of ALL Ignore Z-Axis Hacks Reported by the anticheat.

Ignore Anti-Swim Reports: Total Amount of ALL Anti-Swim Hacks Reported by the anticheat.

Gravity Reports: Total Amount of ALL Gravity Hacks Reported by the anticheat.

Anti-Knock Back Reports: Total Amount of ALL Anti-Knock Back Hacks Reported by the anticheat.

No Fall Damage Reports: Total Amount of ALL No Fall Damage Hacks Reported by the anticheat.

Op Ack Reports: Total Amount of ALL Op Ack Hacks Reported by the anticheat.

**RECOMMEND CONF SETTINGS**
Confs are reloadable with .reload conf 

```conf
###################################################################################################
#   ANTICHEAT
#
#     Anticheat.Enable
#       Description: Enables or disables the Anticheat System functionality
#       Default:     1 - (Enabled)
#                    0 - (Disabled)

Anticheat.Enable = 1

#     Anticheat.EnabledOnGmAccounts
#       Description: Enables detection for GM accounts
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.EnabledOnGmAccounts = 0

#     Anticheat.ReportsForIngameWarnings
#       Description: How many reports the player must have to notify to GameMasters ingame when he generates a new report.
#       Default:     70

Anticheat.ReportsForIngameWarnings = 70

#     Anticheat.MaxReportsForDailyReport
#       Description: How many reports must the player have to make a report that it is in DB for a day (not only during the player's session).
#       Default:     70

Anticheat.MaxReportsForDailyReport = 70

#     Anticheat.ReportinChat
#       Description: min and max total reports to trigger gm chat message spam.
#       Default:     So with 70 being min and 80 being max, it will spam gm in chat 10 times.
#                    Anticheat.ReportinChat.Min = 70
#                    Anticheat.ReportinChat.Max = 80

Anticheat.ReportinChat.Min = 70
Anticheat.ReportinChat.Max = 80

#     Anticheat.AlertFrequency
#       Description: Once Ingame warngings and report in chat min is met, this will throttle to alert the gms every other count
#       Default:     So with 1 being the default, u will get a message alert for every 1 violations.
#       Anticheat.AlertFrequency = 1

Anticheat.AlertFrequency = 1

#     Anticheat.WriteLog
#       Description: Enable writing to log when a player is detected using hacks
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.WriteLog = 1

#     Anticheat.Detect
#       Description: It represents which detections are enabled (ClimbHack disabled by default).
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.LUAblocker = 1
Anticheat.DetectFlyHack = 1
Anticheat.DetectWaterWalkHack = 1
Anticheat.DetectJumpHack = 1
Anticheat.DetectTelePlaneHack = 1
Anticheat.DetectSpeedHack = 1
Anticheat.DetectClimbHack = 1
Anticheat.DetectTelePortHack = 1
Anticheat.IgnoreControlHack = 1
Anticheat.DetectZaxisHack = 1
Anticheat.AntiSwimHack = 1
Anticheat.DetectGravityHack = 1
Anticheat.AntiKnockBack = 1
Anticheat.NoFallDamage = 1
Anticheat.DetectBGStartHack = 1
Anticheat.OpAckOrderHack = 1

#     Anticheat.StricterFlyHackCheck
#       Description: Checks moveflag ascending (may give false positives)
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.StricterFlyHackCheck = 1

#     Anticheat.StricterDetectJumpHack
#       Description: Checks moveflag for advance stricter jump hacks (may give false positives)
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.StricterDetectJumpHack = 1

#     Anticheat.SpeedLimitTolerance
#       Description: Speed Limit Tolerance allows a certain whole percentage of tolerance to speed 
#       hack logging and detection.
#
#       Example: AnticheatMgr:: Speed-Hack (Speed Movement at 12% above allowed Server Set rate 8%.)
#       will be detected since its 4 (default) and higher, but anything 3 and lower will not be flagged.
#       Default:    4 - (Default)
#

Anticheat.SpeedLimitTolerance = 4

#     Automatic Moderation Features
#
#     Anticheat.KickPlayer
#     Anticheat.ReportsForKick
#
#       Description: Enables and Auto kick when reports reach threshhold
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#       Default:    70 - (Kicks at 70 auto reports)
#

Anticheat.KickPlayer = 0
Anticheat.ReportsForKick = 75

#     Anticheat.BanPlayer
#     Anticheat.ReportsForBan
#
#       Description: Enables and Auto ban when reports reach threshhold
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#       Default:    70 - (Bans at 70 auto reports)
#

Anticheat.BanPlayer = 0
Anticheat.ReportsForBan = 70

#     Anticheat.JailPlayer
#     Anticheat.ReportsForJail
#
#       Description: Enables and Auto Jail when reports reach threshhold
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#       Default:    70 - (Jails at 70 auto reports)
#

Anticheat.JailPlayer = 0
Anticheat.ReportsForJail = 70

#     Anticheat.AnnounceKick
#     Anticheat.AnnounceBan
#     Anticheat.AnnounceJail
#       Description: Send a message to all players when a user kicked, banned, jailed.
#       Default:    0 - (Disabled)
#                   1 - (Enabled)

Anticheat.AnnounceKick = 0
Anticheat.AnnounceBan = 0
Anticheat.AnnounceJail = 0



#
###################################################################################################

###################################################################################################
#   ANTICHEAT COUNTER MEASURE
#
#     Anticheat Counter Measures
#
#     Anticheat.CM.TIMEMANIPULATION
#
#       Description: Counters Time Manipulation hacks. These hacks can cause server to crash.
#
#       Default:    1 - (Enabled)
#                   0 - (Disabled)
#

Anticheat.CM.TIMEMANIPULATION = 1

#
#     Anticheat.CM.Teleport
#
#       Description: Sends player back to last gps position if player cheats and teleports.
#
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.Teleport = 1

#
#     Anticheat.CM.FLYHACK
#
#       Description: Sets player back to the ground if fly hack is detected
#
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.FLYHACK = 1

#
#     Anticheat.CM.JUMPHACK
#     Anticheat.CM.ADVJUMPHACK
#       Description: Sets player back to the ground if jump hack is detected
#
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.JUMPHACK = 1
Anticheat.CM.ADVJUMPHACK = 1

#
#     Anticheat.CM.IGNOREZ
#
#       Description: Sets player back to the ground if ignore-z hack is detected
#
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.IGNOREZ = 1

#
#     Anticheat.CM.SPEEDHACK
#
#       Description: Sets player back to allowed server rate speed when speed hack is detected
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.SPEEDHACK = 1

#
#     Anticheat.CM.WriteLog
#
#       Description: Enables Logging
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.WriteLog = 1

#
#     Anticheat.CM.ALERTSCREEN
#
#       Description: Alerts online GMs of Counter Measure being deployed via screen alert
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.ALERTSCREEN = 1

#
#     Anticheat.CM.ALERTCHAT
#
#       Description: Alerts online GMs of Counter Measure being deployed via chat alert
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.CM.ALERTCHAT= 1

#
#     Anticheat.BG.StartAreaTeleport
#
#       Description: Sends player back to start position if player cheats and teleports out of start spot
#                    before the BG begins.
#       Default:    0 - (Disabled)
#                   1 - (Enabled)
#

Anticheat.BG.StartAreaTeleport = 1

# Anticheat Logging\Appenders
# Currently spams into its own file
# If you want world console spam just use Logger.anticheat=3,Console Server Anticheat

Appender.Anticheat=2,3,15,anticheat.log,a
Logger.anticheat=3,Server Anticheat

#
###################################################################################################
```

### Known issues and TODO list

- [ ] Localize
- [ ] Water Walking at times does false flags when going over certain shallow water.
- [ ] Climb Hack can at times false flag durning a knock back.
- [ ] Speed hack can at times be hit when there is no cheating due to how the client handles server rate speed build updated.
- [ ] Adv Jump hack rarely at times false hits when jumping over select objects.
- [ ] Anti Knock Back can at times false hit when player gets knocked back but is under a object or near a wall.
- [ ] Ignore Control can at times false hit when a player gets delayed rooted via client\server packet handling.
- [ ] Identify any zones needing inclusion from select detection.

### Localize Firelands_Strings
- [x] LOCALE_enUS = 0
- [ ] LOCALE_koKR = 1
- [ ] LOCALE_frFR = 2
- [ ] LOCALE_deDE = 3
- [ ] LOCALE_zhCN = 4
- [ ] LOCALE_zhTW = 5
- [ ] LOCALE_esES = 6
- [ ] LOCALE_esMX = 7
- [ ] LOCALE_ruRU = 8