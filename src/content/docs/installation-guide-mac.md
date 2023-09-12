---
title: 'Installation Guide (Mac)'
author: "Seobryn"
description: 'Step by Step How to steup Firelands Cata for Mac'
pubDate: 'Sep 11 2023'
---

## Prerequisites

Before start all this guide we recomend to instal Brew, which is a Package manager for Mac Terminal, you can learn more about it following this [Link](https://brew.sh/)

To Compile Firelands Cata, you have to install the Following Libraries:

1. Cmake (3.27.1+)
2. Boost (1.82.0)
3. Readline (8.2.1+)
4. Mysql (8.x+)
5. Clang
6. Git 2.7+
7. OpenSSL 1.1 +

## Workspace preparation

Once you have installed all of this Libraries, you have to create your workspace folder, in our example, we create our workspace in the main User Folder.
```zsh
mkdir ~/Firelands
cd ~/Firelands
```
After this, you can donwload our main source code from [Firelands Cata Github](https://github.com/FirelandsProject/firelands-cata).
```zsh
git clone https://github.com/FirelandsProject/firelands-cata
```

After you download the code, you have to create a dedicated folders for the **build** and **release**:
```zsh
mkdir firelands-release firelands-build
cd firelands-build
```

## Core compilation

Once you have those folders, you are able to compile the source, so you have to configure your solution with Cmake:
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

With this configuration, you are able to build the game server without Game tools, which is the tools needed to extract maps, vmaps, mmaps, etc.

If you want to compile the Tools, the Only thing you need is change the variable `-DTOOLS` to 1 to enable the Tools build.

After the cmake configuration, you are able to compile your code, to do this you have to run this command:

```zsh
make -j $(nproc)
make install
```

Once this command finish, you code are compiled and ready to start.

## Core configuration

To configure the core properties, you have to move to the release folder, using this command:
```zsh
cd ../firelands-release/etc
```

Inside this folder you can see two files:  `worldserver.conf.dist` and `authserver.conf.dist`, this files has the base configuration of the server, and if you want to run your server, you have to rename those files running the following command:

```zsh
cp worldserver.conf.dist worldserver.conf
cp authserver.conf.dist authserver.conf
```

Now you can open it and confiigure some things that are required before run the **worldserver** file.

### Worldserver Config

You have to configure some things before start worldserver application:
```conf
DataDir = "~/Firelands/Data"

LoginDatabaseInfo     = "127.0.0.1;3306;firelands;firelands;firelands_auth"
WorldDatabaseInfo     = "127.0.0.1;3306;firelands;firelands;firelands_world"
CharacterDatabaseInfo = "127.0.0.1;3306;firelands;firelands;firelands_characters"
HotfixDatabaseInfo    = "127.0.0.1;3306;firelands;firelands;firelands_hotfixes"
```

Here's the explanation about this variables:

- **DataDir:** Is the path of the folder that contains the Game Data Extracted, to be able to use inside the core, you can download it from [HERE.](https://github.com/seobryn/cata-client-data/releases/download/v.10/FC_V10.zip)

- **LoginDatabaseInfo:** This is the configuration of your Auth Database, you have to put here your DB Credentials and the name of the Database.

- **WorldDatabaseInfo:** This is the configuration of your World Database, you have to put here your DB Credentials and the name of the Database.

- **CharacterDatabaseInfo:** This is the configuration of your Characters Database, you have to put here your DB Credentials and the name of the Database.

- **HotfixDatabaseInfo:** This is the configuration of your Hotfix Database, you have to put here your DB Credentials and the name of the Database.

### Authserver Config

You have to configure the database info before start **Authserver** application:

```conf
LoginDatabaseInfo = "127.0.0.1;3306;firelands;firelands;firelands_auth"
```

Here's the explanation about this variable:

- **LoginDatabaseInfo:** This is the configuration of your Auth Database, you have to put here your DB Credentials and the name of the Database.

## Application run

To run the applications, you have to be open 2 terminals, and run the following commands staying inside the `firelands-release/bin` folder:

```zsh
cd ../bin/
```

In the first Terminal, you can run the **Authserver**:
```zsh
./authserver
```

In the second Terminal, you can run the **Worldserver**:
```zsh
./worldserver
```

Afther run this commands, you have your code Running!, and you are ready to run the game and Enjoy!.