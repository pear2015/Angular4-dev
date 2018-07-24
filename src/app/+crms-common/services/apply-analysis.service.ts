import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
import { FileItem } from 'ng2-file-upload';

@Injectable()
export class ApplyAnalysisService extends ServiceBase {

    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initialApplyService();
    }

    /**
     * 初始化犯罪服务基地址
     */
    async initialApplyService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 分析完成后更新申请
     * POST /api/v1/application/analysis/save
     * @param {CertificateApplyInfo} certificateApplyInfo
     * @returns {Promise<any>}
     * @memberof ApplyAnalysisService
     */
    @exceptionHandle
    async updateCertificateApplyInfo(certificateApplyInfo: CertificateApplyInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(certificateApplyInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialApplyService();
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
     *
     *通过分析员用户ID获取待分析任务
     *
     * @param {string} analystID
     * @returns {Promise<any>}
     * @memberof ApplyAnalysisService
     */
    @exceptionHandle
    async  getAnalystTasksByAnalystId(analystId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(analystId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialApplyService();
        }
        let url = this.apiBaseUrl + '/application/analysis/get/' + analystId;
        let result = await this.httpProxy.getRequest(url, 'getAnalystTasksByAnalystId', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

}

export class MinImg {
    minImgPath: string;
    uploadFileItem: FileItem;
}
