import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketQuery } from '../model/socket-info/SocketQuery';

/**
 * 基于Socket.io-client封装的SocketClient, 用于客户端与服务器间的双向通讯
 *
 * @export
 * @class SocketClient
 */
@Injectable()
export class SocketClient {

    public socketQuery: SocketQuery;
    public socketClient;
    public SocketGenerator = io;
    public serverUrl: string;

    constructor() {
    }

    /**
     * SocketClient初始化操作
     *
     * @param {string} url 服务地址，可参考：{http://localhost:8000} or {http://localhost:8000/namespace}
     * @param {string} [path] 自定义路由路径，可选参数，可参考: /authrization
     * @param {Object} [query] 自定义查询参数，可选参数，可参考： { token: 'scret' }
     * @returns {SocketClientStatic} SocketClient基础定义
     * @memberof SocketClient
     */
    Init(url: string, path?: string, query?: Object): SocketClientStatic {
        this.serverUrl = url;
        this.socketClient = this.SocketGenerator(url, {
            transports: ['websocket'],
            autoConnect: false,
            path: path,
            query: query
        });
        return new SocketClientStatic(this.socketClient);
    };

    /**
     * 建立Socket连接
     *
     * @memberof SocketClient
     */
    Connect() {
        this.socketClient.connect();
    };

    /**
     * 关闭Socket连接
     *
     * @memberof SocketClient
     */
    Disconnect() {
        this.socketClient.disconnect();
    };

    /**
     * 消息监听
     *
     * @param {string} eventName 消息名称
     * @param {Function} fn 监听成功后的回调函数
     * @memberof SocketClient
     */
    Listen(eventName: string, fn: Function) {
        this.socketClient.on(eventName, fn);
    };
    /**
     * 是否连接成功
     */
    isConnected(): any {
        return this.socketClient.connected;

    }

    /**
     * 普通消息发送
     *
     * @param {*} [args] 消息参数
     * @param {Function} [fn] 消息发送成功后的回调函数
     * @memberof SocketClient
     */
    Send(args?: any, fn?: Function) {
        this.socketClient.send(args, fn);
    };

    /**
     * 事件消息发送
     *
     * @param {string} eventName  事件名称
     * @param {*} [args] 事件所需参数
     * @param {Function} [fn]  消息发送成功后的回调函数
     * @memberof SocketClient
     */
    SendEvent(eventName: string, args?: any, fn?: Function) {
        this.socketClient.emit(eventName, args, fn);
    };
};


/**
 * 针对于SocketClient的基础定义，用于定义常用的事件监听函数
 *
 * @class SocketClientStatic
 */
export class SocketClientStatic {

    private socketClient;

    constructor(client: SocketIOClient.Socket) {
        this.socketClient = client;
    }

    /**
     * 连接成功时触发
     *
     * @param {Function} onConnect 连接成功后的业务回调。回调参数: [socket] socket对象
     * @param {Function} onConnectionError 连接失败时的业务回调。回调参数: [error] 连接服务时的错误信息
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenConnect(onConnect: Function, onConnectionError: Function): SocketClientStatic {
        this.socketClient.on('connect', (socket) => {
            // this.logger.info(`Successfully Connected to the server, the connection id was`);
            if (onConnect) {
                onConnect(socket);
            }
        });
        this.socketClient.on('connect_error', (error) => {
            // this.logger.error(`There have some errors when start connecting to the server,
            // the error detail was ${error},
            //         >>>stack was ${error.stack}`);
            if (onConnectionError) {
                onConnectionError(error);
            }
        });
        return this;
    };


    /**
     * 发生服务重连时触发
     *
     * @param {Function} onReconnect 重连成功后的业务回调。回调参数: [atempts] 尝试次数
     * @param {Function} onReconnectError 重连成功，但发生错误时的业务回调。回调参数: [error] 连接错误信息
     * @param {Function} onReconnectFailed 重连失败时的业务回调。回调参数: [error] 连接错误信息
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenReconnect(onReconnect: Function, onReconnectError: Function, onReconnectFailed: Function): SocketClientStatic {
        this.socketClient.on('reconnect_attempt', (attempts) => {
            // this.logger.info(`Try to reconnect server again with ${attempts} times`);
            this.socketClient.io.opts.transports = ['polling', 'websocket'];
            if (onReconnect) {
                onReconnect(attempts);
            }
        });
        this.socketClient.on('reconnect_error', (error) => {
            // this.logger.info(`There have some errors when trying to reconnect server again,
            //         the error detail was ${error},
            //         >>>stack was ${error.stack}`);
            if (onReconnectError) {
                onReconnectError(error);
            }
        });
        this.socketClient.on('reconnect_failed', (error) => {
            // this.logger.info(`Failed to reconnect server,
            //         the error detail was ${error},
            //         >>>stack was ${error.stack}`);
            if (onReconnectFailed) {
                onReconnectFailed(error);
            }
        });
        return this;
    };


    /**
     * 服务断连时触发
     *
     * @param {Function} onDisconnect 服务断连后的业务回调。回调参数: [reason] 产生断线重连的原因
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenDisconnect(onDisconnect: Function): SocketClientStatic {
        this.socketClient.on('disconnect', (reason) => {
            // this.logger.warn(`Has been disconnected from the server, the reason was ${reason}`);
            if (onDisconnect) {
                onDisconnect(reason);
            }
        });
        return this;
    };


    /**
     * 连接超时时触发
     *
     * @param {Function} onTimeout 连接超时发生后的业务回调。回调参数: [timeout] 超时时间
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenTimeout(onTimeout: Function): SocketClientStatic {
        this.socketClient.on('connet_timeout', (timeout) => {
            // this.logger.error(`Timeout when trying to connect to the server, use ${timeout} ms`);
            if (onTimeout) {
                onTimeout(timeout);
            }
        });
        return this;
    };


    /**
     * 已连接过程中发生错误时触发
     *
     * @param {Function} onError 错误发生后的业务回调。回调参数: [error] 连接过程中产生的错误信息
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenError(onError: Function): SocketClientStatic {
        this.socketClient.on('error', (error) => {
            // this.logger.error(`There has some errors during connection,
            // the error detail was ${error},
            //  >>>stack was ${error.stack}`);
            if (onError) {
                onError(error);
            }
        });
        return this;
    };


    /**
     * 当服务端接收到ping包时触发
     *
     * @param {Function} onPingRecieved 接收到ping包后的业务回调
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenPing(onPingRecieved: Function): SocketClientStatic {
        this.socketClient.on('ping', () => {
            // this.logger.info(`The server has recieved ping packect`);
            if (onPingRecieved) {
                onPingRecieved();
            }
        });
        return this;
    };


    /**
     * 当客户端接收到从服务端发来的ping包响应
     *
     * @param {Function} onPongRecieved 当接收到ping包响应时的业务回调。回调参数: [latency] pong包接收耗时
     * @returns {SocketClientStatic}
     * @memberof SocketClientStatic
     */
    WhenPong(onPongRecieved: Function): SocketClientStatic {
        this.socketClient.on('pong', (latency) => {
            // this.logger.info(`Has recieved a pong from the server by ${latency} ms`);
            if (onPongRecieved) {
                onPongRecieved(latency);
            }
        });
        return this;
    };

};
