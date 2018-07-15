import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { exceptionHandle } from '../../../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../../core/';
import { CertificateInfo } from '../../../../model/certificate-apply/certificateInfo';

@Injectable()
export class CertificatePrintService extends ServiceBase {

    private apiBaseUrl: string;
    public mongoStoreFileUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
    private Attachmentheaders = new Headers({ 'enctype': 'multipart/form-data' });
    constructor(public httpProxy: HttpProxyService,
        public configService: ConfigService,
        public utilhelper: UtilHelper
    ) {
        super(configService);
        this.initialCrmsService();
        this.initialStoreService();
    }
    /**
     * 初始化犯罪服务基地址
     */
    async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }
    /**
      * 初始化犯罪附件服务地址
      */
    async initialStoreService(): Promise<any> {
        return this.mongoStoreFileUrl = await this.inititStoreFileUrl();
    }

    /**
     * 通过申请ID获取证书
     *
     */
    @exceptionHandle
    async findCertificateInfoByApplyId(applyInfoId: string): Promise<any> {
        if (this.utilhelper.AssertEqualNull(applyInfoId)) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/credentials/get/' + applyInfoId;
        let result = await this.httpProxy.getRequest(url, 'findCertificateInfoByApplyId', { headers: this.Requestheaders });
        return result;
    }
    /**
     * 保存证书信息
     *
     */
     @exceptionHandle
    async saveCertificateInfo(certificateInfo: CertificateInfo): Promise<any> {
        if (certificateInfo == null || certificateInfo === undefined) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/credentials/add';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(certificateInfo),
            'saveCertificateInfo', { headers: this.Requestheaders });
        return result;
    }
    /**
     * 更新证书信息
     *
     * @param {CertificateInfo} certificateInfo
     * @returns
     * @memberof CertificatePrintService
     */
     @exceptionHandle
    async updateCertificateInfo(certificateInfo: CertificateInfo) {
        if (certificateInfo == null || certificateInfo === undefined) {
            return null;
        }
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/credentials/update';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(certificateInfo),
            'updateCertificateInfo', { headers: this.Requestheaders });
        return result;
    }
    // base64 转换成 blob
    dataURLtoBlob(dataUrl) {
        if (dataUrl == null || dataUrl === undefined || dataUrl === '') {
            return null;
        }
        let byte = atob(dataUrl.split(',')[1]);
        let mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        let ab = new ArrayBuffer(byte.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byte.length; i++) {
            ia[i] = byte.charCodeAt(i);
        }
        return new Blob([ab], { type: mime });
    }
    /**
     * 保存证书附件
     *
     */
     @exceptionHandle
    async storeFile(blob: any): Promise<any> {
        if (blob == null || blob === undefined) {
            return null;
        }
        if (this.mongoStoreFileUrl == null || this.mongoStoreFileUrl === undefined) {
            await this.initialStoreService();
        }
        let formData = new FormData();
        formData.append('file', blob);
        let result = await this.httpProxy.postRequest(this.mongoStoreFileUrl,
            formData,
            'storeFile', { headers: this.Attachmentheaders });
        return result;
    }

}



