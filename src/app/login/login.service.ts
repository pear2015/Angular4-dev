import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Md5 } from 'ts-md5/dist/md5';
import { ConfigService, HttpLoginProxyService, UrlHelperService, UtilHelper } from '../core';
import { LoginLog } from '../model/common/LoginLog';

/**
 * 登录授权服务
 */
@Injectable()
export class LoginService {

  // 重定向地址
  private restAddress: string;
  // 业务系统唯一标识符
  private clientId: string;
  // 密钥
  private clientSecret: string;
  // 用户名
  private userName: string;
  //  密码
  private password: string;
  // 范围
  private scope: string;
  private apiBaseUrl: string;

  private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
  constructor(
    private configService: ConfigService,
    private httpProxy: HttpLoginProxyService,
    private urlhelper: UrlHelperService,
    private utilhelper: UtilHelper,
  ) {
  }

  /**
   * 初始化数据，主要用于验证服务是否发布成功
   */
  async initialData(): Promise<any> {
    await this.configService.get(['gauthBaseUrl', 'clientId', 'clientSecret',
      'userName', 'password', 'scope', 'apiBaseUrl']).then(urls => {
        if (urls) {
          this.restAddress = urls[0];
          this.clientId = urls[1];
          this.clientSecret = urls[2];
          this.userName = urls[3];
          this.password = Md5.hashStr(urls[4]).toString();
          this.scope = urls[5].replace(/,/g, '%20');
          this.apiBaseUrl = urls[6];
        } else {
          return Promise.reject('can not read UapRestAddress config.');
        }
      });
  }

  /**
   * 根据用户名和密码从认证平台获取token
   */
  getToken(userName: string, password: string): Promise<any> {
    // 身份验证
    password = Md5.hashStr(password).toString();
    let url = this.restAddress +
      'oauth/token?client_id=' + this.clientId + '&' + 'client_secret=' + this.clientSecret + '&' +
      'grant_type=password' + '&' + 'scope=' + this.scope + '&' + 'username=' + userName + '&' + 'password=' + password;
    let option = new RequestOptions();
    return this.httpProxy.postRequest(url, 'login', option)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  /**
   * 保存登陆日志
   *
   * @param {LoginLog} loginLog
   * @returns
   * @memberof LoginService
   */
  async saveLoginLog(loginLog: LoginLog) {
    try {
      if (this.utilhelper.AssertNotNull(this.apiBaseUrl)) {
        let url = this.apiBaseUrl + '/api/v1/loginlog/save';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(loginLog), 'saveLoginLog', { headers: this.Requestheaders });
        if (this.utilhelper.AssertNotNull(result.ok) && result.ok === false) {
          return false;
        } else {
          return result;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }


  /**
   * 保存登出日志
   *
   * @param {LoginLog} loginLog
   * @returns
   * @memberof LoginService
   */
  async updateLoginLog(loginLog: LoginLog) {
    try {
      if (this.utilhelper.AssertNotNull(this.apiBaseUrl)) {
        let url = this.apiBaseUrl + '/api/v1/loginlog/update';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(loginLog), 'updateLoginLog', { headers: this.Requestheaders });
        if (this.utilhelper.AssertNotNull(result.ok) && result.ok === false) {
          return false;
        } else {
          return result;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 查询用户可访问业务系统
   */
  async getAccessSystem(token: string) {
    try {
      console.log(11);
      let apiUrl = await this.urlhelper.getGauthBaseUrl('getAccessSystem');
      if (this.utilhelper.AssertNotNull(apiUrl)) {
        let url = this.urlhelper.formatUrl(apiUrl, token);
        console.log(url);
        let result = await this.httpProxy.getRequest(url, 'getAccessSystem', { headers: this.Requestheaders });
        return result;
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 根据token及业务系统id查询用户信息及其角色
   */
  getUserInfo(token: string, clientId?: string) {
    return this.urlhelper.getGauthBaseUrl('getUserInfo').then(r => {
      let apiUrl = r;
      if (this.utilhelper.AssertNotNull(apiUrl)) {
        let url;
        if (this.utilhelper.AssertNotNull(clientId)) {
          url = this.urlhelper.formatUrl(apiUrl, clientId, token);
        } else {
          url = this.urlhelper.formatUrl(apiUrl, this.clientId, token);
        }
        return this.httpProxy.getRequest(url, 'QueryService', { headers: this.Requestheaders })
          .then(result => {
            if (this.utilhelper.AssertNotNull(result)) {
              return result;
            }
          }).catch(e => {
            console.log(e);
          });
      }
    });
  }

  /**
   * 根据角色Code查询角色菜单(包括子菜单)
   */
  getMenu(clientId: string, code: string, token: string) {
    return this.urlhelper.getGauthBaseUrl('getMenu').then(r => {
      let apiUrl = r;
      if (this.utilhelper.AssertNotNull(apiUrl)) {
        let url = this.urlhelper.formatUrl(apiUrl, clientId, code, token);
        return this.httpProxy.getRequest(url, 'QueryService', { headers: this.Requestheaders })
          .then(result => {
            if (this.utilhelper.AssertNotNull(result)) {
              return result;
            }
          }).catch(e => {
            console.log(e);
          });
      }
    });
  }
}
















