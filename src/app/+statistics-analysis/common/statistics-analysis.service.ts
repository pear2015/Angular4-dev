import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CrimeNoticeStatisticsMapper } from './mapper/crime-notice-statistics.mapper';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class StatisticsAnalysisService extends ServiceBase {

    private apiBaseUrl: string;
    private organizationUrl: string;
    private angolaId: string = ''; // 安哥拉国家在组织机构中的ID
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private mapper: CrimeNoticeStatisticsMapper,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialCrmsService();
        this.initialOrganizationService();
        this.getAngolaCountryId();
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
     * 获取已计算的采集点名称和编码
     *
     * @returns {Promise<any>}
     * @memberof BusinessStatisticsService
     */
    @exceptionHandle
    async getFrontOffices(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.organizationUrl + '/station';
        let result = await this.httpProxy.getRequest(url, 'getFrontOffices', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 获取安哥拉国家ID
     *
     * @memberof StatisticsAnalysisService
     */
    @exceptionHandle
    async getAngolaCountryId() {
        let result = await this.configService.get('countryId');
        if (this.utilHelper.AssertNotNull(result)) {
            this.angolaId = result;
        }
    }

    /**
     * 获取已计算的省名称和编码
     *
     * @returns {Promise<any>}
     * @memberof BusinessStatisticsService
     */
    @exceptionHandle
    async getProviceOffice(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.organizationUrl + '/province/getAll/' + this.angolaId;
        let result = await this.httpProxy.getRequest(url, ' getProviceOffice', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
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
     * 获取申请类型数据
     */
    @exceptionHandle
    async getApplyTypeList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialcrmsBaseUrl();
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
     * 获取犯罪类型
     *
     * @returns {Promise<any>}
     * @memberof StatisticsAnalysisService
     */
    @exceptionHandle
    async getCrimeTypeList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimeType/get';
        let result = await this.httpProxy.getRequest(url, 'getCrimeTypeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
       * 获取申请目的列表
       *
       * @returns {Promise<any>}
       * @memberof ApplyCommonService
       */
    @exceptionHandle
    async getApplyPurposeList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/purpose/get';
        let result = await this.httpProxy.getRequest(url, 'getApplyPurposeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}





