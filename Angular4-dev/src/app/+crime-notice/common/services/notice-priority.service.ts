import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { CrimeSearchInfo } from '../../../model/crime-notice/crimeSearchInfo';
import { NoticeInfo } from '../../../model/crime-notice/noticeInfo';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
@Injectable()
export class NoticePriorityService extends ServiceBase {

    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
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
     *  获取申请列表
     */
    @exceptionHandle
    async getNoticeList(searchInfoParam: CrimeSearchInfo) {
        if (this.utilHelper.AssertEqualNull(searchInfoParam)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/priority';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(searchInfoParam),
            'getNoticeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    };

    /**
     * 修改优先级
     */
    @exceptionHandle
    async updatePriority(newNoticeInfo: NoticeInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(newNoticeInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/priority/edit';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(newNoticeInfo),
            'updatePriority', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    // 获取法院名称数据
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
    async searchFormObj() {
        let courtData: any;
        courtData = await this.getCourtData();
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
        }
    }

}




