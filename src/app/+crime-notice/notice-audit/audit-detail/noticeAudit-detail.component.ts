import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as ip from 'internal-ip';

import { UtilHelper, EventAggregator, LocalStorageService, LoggerRecordService } from '../../../core';
import { CrimeAndNoticeService } from '../../../+crms-common/services/crime-notice.service';
import { EnumInfo } from '../../../enum';

import { NoticeInfo } from '../../../model/crime-notice/noticeInfo';
import { CrimeInfo } from '../../../model/crime-notice/crimeInfo';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';
import { UserInfo } from '../../../model/auth/userinfo';
import { OperationLog } from '../../../model/logs/operationLog';

import { NoticeAuditService } from '../../common/services/notice-audit.service';
import { asEnumerable } from 'linq-es2015';
import { WizardComponent } from '../../../shared/components/wizard/wizard.component';

@Component({
  templateUrl: './noticeAudit-detail.component.html',
  providers: [NoticeAuditService, EnumInfo, CrimeAndNoticeService]
})

export class NoticeAuditDetailComponent implements OnInit {

  noticeId: string;
  auditPersonId: string;

  noticeInfo: NoticeInfo; // 公告信息
  crimeInfo: CrimeInfo; // 犯罪基本信息
  crimePersonInfo: CrimePersonInfo; // 犯罪个人信息

  noticeBox: boolean = true; // 公告信息容器
  personBox: boolean = false; // 罪犯信息容器

  simpleProducts: any; // 审核结果枚举
  outRequestParameters: any; // 提交审核参数
  @ViewChild(WizardComponent) wizard: WizardComponent;
  // auditDescriptionLength: number = 0; // 字符数
  isRecorded: boolean = false; // 判断是否审核按钮是否隐藏
  routerFlag: any; // 公告审核页面
  routeStatusId: string; // 录入的公告查询页面
  noticeRejectFlag: string; // 驳回的公告页面
  attachmentList: any[]; // 附件列表

  matchRequestParameters: any; // 匹配列表参数
  matchList: any; // 匹配列表
  personInfoList: any; // 匹配人员信息列表
  dataCount: any; // 匹配人员信息总条目

  criminalId: string; // 当前公告罪犯ID

  loadingPanelVisible: boolean = false; // loading
  auditInfoSwitch: boolean = true; // 审核时页面隐藏回填合并信息开关

  attchmentControllObj: any;
  userInfo: UserInfo;
  showProcessInfo = true; // 查看流程
  waitMergingCriminalList: string[] = []; // 待合并数据集合
  dataCompareVisible: boolean = false;
  criminalInfoObj: any = {};
  crimePersonId: string;
  popupNoticeVisible: boolean;
  operationLog: OperationLog;
  // 清空按钮提示信息
  clearPageTolVisible: boolean = false;
  // 审核按钮是否可用
  submitDisabled: boolean = false;
  showInfoIndex: number = 1;
  completeInfo: any;
  submitResult: string;
  constructor(
    private service: NoticeAuditService,
    private crimeNoticeService: CrimeAndNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private enumInfo: EnumInfo,
    private utilHelper: UtilHelper,
    private toastr: ToastrService,
    private eventAggregator: EventAggregator,
    public translateService: TranslateService,
    public localStorageService: LocalStorageService,
    public logger: LoggerRecordService,
  ) {
    this.noticeInfo = new NoticeInfo();
    this.crimeInfo = new CrimeInfo();
    this.crimePersonInfo = new CrimePersonInfo();
    this.operationLog = new OperationLog();
    this.simpleProducts = this.enumInfo.getAuditResultEnum;
    this.matchRequestParameters = {
      pages: 0,
      pageSize: 5,
    };

    this.attchmentControllObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };

    this.toastr.toastrConfig.maxOpened = 1;
  }
  ngOnInit() {

    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;

    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;

    // 初始化接口地址
    this.service.initialCrmsService()
      .then(result => {
        this.bindDataList();
        // this.bindCrimePersonList();
      });

    // 获取接口参数
    this.route.params.subscribe(data => {
      this.noticeId = data.noticeId;
      this.auditPersonId = data.roleId;
      this.routerFlag = data.flag;
    });
    sessionStorage.setItem('currentRouter', 'noticeAudit-detail');
    // 路由跳转进来后页面状态
    if (this.routerFlag === 'noticeAudit-pending') {// 从审核从跳过来要显示 待合并列表
      this.isRecorded = false;
      this.showProcessInfo = true;
      this.auditInfoSwitch = false;
      this.bindRoutUrl('CrimeNoticeManagement', 'NoticeAuditPending');
    } else if (this.routerFlag === 'noticeAudit-complete' || this.routerFlag === 'notice-history' ||
      this.routerFlag === 'notice-priority') {
      this.isRecorded = true;
      this.showProcessInfo = false;
      this.auditInfoSwitch = true;
    } else if (this.routerFlag === 'notice-reject' || this.routerFlag === 'notice-auditing') {
      this.isRecorded = true;
      this.auditInfoSwitch = true;
    } else {
      // 路由信息
      this.bindRoutUrl('CrimeNoticeManagement', 'notice detail');
    }


    // 初始化数据列表

    // 获取匹配参数和数据
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo)) {
      this.matchRequestParameters = {
        certificateNumber: this.crimePersonInfo.certificateNumber,
        certificateType: this.crimePersonInfo.certificateType,
        firstName: this.crimePersonInfo.firstName,
        lastName: this.crimePersonInfo.lastName,
      };
    }

  }

  // 路由绑定header路径
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 获取数据列表
  async bindDataList() {
    // 获取数据源
    let result = await this.service.getNoticeDetails(this.noticeId);
    if (this.utilHelper.AssertNotNull(result)) {
      this.noticeInfo = result.noticeInfo;
      this.crimePersonInfo = result.crimePersonInfo;
      this.crimeInfo = result.crimeInfo;
      this.attachmentList = result.attachmentInfo;
      this.criminalId = this.crimePersonInfo.crimePersonId;
      this.waitMergingCriminalList = result.waitCriminalIds;
      // 获取匹配参数和数据
      if (this.utilHelper.AssertNotNull(this.crimePersonInfo)) {
        if (this.crimePersonInfo.age === 0 && this.utilHelper.AssertEqualNull(this.crimePersonInfo.dateOfBirth)) {
          this.crimePersonInfo.age = null;
        }
        // 重新审核 初始化审核信息
        if (this.utilHelper.AssertNotNull(this.noticeInfo) && this.routerFlag === 'noticeAudit-pending') {
          this.noticeInfo.auditResultId = null;
          this.noticeInfo.auditDescription = null;
        }
        this.matchRequestParameters = {
          certificateNumber: this.crimePersonInfo.certificateNumber,
          certificateType: this.crimePersonInfo.certificateType,
          firstName: this.crimePersonInfo.firstName,
          lastName: this.crimePersonInfo.lastName,
          pages: 0,
          pageSize: 5
        };
        this.bindCrimePersonList();
      }
    } else {
      this.translateService.get(['Data abnormal']).subscribe(value => {
        this.toastr.error(value['Data abnormal']);
      });
    };
  }

  /**
   *  获取回填信息列表
   * isChecked 是否已勾选
   * isCheckedDisabled 是否不能合并
   */

  async bindCrimePersonList() {
    // 获取回填信息列表
    let result = await this.service.postMatchList(this.matchRequestParameters);
    // 获取回填人员信息
    if (this.utilHelper.AssertNotNull(result)) {
      this.personInfoList = result.data;
      if (this.utilHelper.AssertNotNull(this.personInfoList) && this.personInfoList.length > 0) {
        this.personInfoList.forEach(item => {
          /**
           * 判断数据是否含有回填 和合并的数据
           * 有回填和合并的数据要进行勾选
           */
          if (this.utilHelper.AssertNotNull(this.crimePersonInfo) &&
            item.crimePersonId === this.crimePersonInfo.backFillCriminalId) {
            item.isChecked = true;
            item.isCheckedDisabled = false;
          } else if (this.utilHelper.AssertNotNull(this.waitMergingCriminalList) && this.waitMergingCriminalList.length > 0) {
            this.isContainCriminalId(this.waitMergingCriminalList, item);
          } else {
            item.isChecked = false;
            item.isCheckedDisabled = item.isMerging === '1';
          }
        });
      }

      this.dataCount = result.totalCount;
      // 数据匹配
      this.compareNoticeSimilarly(this.personInfoList);
    }
  }

  /**
   * 比较公告相似度
   *
   * @memberof ApplyAuditDetailComponent
   */
  compareNoticeSimilarly(criminals: Array<CrimePersonInfo>) {
    if (this.utilHelper.AssertNotNull(criminals)) {
      criminals.forEach(item => {
        if (item.age === 0) {
          item.age = null;
        }
        if (item.height === 0) {
          item.height = null;
        }
        if (this.crimePersonInfo.age === 0 && this.utilHelper.AssertEqualNull(this.crimePersonInfo.dateOfBirth)) {
          this.crimePersonInfo.age = null;
        }
        if (this.crimePersonInfo.height === 0) {
          this.crimePersonInfo.height = null;
        }
        item.point = this.crimeNoticeService.comparsionInformation(item, this.crimePersonInfo);
        item.ciminalName = item.firstName + ' ' + item.lastName;
        // if (item.crimePersonId === this.criminalId) {
        //     item.isChecked = true;
        // }
      });
      this.personInfoList = asEnumerable(criminals).OrderByDescending(item =>
        Number(item.point.substring(0, item.point.length - 1))).ThenByDescending(item => item.enteringTime).ToArray();
    }
  }
  /**
   * 判断是否有合并数据 匹配到操作状态进行勾选
   * 判断待合并列表是否包含改罪犯
   */
  isContainCriminalId(waitMergingCriminalList: any, crimePerson: any) {
    if (this.utilHelper.AssertNotNull(crimePerson) && this.utilHelper.AssertNotNull(waitMergingCriminalList)) {
      crimePerson.isCheckedDisabled = waitMergingCriminalList.indexOf(crimePerson.crimePersonId) === -1 ? (
        crimePerson.isMerging === '1' ? true : false) : false;
      crimePerson.isChecked = !(waitMergingCriminalList.indexOf(crimePerson.crimePersonId) === -1);
    }
  }

  showNotice() {
    this.noticeBox = true;
    this.personBox = false;
  }
  showPerson() {
    this.noticeBox = false;
    this.personBox = true;
  }
  goBack() {
    if (this.routerFlag === 'noticeAudit-pending') {
      this.router.navigate(['/crms-system/crime-notice/noticeAudit-pending']);
    }
    if (this.routerFlag === 'noticeAudit-complete') {
      this.router.navigate(['/crms-system/crime-notice/noticeAudit-complete']);
    }
    if (this.routerFlag === 'notice-reject') {
      this.router.navigate(['/crms-system/crime-notice/notice-reject']);
    }
    if (this.routerFlag === 'notice-history') {
      this.router.navigate(['/crms-system/crime-notice/notice-history']);
    }
    if (this.routerFlag === 'notice-auditing') {
      this.router.navigate(['/crms-system/crime-notice/notice-auditing']);
    }
    if (this.routerFlag === 'notice-priority') {
      this.router.navigate(['/crms-system/crime-notice/notice-priority']);
    }
  }

  showToastrTip(tips) {
    this.loadingPanelVisible = false;
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.clear();
    this.toastr.error(tips);
  }

  async onSubmit() {
    if (this.utilHelper.AssertEqualNull(this.noticeInfo.auditResultId)) {
      // 是否选择录入意见
      this.toastr.error(this.getTranslateName('auditResult is required'));
      return;
    }
    this.noticeInfo.auditTime = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.noticeInfo.auditPersonId = this.userInfo.orgPersonId;
    this.noticeInfo.auditPersonName = this.userInfo.personName;
    let tips = this.getTranslateName('please entering') + ':';
    // 开始提交
    if (this.utilHelper.AssertEqualNull(this.noticeInfo.auditResultId) &&
      this.utilHelper.AssertEqualNull(this.noticeInfo.auditDescription)) {
      tips = tips + this.getTranslateName('auditResultName') + ' ' + this.getTranslateName('auditDescription');

      this.showToastrTip(tips);
    } else if (this.utilHelper.AssertNotNull(this.noticeInfo.auditResultId) &&
      this.utilHelper.AssertEqualNull(this.noticeInfo.auditDescription)) {
      tips = tips + this.getTranslateName('auditDescription');

      this.showToastrTip(tips);
    } else if (this.utilHelper.AssertEqualNull(this.noticeInfo.auditResultId) &&
      this.utilHelper.AssertNotNull(this.noticeInfo.auditDescription)) {
      tips = tips + this.getTranslateName('auditResultName');

      this.showToastrTip(tips);
    } else {
      this.submitDisabled = true;
      this.loadingPanelVisible = true;
      if (this.utilHelper.AssertNotNull(this.waitMergingCriminalList) && this.waitMergingCriminalList.length > 0) {
        await this.crimeNoticeService.onRedisReleaseList(this.waitMergingCriminalList);
      }
      this.service.postAuditResult(this.noticeInfo)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result) && result.success === true) {
            this.completeInfo = result.data;
            this.loadingPanelVisible = false;
            this.submitResult = this.getTranslateName('update notice-audit success');
            this.wizard.next();
            // this.router.navigate(['/crms-system/crime-notice/noticeAudit-pending']);
            // 审核成功日志记录
            try {
              this.operationLog.level = 'info';
              this.operationLog.action = 'UPDATE';
              this.operationLog.actionDesc = 'update notice-audit success';
              let _newContent = JSON.stringify(this.noticeInfo).replace(/"/g, `'`);
              this.operationLog.newContent = _newContent;
              this.logRecord();
            } catch (error) {
              console.log(error);
            }
          } else {

            // 审核失败日志记录
            try {
              this.operationLog.level = 'info';
              this.operationLog.action = 'UPDATE';
              this.loadingPanelVisible = false;
              this.operationLog.actionDesc = 'update notice-audit failed';
              this.submitResult = this.getTranslateName('update notice-audit failed');
              let _newContent = JSON.stringify(this.noticeInfo).replace(/"/g, `'`);
              this.operationLog.newContent = _newContent;
              this.logRecord();
            } catch (error) {
              console.log(error);
            }
            this.loadingPanelVisible = false;
            this.submitDisabled = false;
            this.toastr.clear();
            this.toastr.error(this.getTranslateName('Submit fail'));
          }

        }).catch((error) => {
          console.log(error);
          this.loadingPanelVisible = false;
          this.submitDisabled = false;
          this.toastr.clear();
          this.toastr.toastrConfig.maxOpened = 1;
          this.toastr.error(this.getTranslateName('save failure'));
          this.submitResult = this.getTranslateName('update notice-audit failed');
        });
    }
  }

  // 分页传输的数据
  getpageObjChange(obj) {
    this.matchRequestParameters = obj;
    this.bindCrimePersonList();
  }

  dataCompare(item) {
    if (this.utilHelper.AssertNotNull(item)) {
      this.criminalInfoObj = item;
      this.dataCompareVisible = true;

    }
  }
  watchNotice(data) {
    if (this.utilHelper.AssertNotNull(data) && this.utilHelper.AssertNotNull(data.crimePersonId)) {
      this.crimePersonId = data.crimePersonId;
      this.popupNoticeVisible = true;
    } else {
      this.crimePersonId = null;
      this.popupNoticeVisible = false;
    }
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'notice-audit';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-notice';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }
  /**
  * tooltips提示
  */
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }
  /**
  * 判断拒绝原因是否必填
  * '1': 通过;
  * '2': 不通过;(不通过原因必填)
  */
  enterOption(index) {
    this.noticeInfo.auditResultId = this.simpleProducts[index].value;
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
