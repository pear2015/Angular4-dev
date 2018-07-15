import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { TranslateService } from 'ng2-translate';
import { ApplyInfoParam } from '../../model/application-credentials-management/applyInfoParam';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class ApplyAuditService extends ServiceBase {

    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private translateService: TranslateService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialCrmsService();
    }

    /**
     * 初始化犯罪服务基地址
     */
    /**
    * 初始化犯罪服务基地址
    */
    private async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 通过applyID获取犯罪公告信息
     */
    @exceptionHandle
    async getNoticeInfoListByApplyID(applyID: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(applyID)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/noticeinfo/getByApplyID/' + applyID;
        let result = await this.httpProxy.getRequest(url, 'getNoticeInfoListByApplyID', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取待审核的申请信息
     *
     * @returns {Promise <any>}
     * @memberof ApplyAuditService
     */
    async getWaitAuditApplyInfoForDisplay(pages, pageSize, auditId): Promise<any> {
        if (this.utilHelper.AssertEqualNull(pages) || this.utilHelper.AssertEqualNull(pageSize) ||
            this.utilHelper.AssertEqualNull(auditId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/audit/get?pages=' + pages + '&pageSize=' + pageSize + '&auditorId=' + auditId;
        let result = await this.httpProxy.getRequest(url, 'getWaitAuditList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 获取已审核的申请信息
     *
     * @returns {Promise <any>}
     * @memberof ApplyAuditService
     */
    async getHasAuditedApplyInfoForDisplay(applyInfoParam: ApplyInfoParam): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        if (this.utilHelper.AssertEqualNull(applyInfoParam)) {
            return null;
        }
        let url = this.apiBaseUrl + '/hasAudit/get';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(applyInfoParam),
            'getHasAuditedApplyInfoForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 更新审核信息
     */
    async updateCertificateApplyInfo(certificateApplyInfo: CertificateApplyInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(certificateApplyInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/audit/save';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(certificateApplyInfo),
            'updateCertificateApplyInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取历史记录
     *
     * @param {string} applyId
     * @returns
     * @memberof ApplyAuditService
     */
    async getHandleHistory(applyId: string) {
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

    /**
    * 定义搜索对象
    */
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
    * 获取到申请目的
    *
    */
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
}
