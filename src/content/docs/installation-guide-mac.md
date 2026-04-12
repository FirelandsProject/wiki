---
title: ' Installation Guide (macOS)'
author: "Seobryn"
description: 'Step-by-step ritual to configure the Firelands Core on macOS.'
pubDate: 'Sep 11 2023'
---

# 🗺️ Quest: Initializing the Mac Core

Welcome, adventurer. Before you can harness the power of Firelands, you must prepare your machine. This guide will walk you through the ritual of compilation on macOS, ensuring your core is forged with precision.

---

## 🛑 Stage 1: The Gathering (Prerequisites)

Every great architect needs the right tools. First, ensure you have **Homebrew** installed (The legendary package manager for Mac). If you don't have it, retrieve it from [brew.sh](https://brew.sh/).

### 📦 Required Materials
Open your terminal and gather these libraries:

1. **Cmake** (3.27.1+) - *The Master Blueprint*
2. **Boost** (1.82.0) - *The Power Source*
3. **Readline** (8.2.1+) - *The Command Interface*
4. **MySQL** (8.x+) - *The Ancient Archive*
5. **Clang** - *The Great Refiner*
6. **Git** (2.7+) - *The Chronicler*
7. **OpenSSL** (1.1+) - *The Shield of Encryption*

---

## 🛠️ Stage 2: The Forge (Workspace Preparation)

Designate a sacred space for your project. We suggest your home directory.

```zsh
# Create the base directory
mkdir ~/Firelands
cd ~/Firelands

# Clone the Ancient Source
git clone https://github.com/FirelandsProject/firelands-cata
```

### 🧱 Preparing the Chambers
Create dedicated chambers for the building process and the final release:

```zsh
mkdir firelands-release firelands-build
cd firelands-build
```

---

## 🔥 Stage 3: The Incantation (Core Compilation)

Now, we invoke the `cmake` commands to weave the source into reality.

```zsh
export OPENSSL_ROOT_DIR="$(brew --prefix openssl@1.1)"

cmake "../firelands-cata" \
-DCMAKE_INSTALL_PREFIX=../firelands-release  \
-DSCRIPTS=static \
-DMODULES=static \
-DMYSQL_ADD_INCLUDE_PATH=/opt/homebrew/include/mysql \
-DMYSQL_LIBRARY=/opt/homebrew/lib/libmysqlclient.dylib \
-DREADLINE_INCLUDE_DIR=/opt/homebrew/opt/readline/include \
-DREADLINE_LIBRARY=/opt/homebrew/opt/readline/lib/libreadline.dylib \
-DOPENSSL_INCLUDE_DIR="$OPENSSL_ROOT_DIR/include" \
-DOPENSSL_SSL_LIBRARIES="$OPENSSL_ROOT_DIR/lib/libssl.dylib" \
-DOPENSSL_CRYPTO_LIBRARIES="$OPENSSL_ROOT_DIR/lib/libcrypto.dylib" \
-DTOOLS=0 \
-DSERVERS=1 \
-DCMAKE_BUILD_TYPE=RelWithDebInfo
```

> [!TIP]
> **Seeking Game Tools?** Change `-DTOOLS=0` to `-DTOOLS=1` to extract your own maps and data!

### 🔨 Commencing the Build
Execute the final strike of the hammer:

```zsh
make -j $(sysctl -n hw.ncpu)
make install
```

---

## 📜 Stage 4: Attunement (Core Configuration)

Your core is forged, but it must be attuned to your realm.

```zsh
cd ../firelands-release/etc
cp worldserver.conf.dist worldserver.conf
cp authserver.conf.dist authserver.conf
```

### ⚙️ Database Binding
Open `worldserver.conf` and bind your databases:

```conf
DataDir = "~/Firelands/Data"

LoginDatabaseInfo     = "127.0.0.1;3306;firelands;firelands;firelands_auth"
WorldDatabaseInfo     = "127.0.0.1;3306;firelands;firelands;firelands_world"
CharacterDatabaseInfo = "127.0.0.1;3306;firelands;firelands;firelands_characters"
HotfixDatabaseInfo    = "127.0.0.1;3306;firelands;firelands;firelands_hotfixes"
```

---

## 🚀 Stage 5: Ascension (Application Run)

The moment of truth. Open two scrolls (terminal windows) and cast these spells:

### 1. The Gatekeeper (Authserver)
```zsh
cd ../bin/
./authserver
```

### 2. The Realm (Worldserver)
```zsh
./worldserver
```

---

## 🏆 Victory: Quest Complete

**Glory awaits!** Your server is now part of the Firelands Project. You have successfully navigated the trial of macOS compilation.

> [!IMPORTANT]
> Join our [Discord](https://discord.gg/firelandsproject) to share your progress and connect with other developers!