import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class ApplyCompleteService extends ServiceBase {

  private apiBaseUrl: string;
  private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public configService: ConfigService,
    private httpProxy: HttpProxyService,
    private utilHelper: UtilHelper
  ) {
    super(configService);
    this.initialCrmsService();
  }

  /**
   * 初始化犯罪服务基地址
   */
  async initialCrmsService(): Promise<any> {
    return this.apiBaseUrl = await this.initialcrmsBaseUrl();
  }

  /**
   * 获取当天申请的办理量
   *
   * @param {string} userId 操作员Id
   * @returns
   * @memberof ApplyCompleteService
   */
  @exceptionHandle
  async getTodayHandledApplyQuantity(pages: number, pageSize: number, userId: string) {
    if (this.utilHelper.AssertEqualNull(pages) || this.utilHelper.AssertEqualNull(pageSize)
      || this.utilHelper.AssertEqualNull(userId)
    ) {
      return null;
    }
    if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
      await this.initialCrmsService();
    }
    let url = this.apiBaseUrl + '/application/day/handle/get/' + userId + '?pages=' + pages + '&pageSize=' + pageSize;
    let result = await this.httpProxy.getRequest(url, 'getTodayHandledApplyQuantity', { headers: this.Requestheaders });
    if (this.utilHelper.AssertNotNull(result)) {
      return result;
    } else {
      return null;
    }
  };
  /**
  * 获取未完成的任务申请
  *
  * @param {string} userId 操作员Id
  * @returns
  * @memberof ApplyCompleteService
  */
  @exceptionHandle
  async getTodayUndoneApplyQuantity(pages: number, pageSize: number, userId: string, applyStatus: string) {
    if (this.utilHelper.AssertEqualNull(pages) || this.utilHelper.AssertEqualNull(pageSize)
      || this.utilHelper.AssertEqualNull(userId)
    ) {
      return null;
    }
    if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
      await this.initialCrmsService();
    }
    let url = this.apiBaseUrl + '/application/undone/get/' + userId + '?pages=' + pages + '&pageSize=' + pageSize +
    '&applyStatus=' + applyStatus;
    let result = await this.httpProxy.getRequest(url, 'getTodayHandledApplyQuantity', { headers: this.Requestheaders });
    if (this.utilHelper.AssertNotNull(result)) {
      return result;
    } else {
      return null;
    }
  };

}

