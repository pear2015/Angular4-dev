import { Injectable } from '@angular/core';
import { ConfigService } from './services/config.service';
@Injectable()
export class ServiceBase {

    /**
     * 组织机构url
     */
    private orgUrl: any;
    /**
     * 犯罪服务连接地址
     */
    private crmsBaseUrl: any;

    /**
     * 附件存储地址
     */
    private storeFileUrl: any;

    /**
     * 附件读取地址
     */
    private getFileUrl: any;
    /**
     * 日志审计服务地址
     */
    private logAuditUrl: any;
    /**
     * 获取日志审计服务地址
     */
    private getLogAuditUrl: any;
    /**
     * socket 连接地址
     */
    private socketConnectUrl: any;
    /**
     * socket api 连接地址
     */
    private socketApiBaseUrl: any;
    /**
     * 认证平台连接地址
     */
    private gauthBaseUrl: any;

    constructor(public configService: ConfigService) { }
    /**
    * 初始组织机构基地址
    */
    async initialOranizationUrl(): Promise<any> {
        try {
            if (this.orgUrl != null && this.orgUrl !== undefined && this.orgUrl !== '') {
                return this.orgUrl;
            }
            let url = await this.configService.get('OrganizationUrl');
            if (url) {
                this.orgUrl = url + '/api';
            }
        } catch (error) {
            console.log(error);
        }
        return this.orgUrl;

    }

    /**
    * 初始化犯罪服务基地址
    */
    async initialcrmsBaseUrl(): Promise<any> {
        try {
            if (this.crmsBaseUrl != null && this.crmsBaseUrl !== undefined && this.crmsBaseUrl !== '') {
                return this.crmsBaseUrl;
            }
            let url = await this.configService.get('apiBaseUrl');

            if (url) {
                this.crmsBaseUrl = url + '/api/v1';
            }
        } catch (error) {
            console.log(error);
        }
        return this.crmsBaseUrl;
    }
    /**
   * 初始化附件存储地址
   */
    async inititStoreFileUrl(): Promise<any> {
        try {
            if (this.storeFileUrl != null && this.storeFileUrl !== undefined && this.storeFileUrl !== '') {
                return this.storeFileUrl;
            }
            let url = await this.configService.get('storeFileUrl');

            if (url) {
                this.storeFileUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.storeFileUrl;
    }

    /**
     *  初始化附件读取地址
     */
    async inititGetFileUrl(): Promise<any> {
        try {
            if (this.getFileUrl != null && this.getFileUrl !== undefined && this.getFileUrl !== '') {
                return this.getFileUrl;
            }
            let url = await this.configService.get('getFileUrl');

            if (url) {
                this.getFileUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.getFileUrl;
    }
    /**
     *  初始化日志审计地址
     */
    async inititLogAuditUrl(): Promise<any> {
        try {
            if (this.logAuditUrl != null && this.logAuditUrl !== undefined && this.logAuditUrl !== '') {
                return this.logAuditUrl;
            }
            let url = await this.configService.get('logSvrUrl');

            if (url) {
                this.logAuditUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.logAuditUrl;
    }
    /**
     *  初始化日志审计地址
     */
    async initialGetLogAuditUrl(): Promise<any> {
        try {
            if (this.getLogAuditUrl != null && this.getLogAuditUrl !== undefined && this.getLogAuditUrl !== '') {
                return this.getLogAuditUrl;
            }
            let url = await this.configService.get('getlogSvrUrl');

            if (url) {
                this.getLogAuditUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.getLogAuditUrl;
    }

    /**
       *  初始化socket 连接地址
       */
    async inititSocketConnUrl(): Promise<any> {
        try {
            if (this.socketConnectUrl != null && this.socketConnectUrl !== undefined && this.socketConnectUrl !== '') {
                return this.socketConnectUrl;
            }
            let url = await this.configService.get('socketConnectUrl');

            if (url) {
                this.socketConnectUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.socketConnectUrl;
    }

    /**
       *  初始化socket api地址
       */
    async inititSocketApiUrl(): Promise<any> {
        try {
            if (this.socketApiBaseUrl != null && this.socketApiBaseUrl !== undefined && this.socketApiBaseUrl !== '') {
                return this.socketApiBaseUrl;
            }
            let url = await this.configService.get('socketApiBaseUrl');

            if (url) {
                this.socketApiBaseUrl = url + '/api/v1';
            }
        } catch (error) {
            console.log(error);
        }
        return this.socketApiBaseUrl;
    }
    /**
     * 获取统一认证平台地址
     */
    async inititGauthBaseUrl(): Promise<any> {
        try {
            if (this.gauthBaseUrl != null && this.gauthBaseUrl !== undefined && this.gauthBaseUrl !== '') {
                return this.gauthBaseUrl;
            }
            let url = await this.configService.get('gauthBaseUrl');

            if (url) {
                this.gauthBaseUrl = url;
            }
        } catch (error) {
            console.log(error);
        }
        return this.gauthBaseUrl;
    }
}
