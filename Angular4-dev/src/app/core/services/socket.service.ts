import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService } from './config.service';
import { HttpProxyService } from './http.proxy.service';
import { SocketClient } from '../socket-io.client';
import { SocketQuery } from '../../model/socket-info/SocketQuery';
import { UserInfo } from '../../model/auth/userinfo';
import { EventAggregator } from './eventaggregator.service';
/**
 * 配置服务
 */
@Injectable()
export class SocketService {
  private socketConnectUrl: string;
  private socketApiBaseUrl: string;
  // 查询参数
  socketQuery: SocketQuery;
  socketClientManager: any;
  // 数据传输格式必须在GET和POST方法中加入 默认的数据格式 text/plain
  private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
  constructor(private configService: ConfigService,
    private httpProxy: HttpProxyService,
    private socketClient: SocketClient,
    private eventAggregator: EventAggregator
  ) {
  }
  /*--------------------socket本身提供的方法-----------------------------------------*/
  /**
   * 初始化socket的连接地址
   *
   * @returns {Promise<any>}
   * @memberof SocketService
   */
  initSocketConnectionService(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.configService.get('socketConnectUrl').then(url => {
        if (url) {
          this.socketConnectUrl = url;
          this.socketClientManager = this.socketClient.Init(this.socketConnectUrl, '', '');
          return resolve();
        } else {
          return reject('can not read apiBaseUrl config.');
        }
      });
    });
  }
  /**
   * 初始socket基地址
   */
  initialSocketService(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.configService.get('socketApiBaseUrl').then(url => {
        if (url) {
          this.socketApiBaseUrl = url + '/api/v1';
          return resolve();
        } else {
          return reject('can not read apiBaseUrl config.');
        }
      });
    });
  }
  /**
   * 建立socket连接
   * @memberof HomeComponent
   */
  buildSocketIOConnect() {
    this.socketClient.Connect();
  }
  /**
   * socket注册
    */
  socketRegister(event: string, socketQuery: SocketQuery) {
    this.socketClient.SendEvent(event, this.socketQuery, () => {
    });
  }
  /**
   * redis 检测
   * redis异常 socket重连
   */
  async checkRedisStatus(socketClientId: string) {
    let url = this.socketApiBaseUrl + '/socket/redis/status/' + socketClientId;
    let result = await this.httpProxy.getRequest(url,
      'addEventListener', { headers: this.Requestheaders });
    if (!result) {
      this.socketClient.Disconnect();
      // 发布消息 登录成功 关闭弹框
      this.eventAggregator.publish('redisException', '');
    } else {
      // 发布消息 登录成功 关闭弹框
      this.eventAggregator.publish('loginSuccess', '');
    }
  }
  /**
   * 注册监听
  */
  addEventListener(eventList: string[]): Promise<any> {
    let url = this.socketApiBaseUrl + '/socket/event/add/';
    let result = this.httpProxy.postRequest(url,
      JSON.stringify(eventList),
      'addEventListener', { headers: this.Requestheaders });
    return result;
  }
  /**
   * 获取事件监听消息
   * @param {any} name
   * @memberof HomeComponent
   */
  async  getListenMessage(event: string): Promise<any> {
    return this.socketClient.Listen(event, result => {
      return result;
    });
  }
  /**
   * socket断开连接
   */
  disconnetSocket() {
    this.socketClient.Disconnect();
  }
  /*--------------------socket外部调用方法-----------------------------------------*/

  /**
 * socket 检测socket是否连接成功
 * 返回socket连接的状态
 */
  checkSocketConnect() {
    return this.socketClient.isConnected();
  }
  /**
   * 检测当前的socket状态
   * 1、连接成功
   * 2、断开连接
   * 3、重连失败
   * 4、
   *  */
  getSocketCurrentStatus(userinfo: UserInfo) {
    /**
     * 重新连接成功进行socket注册
     * 检测redis状态
     */
    this.socketClientManager.WhenConnect((s) => {
      this.socketQuery = new SocketQuery(userinfo.orgPersonId, userinfo.userName, userinfo.roleType, userinfo.centerCode);
      this.socketRegister('register', this.socketQuery);
      // socket 服务重启后会自动连接 但此时redis服务检测不到连接
      // this.checkRedisStatus(this.socketClient.socketClient.id);
        // 发布消息 登录成功 关闭弹框
      this.eventAggregator.publish('loginSuccess', '');
    }, (e) => {
    });

    // 判断重连次数 大于5次 强制退出
    this.socketClientManager.WhenReconnect((s) => {
      if (s === 5) {
        // 发布消息 强制退出
        this.eventAggregator.publish('quitLogin', s);
      }
    }, (e) => {
    });
  }

}
