import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
/**
 * 业务办理情况统计Service
 *
 * @export
 * @class BusinessStatisticsService
 */
@Injectable()
export class StatisticsBusinessService extends ServiceBase {


    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialCrmsService();
    }

    /**
     * 初始化犯罪服务基地址
     */
    async  initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 获取某一时间段所有采集点的业务数量（默认查询全国）
     *
     * @param {string} frontOffice 采集点编码
     * @returns {Promise<any>}
     * @memberof BusinessStatisticsService
     */
    @exceptionHandle
    async getQuantityByDate(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(businessQueryInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/dateType';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByDate', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
     * 通过申请类型和采集点获取业务数量
     * @param businessQueryInfo
     */
    @exceptionHandle
    async getQuantityByTypeAndCenter(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/type/centerCode';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByTypeAndCenter', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 通过申请类型和采集点获取业务数量
     * @param businessQueryInfo
     */
    @exceptionHandle
    async getQuantityByTypeAndPurpose(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/type/purpose';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByTypeAndPurpose', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 通过申请类型和采集点获取业务数量
     * @param businessQueryInfo
     */
    @exceptionHandle
    async getQuantityByPurposeAndCenter(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/centerCode/purpose';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByPurposeAndCenter', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 通过申请类型和采集点获取业务数量
     * @param businessQueryInfo
     */
    @exceptionHandle
    async getQuantityByResultAndAvg(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/result/avg';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByResultAndavg', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 通过申请类型和采集点获取业务数量
     * @param businessQueryInfo
     */
    @exceptionHandle
    async getQuantityByAuditAndAvg(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/audit/avg';
        let result = await this.httpProxy.postRequest(url,
            businessQueryInfo, 'getQuantityByAuditAndAvg', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取申请类型的业务数量
     *
     * @param {string} frontOffice 采集点 同上
     * @param {string} time 时间点 同上
     * @returns {Promise<any>}
     * @memberof BusinessStatisticsService
     */
    @exceptionHandle
    async  getQuantityOfType(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/type';
        let result = await this.httpProxy.postRequest(url, businessQueryInfo, 'getQuantityOfType', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 获取申请结果的业务数量
     *
     * @param {string} frontOffice 采集点 同上
     * @param {string} time 时间点 同上
     * @returns {Promise<any>}
     * @memberof BusinessStatisticsService
     */
    @exceptionHandle
    async getQuantityOfResult(businessQueryInfo: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/business/get/result';
        let result = await this.httpProxy.postRequest(url, businessQueryInfo, 'getQuantityOfResult', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}



export class QuantityOfFrontOffice {
    FOCode: string;
    FOName: string;
    quantity: number;
}

export class BusinessQueryInfo {
    dateType: string;
    applyTypeId: string;
    applyPurposeId: string;
    applyResultId: string;
    auditResultId: string;
    centerCode: string;
    averageTime: string;
    startMinute: Number;
    endMinute: Number;
    startDate: Date;
    endDate: Date;
}
export class DataList {
    coord_X: string;
    coord_Y: string;
    count: string;
    typeName: any;
}

