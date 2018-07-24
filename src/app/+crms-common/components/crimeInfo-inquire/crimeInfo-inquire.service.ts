import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { CrimePersonQuery } from '../../../model/crime-integrated-business/CrimePersonQuery';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
/**
 * Created By zhangqiang 2017/10-17
 * 犯罪信息综合业务Service
 * @export
 * @class CrimeAndNoticeService
 * @extends {ServiceBase}
 */
@Injectable()
export class CrimeInfoInquireService extends ServiceBase {
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
    * 犯罪信息： 简单搜索和高级搜索
    * 根据个人基本信息查询犯罪信息（包含犯罪公告）
    * @returns {Promise<any>}
    * @memberof ApplyCommonService
    */
    @exceptionHandle
    async findAllCrimeInfoByPersonalInfo(crimePersonQuery: CrimePersonQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimePersonQuery)) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/inquire/search';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimePersonQuery), 'findAllCrimeInfoByPersonalInfo',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
  * 定义搜索对象
  */
    searchFormObj() {
        let obj: any;
        obj = {
            textDatas: [
                {
                    title: 'firstName',
                    value: '',
                    class: '',
                    labelName: 'firstName',
                },
                {
                    title: 'lastName',
                    value: '',
                    class: '',
                    labelName: 'lastName',
                },
                {
                    title: 'certificateNumber',
                    value: '',
                    class: '',
                    labelName: 'certificateNumber',
                },
                {
                    title: 'fatherFirstName',
                    value: '',
                    class: '',
                    labelName: 'fatherFirstName',
                },
                {
                    title: 'fatherLastName',
                    value: '',
                    class: '',
                    labelName: 'fatherLastName',
                }, {
                    title: 'motherFirstName',
                    value: '',
                    class: '',
                    labelName: 'motherFirstName',
                }, {
                    title: 'motherLastName',
                    value: '',
                    class: '',
                    labelName: 'motherLastName',
                }
            ],
            selectDatas: [],
            dateDatas: [
                {
                    title: 'dateOfBirth',
                    value: '',
                    maxTime: new Date(),
                    labelName: 'dateOfBirth',
                }
                /* , {
                     title: 'dateOfBirth',
                     value: '',
                     minTime: new Date(),
                     labelName: 'dateOfBirth',
                     end: true
                 }*/
            ]
        };
        return obj;
    }

}
