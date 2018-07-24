import { Injectable } from '@angular/core';

import { Headers } from '@angular/http';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';

/**
 * 政府申请业务统计Service
 *
 * @export
 * @class GovernmentStatisticsService
 */
@Injectable()
export class StatisticsGovernmentService extends ServiceBase {
    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper
    ) {
        super(configService);
        this.initialCrmsService();

    }

    // 初始化犯罪基地址
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }


    /**
     * 获取办理用途和办理结果纬度业务数量
     */
    @exceptionHandle
    async getQuantityByPurposeAndResult(queryByDate: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(queryByDate)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/government/get/purpose/result';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(queryByDate),
            'getQuantityByPurposeAndResult', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取申请目的的业务数量
     */
    @exceptionHandle
    async  getQuantityOfPurpose(queryByDate: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(queryByDate)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/government/get/org/purpose';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(queryByDate),
            'getQuantityOfPurpose', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取申请结果的业务数量
     */
    @exceptionHandle
    async  getQuantityOfResult(queryByDate: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(queryByDate)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/government/get/org/result';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(queryByDate), 'getQuantityOfResult', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取申请政府类型的业务数量
     */
    @exceptionHandle
    async getQuantityOfGovernmentType(queryByDate: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(queryByDate)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/government/get/date/org';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(queryByDate),
            'getQuantityOfGovernmentType', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
       * 获取申请目的列表
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

    /**
       * 获取初始默认图表
       */
    @exceptionHandle
    async getCurrentList(criminalNoticeInfoStatistics): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/government/get/date/';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(criminalNoticeInfoStatistics),
            'getCurrentList', { headers: this.Requestheaders });
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

export class QuantityOfTime {
    time: string;
    quantity: number;
}

export class CustomTimeSerchInfo {
    dateType: string;
    startDate: string;
    endDate: string;
    fo: string;
    timePoint: string;
}
