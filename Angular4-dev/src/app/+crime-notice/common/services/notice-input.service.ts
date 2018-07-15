import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../core/';
import { CrimeAndNoticeExtendInfo } from '../../../model/crime-notice/CrimeAndNoticeExtendInfo';
import { CrimeNoticeQuery } from '../../../model/crime-integrated-business/CrimeNoticeQuery';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
/**
 * 犯罪公告和犯罪信息服务
 */
@Injectable()
export class NoticeInputService extends ServiceBase {
    private apiBaseUrl: string;
    // 数据传输格式必须在GET和POST方法中加入 默认的数据格式 text/plain
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
    async  initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 检测公告编号是否重复
     */
    @exceptionHandle
    async checkCrimeNoticeNumber(noticeNumber: string, noticeId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(noticeNumber)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/noticeNumber/hasUse?noticeNumber=' + noticeNumber + '&noticeId=' + noticeId;
        let result = await this.httpProxy.getRequest(url, 'checkCrimeNoticeNumber', { headers: this.Requestheaders });

        return result;
    }
    /**
     * 通过申请人员基本信息中身份证ID和姓名模糊匹配可能存在的犯罪公告列表
     * 包含：公告信息，犯罪信息，犯罪人员基本信息，公告附件
     */
    @exceptionHandle
    async  getNoticeListByNumberAndName(crimeNoticeQuery: CrimeNoticeQuery, backFillCriminalId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeNoticeQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/search?backFillCriminalId=' + backFillCriminalId;
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimeNoticeQuery),
            'getNoticeListByNumberAndName', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 根据条件查询犯罪人的回填列表
     */
    @exceptionHandle
    async  getCrimePersonListByNumberAndName(crimeNoticeQuery: CrimeNoticeQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeNoticeQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/findByCertNumberOrName';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimeNoticeQuery),
            'getNoticeListByCertNumberOrName', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 保存公告信息和犯罪信息POST
     */
    @exceptionHandle
    async saveNoticeAndCrimeInfo(crimeAndNoticeExtendInfo: CrimeAndNoticeExtendInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeAndNoticeExtendInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/add';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(crimeAndNoticeExtendInfo),
            'saveNoticeAndCrimeInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    // 通过路由传来公告Id获取公告详情
    @exceptionHandle
    async getNoticeDetail(noticeId: string) {
        if (this.utilHelper.AssertEqualNull(noticeId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/notice/auditDetail/' + noticeId;
        let result = await this.httpProxy.getRequest(url, 'getNoticeDetail', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    // 重新分析后更新公告
    @exceptionHandle
    async updateNoticeAndCrimeInfo(crimeAndNoticeExtendInfo: CrimeAndNoticeExtendInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeAndNoticeExtendInfo)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/reply/submit';
        let result = await this.httpProxy.postRequest(url,
            JSON.stringify(crimeAndNoticeExtendInfo),
            'updateNoticeAndCrimeInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

}
