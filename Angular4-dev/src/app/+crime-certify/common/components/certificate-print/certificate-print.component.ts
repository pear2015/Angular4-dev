import {
  Component, Output, Input, ViewChild, Renderer2,
  EventEmitter, ElementRef, OnInit, OnDestroy, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as domtoimage from 'dom-to-image';
import * as ip from 'internal-ip';

import { LocalStorageService, UtilHelper, ConfigService, LoggerRecordService } from '../../../../core';

import { CertificateInfo } from '../../../../model/certificate-apply/certificateInfo';
import { CertificatePrintInfo } from '../../../../model/certificate-apply/CertificatePrintInfo';
import { OperationLog } from '../../../../model/logs/operationLog';
import { ApplyInfo } from '../../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../../model/certificate-apply/ApplyBasicInfo';
import { CrimeRecordPrint } from '../../../../model/crime-notice/CrimeRecordPrint';

import { UserInfo } from '../../../../model/auth/userinfo';
import { CertificatePrintService } from './certificate-print.service';
import { CrimeRecordPrintComponent } from '../crimerecord-print/crimerecord-print-component';
import { ApplyCommonService } from '../../../../+crms-common/services/apply-common.service';
import { EncodingRulesService } from '../../../../+crms-common/services/encoding-rules.service';
@Component({
  selector: 'mf-print',
  templateUrl: './certificate-print.component.html',
  providers: [CertificatePrintService]
})
export class CertificatePrintComponent implements OnChanges, OnInit, OnDestroy {
  operationLog: OperationLog;
  printFlag: boolean = true;
  applyInfoCer: any;
  certificatePrintVisable: boolean = false;
  showPrintBtn: boolean = true;
  showRePrintBtn: boolean = false;
  showGovernCer: boolean = false;
  showPersonCer: boolean = false;
  certificateInfo: CertificateInfo;
  LoadingPanelVisible: boolean = false;
  confirmVisible: boolean = false;
  attachmentId: string;
  saveInfoVisible: boolean = false;
  operationInfo: string;
  // 是否保存了电子证书
  flag: boolean = false;
  userInfo: UserInfo;
  applyBasicInfo: ApplyBasicInfo;
  nationalCenterDirector: string;
  today: Date;

  @Input() certificatePrintInfo: CertificatePrintInfo;
  @Input() printTip: boolean;
  @Output() printOver: EventEmitter<any>;
  // 犯罪信息列表
  @Input() crimeAndNoticeList: CrimeRecordPrint[];
  // 申请信息
  @Input() applyInfo: ApplyInfo;
  // 申请人基本信息
  // @Input()
  @Input() applyId: string;
  @Input() certificateId: string;

  @ViewChild('certificateDiv') certificateDiv: ElementRef;
  @ViewChild(CrimeRecordPrintComponent) crimeRecordPrintComponent: CrimeRecordPrintComponent;
  crimerecordElement: ElementRef;

  @ViewChild('crimeRecord') crimeRecord: ElementRef;

  private domtoimage = domtoimage;
  private blob: Blob;
  isShowNoticeNumber: boolean = false;
  personPrintFlag: boolean = true;
  govmentPrintFlag: boolean = true;
  constructor(
    private cerPrintService: CertificatePrintService,
    private encodingRulesService: EncodingRulesService,
    private applyCommonService: ApplyCommonService,
    private localStorageService: LocalStorageService,
    private utilHelper: UtilHelper,
    private renderer2: Renderer2,
    private router: Router,
    private configService: ConfigService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private logger: LoggerRecordService,
  ) {
    this.certificatePrintInfo = new CertificatePrintInfo();
    this.printOver = new EventEmitter<any>(false);
    this.certificateInfo = new CertificateInfo();
    this.operationLog = new OperationLog();

    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.timeOut = 3000;
  }
  ngOnChanges() {
    console.log(this.certificateId);
    if (this.utilHelper.AssertNotNull(this.applyInfo)) {
      if (this.applyInfo.applyTypeId === '1' && this.applyInfo.applyResultId === '1') { // 个人申请无犯罪
        this.personPrintFlag = true;
      } else if (this.applyInfo.applyTypeId === '1' && this.applyInfo.applyResultId === '2') { // 个人申请有犯罪
        this.personPrintFlag = false;
      } else if (this.applyInfo.applyTypeId === '2' && this.applyInfo.applyResultId === '1') { // 政府申请无犯罪
        this.govmentPrintFlag = false;
      } else if (this.applyInfo.applyTypeId === '2' && this.applyInfo.applyResultId === '2') { // 政府申请有犯罪
        this.govmentPrintFlag = true;
      }
    }
  }
  ngOnInit() {
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;

    this.configService.get('NationalCenterDirector')
      .then(result => {
        this.nationalCenterDirector = result;
        this.today = new Date();
      });
  }
  ngOnDestroy() {
    this.isShowNoticeNumber = false;
  }

  /**
   *  开始打印
   *  出现全部遮盖loading
   */
  beforePrint() {
    this.LoadingPanelVisible = true;
    // this.showPrintBtn = false;
    // this.isPrintCrimeRecordByApplyResult();
    // this.isShowNoticeNumber = false;
  }
  /**
   *
   * 申请结果为有犯罪记录就打印犯罪公告，没有不打印。
   *
   * @memberof CertificatePrintComponent
   */
  isPrintCrimeRecordByApplyResult() {
    if (this.applyInfo.applyResultId === '2') {
      this.renderer2.appendChild(this.crimeRecord.nativeElement, this.crimeRecordPrintComponent.crimeRecord.nativeElement);
    }
  }

  /**
   * 打印完成
   */
  completePrint() {
    this.LoadingPanelVisible = false;
    // 没有保存电子证书，就保存证书
    if (this.applyInfo.applyStatusId !== '4') {
      this.certificateAttachment();
    } else {
      this.updateCertificateInfo(null);
    }
    this.isShowNoticeNumber = false;
  }


  async certificateAttachment() {
    await this.htmlToBlob();
    let result = false;
    if (this.blob != null) {
      try {
        this.attachmentId = await this.cerPrintService.storeFile(this.blob);
        if (this.attachmentId != null && this.attachmentId !== undefined) {
          result = await this.updateCertificateInfo(this.attachmentId);
          if (result) {
            if (this.router.url === '/crms-system/crime-certify/apply-person' ||
              this.router.url === '/crms-system/crime-certify/apply-goverment') {
              this.router.navigate(['/crms-system/crime-certify/apply-complete']);
            }
          }
          return result;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return result;
  }

  /**
   * 获取打印证书内容
   */
  async getCertificatePrintInfo(applyInfo) {
    try {
      if (this.utilHelper.AssertNotNull(applyInfo) && this.utilHelper.AssertNotNull(applyInfo.applyId)) {
        let result = await this.applyCommonService.getCertificateInfo(applyInfo.applyId);

        if (this.utilHelper.AssertNotNull(result)) {
          this.applyInfoCer = result.applyInfo;
          this.applyBasicInfo = result.applyBasicInfo;

          this.certificatePrintInfo = new CertificatePrintInfo();
          // this.certificatePrintInfo = new CertificatePrintInfo();

          // 证书信息头部
          this.certificatePrintInfo.applyTypeId = this.applyInfoCer.applyTypeId;
          // 证书上待打印的个人信息
          if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssueDate)) {
            this.certificatePrintInfo.credentialsIssueDate = this.applyBasicInfo.credentialsIssueDate
              .toString().substring(0, 10);
          }
          if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
            this.certificatePrintInfo.dateOfBirth = this.applyBasicInfo.dateOfBirth.toString().substring(0, 10);

          }
          this.certificatePrintInfo.govermentInfo = this.applyInfoCer.govermentProcess;
          this.certificatePrintInfo.applyPurposeName = this.applyInfoCer.applyPurposeName;
          this.certificatePrintInfo.firstName = this.applyBasicInfo.firstName;
          this.certificatePrintInfo.lastName = this.applyBasicInfo.lastName;
          this.certificatePrintInfo.applyResultName = this.applyInfoCer.applyResultName;
          this.certificatePrintInfo.certificateName = this.applyBasicInfo.certificateName;
          this.certificatePrintInfo.certificateNumber = this.applyBasicInfo.certificateNumber;
          this.certificatePrintInfo.credentialsIssuePlace = this.applyBasicInfo.credentialsIssuePlace;
          this.certificatePrintInfo.fatherFirstName = this.applyBasicInfo.fatherFirstName;
          this.certificatePrintInfo.fatherLastName = this.applyBasicInfo.fatherLastName;
          this.certificatePrintInfo.motherFirstName = this.applyBasicInfo.motherFirstName;
          this.certificatePrintInfo.motherLastName = this.applyBasicInfo.motherLastName;
          this.certificatePrintInfo.marriageName = this.applyBasicInfo.marriageName;
          this.certificatePrintInfo.provinceName = this.applyBasicInfo.provinceName;
          this.certificatePrintInfo.cityName = this.applyBasicInfo.cityName;
          this.certificatePrintInfo.communityName = this.applyBasicInfo.communityName;

          if (this.printFlag) {
            if (this.utilHelper.AssertNotNull(this.certificatePrintInfo)) {
              if (this.certificatePrintInfo.applyTypeId === '1') {
                this.showPersonCer = false;
                this.showGovernCer = true;
                this.certificatePrintVisable = true;
              } else if (this.certificatePrintInfo.applyTypeId === '2') {
                this.showPersonCer = true;
                this.showGovernCer = false;
                this.certificatePrintVisable = true;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);

    }

  }

  /**
   * 保存初始证书
   */
  async saveInitCertificateInfo(applyInfo) {
    try {
      if (this.utilHelper.AssertNotNull(applyInfo)) {
        let result = await this.cerPrintService.findCertificateInfoByApplyId(applyInfo.applyId);
        if (this.utilHelper.AssertEqualNull(result)) {
          this.certificateInfo.applyId = applyInfo.applyId;
          this.certificateInfo.certificateType = applyInfo.applyTypeId;
          this.certificateInfo.createPersonName = this.userInfo.orgPersonId;
          this.certificateInfo.validateCode = this.encodingRulesService.verificationCodeCreate();
          this.saveCertificate();
        } else {
          this.certificateInfo = result;
        }
      }
    } catch (error) {
      this.displayErrorTip();
      console.log(error);
    }
  }

  /**
   * 无初始证书存储时保存
   */
  async saveCertificate() {
    try {
      let certificateInfo = await this.cerPrintService.saveCertificateInfo(this.certificateInfo);
      if (this.utilHelper.AssertNotNull(certificateInfo)) {
        this.certificateInfo = certificateInfo;
      } else {
        this.displayErrorTip();
      }
    } catch (error) {
      this.displayErrorTip();
      console.log(error);
    }
  }

  /**
   *  更新证书信息
   */
  async updateCertificateInfo(attachmentID: string) {

    this.certificateInfo.certificateStatus = '1';
    this.certificateInfo.attachmentId = attachmentID;
    try {
      let result = await this.cerPrintService.updateCertificateInfo(this.certificateInfo);
      if (result) {
        this.operationInfo = 'electric certificate sava success';
        this.toastr.clear();
        this.toastr.success(this.getTranslateName(this.operationInfo));
        if (this.router.url === '/crms-system/crime-certify/apply-person' ||
          this.router.url === '/crms-system/crime-certify/apply-goverment') {
          this.router.navigate(['/crms-system/crime-certify/apply-complete']);
        }
        this.printOver.emit();

        // 证书打印成功日志记录
        try {
          this.operationLog.level = 'info';
          this.operationLog.action = 'ADD';
          let _newContent = JSON.stringify(this.certificateInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'add certificate-print success';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }

      } else {
        this.toastr.clear();
        this.toastr.error(this.getTranslateName(this.operationInfo));

        // 证书打印失败日志记录
        try {
          this.operationLog.level = 'info';
          this.operationLog.action = 'ADD';
          let _newContent = JSON.stringify(this.certificateInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'add certificate-print failed';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }

      }
      this.certificatePrintVisable = false;
      return result;
    } catch (error) {
      console.log(error);
      this.displayErrorTip();
    }
  }

  /**
   * 关闭按钮事件
   */
  closePopup() {
    this.certificatePrintVisable = false;
    this.isShowNoticeNumber = false;
  }

  /**
   *  转换成blob
   */
  async htmlToBlob() {
    if (this.certificateDiv != null && this.certificateDiv !== undefined && this.certificateDiv.nativeElement != null &&
      this.certificateDiv.nativeElement !== undefined) {
      try {
        let url = await this.domtoimage.toJpeg(this.certificateDiv.nativeElement);
        if (url != null && url !== undefined) {
          this.blob = this.cerPrintService.dataURLtoBlob(url);
          this.certificatePrintVisable = false;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  displayErrorTip() {
    this.toastr.clear();
    this.toastr.error(this.getTranslateName('Server Inner Exception,Can not Print'));

    this.printFlag = false;
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'certificate-print';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }

}
