import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ViewChildren, QueryList } from '@angular/core';
import { EventAggregator, UtilHelper, ConfigService } from '../../../core';
import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'person-applyinfo',
  templateUrl: './person-applyInfo.component.html',
  providers: []
})

export class CrmsPersonApplyInfoComponent implements OnInit, OnChanges {

  // 时间输入域控制
  now: Date = new Date();

  // 文本域字符统计
  applyOtherPurposeReasonLength: number = 0;
  applyDescriptionLength: number = 0;
  applyNoteLength: number = 0;


  // 清空按钮tooltip
  clearPageTolVisible: boolean = false;

  // 身份证证件号码正则
  idNumberRegex: string;
  // 其他证件号码正则
  otherCertificateTypeRegex: string;
  // regex 中间变量
  certificateRegexTemp: string;
  // 证件号码是否必填
  certificateNumberDisabled: boolean = true;
  // 必填星号是否显示
  certificateRequired: boolean = false;

  @Input() applyInfo: any;
  @Input() applyPersonTypeEnum: any;
  @Input() applyPurposeList: any;
  @Input() applyPriorityList: any;
  @Input() certificateTypeList: any;
  @Input() showAgent: any;
  @Input() showOtherPurposeReason: boolean;
  @Input() centerCodeName: boolean;

  @Input() isReadOnly: boolean;
  @Input() clearBtnVisible: boolean;
  @Output() clearInfo: EventEmitter<any>;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  constructor(
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper,
    private configService: ConfigService
  ) {
    this.clearInfo = new EventEmitter();
  }

  ngOnInit() {
    // 全局清空事件订阅
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    // 局部清空事件订阅
    this.eventAggregator.subscribe('cleanPersonApplyInfoCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    this.showAgent = true;
    this.showOtherPurposeReason = true;
    this.getIdNumberAndPhoneRegx();
  }

  ngOnChanges() {
    this.countCharacter();
    this.showAgent = true;
    this.showOtherPurposeReason = true;
  }
  /**
   * 初始化身份证和联系电话的正则表达式
   *
   * @memberof CrmsPersonApplyBasicInfoComponent
   */
  async getIdNumberAndPhoneRegx() {
    let result = await this.configService.get(['idnumberRegex', 'otherCertificateTypeRegex']);
    this.certificateRegexTemp = result[0];
    this.idNumberRegex = result[0];
    this.otherCertificateTypeRegex = result[1];
  }

  // 1、其他目的原因
  countApplyOtherPurposeReasonCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyInfo.otherPurposeReason)) {
      this.applyOtherPurposeReasonLength = this.applyInfo.otherPurposeReason.length;
    }
  }
  // 2、申请描述
  countApplyDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyInfo.applyDescription)) {
      this.applyDescriptionLength = this.applyInfo.applyDescription.length;
    }
  }
  // 3、申请备注
  countApplyNoteCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyInfo.note)) {
      this.applyNoteLength = this.applyInfo.note.length;
    }
  }


  /**
   * 根据证件类型生成不同正则
   *
   * @param {any} e
   * @memberof CrmsPersonApplyBasicInfoComponent
   */
  selectedCertificateType(e) {
    if (this.utilHelper.AssertNotNull(this.certificateTypeList) && e.selectedItem !== null) {
      let certificateType = e.selectedItem.type;
      this.applyInfo.agentIdNumber = '';
      if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '0') {
        // 身份证时
        this.idNumberRegex = this.certificateRegexTemp;
        this.certificateNumberDisabled = false;
        this.certificateRequired = false;
      } else {
        this.idNumberRegex = this.otherCertificateTypeRegex;
        this.certificateNumberDisabled = false;
        this.certificateRequired = false;
      }
    }
  }

  // 统计字符
  countCharacter() {
    this.countApplyOtherPurposeReasonCharacter();
    this.countApplyDescriptionCharacter();
    this.countApplyNoteCharacter();
  }

  // 清空文本域字符
  clearCharacterCount() {
    this.applyOtherPurposeReasonLength = 0;
    this.applyDescriptionLength = 0;
    this.applyNoteLength = 0;
  }

  // 清除当前页按钮提示
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }

  /**
   * 申请人其他目的原因可见性
   * applyPurposeID: 5:其他
   */
  selectIndexOfApplyPurposeID(e) {
    let descriptionType;
    if (this.utilHelper.AssertNotNull(e.selectedItem) && this.utilHelper.AssertNotNull(e.selectedItem.description)) {
      descriptionType = e.selectedItem.description;
    }
    if (this.utilHelper.AssertNotNull(descriptionType) && descriptionType === '0') {
      this.showOtherPurposeReason = false;
    } else {
      this.showOtherPurposeReason = true;
      this.applyInfo.otherPurposeReason = null;
      this.applyOtherPurposeReasonLength = 0;
    }
  }

  /**
   * 选择申请人类型代办信息可见性
   * value: 1：本人 2：代理人
   * 当选择代理人时，出现代理人证件信息输入项
   */
  selectIndexOfApplyPersonType(e) {
    if (e.selectedItem !== null) {
      if (e.selectedItem.value === '2') {
        this.showAgent = false;
      } else {
        this.showAgent = true;
      }
    }
  }
}
