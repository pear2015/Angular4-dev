import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { CrimeSearchInfo } from '../../model/crime-notice/crimeSearchInfo';
import { NoticeComparison } from '../../model/crime-notice/NoticeComparison';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
import { LockExtend } from '../../model/crime-notice/lockExtend';

/**
 * 犯罪公告和犯罪信息服务
 */
@Injectable()
export class CrimeAndNoticeService extends ServiceBase {

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
    * 获取组织机构数据
    */
    @exceptionHandle
    async  getOrganizationDataForDisplay(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.organizationUrl)) {
            await this.initialOrganizationService();
        }
        let url = this.organizationUrl + '/organization/getall';
        let result = await this.httpProxy.getRequest(url, 'getOrganizationDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
    * 获取申请优先级列表
    *
    * @returns {Promise<any>}
    * @memberof ApplyCommonService
    */
    @exceptionHandle
    async getApplyPriorityList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/priority/get';
        let result = await this.httpProxy.getRequest(url, 'getAllApplyPriorityList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取公告的证件类型列表
     *
     * @returns {Promise<any>}
     * @memberof ApplyCommonService
     */
    @exceptionHandle
    async getCertificateTypeList(applyType: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/certificateType/get?applyType=' + applyType;
        let result = await this.httpProxy.getRequest(url, 'getCertificateTypeList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 婚姻状态
     */
       @exceptionHandle
    async getMarriageList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/marriage/get';
        let result = await this.httpProxy.getRequest(url, 'getMarriageList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
     /**
     *
     * 获取职业列表
     *
     */
    @exceptionHandle
    async getCareerList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/career/get';
        let result = await this.httpProxy.getRequest(url, 'getCareerList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取所有犯罪相关信息Get
     * 方法修改,改为传一个搜索体对象
     */
    @exceptionHandle
    async getNoticeAndCrimeDataForDisplay(crimeSearchInfo: CrimeSearchInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeSearchInfo)) {
            return;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/get/';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimeSearchInfo), 'getNoticeAndCrimeDataForDisplay',
            { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取法院信息列表
     */
    @exceptionHandle
    async getCourtDataForDisplay(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/court/get';
        let result = await this.httpProxy.getRequest(url, 'getCourtDataForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取犯罪类型列表
     */
    @exceptionHandle
    async getCrimeTypeForDisplay(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimeType/get';
        let result = await this.httpProxy.getRequest(url, 'getCrimeTypeForDisplay', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 获取图片，返回字节数组
     */
    @exceptionHandle
    async getImageFormUploaded(filePathId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(filePathId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/file/get/' + filePathId;
        let result = await this.httpProxy.getRequest(url, 'getImageFormUploaded', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
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
    /**
  * 利用 socket服务中的加锁 测试
  */
    @exceptionHandle
    async onRedisLock(keyName: string, userId: string): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/lock/' + userId + '/' + keyName;
            let result = await this.httpProxy.getRequest(url, 'onRedisLock', { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
   * socket是否能够加锁 测试
   */
    @exceptionHandle
    async isCanLock(keyName: string, userId: string): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/isCanLock/' + userId + '/' + keyName;
            let result = await this.httpProxy.getRequest(url, 'onRedisLock', { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * redis 解锁
     */
    @exceptionHandle
    async onRedisRelease(keyName: string, orgPersonId: string): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/release/' + keyName + '/' + orgPersonId;
            let result = await this.httpProxy.getRequest(url, 'onRedisRelease', { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * 批量锁验证
     */
    @exceptionHandle
    async isValidLock(lockExtend: LockExtend): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/validate/lock';
            let result = await this.httpProxy.postRequest(url, JSON.stringify(lockExtend), 'isValidLock',
                { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
        * 批量解锁
        */
    @exceptionHandle
    async onRedisReleaseList(lockList: string[]): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/release/list/delete';
            let result = await this.httpProxy.postRequest(url, JSON.stringify(lockList), 'onRedisReleaseList',
                { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
        * 根据人来 批量解锁
        */
    @exceptionHandle
    async onRedisReleaseListAndUserId(lockList: string[], userId: string): Promise<any> {
        try {
            if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
                await this.initiaSocketApiService();
            }
            let url = this.socketApiUrl + '/release/list/delete/' + userId;
            let result = await this.httpProxy.postRequest(url, JSON.stringify(lockList), 'onRedisReleaseListAndUserId',
                { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                return result;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * 比对相似度
     */
    comparsionInformation(object1: any, object2: any): string {
        if (this.utilHelper.AssertNotNull(object1) && this.utilHelper.AssertNotNull(object2)) {
            let crimePersonInfoNew = new NoticeComparison();
            let applyBasicInfoNew = new NoticeComparison();
            object1 = this.commomPorp(object1, crimePersonInfoNew);
            object2 = this.commomPorp(object2, applyBasicInfoNew);
            let obj1Props = Object.getOwnPropertyNames(object1);
            let count = 0;
            let totalCount = 0;
            for (let i = 0; i < obj1Props.length; i++) {
                totalCount++;
                let propName = obj1Props[i];
                if ((object1[propName] === object2[propName]) ||
                    (this.utilHelper.AssertEqualNull(object1[propName]) && this.utilHelper.AssertEqualNull(object2[propName]))) {
                    count++;
                }
            }
            return Math.round(count / totalCount * 100).toString() + '%';
        }
    }
    /**
     * 提取公用属性
     *
     */
    commomPorp(obj1: object, obj2: object) {
        if (this.utilHelper.AssertNotNull(obj1) && this.utilHelper.AssertNotNull(obj2)) {
            for (let key in obj1) {
                if (obj2.hasOwnProperty(key)) {
                    obj2[key] = obj1[key];
                }
            }
            return obj2;
        }
    }

}
