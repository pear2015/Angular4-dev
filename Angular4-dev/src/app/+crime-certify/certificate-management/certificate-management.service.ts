import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { TranslateService } from 'ng2-translate';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';

@Injectable()
export class CertificateManagementService extends ServiceBase {

    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });



    constructor(
        public httpProxyService: HttpProxyService,
        public configService: ConfigService,
        public translateService: TranslateService,
        private utilHelper: UtilHelper
    ) {
        super(configService);
        this.initialCrmsService();
    }

    // 初始化犯罪服务基地址

    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }



    // 获取证书列表
    @exceptionHandle
    async postManagementList(orgPersonId: string, requestParameters: any): Promise<any> {
        if (this.utilHelper.AssertEqualNull(orgPersonId) || this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/credentials/admin/get?orgPersonId=' + orgPersonId;
        let result = await this.httpProxyService.postRequest(url, requestParameters, { headers: this.Requestheaders });

        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }


    }

    // 获取图片信息
    @exceptionHandle
    async getImgList(requestParameters: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        let url = this.apiBaseUrl + '/crms/file/get/' + requestParameters;
        let result = await this.httpProxyService.getRequest(url, 'getImgList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    // 获取搜索对象
    getSerchObj() {
        // tslint:disable-next-line:no-use-before-declare
        return obj;
    }

}

let obj = {
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
            title: 'certificateId',
            value: '',
            class: '',
            labelName: 'certificateId',
        },
        {
            title: 'authCode',
            value: '',
            class: '',
            labelName: 'authCode',
        },
        {
            title: 'deliveryReceiptNumbr',
            value: '',
            class: '',
            labelName: 'deliveryReceiptNumbr',
        },
      /*  {
            title: 'govermentInfo',
            value: '',
            class: '',
            labelName: 'govermentInfo',
        },*/
        {
            title: 'certificateNumber',
            value: '',
            class: '',
            labelName: 'certificateNum',
        },

    ],
    selectDatas: [
        {
            data: [
                {
                    name: 'applyPerson',
                    value: '1',

                },
                {
                    name: 'applyGovernment',
                    value: '2',
                },
            ],
            class: 'first-class',
            value: '',
            title: 'applyTypeName',
            labelName: 'certificateType',

        },
    ],
    dateDatas: [
        {
            title: 'enteringBeginTime',
            value: '',
            maxTime: new Date(),
            labelName: 'printStartTime',

        }, {
            title: 'enteringEndTime',
            value: '',
            minTime: new Date(),
            labelName: 'printEndTime',
            end: true
        }
    ]
};


