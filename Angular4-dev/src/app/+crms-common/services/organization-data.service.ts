import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import {exceptionHandle} from '../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
@Injectable()
export class OrganizationService extends ServiceBase {

    private organizationUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialOrganizationService();
    }

    /**
     * 初始化组织机构基地址
     */
    async initialOrganizationService(): Promise<any> {
        return this.organizationUrl = await this.initialOranizationUrl();
    }

    /**
    * 获取组织机构数据
    */
    @exceptionHandle
    async getOrganizationDataForDisplay(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/organization/getall';
        let result = await this.httpProxy.getRequest(url, 'getOrganizationDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
     * 调用组织机构服务获取国家数据GET
     */
    async getCountryDataForDisplay(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/country/getAll';
        let result = await this.httpProxy.getRequest(url, 'getCountryDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     *调用组织机构获取省数据GET
     */
    async getProvinceDataForDisplay(countryId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(countryId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/province/getAll/' + countryId;
        let result = await this.httpProxy.getRequest(url, 'getProvinceDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
    *调用组织机构获取城市数据GET
    */
    async getCityDataForDisplay(provinceId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(provinceId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/city/getAll/' + provinceId;
        let result = await this.httpProxy.getRequest(url, 'getCityDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
    *调用组织机构获取社区数据GET
    */
    async getCommunityDataForDisplay(cityId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(cityId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/community/getAll/' + cityId;
        let result = await this.httpProxy.getRequest(url, 'getCommunityDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

}
