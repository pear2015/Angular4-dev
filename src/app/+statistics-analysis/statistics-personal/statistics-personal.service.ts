import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
/**
 * 个人申请业务统计Service
 *
 * @export
 * @class PersonalStatisticsService
 */
@Injectable()
export class StatisticsPersonalService extends ServiceBase {
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

    /**
       * 初始化犯罪服务基地址
       */
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }


    /**
     * 按时间和采集点获取数据
     *
     * @param {*} rp
     * @returns {Promise<any>}
     * @memberof StatisticsPersonalService
     */
    @exceptionHandle
    async postDataListByTimeAndOffice(rp: any): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(rp)) {
                return null;
            }
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initialCrmsService();
            }
            let url = this.apiBaseUrl + '/statistics/person/get/date/centerCode';
            let result = await this.httpProxy.postRequest(url, rp, { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }

    };

    /**
     * 按职业和办理用途获取数据
     *
     * @param {*} rp
     * @returns {Promise<any>}
     * @memberof StatisticsPersonalService
     */
    @exceptionHandle
    async  postDataListByOccupationAndApplyPurpose(rp: any): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(rp)) {
                return null;
            }
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initialCrmsService();
            }
            let url = this.apiBaseUrl + '/statistics/person/get/profession/purpose';
            let result = await this.httpProxy.postRequest(url, rp, { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }

    };

    /**
     * 按职业和办理结果获取数据
     *
     * @param {*} rp
     * @returns {Promise<any>}
     * @memberof StatisticsPersonalService
     */
    @exceptionHandle
    async  postDataListByOccupationAndApplyResult(rp: any): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(rp)) {
                return null;
            }
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initialCrmsService();
            }
            let url = this.apiBaseUrl + '/statistics/person/get/profession/result';
            let result = await this.httpProxy.postRequest(url, rp, { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }

    };
    /**
   * 按办理结果和办理用途获取数据
   *
   * @param {*} rp
   * @returns {Promise<any>}
   * @memberof StatisticsPersonalService
   */
    @exceptionHandle
    async  postDataListByApplyResultAndApplyPurpose(rp: any): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(rp)) {
                return null;
            }
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initialCrmsService();
            }
            let url = this.apiBaseUrl + '/statistics/person/get/purpose/result';
            let result = await this.httpProxy.postRequest(url, rp, { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }

    };

}








export class DataList {
    coord_X: string;
    coord_Y: string;
    count: string;
    typeName: any;
}





