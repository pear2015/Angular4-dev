import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ApplyInfoParam } from '../../model/application-credentials-management/applyInfoParam';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';

@Injectable()
export class ApplyHistoryService extends ServiceBase {

    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper,
        private translateService: TranslateService,
    ) {
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
     * 获取历史记录
     *
     */
    @exceptionHandle
    async getHandleHistory(pageObj: ApplyInfoParam) {
        if (this.utilHelper.AssertEqualNull(pageObj)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/admin';
        let result = await this.httpProxy.postRequest(url, pageObj, 'getHandleHistory', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }

    };

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
        if (this.utilHelper.AssertNotNull(getApplyPurposeData) && getApplyPurposeData.length > 0) {
            getApplyPurposeData.forEach(item => {
                item.value = item.applyPurposeId;
                delete item.applyPurposeId;
            });
        } else {
            getApplyPurposeData = [];
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
                }
            ],
            selectDatas: [
                {
                    data: [
                        {
                            name: this.getTranslateName('applyPerson'),
                            value: '1',

                        },
                        {
                            name: this.getTranslateName('applyGovernment'),
                            value: '2',
                        },
                    ],
                    class: '',
                    title: 'applyTypeName',
                    labelName: 'applyType',

                }, {
                    data: [
                        {
                            name: this.getTranslateName('analyzing'),
                            value: '1',
                        },
                        {
                            name: this.getTranslateName('auditing'),
                            value: '2',
                        },
                        {
                            name: this.getTranslateName('toBePrinted'),
                            value: '3',
                        },
                        {
                            name: this.getTranslateName('printed'),
                            value: '4',
                        },
                        {
                            name: this.getTranslateName('rejected'),
                            value: '5',
                        },
                    ],
                    class: '',
                    title: 'applyStatusName',
                    labelName: 'applyStatus',

                },
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


    // 国际化
    getTranslateName(code: string) {
        if (this.utilHelper.AssertNotNull(code)) {
            let key: any = this.translateService.get(code);
            return key.value;
        }
    }

    /**
    * 获取历史记录
    *
    * @param {string} applyId
    * @returns
    * @memberof ApplyAuditService
    */
    @exceptionHandle
    async getHandleHistoryById(applyId: string) {
        if (this.utilHelper.AssertEqualNull(applyId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/history/get/' + applyId;
        let result = await this.httpProxy.getRequest(url, 'getHandleHistory', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    };

}
