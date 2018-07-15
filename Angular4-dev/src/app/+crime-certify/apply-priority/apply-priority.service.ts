import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ApplyInfoParam } from '../../model/application-credentials-management/applyInfoParam';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class ApplyPriorityService extends ServiceBase {

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
    async getApplyList(applyInfoParam: ApplyInfoParam, orgPersonId: string) {
        if (this.utilHelper.AssertEqualNull(applyInfoParam)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/priority/list?orgPersonId=' + orgPersonId;
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(applyInfoParam), 'getApplyList', { headers: this.Requestheaders });
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
    async updatePriority(applyId: string, priority: string, modifyPersonName: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(applyId) || this.utilHelper.AssertEqualNull(priority)
            || this.utilHelper.AssertEqualNull(modifyPersonName)
        ) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/priority/update?applyId=' + applyId + '&priority=' + priority +
            '&modifyPersonId=' + modifyPersonName;
        let result = await this.httpProxy.getRequest(url, 'updatePriority', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取到申请目的
     *
     */
    @exceptionHandle
    async  getApplyPurpose(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/purpose/get';
        let result = await this.httpProxy.getRequest(url, 'getApplyPurpose', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


    /**
     * 定义搜索对象
     */
    @exceptionHandle
    async searchFormObj() {
        let obj: any;
        let getApplyPurposeData: any;
        getApplyPurposeData = await this.getApplyPurpose();
        if (this.utilHelper.AssertNotNull(getApplyPurposeData)) {
            getApplyPurposeData.forEach(item => {
                item.value = item.applyPurposeId;
                delete item.applyPurposeId;
            });
        }
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
                    title: 'deliveryReceiptNumbr',
                    value: '',
                    class: 'first-class',
                    labelName: 'deliveryReceiptNumbr',
                },
                {
                    title: 'certificateNumber',
                    value: '',
                    class: 'first-class',
                    labelName: 'certificateNumber',
                }
            ],
            selectDatas: [
                {
                    data: getApplyPurposeData,
                    class: '',
                    title: 'applyPurpose',
                    labelName: 'applyPurpose',

                }
            ],
            dateDatas: [
                {
                    title: 'startNoticeCreateTime',
                    value: '',
                    maxTime: new Date(),
                    labelName: 'startApplyTime',

                }, {
                    title: 'endNoticeCreateTime',
                    value: '',
                    minTime: new Date(),
                    labelName: 'endApplyTime',
                    end: true
                }
            ]
        };
        return obj;
    }
}

export class SearchInfo {
    applyId: string;
    priority: string;
    modifyPersonName: string;
    modifyDescription: string;
};


