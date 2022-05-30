# uMatrix
A fork of [uMutrix](https://github.com/gorhill/uMatrix)

These are the differences:
I deleted the following: 
1. hosts-files
2. asset-viewer 
3. main-blocked
4. recipe-manager
5. support for cloud storage
6. changed some default settings

Since hosts-files, and thus main-blocked and asset-viewer are not necessary since we have uBlock Origin + recipe manager also not very usefull seems to me I have deleted those.

It also comes with a lot of additions:
1. Maximize all windows
2. Stop history recording, also on domain and keyword level
3. Window merger
4. Duplicate tab