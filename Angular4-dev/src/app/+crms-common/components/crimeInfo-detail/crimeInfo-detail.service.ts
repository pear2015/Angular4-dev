import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
/**
 * Created By zhangqiang 2017/10-17
 * 犯罪信息综合业务Service
 * @export
 * @class CrimeAndNoticeService
 * @extends {ServiceBase}
 */
@Injectable()
export class CrimeInfoDetailService extends ServiceBase {
    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialCrmsService();
    }
    /**
     * 初始化犯罪服务基地址
     */
    private async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
    * 获取右侧列表数据
    */
    @exceptionHandle
    async findNoticeList(crimePersonId: string): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/inquire/detail/' + crimePersonId;
        let result = await this.httpProxy.getRequest(url, 'findNoticeList',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }



    /**
   * 列表数据切换
   */
    @exceptionHandle
    async singleNotice(crimePersonId: string): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/detail/' + crimePersonId;
        let result = await this.httpProxy.getRequest(url, 'singleNotice',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
   * 获取申请优先级列表
   *
   * @returns {Promise<any>}
   * @memberof ApplyCommonService
   */
    @exceptionHandle
    async getApplyPriorityList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/priority/get';
        let result = await this.httpProxy.getRequest(url, 'getAllApplyPriorityList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
