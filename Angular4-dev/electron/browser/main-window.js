var createMainWindow = function createMainWindow(BrowserWindow, config) {

  'use strict';

  var logger = BrowserWindow.logger;

  if (!config || !config['option']) {
    let msg = 'Cannot create login shell without exactly configuration';
    logger.error(msg);
    throw new Error(msg);
  }

  var option = config['option'];
  var enableDebug = config['enable_debug'];

  var mainWindow = new BrowserWindow(option);

  if (config['fileFullPath']) {
    var fileFullPath = config['fileFullPath'];
    mainWindow.loadURL(`file://` + fileFullPath)
  }
  else {
    var url = config['url']
    mainWindow.loadURL(url)
  }

  // Open the DevTools.
  if (enableDebug)
    mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-navigate-in-page', () => {
    logger.info("web finish load...");
  });

  mainWindow.webContents.on('did-finish-load', function () {
    logger.info("web finish load...");
  });

  mainWindow.webContents.on('did-fail-load', function () {
    logger.info("web fail load...");
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    logger.info("web closed...");
    mainWindow = null;
  });

  return mainWindow;
};

module.exports = createMainWindow;
