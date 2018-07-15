import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApplyComparison } from '../../model/certificate-apply/ApplyComparison';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { ApplyPersonQuery } from '../../model/certificate-apply/ApplyPersonQuery';
import { CrimeNoticeQuery } from '../../model/crime-integrated-business/CrimeNoticeQuery';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
@Injectable()
export class ApplyCommonService extends ServiceBase {
    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper,
    ) {
        super(configService);
        this.initialCrmsService();
    }
    /**
   * 初始化犯罪服务基地址
   */
    private async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 获取申请目的列表
     *
     * @returns {Promise<any>}
     * @memberof ApplyCommonService
     */
    @exceptionHandle
    async getApplyPurposeList(): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/purpose/get';
        let result = await this.httpProxy.getRequest(url, 'getApplyPurposeList', { headers: this.Requestheaders });
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
     * 获取证件类型列表 获取个人申请 政府申请证件类型
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
     * 获取婚姻状态
     * @param applyType
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
     * 通过申请人员基本信息中身份证ID和姓名模糊匹配人口库获取人员列表
     */
    @exceptionHandle
    async getPersonInfoListByNumberAndName(applyPersonQuery: ApplyPersonQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(applyPersonQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/personInfo/post';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(applyPersonQuery),
            'getPersonInfoListByNumberAndName', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 通过ApplyID获取申请基本信息,不包含公告
     */
    @exceptionHandle
    async getApplyInfoByApplyID(applyId: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        if (this.utilHelper.AssertEqualNull(applyId)) {
            return null;
        }
        let url = this.apiBaseUrl + '/application/get/' + applyId;
        let result = await this.httpProxy.getRequest(url, 'getApplyInfoByApplyID', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
    /**
     * 调用人口库接口 通过身份证号查询
     */
    @exceptionHandle
    async getPersonInfoListByCertificateNumber(applyPersonQuery: ApplyPersonQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(applyPersonQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/personInfo/search';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(applyPersonQuery),
            'getPersonInfoListBysearchQuery', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     *
     *通过申请ID获取公告列表
     *
     * @param {string} analystID
     * @returns {Promise<any>}
     * @memberof ApplyAnalysisService GET /api/v1/application/notices/get/{id}
     */
    // async  getNoticeListByApplyId(applyId: string, pages: number, pageSize: number): Promise<any> {
    //     if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
    //         await this.initialCrmsService();
    //     }
    //     let url = this.apiBaseUrl + '/application/notices/get/' + applyId + '?pages=' + pages + '&pageSize=' + pageSize;
    //     let result = await this.httpProxy.getRequest(url, 'getNoticeListByApplyId', { headers: this.Requestheaders });
    //     if (this.utilHelper.AssertNotNull(result)) {
    //         return result;
    //     } else {
    //         return null;
    //     }
    // }


    /**
     * 通过申请人员基本信息中身份证ID和姓名模糊匹配可能存在的犯罪公告列表
     * 包含：公告信息，犯罪信息，犯罪人员基本信息，公告附件
     */
    @exceptionHandle
    async  getNoticeListByNumberAndName(crimeNoticeQuery: CrimeNoticeQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeNoticeQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/search';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimeNoticeQuery),
            'getNoticeListByNumberAndName', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
       * 通过申请人员基本信息中身份证ID和姓名模糊匹配可能存在的罪犯
       * 包含：公告信息，犯罪信息，犯罪人员基本信息，公告附件
       */
    @exceptionHandle
    async  getCriminalByNameAndId(crimeNoticeQuery: CrimeNoticeQuery): Promise<any> {
        if (this.utilHelper.AssertEqualNull(crimeNoticeQuery)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/crimePerson/search';
        let result = await this.httpProxy.postRequest(url, JSON.stringify(crimeNoticeQuery),
            'getCriminalByNameAndId', { headers: this.Requestheaders });
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
    async getImageFormUploaded(filePath: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(filePath)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/file/get/' + filePath;
        let result = await this.httpProxy.getRequest(url, 'getImageFormUploaded', { headers: this.Requestheaders });
        if (!this.utilHelper.AssertEqualNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * 获取打印证书的相关信息
     * @param applyId
     */
    @exceptionHandle
    async getCertificateInfo(applyId: string) {
        if (this.utilHelper.AssertEqualNull(applyId)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/get/' + applyId;
        let result = await this.httpProxy.getRequest(url, 'getCertificateInfo', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    };

    /**
     * 获取办理历史记录
     * @param applyId
     */
    @exceptionHandle
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
     * 比对相似度
     */
    comparsionInformation(object1: any, object2: any): string {
        if (this.utilHelper.AssertNotNull(object1) && this.utilHelper.AssertNotNull(object2)) {
            let crimePersonInfoNew = new ApplyComparison();
            let applyBasicInfoNew = new ApplyComparison();
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

    /**
     * 根据申请ID获取可打印的犯罪记录
     * @param applyId
     */
    @exceptionHandle
    async getApplyCrimeRecordByApplyId(applyId: string) {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/application/notice/' + applyId;
        let result = await this.httpProxy.getRequest(url, 'getApplyCrimeRecordByApplyId', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }


  /**
   * 根据enteringPersonID获取未完成业务的数据
   *
   * @memberof ApplyCommonService
   */
  @exceptionHandle
    async getCrimsIncompleteListByEnteringPersonId(enteringPersonId: string) {
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/statistics/bussinesscollect/apply/' + enteringPersonId;
        let result = await this.httpProxy.getRequest(url, 'getCrimsIncompleteList', { headers: this.Requestheaders });
        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
