import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { FileItem } from 'ng2-file-upload';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';



@Injectable()
export class ApplyGovermentService extends ServiceBase {

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
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 保存政府申请基本信息和申请人信息POST
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

    /**
     * 驳回申请分析完成后提交
     */
    @exceptionHandle
    async updateCertificateApplyInfo(certificateApplyInfo: CertificateApplyInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(certificateApplyInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/analysis/save';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(certificateApplyInfo),
            'updataCertificateApplyInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
    * 获取公告数据列表数据
    */
    @exceptionHandle
    async findNoticeList(crimePersonId: string): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/inquire/detail/' + crimePersonId;
        let result = await this.httpProxy.getRequest(url, 'findNoticeList',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}

export class MinImg {
    filePath: string;
    fileName: string;
    fileItem: FileItem;
}

