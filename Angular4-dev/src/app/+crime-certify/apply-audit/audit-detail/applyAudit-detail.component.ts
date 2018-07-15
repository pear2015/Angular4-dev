import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as ip from 'internal-ip';

import { EventAggregator, LoggerRecordService, LocalStorageService, UtilHelper, DateFormatHelper } from '../../../core';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { EnumInfo } from '../../../enum/';

import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../../model/common/AttachmentInfo';
import { ApplyAndCriminalRelation } from '../../../model/certificate-apply/ApplyAndCriminalRelation';
import { CertificateApplyInfo } from '../../../model/certificate-apply/CertificateApplyInfo';
import { NoticeMessage } from '../../../model/socket-info/NoticeMessage';
import { OperationLog } from '../../../model/logs/operationLog';
import { UserInfo } from '../../../model/auth/userinfo';
import { CrimeNoticeQuery } from '../../../model/crime-integrated-business/CrimeNoticeQuery';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';

import { ApplyAuditService } from './../apply-audit.service';
import { WizardComponent } from '../../../shared/components/wizard/wizard.component';
@Component({
  templateUrl: './applyAudit-detail.component.html',
  providers: [ApplyCommonService, ApplyAuditService, DateFormatHelper, EnumInfo]

})
export class ApplyAuditDetailComponent implements OnInit {

  @ViewChild('crimeNoticeGrids')
  crimeNoticeGrids: DxDataGridComponent;

  /**
   * 个人申请的相关信息初始化
   * 1. 证书申请基本信息
   * 2. 证书申请个人基本信息
   * 3. 证书申请附件信息
   * 4. 犯罪noticeId与applyId关联信息
   * 5. 查询出的证书申请详细信息
   * 6. 犯罪公告信息
   * 7. 审核员Id
   */
  applyInfo: ApplyInfo;
  applyBasicInfo: ApplyBasicInfo;
  applyAttachmentList: AttachmentInfo[] = [];
  applyAndCriminalRelation: ApplyAndCriminalRelation;
  certificateApplyInfo: CertificateApplyInfo;
  crimePersonInfo: CrimePersonInfo;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  criminalList: any;
  auditorId: string;

  /**
   * 审核主页路由传递过来的待审核applyId
   * 审核结果枚举类型
   */
  applyId: string;
  auditResultEnum: any;

  /**
   * 1. 详情页可缩放
   * 2. 保存按钮tooltip
   * 3. 回退按钮tooltip
   * 4. 保存时的loading可见性
   * 5. 保存结果pupop可见性
   * 6. 保存结束时操作提示消息
   * 7. 是否更新成功
   */
  showCollapsed: boolean = true;
  defaultVisible: boolean;
  backDefaultVisible: boolean;
  loadingVisible: boolean = false;
  popupVisible: boolean = false;
  operationInfo: string;
  isSaveSucess: boolean;

  /**
   * 拒绝原因是否可输入与必填
   */
  isReason: boolean = true;

  /**
   * 附件查询预览功能
   * 1.popup可见性
   * 2.附件图片byte数组
   */
  pupopSee = false;
  seeSrc = '';

  noticeImagePathList: any[] = [];
  noticeImageFileList: any[] = [];
  imagePathList: any[] = [];
  imageFileList: any[] = [];
  thumbnailWidth: string;
  popupImageVisible: boolean = false;
  activeSlideIndex: number = 0;

  /**
   * 输入字符统计初始化
   * 1.审核描述
   * 2.原因字符数
   */
  auditDescriptionLength: number = 0;
  auditRejectReasonLength: number = 0;

  // 分析拒绝原因是否显示
  isRejectAnalysis: boolean = true;

  // 页数
  totalCount: number;

  /**
   * 消息体
   */
  noticeMessage: NoticeMessage;

  // 操作记录日志
  operationLog: OperationLog;
  // 当前用户
  userInfo: UserInfo = null;

  // 犯罪公告分页对象
  crimeNoticeQuery: CrimeNoticeQuery;


  // 没有通过验证的规则列表
  brokenRules: any[] = [];
  validateVisible: boolean = false;
  routerFlag: string;
  applyAuditVisible: boolean = true;

  attchmentControllObj: any;
  noticeBox: boolean = true; // 公告信息容器
  personBox: boolean = false; // 罪犯信息容器
  showPersonApplyInfo: boolean = true;
  showGovernApplyInfo: boolean = true;
  showProcessInfo: boolean = true;
  isAnalysised: boolean = true;

  applyTypeId: string;
  submitDiabled: boolean = false;
  // 当前选择的罪犯Id
  hasSelectCrimePersonId: string;
  showInfoIndex: number = 1;
  completeInfo: any;
  submitResult: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enumInfo: EnumInfo,
    private dateFormatHelper: DateFormatHelper,
    private utilHelper: UtilHelper,
    private applyCommonService: ApplyCommonService,
    private applyAuditService: ApplyAuditService,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private logger: LoggerRecordService,
    private toastr: ToastrService,
  ) {
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.noticeMessage = new NoticeMessage();
    this.operationLog = new OperationLog();
    // 获取路由导航传递过来的参数
    this.route.queryParams.subscribe(data => {
      this.applyId = data.applyId;
      this.applyTypeId = data.applyTypeId;
      this.routerFlag = data.flag;
    });
    this.crimeNoticeQuery = new CrimeNoticeQuery();
    this.applyAndCriminalRelation = new ApplyAndCriminalRelation();
    this.crimePersonInfo = new CrimePersonInfo();

    this.attchmentControllObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
  };


  ngOnInit() {
    // 获取登录人员的信息
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;

    // 获取申请基本信息
    this.bindApplyInfoListData();

    // 路由路径绑定
    this.bindRoutUrl('CrimeCertifyManagement', 'applyAuditDetail');

    // 获取审核类型结果枚举
    this.auditResultEnum = this.enumInfo.getAuditResultEnum;
    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-audit-detail');

    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;
  }

  /**
   * 选中已选的犯罪嫌疑人
   */
  selectdefaultCrimer(e) {
    if (this.utilHelper.AssertNotNull(this.criminalList)) {
      this.criminalList.forEach((item, index) => {
        if (item.crimePersonId === this.applyAndCriminalRelation.criminalId) {
          this.crimeNoticeGrids.instance.selectRowsByIndexes([index]);
        }
      });
    }
  }


  /**
   * 获取申请基本信息
   *
   * @memberof ApplyAuditDetailComponent
   */
  async  bindApplyInfoListData() {
    try {
      let result = await this.applyCommonService.getApplyInfoByApplyID(this.applyId);
      if (this.utilHelper.AssertNotNull(result)) {
        this.applyInfo = result.applyInfo;
        this.applyBasicInfo = result.applyBasicInfo;
        this.applyAttachmentList = result.attachmentInfoList;
        if (this.utilHelper.AssertNotNull(result.crimePersonInfo)) {
          this.crimePersonInfo = result.crimePersonInfo;
          this.applyAndCriminalRelation.criminalId = this.crimePersonInfo.crimePersonId;
          if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.crimePersonInfo.isActive === '1') {
            this.hasSelectCrimePersonId = this.crimePersonInfo.crimePersonId;
          }
        }
        // 选择显示的申请信息类型
        this.showApplyInfo(this.applyTypeId, this.routerFlag);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 选择显示的申请信息类型
  showApplyInfo(applyTypeId: string, routerFlag: string) {
    if (applyTypeId === '1') {
      this.showPersonApplyInfo = false;
      this.showGovernApplyInfo = true;
    }
    if (applyTypeId === '2') {
      this.showPersonApplyInfo = true;
      this.showGovernApplyInfo = false;
    }
    if (this.routerFlag === 'applyAudit-pending') {
      this.applyAuditVisible = false;
      this.showProcessInfo = true;
      // 将分析勾选的罪犯勾上
      this.bindCriminalListByAnalystResult();
    }
    if (this.routerFlag === 'applyAudit-complete') {
      this.applyAuditVisible = true;
      this.showProcessInfo = false;
    }
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo)) {
      if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
        this.applyBasicInfo.age = null;
      }
    }
  }

  /**
   * 判断分析结果是有犯罪还是无犯罪1.有犯罪展示分析员勾选的公告。
   * 2.无犯罪和拒绝分析展示所有匹配的公告
   * @memberof ApplyAuditDetailComponent
   */
  bindCriminalListByAnalystResult() {

    this.getCriminalListByNameAndIdNumber(this.crimeNoticeQuery);

    if (this.applyInfo.analysisResultId === '3') {
      this.isRejectAnalysis = false;
    }
  }

  getCrimeNoticeEmit(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.crimeNoticeQuery.pages = obj;
      this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
            this.isAnalysised = true;
            this.criminalList = result.data;
            this.totalCount = result.totalCount;
          }
          if (this.utilHelper.AssertNotNull(this.criminalList)) {
            this.criminalList.forEach(item => {
              if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
                item.age = null;
              }
              if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
                this.applyBasicInfo.age = null;
              }
              item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
              item.name = item.firstName + ' ' + item.lastName;
            });

          }
        }).catch(err => {
          console.log(err);
        });
    }
  }

  /**
   * 分析结果为无犯罪记录时，加载所有可能罪犯
   * 通过姓名和证件查询罪犯
   * @param crimeNoticeQuery
   */
  getCriminalListByNameAndIdNumber(crimeNoticeQuery: CrimeNoticeQuery) {
    this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
    this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
    this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
    this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
    this.applyCommonService.getCriminalByNameAndId(this.crimeNoticeQuery).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.criminalList = result.data;
        this.totalCount = result.totalCount;
      }
    }).catch(e => {
      console.log(e);
    });
  }

  showNotice() {
    this.noticeBox = true;
    this.personBox = false;
  }
  showPerson() {
    this.noticeBox = false;
    this.personBox = true;
  }

  /**
  * 点击分页按钮，重新拉取数据
  *
  */
  pageIndexChange(obj) {
    this.crimeNoticeQuery.pages = obj.pages;
    this.getCriminalListByNameAndIdNumber(this.crimeNoticeQuery);
  }


  /**
   * 判断拒绝原因是否必填
   * '1': 通过;
   * '2': 不通过;(不通过原因必填)
   */
  enterOption(index) {
    this.applyInfo.auditResultId = this.auditResultEnum[index].value;
    if (index === 1) {
      this.isReason = false;
    } else {
      this.isReason = true;
      this.applyInfo.auditRejectReason = '';
      this.auditRejectReasonLength = 0;
    }
  }


  /**
   * 保存按钮tooltip
   * 回退按钮tooltip
   */
  toggleDefault() {
    this.defaultVisible = !this.defaultVisible;
  }
  backToggleDefault() {
    this.backDefaultVisible = !this.backDefaultVisible;
  }

  /**
   * 统计审核描述和原因字符数
   */
  countAuditDescriptionCharacter() {
    this.auditDescriptionLength = this.applyInfo.auditDescription.length;
  }
  countAuditReasonCharacter() {
    this.auditRejectReasonLength = this.applyInfo.auditRejectReason.length;
  }
  /**
   * 回到审核主页
   * 显示更新时的loading
   * 更新完成后弹出提示窗口
   */
  goBack() {
    if (this.routerFlag === 'applyAudit-pending') {
      this.router.navigate(['/crms-system/crime-certify/applyAudit-pending']);
    }
    if (this.routerFlag === 'applyAudit-complete') {
      this.router.navigate(['/crms-system/crime-certify/applyAudit-complete']);
    }
  }
  showLoadPanel() {
    this.loadingVisible = true;
  }
  onHidden() {
    this.popupOperationInfo(this.isSaveSucess);
  }

  /**
   * 日期格式处理
   *
   * @memberof ApplyAuditDetailComponent
   */
  formatDate() {
    this.applyInfo.auditTime = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.applyInfo.auditTime);
  }


  /**
   * 弹出操作结果提示信息
   * @param isSucess
   */
  popupOperationInfo(isSucess: boolean) {
    if (isSucess === true) {
      this.operationInfo = 'save success';
      this.popupVisible = true;
    }
    if (isSucess === false) {
      this.operationInfo = 'save failure';
      this.popupVisible = true;
    }
  }


  getApplyAndCriminalRelationEmit(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.applyAndCriminalRelation.criminalId = e;
    } else {
      this.applyAndCriminalRelation.criminalId = null;
    }
  }

  onSubmit(e) {
    if (this.utilHelper.AssertEqualNull(this.applyInfo.auditResultId)) {
      // 是否选择录入意见
      this.toastr.error(this.getTranslateName('auditResult is required'));
      return;
    }
    let validateResult = this.validator.first.instance.validate();
    let isValid = validateResult.isValid;
    if (isValid) {
      this.submitDiabled = true;
      // 出现loading效果
      this.showLoadPanel();

      // 设置审核时间以及审核员Id
      this.applyInfo.auditTime = new Date();
      this.applyInfo.auditPersonId = this.userInfo.orgPersonId;
      this.applyInfo.auditPersonName = this.userInfo.personName;
      // 传入申请状态
      this.setApplyInfoStatus();

      // 格式化审核时间
      this.formatDate();

      // 提交审核信息
      this.certificateApplyInfo = new CertificateApplyInfo(this.applyBasicInfo, this.applyInfo,
        this.applyAttachmentList, this.applyAndCriminalRelation);

      this.applyAuditService.updateCertificateApplyInfo(this.certificateApplyInfo)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result) && result.success === true) {
            this.isSaveSucess = result.success;
          }
          if (this.isSaveSucess) {
            this.completeInfo = result.data;
            this.submitDiabled = true;
            this.loadingVisible = false;
            this.applyInfo.auditRejectReason = '';
            this.auditRejectReasonLength = 0;
            this.applyInfo.auditDescription = '';
            this.auditDescriptionLength = 0;
            this.wizard.next();
            // this.router.navigate(['/crms-system/crime-certify/applyAudit-pending']);
            // 审核成功日志记录
            try {
              this.operationLog.level = 'info';
              this.operationLog.action = 'UPDATE';
              let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
              this.operationLog.newContent = _newContent;
              this.operationLog.actionDesc = 'update apply-audit success';
              this.submitResult = this.getTranslateName('update apply-audit success');
              this.logRecord();
            } catch (error) {
              console.log(error);
            }

          } else {
            this.submitDiabled = false;
            this.toastr.clear();
            this.toastr.toastrConfig.maxOpened = 1;
            this.toastr.error(this.getTranslateName('save failure'));

            // 审核失败日志记录
            try {
              this.operationLog.level = 'error';
              this.operationLog.action = 'UPDATE';
              let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
              this.operationLog.newContent = _newContent;
              this.operationLog.actionDesc = 'update apply-audit failed';
              this.submitResult = this.getTranslateName('update apply-audit failed');
              this.loadingVisible = false;
              this.logRecord();
            } catch (error) {
              console.log(error);
            }
          }
        }).catch(error => {
          console.log(error);
          this.submitDiabled = false;
          this.loadingVisible = false;
          this.toastr.clear();
          this.toastr.toastrConfig.maxOpened = 1;
          this.toastr.error(this.getTranslateName('save failure'));
          this.submitResult = this.getTranslateName('update apply-audit failed');
        });

    } else {
      this.submitDiabled = false;
      this.brokenRules = validateResult.brokenRules;
      this.validateVisible = true;
    }
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  /**
   * 设置申请状态
   *
   * @memberof ApplyAuditDetailComponent
   */
  setApplyInfoStatus() {
    if (this.utilHelper.AssertNotNull(this.applyInfo)) {
      if (this.applyInfo.auditResultId === '1' && this.applyInfo.analysisResultId === '3') {
        // 拒绝打印
        this.applyInfo.applyStatusId = '6';
      } else if (this.applyInfo.auditResultId === '1') {
        // 待打印
        this.applyInfo.applyStatusId = '4';
      } else if (this.applyInfo.auditResultId === '2') {
        // 待分析
        this.applyInfo.applyStatusId = '2';
      }
    }
  }

  /***
   * 路由绑定header路径
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'apply-audit';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.newContent = null;
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }

  //  tab页切换
  showInfo(num) {
    this.showInfoIndex = num;
  }

  /**
* @param e 点击下一步表单验证
*/
  nextEventValidata(step) {
    if (step === 0) {
      this.wizard.next(); // 直接进行下一步
    } else if (step === 1) {  // 第二步
      this.wizard.next(); // 直接进行下一步
    } else if (step === 2) { // 第三步
      this.wizard.next(); // 直接进行下一步
    } else if (step === 3) { // 第四步
      this.wizard.next();
    }
  }

}
