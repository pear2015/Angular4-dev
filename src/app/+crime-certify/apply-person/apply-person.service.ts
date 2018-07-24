import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { FileItem } from 'ng2-file-upload';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class ApplyPersonService extends ServiceBase {

    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public httpProxy: HttpProxyService,
        public configService: ConfigService,
        private utilHelper: UtilHelper
    ) {
        super(configService);
    }
    /**
     * 初始化犯罪服务基地址
     */
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 保存个人申请基本信息和申请人信息POST
     *
     */
    @exceptionHandle
    async saveCertificateApplyInfo(certificateApplyInfo: CertificateApplyInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(certificateApplyInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/add';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(certificateApplyInfo),
            'saveCertificateApplyInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    // 根据applyId获取申请信息列表
    @exceptionHandle
    async getApplyInfoList(requestParameters) {
        if (this.utilHelper.AssertEqualNull(requestParameters)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/get/' + requestParameters;
        let result = this.httpProxy.getRequest(url, 'getApplyInfoList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertEqualNull(result)) {
            return null;
        } else {
            return result;
        }
    }
}

export class ImageFile {
    filePath: string;
    fileName: string;
    fileItem: FileItem;
}

