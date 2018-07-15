# Electron Installer描述

基于electron-packager打包后制作windows安装包

## Installing

```sh
npm install --save-dev electron-winstaller
```

## Usage

Require the package:

```js
var electronInstaller = require('electron-winstaller');
```

Then do a build like so..

```js
gulp.task("createWindowsInstaller",function(){
  resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/output/achilles-shell-win32-x64',
    outputDirectory: './dist/windows-installation-package',
    loadingGif:'./scripts/gulp/loading.gif',
    description:'achilles',
    authors: 'Gsafety',
    noMsi:'true',
    title:'achilles',
    version:JSON.parse(fs.readFileSync('./package.json', 'utf8')).version,
    setupExe:'achilles-' + JSON.parse(fs.readFileSync('./package.json', 'utf8')).version + '-win32-x64.exe',
    setupIcon:'achilles.ico',
    //remoteReleases:'http://172.18.24.38:8020/',
    exe: 'achilles-shell.exe'
  });
})
```
