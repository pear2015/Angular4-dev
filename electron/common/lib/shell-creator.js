var shellCreator = function shellCreator(electron) {

  'use strict';

  var logger = electron.BrowserWindow.logger;
  var BrowserWindow = electron.BrowserWindow;
  var app = electron.app;
  var fs = require('fs');
  var path = require('path');

  return {
    Create: create
  };

  /**
   * 根据 shell_configs 配置节点创建应用程序壳
   *
   * @param {any} configs shell_configs 配置节信息
   * @returns
   */
  function create(appPath, configs) {
    let shell;
    if (!(configs instanceof Array)) {
      logger.error('Cannot create shells without exactly shell configs')
      return;
    }
    let screenManager = require('../../common/lib/screen-manager')(electron); // 获得屏幕对象
    configs.forEach(function createShell(config) { // 多屏显示，遍历配置的对象
      let screen = screenManager.GetScreenByCondition(config['screen']);
      if (!screen && config['force_show']) {
        screen = screenManager.GetPrimary();
      }
      if (screen) {
        if (!config || !config['option']) {
          let shellname = config['static_file'];
          let msg = `Cannot create ${shellname} shell without exactly configuration`;
          logger.error(msg);
          throw new Error(msg);
        }
        config['option']['x'] = screen.bounds.x;
        config['option']['y'] = screen.bounds.y;
        config['option']['width'] = screen.bounds.width;
        config['option']['height'] = screen.bounds.height;
        let shellLocation = path.join(appPath, 'browser', config['static_file']);
        if (config["filePath"]) {
          config["fileFullPath"] = appPath + config["filePath"]
        }
        shell = require(shellLocation)(BrowserWindow, config); // 真正的boeserwindow对象
        if (shell instanceof BrowserWindow) {
          shell.show();
          // 监听electron退出事件
        }
      }
    }, this);
    return shell;
  }

};

module.exports = shellCreator;
