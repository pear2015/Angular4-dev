import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';

/**
 * 犯罪公告和犯罪信息服务
 */
@Injectable()
export class CheckedCrimialPersonService extends ServiceBase {

    private organizationUrl: string;
    private apiBaseUrl: string;
    // 数据传输格式必须在GET和POST方法中加入 默认的数据格式 text/plain
    private socketApiUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(public configService: ConfigService, private httpProxy: HttpProxyService, private utilHelper: UtilHelper) {
        super(configService);
        this.initialCrmsService();
        this.initialOrganizationService();
        this.initiaSocketApiService();
    }


    /**
    * 初始化犯罪服务基地址
    */
    async  initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }
    async  initiaSocketApiService(): Promise<any> {
        return this.socketApiUrl = await this.inititSocketApiUrl();
    }

    /**
     * 初始化组织机构基地址
     */
    @exceptionHandle
    async  initialOrganizationService(): Promise<any> {
        return this.organizationUrl = await this.initialOranizationUrl();
    }






    /**
    * 获取图片，返回字节数组
    */
    @exceptionHandle
    async getCrimePerson(crimePersonId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimePersonId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/' + crimePersonId;
        let result = await this.httpProxy.getRequest(url, 'getImageFormUploaded', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }




}
