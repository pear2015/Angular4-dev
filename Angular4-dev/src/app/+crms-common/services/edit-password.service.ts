import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';

@Injectable()
export class EditPasswordService extends ServiceBase {

  private apiBaseUrl: string;
  private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public configService: ConfigService,
    private httpProxy: HttpProxyService,
    private utilHelper: UtilHelper) {
    super(configService);
    this.initialGauthService();
  }

  /**
   * 初始化犯罪服务基地址
   */
  async initialGauthService(): Promise<any> {
    return this.apiBaseUrl = await this.inititGauthBaseUrl();
  }

  /**
   * 修改密码服务
   */
  @exceptionHandle
  async editPassword(obj: any, token: string): Promise<any> {
    if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
      await this.initialGauthService();
    }
    let url = this.apiBaseUrl + 'user/password' + '?access_token=' + token;
    let result = await this.httpProxy.putRequest(url,
     obj,
      'editPassword', { headers: this.Requestheaders });
    if (this.utilHelper.AssertNotNull(result)) {
      return result;
    } else {
      return null;
    }
  }

}
