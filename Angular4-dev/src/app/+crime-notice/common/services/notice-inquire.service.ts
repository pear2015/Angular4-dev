import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { CrimeSearchInfo } from '../../../model/crime-notice/crimeSearchInfo';

/**
 * 犯罪公告服务
 */
@Injectable()
export class NoticeInquireService extends ServiceBase {

    private apiBaseUrl: string;
    // 数据传输格式必须在GET和POST方法中加入 默认的数据格式 text/plain
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(public configService: ConfigService,
        private httpProxy: HttpProxyService, private utilHelper: UtilHelper,
        private translateService: TranslateService,
    ) {
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
     * 获取历史公告信息列表
     */
    @exceptionHandle
    async getHistoryNoticeData(searchInfoParam: CrimeSearchInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/history';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(searchInfoParam),
            'getHistoryNoticeData', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
   * 获取审核中公告信息列表
   */
    @exceptionHandle
    async getAuditPendingNoticeData(searchInfoParam: CrimeSearchInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/waitAudit';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(searchInfoParam),
            'getAuditPendingNoticeData', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
    * 获取重新分析公告信息列表
    */
    @exceptionHandle
    async getNoticeReplyDataForDisplay(searchInfoParam: CrimeSearchInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/notice/reply/get?pages=' + searchInfoParam.pages
            + '&pageSize=' + searchInfoParam.pageSize + '&filterId=' + searchInfoParam.enterPersonId + '&businessType=3';
        let result = await this.httpProxy.getRequest(url, 'getNoticeReplyDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
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



    /**
    * 定义搜索对象
    */
    async searchHistoryFormObj() {
        let status: any[] = [
             {
                name: this.getTranslateName('auditing'),
                value: 1
            },
            {
                name: this.getTranslateName('apply-reject'),
                value: 2
            },
            {
                name: this.getTranslateName('hasRatify'),
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
                    {
                        title: 'createPersonName',
                        value: '',
                        class: '',
                        labelName: 'enteringPersonName',
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
}

