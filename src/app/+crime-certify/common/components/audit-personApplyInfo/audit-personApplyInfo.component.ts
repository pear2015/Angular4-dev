import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { EnumInfo } from '../../../../enum';
import { ApplyCommonService } from '../../../../+crms-common/services/apply-common.service';
import { UtilHelper } from '../../../../core';

@Component({
    selector: 'audit-personApplyInfo',
    templateUrl: './audit-personApplyInfo.component.html',
})

/**
 * 分页组件
 */
export class AuditPersonApplyInfoComponent implements OnChanges, OnInit {
    applyPersonTypeEnum: any;
    applyPriorityList: any;
    applyPurposeList: any;
    certificateTypeList: any;
    showOtherPurposeReason: boolean = true;

    @Input() applyInfo;

    constructor(
        public enumInfo: EnumInfo,
        public applyCommonService: ApplyCommonService,
        public utilHelper: UtilHelper,

    ) {
        this.applyPersonTypeEnum = this.enumInfo.getApplyPersonTypeEnum;
    }
    // 接收到的参数发生变化时
    ngOnChanges(): void {
         if (this.utilHelper.AssertNotNull(this.applyInfo) && this.utilHelper.AssertNotNull(this.applyInfo.applyTime)) {
            this.applyInfo.applyTimeshow = this.utilHelper.format(this.applyInfo.applyTime, 'dd-MM-yyyy, HH:mm:ss');
        }

    }

    ngOnInit() {
        if (this.utilHelper.AssertNotNull(this.applyInfo.otherPurposeReason)) {
            if (this.applyInfo.otherPurposeReason === '5') {
                this.showOtherPurposeReason = false;
            }
        } else {
            this.showOtherPurposeReason = true;
        }
    }
}
