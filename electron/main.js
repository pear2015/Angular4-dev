const electron = require('electron');
// Module to control application life.
const app = electron.app;
const fs = require('fs');
const path = require('path');
var configMgr = require('./common/lib/config-manager');
configMgr.Init(path.join(__dirname, './config/main-conf.json'));

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Create logger for browser window.
var logPath = path.join(app.getPath('userData'), 'logInfo');
var winston = require('winston');
var winstonConfig = require('winston-daily-rotate-file')
var setlogger = require('./common/lib/logger');
var logger = setlogger({
  verbose: 'silly',
  logPath: logPath
}, winston, winstonConfig);
/**
 * token判断是从哪个窗体打开
 */
/*var login_token = {
  access_token: process.env.token
};*/
BrowserWindow.logger = logger;
// Module to control application life.
const crashReporter = electron.crashReporter;


var electronInstall = require('./common/api/electron-install');
if (electronInstall.handleSquirrelEvent(logger)) {
  return;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var shell = require('./common/lib/shell-creator')(electron);
var createLoginShell = require('./browser/login-window');
var loginShell;
var editPasswordFlag;
var ipcMainHandler = require('./common/api/ipcMain-handler')(logger);
var shellCreater;
// 监听登录成功消息
ipcMainHandler.Handle('onLoginSuccess', (event, arg) => {
  if (loginShell instanceof BrowserWindow) {
    editPasswordFlag = true;
    loginShell.close();
  }

  shellCreater = shell.Create(__dirname, configMgr.Get('shell_configs'));
  shellCreater.on('close', function (event) {
    if (editPasswordFlag === false) {
      return;
    }
    event.preventDefault();
    let options;
    let electronLanguage = app.getLocale(); // 设置electron语言设置
    if (electronLanguage === 'pt-PT') { // 葡萄牙语言
      options = {
        type: 'info',
        buttons: ['Confirmar', 'Cancelar'],
        message: 'Tem certeza de sair ?',
        title: 'Dicas'
      }
    } else if (electronLanguage === 'zh-CN') { // 中文
      options = {
        type: 'info',
        buttons: ['Yes', 'No'],
        message: '确认退出吗',
        title: '提示信息'
      }
    } else { // 英语
      options = {
        type: 'info',
        buttons: ['Yes', 'No'],
        message: 'are you sure to exit?',
        title: 'pupopinformation'
      }
    }
    electron.dialog.showMessageBox(options, function (index) {
      if (index === 0) {
        shellCreater.destroy();
      }
    });
  })
});

// 监听退出系统消息
ipcMainHandler.HandleOnce('onExitApp', (event, arg) => {
  logger.info('electron app close...');
  if (process.platform !== 'darwin') {
    app.exit();
  }
});

// 最小化
ipcMainHandler.Handle('hide-window', (event, arg) => {
  logger.info('electron app min app...');
  if (process.platform !== 'darwin') {
    shellCreater.minimize();
  }
});

// 监听修改密码
ipcMainHandler.Handle('editPasswordSuccess', (event, arg) => {
  logger.info('electron app close...');
  if (process.platform !== 'darwin') {
    editPasswordFlag = false;
    shellCreater.close();
    var login_token = process.env.token;
    if (login_token && login_token.length > 0) {
      if (loginShell instanceof BrowserWindow) {
        loginShell.close();
      }
      shell.Create(__dirname, configMgr.Get('shell_configs'));
    } else {
      var configs = configMgr.Get('login_config');
      if (configs['filePath']) {
        configs['fileFullPath'] = __dirname + configs['filePath'];
      }
      loginShell = createLoginShell(BrowserWindow, configs);
      loginShell.show();
      electronInstall.autoUpdate();
    }
  }
});





// electron.dialog.showErrorBox('asdasd','login out')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  logger.info('electron app start now...');
  var login_token = process.env.token;
  if (login_token && login_token.length > 0) {
    if (loginShell instanceof BrowserWindow) {
      loginShell.close();
    }
    shell.Create(__dirname, configMgr.Get('shell_configs'));
  } else {
    var configs = configMgr.Get('login_config');
    if (configs['filePath']) {
      configs['fileFullPath'] = __dirname + configs['filePath'];
    }
    loginShell = createLoginShell(BrowserWindow, configs);
    loginShell.show();
    electronInstall.autoUpdate();
  }
});
app.on('activate', function () {});

crashReporter.start({
  productName: 'electron-seed',
  companyName: 'gsafety',
  submitURL: 'http://numsg.com',
  autoSubmit: true
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
