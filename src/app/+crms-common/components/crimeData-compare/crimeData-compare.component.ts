import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { UtilHelper } from '../../../core';
import { CrimeDataCompareModel } from './crimeData-compare.model';
import { CrimeDataCompareService } from './crimeData-compare.service';
@Component({
    selector: 'crimeData-compare',
    templateUrl: './crimeData-compare.component.html',
    providers: [CrimeDataCompareService]
})

// 高拍仪组件 公告中犯罪人的匹配度
export class CrimeDataCompareComponent implements OnChanges {
    @Input() applyBasicInfo;
    @Input() criminalInfoObj;
    @Output() captureEvent: EventEmitter<any>;
    compareObj: any;
    CertificateTypeList: any;
    constructor(
        private utilHelper: UtilHelper,
        private crimeDataCompareService: CrimeDataCompareService
    ) {
    }

    /**
     * 提取公用属性
     *
     */
    commomPorp(obj1: object, obj2: object) {
        if (this.utilHelper.AssertNotNull(obj1) && this.utilHelper.AssertNotNull(obj2)) {
            for (let key in obj1) {
                if (obj2.hasOwnProperty(key)) {
                    if (this.utilHelper.AssertNotNull(obj1[key])) {
                        obj2[key] = obj1[key];
                    }
                }
            }
            return obj2;
        }
    };

    getKeys(item) {
        return Object.keys(item);
    }

    /**
     * 获取证件类型
     */
    async getCertificateType() {
        try {
            this.CertificateTypeList = await this.crimeDataCompareService.getCertificateTypeList();
            if (this.utilHelper.AssertNotNull(this.CertificateTypeList) && this.CertificateTypeList.length > 0) {
             this.criminalInfoObj.certificateName = this.CertificateTypeList.filter
             (item => item.certificateTypeId === this.criminalInfoObj.certificateType)[0].name;
             this.applyBasicInfo.certificateName = this.CertificateTypeList.filter
             (item => item.certificateTypeId === this.applyBasicInfo.certificateType)[0].name;
            }
        } catch (error) {
            console.log(error);
        }
    }

    ngOnChanges() {
        this.getCertificateType();
        this.criminalInfoObj.countryOfCitizenship = this.criminalInfoObj.livingCountryName;
        let crimeObj = new CrimeDataCompareModel();
        let applyObj = new CrimeDataCompareModel();
        if (this.utilHelper.AssertNotNull(this.applyBasicInfo)) {
            this.applyBasicInfo = this.commomPorp(this.applyBasicInfo, applyObj);
        }
        if (this.utilHelper.AssertNotNull(this.criminalInfoObj)) {
            this.criminalInfoObj = this.commomPorp(this.criminalInfoObj, crimeObj);
        }
    }
}
