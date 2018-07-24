import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChildren, QueryList } from '@angular/core';
import { EventAggregator, UtilHelper } from '../../../core';
import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'crms-notice',
  templateUrl: './crime-notice.component.html',
  providers: []
})

export class CrmsNoticeComponent implements OnInit, OnChanges {

  now: Date = new Date();

  // 文本域字符统计
  noticeDescriptionLength: number = 0;
  noticeNoteLength: number = 0;

  // 优先级初始化
  priority: string;

  // 清空按钮提示信息
  clearPageTolVisible: boolean = false;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  @Input() noticeInfo: any;
  @Input() crimeInfo: any;
  @Input() courtInfoList: any;
  @Input() priorityList: any;
  @Input() isReadOnly: boolean;
  @Input() clearBtnVisible: boolean;
  @Input() crimePersonInfo: any;
  @Output() checkNoticeNumber: EventEmitter<any>;
  @Output() clearInfo: EventEmitter<any>;
  minDateOfnoticeCreateTime: any; // 发布时间最小值
  TwoHundredYearsTime: any;
  constructor(
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper
  ) {
    this.checkNoticeNumber = new EventEmitter();
    this.clearInfo = new EventEmitter();

  }


  ngOnInit() {
    // 初始化优先级为普通
    this.noticeInfo.priority = '0';
    // 全局清空事件订阅
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    // 局部清空事件订阅
    this.eventAggregator.subscribe('cleanNoticeInfoCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    this.getTwoHundredYearsTime();
  }
  ngOnChanges() {
    this.countCharacter();
    this.getTwoHundredYearsTime();
  }

  //  当前日期的前200年时间
  getTwoHundredYearsTime() {
    let yearForNow: any = new Date().getFullYear();
    let monthForNow: any = new Date().getMonth() + 1;
    let day: any = new Date().getDate();
    let hour: any = new Date().getHours();
    let minute: any = new Date().getMinutes();
    let second: any = new Date().getSeconds();
    let year: any = yearForNow - 200;
    this.TwoHundredYearsTime = new Date(year + '-' + monthForNow + '-' + day + ' ' + hour + ':' + minute + ':' + second);
  }

  /**
   * 统计公告描述字符数
   * 统计公告备注字符数
   */
  countNoticeDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.noticeDescription)) {
      this.noticeDescriptionLength = this.noticeInfo.noticeDescription.length;
    } else {
      this.noticeDescriptionLength = 0;
    }

  }

  countNoticeNoteCharacter() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.note)) {
      this.noticeNoteLength = this.noticeInfo.note.length;
    } else {
      this.noticeNoteLength = 0;
    }
  }

  // 统计字符
  countCharacter() {
    this.countNoticeDescriptionCharacter();
    this.countNoticeNoteCharacter();
  }

  // 清除字符统计
  clearCharacterCount() {
    this.noticeDescriptionLength = 0;
    this.noticeNoteLength = 0;
  }

  /**
   * 清除当前页按钮提示
   */
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }

}
