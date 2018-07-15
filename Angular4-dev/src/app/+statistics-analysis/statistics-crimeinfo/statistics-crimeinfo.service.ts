import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ReportCrimeParamModel } from '../../model';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
/**
 * 犯罪信息统计和犯罪类型分析service
 * @export
 * @class StatisticsCrimeinfoService
 * @extends {ServiceBase}
 */
@Injectable()
export class StatisticsCrimeinfoService extends ServiceBase {
    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
    // PivotGrid数据源
    dataSource: any;
    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper) {
        super(configService);
    }
    /**
     * 初始化犯罪服务基地址
     */
    async  initialCrmsService() {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }
    /**
     * 犯罪区域和犯罪类型
     * @param {ReportCrimeParamModel} reportCrimeParamModel
     * @returns
     * @memberof StatisticsCrimeinfoService
     */
    @exceptionHandle
    async getCrimeInfoStatisticsCrimeRegionMain(reportCrimeParamModel: ReportCrimeParamModel) {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        try {
            let url = this.apiBaseUrl + '/statistics/crime/region/type';
            let result = await this.httpProxy.postRequest(url, reportCrimeParamModel,
                'getCrimeInfoStatisticsCrimeRegionMain', { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (err) {
            console.log(err);
        }

    }
    /**
     * 犯罪类型和犯罪时间
     * @param {ReportCrimeParamModel} reportCrimeParamModel
     * @returns
     * @memberof StatisticsCrimeinfoService
     */
    @exceptionHandle
    async getCrimeInfoStatisticsCrimeTypeMain(reportCrimeParamModel: ReportCrimeParamModel) {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/crime/type/time';
        let result = await this.httpProxy.postRequest(url, reportCrimeParamModel, 'getQuantityByYear', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 犯罪区域和犯罪时间
     * @param {ReportCrimeParamModel} reportCrimeParamModel
     * @returns
     * @memberof StatisticsCrimeinfoService
     */
    @exceptionHandle
    async getCrimeInfoStatisticsCrimeTimeMain(reportCrimeParamModel: ReportCrimeParamModel) {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/crime/region/time';
        let result = await this.httpProxy.postRequest(url, reportCrimeParamModel, 'getQuantityByYear', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
export class DataList {
    coord_X: string;
    coord_Y: string;
    count: string;
    typeName: any;
}
