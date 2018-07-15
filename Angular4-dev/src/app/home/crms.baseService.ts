import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { ConfigService, HttpLoginProxyService, UrlHelperService, UtilHelper } from '../core';
import { LoginLog } from '../model/common/LoginLog';

/**
 * 登录授权服务
 */
@Injectable()
export class CrmsBaseService {

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
  initialData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.configService.get(['gauthBaseUrl', 'clientId', 'clientSecret', 'userName', 'password', 'scope', 'apiBaseUrl']).then(urls => {
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
      }).then(result => resolve())
        .catch(reason => {
          reject(reason);
        });
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
   * 查询用户可访问业务系统
   */
  async getAccessSystem(token: string) {
    try {
      let apiUrl = await this.urlhelper.getGauthBaseUrl('getAccessSystem');
      if (this.utilhelper.AssertNotNull(apiUrl)) {
        let url = this.urlhelper.formatUrl(apiUrl, token);
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
}
















