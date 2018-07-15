import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';

@Injectable()
export class ApplyRejectService extends ServiceBase {

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
    private async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 获取需要重新分析的申请列表
     */
    @exceptionHandle
    async getReanalyseInfo(pages: number, pageSize: number, analystID: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(analystID) || this.utilHelper.AssertEqualNull(pageSize)
            || this.utilHelper.AssertEqualNull(pages)
        ) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/reply/analysis/get/?pages=' + pages + '&pageSize=' + pageSize + '&analystId=' + analystID;
        let result = await this.httpProxy.getRequest(url, 'getReanalyseInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
