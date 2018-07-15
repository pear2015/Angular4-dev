import { Injectable } from '@angular/core';
declare let electron: any;

@Injectable()
export class IpcRendererService {

    private _ipcRenderer = electron.ipcRenderer;
    /**
     * 监听主进程请求
     *
     * @param {string} message 事件消息
     * @param {*} done 事件消息接受后的回调操作
     * @memberof IpcRendererService
     */
    on(message: string, done: any) {
        this._ipcRenderer.on(message, done);
    }

    /**
     * 向主进程发送事件消息
     *
     * @param {string} message 事件消息
     * @param {any[]} args 消息参数
     * @memberof IpcRendererService
     */
    send(message: string, args: any[]) {
        this._ipcRenderer.send(message, args);
    }


    /**
     * 向主进程发送同步事件消息
     *
     * @param {string} message 事件消息
     * @param {any[]} args 消息参数
     * @memberof IpcRendererService
     */
    sendSync(message: string, args: any[]) {
        this._ipcRenderer.sendSync(message, args);
    }


    /**
     * 向主进程发送API调用请求
     *
     * @param {string} action 具体api动作
     * @param {any[]} args api请求参数
     * @returns
     * @memberof IpcRendererService
     */
    api(action: string, args: any[]) {
        this._ipcRenderer.send('api', action, args);
        return new Promise((resolve, reject) => {
            this._ipcRenderer.once('$(action)reply', (e: any, reply: any, status: any) => {
                if (!reply) {
                    return reject(status);
                }
                return resolve(reply);
            });
        });
    }


    /**
     * 向主进程发送对话消息弹出请求
     *
     * @param {string} action 对话消息动作
     * @param {any[]} args 对话消息参数
     * @memberof IpcRendererService
     */
    dialog(action: string, args: any[]) {
        this._ipcRenderer.send('dialog', action, args);
    }
}
