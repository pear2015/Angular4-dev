import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ViewChildren, QueryList } from '@angular/core';
import { EventAggregator, UtilHelper } from '../../../core';
import { ProvinceInfo } from '../../../model/organization/ProvinceInfo';
import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'crms-crimeinfo',
  templateUrl: './crime-info.component.html',
  providers: []
})

export class CrmsCrimeInfoComponent implements OnInit, OnChanges {

  // 时间输入域控制
  now: Date;

  // 文本域字符统计
  crimeInfoCriDescriptionLength: number = 0;
  crimeInfoDescriptionLength: number = 0;
  crimeInfoCriResultLength: number = 0;

  // 清空按钮tooltip
  clearPageTolVisible: boolean = false;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  @Input() crimeInfo: any;
  @Input() noticeInfo: any;
  @Input() crimeTypeList: any;
  @Input() isReadOnly: boolean;
  @Input() clearBtnVisible: boolean;
  @Input() crimeRegionList: ProvinceInfo[] = [];
  @Input() crimePersonInfo: any;
  @Output() clearInfo: EventEmitter<any>;
  minDateOfcrimeTime: any; // 犯罪时间最小值
  minDateOfcrimeJudgeTime: any; // 判决时间最小值
  constructor(
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper,
  ) {
    this.clearInfo = new EventEmitter();
  }

  ngOnInit() {
    this.now = new Date();
    // 全局清空事件订阅
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    // 局部清空事件订阅
    this.eventAggregator.subscribe('cleanCrimeInfoCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    this.getMinDateOfcrimeTime();
  }

  ngOnChanges() {
    this.getMinDateOfcrimeTime();
    this.countCharacter();
  }

  //  获取犯罪公告最小时间
  getMinDateOfcrimeTime() {
    let yearForNow: any = new Date().getFullYear();
    let monthForNow: any = new Date().getMonth() + 1;
    let day: any = new Date().getDate();
    let hour: any = new Date().getHours();
    let minute: any = new Date().getMinutes();
    let second: any = new Date().getSeconds();
    let year: any = yearForNow - 200;
    this.minDateOfcrimeTime = new Date(year + '-' + monthForNow + '-' + day + ' ' + hour + ':' + minute + ':' + second);
  }

  countCrimeCriDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeDescription)) {
      this.crimeInfoCriDescriptionLength = this.crimeInfo.crimeDescription.length;
    } else {
      this.crimeInfoCriDescriptionLength = 0;
    }
  }


  countCrimeDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimeInfo.description)) {
      this.crimeInfoDescriptionLength = this.crimeInfo.description.length;
    } else {
      this.crimeInfoDescriptionLength = 0;
    }
  }


  countCrimeCriResultCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeResult)) {
      this.crimeInfoCriResultLength = this.crimeInfo.crimeResult.length;
    } else {
      this.crimeInfoCriResultLength = 0;
    }
  }

  // 统计字符
  countCharacter() {
    this.countCrimeCriDescriptionCharacter();
    this.countCrimeDescriptionCharacter();
    this.countCrimeCriResultCharacter();
  }

  // 清空文本域字符
  clearCharacterCount() {
    this.crimeInfoCriDescriptionLength = 0;
    this.crimeInfoDescriptionLength = 0;
    this.crimeInfoCriResultLength = 0;
  }

  // 清除当前页按钮提示
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }
}
