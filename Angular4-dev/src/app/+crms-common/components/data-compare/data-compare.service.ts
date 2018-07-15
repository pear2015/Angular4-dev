import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import {exceptionHandle} from '../../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
/**
 * Created By zhangqiang 2017/10-17
 * 犯罪信息综合业务Service
 * @export
 * @class CrimeAndNoticeService
 * @extends {ServiceBase}
 */
@Injectable()
export class DataCompareService extends ServiceBase {
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
    * 数据比对获取证件类型
    */
    @exceptionHandle
    async getCertificateTypeList(): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/certificateType/get';
        let result = await this.httpProxy.getRequest(url, 'getCertificateType',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
