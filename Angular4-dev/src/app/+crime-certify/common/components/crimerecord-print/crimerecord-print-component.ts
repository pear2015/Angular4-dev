import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ApplyInfo } from '../../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../../model/certificate-apply/ApplyBasicInfo';
import { CrimeRecordPrint } from '../../../../model/crime-notice/CrimeRecordPrint';
import { UtilHelper } from '../../../../core';
@Component({
  selector: 'crimerecord-print',
  templateUrl: './crimerecord-print-component.html',
})
export class CrimeRecordPrintComponent implements OnInit {

  @ViewChild('crimeRecord') crimeRecord: ElementRef;
  // 犯罪信息列表
  @Input() crimeAndNoticeList: CrimeRecordPrint[];
  // 申请信息
  @Input() applyInfo: ApplyInfo;
  // 申请人基本信息
  @Input() applyBasicInfo: ApplyBasicInfo;
  @Input() showNoticeNumber: boolean;

  goverMentInfo: string;
  currentTime: Date;

  constructor(private utilHelper: UtilHelper) {

  }
  ngOnInit() {
    this.currentTime = new Date();
    this.checkedApplyTypeIsGoverment();
  }
  checkedApplyTypeIsGoverment() {
    if (this.utilHelper.AssertNotNull(this.applyInfo) && this.utilHelper.AssertNotNull(this.applyBasicInfo)) {
      this.goverMentInfo = this.applyInfo.govermentInfo;
    }
  }

}
