import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ReportCrimeParamModel } from '../../model';
// import { StatisticsType } from '../../../enum';
import { CrimeNoticeStatisticsMapper } from '../common/mapper/crime-notice-statistics.mapper';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class StatisticsCrimeService extends ServiceBase {

    private apiBaseUrl: string;
    private organizationUrl: string;
    // 法院基地址
    // private getCourtBaseUrl: string;
    // 保存所有法院数据
    // private allCourtData: any;
    /**
     * 保存选择的法院 如 ["1","2"]
     */
    // private courtsId: string[];
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper,
        // private urlHelper: UrlHelperService,
        private mapper: CrimeNoticeStatisticsMapper
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
     * 获取法院列表
     */
    @exceptionHandle
    async getCourtOffices(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/court/get';
        let result = await this.httpProxy.getRequest(url, 'getCourt', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            // 使用映射改变法院属性名。
            return result.map(r => this.mapper.mapperAllCourtData(r));
        } else {
            return null;
        }
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
        let url = this.apiBaseUrl + '/statistics/crimeNotice/get/dateType/court';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(queryInfo), 'statisticsGetResult',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return [];
        }
    }
}
