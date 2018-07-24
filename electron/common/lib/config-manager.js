var fs = require('fs');

var configManager = function configManager() {

    "use strict";

    if (!(this instanceof configManager)) {
        manager = new configManager();
    }
    else {
        manager = this;
    }

    var manager;
    var config;

    return {
        Init: init,
        Get: getSection
    };

    /**
     * 初始化返回配置内容
     * 
     * @param {any} path 配置文件路径
     * @returns 
     */
    function init(path) {

        try {
            let buffer = fs.readFileSync(path);
            manager.config = JSON.parse(buffer.toString());
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * 获取配置项信息
     * 
     * @param {any} key 配置键名称
     * @returns 
     */
    function getSection(key) {

        if (manager.config instanceof Object) {
            return manager.config[key];
        }
        return "";
    }
}

module.exports = configManager();