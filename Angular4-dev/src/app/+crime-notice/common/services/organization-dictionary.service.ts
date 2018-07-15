import { Injectable } from '@angular/core';
import { ServiceBase, UtilHelper, ConfigService } from '../../../core/';
import { CrimeAndNoticeService } from '../../../+crms-common/services/crime-notice.service';
import { OrganizationService } from '../../../+crms-common/services/organization-data.service';
import { exceptionHandle } from '../../../shared/decorator/catch.decorator';
/**
 * 犯罪组织机构和相关字典数据service
 */
@Injectable()
export class OrganizationDictionaryService extends ServiceBase {

    constructor(
        public configService: ConfigService,
        public crimeAndNoticeService: CrimeAndNoticeService,
        private organizationService: OrganizationService,
        public utilHelper: UtilHelper) {
        super(configService);
    }
    /**
     * 获取罪犯的证件类型
     * @returns
     * @memberof OrganizationDictionaryService
     */
    @exceptionHandle
    async bindCertificateTypeData() {
        let certificateTypeList: any[] = [];
        try {
            let result = await this.crimeAndNoticeService.getCertificateTypeList('NOTICE');
            if (this.utilHelper.AssertNotNull(result)) {
                certificateTypeList = result;
            }
        } catch (error) {
            console.log(error);
        }
        return certificateTypeList;
    }
    /**
     * 公告优先级
     *
     * @memberof OrganizationDictionaryService
     */
    @exceptionHandle
    async bindNoticePriorityData() {
        let priorityList: any[] = [];
        let result = await this.crimeAndNoticeService.getApplyPriorityList();
        if (this.utilHelper.AssertNotNull(result)) {
            priorityList = result;
        }
        return priorityList;
    }
    /**
     * 犯罪类型
     *
     * @returns
     * @memberof OrganizationDictionaryService
     */
    @exceptionHandle
    async bindCrimeTypeData() {
        let crimeTypeList: any[] = [];
        let result = await this.crimeAndNoticeService.getCrimeTypeForDisplay();
        if (this.utilHelper.AssertNotNull(result)) {
            crimeTypeList = result;
        }
        return crimeTypeList;
    }

    /**
    * 法院列表
    */
    @exceptionHandle
    async bindCourtListData() {
        let courtInfoList: any[] = [];
        try {
            let result = await this.crimeAndNoticeService.getCourtDataForDisplay();
            if (this.utilHelper.AssertNotNull(result)) {
                courtInfoList = result;
            }
        } catch (error) {
            console.log(error);
        }
        return courtInfoList;
    }
    /**
     * 通过配置文件获取安哥拉国家在组织机构中的ID
     *
     * @returns
     * @memberof OrganizationDictionaryService
     */
    async getCountryIdForConfig() {
        let countryId = await this.configService.get('countryId');
        return countryId;
    }

    /**
     * 犯罪区域
     *
     * @memberof NoticeInputComponent
     */
    @exceptionHandle
    async bindCrimeRegion() {
        let crimeRegionList: any[] = [];
        let countryId = await this.getCountryIdForConfig();
        if (this.utilHelper.AssertNotNull(countryId)) {
            let result = await this.organizationService.getProvinceDataForDisplay(countryId);
            if (this.utilHelper.AssertNotNull(result)) {
                crimeRegionList = result;
            }
        }
        return crimeRegionList;
    }
}
