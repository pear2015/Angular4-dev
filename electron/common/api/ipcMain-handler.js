const {
  ipcMain
} = require('electron');


var ipcMainEventHandler = function ipcMainEventHandler(logger) {

    'use strict';

    return {
        Handle: handle,
        HandleOnce: handleOnce,
        RemoveHandler: removeHandler,
        RemoveAllHandlers: removeAllHandlers
    };

    /**
     * 处理渲染进程请求
     * 
     * @param {string} channel 渲染进程请求频道消息
     * @param {Function(event, args)} handler 频道监听处理器
     */
    function handle(channel, handler) {
        logger.info(`Start handling the ${channel} request`)
        ipcMain.on(channel, handler);
    };

    /**
     * 处理一次性渲染进程请求
     * 
     * @param {string} channel 渲染进程请求频道消息
     * @param {Function(event, args)} handler 频道监听处理器
     */
    function handleOnce(channel, handler) {
        logger.info(`Start handling the ${channel} request for once`)
        ipcMain.once(channel, handler);
    };

    /**
     * 取消对请求频道的监听
     * 
     * @param {string} channel 渲染进程请求频道消息
     * @param {Function(event, args)} handler 频道监听处理器
     */
    function removeHandler(channel, handler) {
        logger.info(`Cancel handling the ${channel} request`)
        ipcMain.removeListener(channel, handler);
    };

    /**
     * 取消对所有请求频道的监听
     * 
     * @param {any} [channel=null] 特指的频道消息
     */
    function removeAllHandlers(channels = null) {
        logger.info(`Cancel handling all the ${channel} request`)
        ipcMain.removeAllListeners(channel);
    };

};

module.exports = ipcMainEventHandler;
