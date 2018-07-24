import { HttpProxyService, ConfigService, ServiceBase, UtilHelper } from '../../../core';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
@Injectable()
export class NoticeAuditService extends ServiceBase {

    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });



    constructor(
        public httpProxyService: HttpProxyService,
        public configService: ConfigService,
        public translateService: TranslateService,
        private utilHelper: UtilHelper,
        private httpProxy: HttpProxyService
    ) {
        super(configService);
        this.initialCrmsService();
    }

    // 初始化犯罪服务基地址
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    };

    // 获取待审核公告列表
    @exceptionHandle
    async getWaitAuditNoticeList(requestParameters): Promise<any> {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/notice/audit/get?pages='
            + requestParameters.pages + '&pageSize=' + requestParameters.pageSize + '&auditorId=' + requestParameters.auditorId
            + '&businessType=' + requestParameters.businessType;
        let result = await this.httpProxyService.getRequest(url, 'getWaitAuditNoticeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    };
    // 获取已审核公告列表
    @exceptionHandle
    async getHasAuditedNoticeList(requestParameters): Promise<any> {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/notice/hasAudit/get';
        let result = await this.httpProxyService.postRequest(url, JSON.stringify(requestParameters),
            'getHasAuditedNoticeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    };

    // 根据公告id查询公告详情
    @exceptionHandle
    async getNoticeDetails(requestParameters): Promise<any> {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/auditDetail/' + requestParameters;
        let result = this.httpProxyService.getRequest(url, 'getNoticeDetails', { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    }

    // 提交审核结果
    @exceptionHandle
    async postAuditResult(noticeInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(noticeInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/notice/audit/submit';
        let result = this.httpProxyService.postRequest(url, JSON.stringify(noticeInfo),
            'postAuditResult', { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    }

    // 获取匹配列表
    @exceptionHandle
    async postMatchList(requestParameters): Promise<any> {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/search';
        let result = this.httpProxyService.postRequest(url, requestParameters, { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    }

    /**
     * 定义搜索对象
     */
    async searchCompeleteAuditNoticeFormObj() {
        let status: any[] = [
            {
                name: this.getTranslateName('through'),
                value: 3
            },
            {
                name: this.getTranslateName('refused'),
                value: 4
            }
        ];
        let courtData: any = await this.getCourtData();
        if (this.utilHelper.AssertNotNull(courtData)) {
            courtData.forEach(item => {
                item.value = item.courtId;
                delete item.courtId;
            });
            let obj: any;
            obj = {
                textDatas: [
                    {
                        title: 'noticeNumber',
                        value: '',
                        class: '',
                        labelName: 'noticeNumber',
                    },
                    {
                        title: 'certificateNumber',
                        value: '',
                        class: '',
                        labelName: 'certificateNumber',
                    },
                ],
                selectDatas: [
                    {
                        data: status,
                        class: '',
                        title: 'noticeStatus',
                        labelName: 'noticeStatus',

                    },
                    {
                        data: courtData,
                        class: '',
                        title: 'courtName',
                        labelName: 'courtId',

                    }
                ],
                dateDatas: [
                    {
                        title: 'startNoticeCreateTime',
                        value: '',
                        maxTime: new Date(),
                        labelName: 'startNoticeCreateTime',

                    }, {
                        title: 'endNoticeCreateTime',
                        value: '',
                        minTime: new Date(),
                        labelName: 'endNoticeCreateTime',
                        end: true
                    }
                ]
            };

            return obj;
        };
    }
    // 国际化
    getTranslateName(code: string) {
        if (this.utilHelper.AssertNotNull(code)) {
            let key: any = this.translateService.get(code);
            return key.value;
        }
    }

    /**
      * 获取法院信息列表
      */
    @exceptionHandle
    async getCourtData(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/court/get';
        let result = await this.httpProxy.getRequest(url, 'getCourtData', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
