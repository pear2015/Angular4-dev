import { Injectable } from '@angular/core';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ReportCrimeParamModel } from '../../model';
import { Headers } from '@angular/http';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class StatisticsSystemUseInfoService extends ServiceBase {

    private apiBaseUrl: string;
    private organizationUrl: string;
    // 所有中心数据
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper,
    ) {
        super(configService);
        this.initialCrmsService();
        this.initialOrganizationService();
    }

    /**
     * 初始化犯罪服务基地址
     */
    async  initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 初始化组织机构基地址
     */
    async initialOrganizationService(): Promise<any> {
        return this.organizationUrl = await this.initialOranizationUrl();
    }

    /**
     * 获取数据
     */
    @exceptionHandle
    async getStatisticsData(queryInfo: ReportCrimeParamModel) {
        if (this.utilHelper.AssertEqualNull(queryInfo)) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/sysUsage/get';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(queryInfo), 'statisticsGetResult',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return [];
        }
    }
}



