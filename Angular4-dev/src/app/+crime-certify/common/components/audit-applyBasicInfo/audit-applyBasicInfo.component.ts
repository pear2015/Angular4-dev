import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { EnumInfo } from '../../../../enum';
import { ApplyCommonService } from '../../../../+crms-common/services/apply-common.service';
import { UtilHelper } from '../../../../core';

@Component({
    selector: 'audit-applyBasicInfo',
    templateUrl: './audit-applyBasicInfo.component.html',
})

/**
 * 分页组件
 */
export class AuditApplyBasicInfoComponent implements OnChanges, OnInit {
    applyPersonTypeEnum: any;
    applyPriorityList: any;
    applyPurposeList: any;
    certificateTypeList: any;
    showOtherPurposeReason: boolean = true;

    @Input() applyBasicInfo;

    constructor(
        public enumInfo: EnumInfo,
        public applyCommonService: ApplyCommonService,
        public utilHelper: UtilHelper,

    ) {
        this.applyPersonTypeEnum = this.enumInfo.getApplyPersonTypeEnum;
    }
    // 接收到的参数发生变化时
    ngOnChanges(): void {

    }

    ngOnInit() {
        this.bindApplyPriorityData();
        this.bindApplyPurposeData();
        // this.bindCertificateTypeData();

    }

    // 优先级类型
    bindApplyPriorityData() {
        this.applyCommonService.getApplyPriorityList().then(result => {
            if (this.utilHelper.AssertNotNull(result)) {
                this.applyPriorityList = result;
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // 申请目的
    bindApplyPurposeData() {
        this.applyCommonService.getApplyPurposeList().then(result => {
            if (this.utilHelper.AssertNotNull(result)) {
                this.applyPurposeList = result;
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // // 证件类型 获取个人申请的证件类型
    // bindCertificateTypeData() {
    //     this.applyCommonService.getCertificateTypeList('PERSON').then(result => {
    //         if (this.utilHelper.AssertNotNull(result)) {
    //             this.certificateTypeList = result;
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }
}
