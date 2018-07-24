import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import * as ip from 'internal-ip';

import { LocalStorageService, EventAggregator, LoggerRecordService, UtilHelper, DateFormatHelper } from '../../core';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';

import { EnumInfo } from '../../enum';

import { ApplyInfo } from '../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../model/common/AttachmentInfo';
import { ApplyAndCriminalRelation } from '../../model/certificate-apply/ApplyAndCriminalRelation';
import { ApplyAndAnalystRelation } from '../../model/certificate-apply/ApplyAndAnalystRelation';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { CrimeAndNoticeExtendInfo } from '../../model/crime-notice/CrimeAndNoticeExtendInfo';
import { NoticeMessage } from '../../model/socket-info/NoticeMessage';
import { UserInfo } from '../../model/auth/userinfo';
import { ApplicationDetailAndNotice } from '../../model/certificate-apply/ApplicationDetailAndNotice';
import { CrimeNoticeQuery } from '../../model/crime-integrated-business/CrimeNoticeQuery';
import { CrimePersonInfo } from '../../model/crime-notice/crimePersonInfo';
import { OperationLog } from '../../model/logs/operationLog';

import { ApplyGovermentAnalysisResultComponent } from '../apply-government/analysis-result/analysis-result.component';
import { ApplyAnalysisService, } from '../../+crms-common/services/apply-analysis.service';
import { SortorderAlgorithmService } from '../../+crms-common/services/sortorder-algorithm.service';
import { WizardComponent } from '../../shared/components/wizard/wizard.component';

/**
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
  templateUrl: './apply-analysis.component.html',
  providers: [ApplyAnalysisService, ApplyCommonService, DateFormatHelper, EnumInfo]

})

export class ApplyAnalysisComponent implements OnInit {
  @ViewChild(DxDataGridComponent)
  crimeNoticeGrids: DxDataGridComponent;
  @ViewChild(ApplyGovermentAnalysisResultComponent) applyGovermentAnalysisResultComponent: ApplyGovermentAnalysisResultComponent;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  // 申请和公告详情
  applicationDetailAndNotice: ApplicationDetailAndNotice;

  /**
   * 个人申请的相关信息初始化
   * 1.证书申请基本信息
   * 2.证书申请个人基本信息
   * 3.证书申请附件信息
   * 4.有犯罪记录的申请信息详情
   */
  applyInfo: ApplyInfo;
  applyBasicInfo: ApplyBasicInfo;
  applyAttachment: AttachmentInfo;
  applyAttachmentList: AttachmentInfo[] = [];
  certificateApplyInfo: CertificateApplyInfo = null;
  applyAndCriminalRelation: ApplyAndCriminalRelation;
  applyAndAnalystRelation: ApplyAndAnalystRelation;
  // 犯罪人的信息
  crimePersonInfo: CrimePersonInfo;
  noticeMessage: NoticeMessage;
  analystId: string;
  analystName: string;

  /**
   * 个人申请中存在犯罪的公告相关信息
   * 1、犯罪公告详情
   */
  notices: CrimeAndNoticeExtendInfo[] = [];

  crimePersonInfoList: any;

  applyId: string;
  certificateNumber: string;
  firstName: string;
  lastName: string;

  /**
   * 枚举类型
   */
  analysisResultEnum: any[];

  /**
   * 拒绝分析员原因是否可见
   * 是否必填
   * 初始化为非必填
   * @type {boolean}
   * @memberof ApplyAnalysisComponent
   */
  isAnalystReject: boolean = true;
  required: boolean = false;
  /**
   * 审核相关信息是否可见
   * @type {boolean}
   * @memberof ApplyAnalysisComponent
   */
  isHasAuditResult: boolean = true;


  // 提交按钮是否见
  submitHidden = false;
  // 提交分析结果按钮是否可点击
  submitCanCilck = false;
  // loading是否可见
  loadingVisible: boolean = false;

  // 保存提示信息
  operations: any;

  // 保存是否成功
  isSaveSuccess: boolean;

  // 分析描述字符数
  analysisDescriptionLength: number = 0;

  uploadFileList: any[] = [];


  /**
  * 图片字节数组列表
  * 轮播图当前index
  * 缩略图容器宽度
  */
  activeSlideIndex: number = 0;
  thumbnailWidth: string;

  popupImageVisible: boolean = false; // 预览图弹框
  popupNoticeImageVisible: boolean = false; // 公告预览弹窗

  // 没有新分析任务提示界面
  noTaskSreenVisible: boolean = true;
  // 分析申请详情表单
  analystFromVisible: boolean = false;
  goBackBtn: boolean = true; // 返回按钮是否可见
  backInfo: boolean; // 返回按钮提示信息

  // 操作日志记录
  operationLog: OperationLog;

  // 公告列表数量
  dataCount: number = 0;
  // 重新分析公告列表分页
  crimeNoticeQuery: CrimeNoticeQuery;
  // 公告列表分页条显示
  noticeListPageVisible: boolean = true;
  // 勾选的罪犯Id
  criminalId: string;

  // 保存前验证必填项是否已填
  validateVisible: boolean = false;
  brokenRules: any[] = [];
  showCollapsed: boolean = true;
  isAnalysised: boolean = true;
  attachmentList: AttachmentInfo[] = [];
  attchmentControllObj: any;
  governmentBox: boolean = true;
  personBox: boolean = false;

  routerFlag: string;
  // 当前选中的犯罪嫌疑人
  hasSelectCrimePersonId: string = '';
  showInfoIndex: number = 1;
  // 完成后的信息
  completeInfo: any;
  submitResult: string;
  constructor(
    private localStorageService: LocalStorageService,
    private applyAnalysisService: ApplyAnalysisService,
    private applyCommonService: ApplyCommonService,
    private enumInfo: EnumInfo,
    private toastr: ToastrService,
    private dateFormatHelper: DateFormatHelper,
    private utilHelper: UtilHelper,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
    private router: ActivatedRoute,
    private route: Router,
    private logger: LoggerRecordService,
    private sortorderAlgorithmService: SortorderAlgorithmService
  ) {

    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.applyAttachment = new AttachmentInfo();
    this.applyAndCriminalRelation = new ApplyAndCriminalRelation();
    this.applyAndAnalystRelation = new ApplyAndAnalystRelation();
    this.noticeMessage = new NoticeMessage();
    // 枚举和数据库测试数据要保持一致
    this.analysisResultEnum = this.enumInfo.getAnalysisResultEnum;
    this.applicationDetailAndNotice = new ApplicationDetailAndNotice();
    this.translateService.get(['Message success']);

    this.operationLog = new OperationLog();
    this.crimeNoticeQuery = new CrimeNoticeQuery();
    this.attchmentControllObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
  }

  ngOnInit(): void {
    this.router.params.subscribe(data => {
      if (this.utilHelper.AssertNotNull(data) && JSON.stringify(data) !== '{}') {
        this.routerFlag = data.flag;
        this.applyId = data.applyId;
      }
    });
    // 从缓存中获取登陆的分析员Id
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.analystId = user.orgPersonId;
    this.analystName = user.personName;

    // 日志记录操作员的name 和 Id
    this.operationLog.operator = user.userName;
    this.operationLog.operatorId = user.orgPersonId;
    try {
      // 获取分析员需要分析的申请
      this.bindApplyAndNoticeDetailData(this.analystId);
    } catch (error) {
      console.log(error);
    }

    // 路由路径绑定
    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyPersonAnalysis');

    this.toastr.toastrConfig.positionClass = 'toast-center-center';
    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-analysis');
    // 当前页收到个人申请,若当前页面无数据,刷新页面的数据
    this.eventAggregator.subscribe('goAnalysisRefreshTask', '', result => {
      this.submitCanCilck = false;
      this.submitHidden = false;
      this.dataIsOnReplyAnalyst(result);
    });
    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;
  }

  /**
     * 选中已选的犯罪嫌疑人
     */
  selectdefaultCrimer(e) {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfoList)) {
      this.crimePersonInfoList.forEach((item, index) => {
        if (item.crimePersonId === this.applyAndCriminalRelation.criminalId) {
          this.crimeNoticeGrids.instance.selectRowsByIndexes([index]);
        }
      });
    }
  }

  /**
   * 路由绑定header路径
   * @param {string} parentUrl
   * @param {string} childrenUrl
   * @memberof ApplyAnalysisComponent
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }
  /**
   * 首次分析时 当前页面收到消息时：判断当前是否正在重新分析 若在重新分析数据不刷新
   */
  dataIsOnReplyAnalyst(analystId: any) {
    if (this.utilHelper.AssertEqualNull(this.applyId)) {
      this.bindApplyAndNoticeDetailData(analystId);
    }
  }

  /**
   * 通过分析员Id加载数据
   * 1.通过分析员Id查找关联表中是否有分派给自己的新分析任务
   * 2.有：通过申请Id拿到申请和公告详情
   *   没有：可以给一个提示
   * 注意，当有新分析任务时，可以在消息通知那里提供一个路由跳转的功能，直接跳到分析页面，如果分析员正在录入申请，应该给出跳转提示
   */
  async bindApplyAndNoticeDetailData(analystId: string) {
    try {
      // 先清除上次选中的罪犯
      this.applyGovermentAnalysisResultComponent.cleanHasSelectedCriminal();
      let url = await this.applyAnalysisService.initialApplyService();
      if (this.utilHelper.AssertNotNull(url)) {
        // 判断是否是驳回页面跳转进来的 this.applyId 为空 首次分析
        if (this.utilHelper.AssertEqualNull(this.applyId)) {
          this.getApplyAndAnalystRelation(analystId);
        } else {
          this.goBackBtn = false;
          this.getRejectedInfo();
        }
      }
    } catch (error) {
    }
  }

  /**
   * 获取待分析的个人申请
   * @param {string} analystId
   * @memberof ApplyAnalysisComponent
   */
  async getApplyAndAnalystRelation(analystId: string) {
    try {
      let result = await this.applyAnalysisService.getAnalystTasksByAnalystId(analystId);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.applyInfo)) {
        this.noTaskSreenVisible = true;
        this.analystFromVisible = false;
        this.applyInfo = result.applyInfo;
        this.applyBasicInfo = result.applyBasicInfo;
        this.applyAttachmentList = result.attachmentInfoList;
        // this.applyAndCriminalRelation = result.applyAndCriminalRelation;

        if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
          this.applyBasicInfo.age = null;
        }
        this.applyDataHandler(this.applyBasicInfo.dateOfBirth, this.applyBasicInfo.credentialsIssueDate);
        if (this.applyInfo.auditResultId !== null) {
          this.isHasAuditResult = false;
        }

        // 获取匹配罪犯列表
        this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
        this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
        this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
        this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
        this.crimeNoticeQuery.pages = 0;
        this.getCriminalByNameAndId(this.crimeNoticeQuery);
        // 默认选中列表的第一页
        this.applyGovermentAnalysisResultComponent.defaultFirstCriminal();
      } else {
        this.analystFromVisible = true;
        this.noTaskSreenVisible = false;
      }
    } catch (error) {
    }
  }
  /**
   * 接收子组件订阅来的消息
   */
  getCrimeNoticeEmit(obj) {
    this.hasSelectCrimePersonId = this.applyGovermentAnalysisResultComponent.getCheckBoxSelectedData();
    if (this.utilHelper.AssertNotNull(obj)) {
      this.crimeNoticeQuery.pages = obj;
      this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
            this.isAnalysised = true;
            this.crimePersonInfoList = result.data;
            this.dataCount = result.totalCount;
          }
          if (this.utilHelper.AssertNotNull(this.crimePersonInfoList)) {
            this.crimePersonInfoList.forEach(item => {
              if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
                item.age = null;
              }
              if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
                this.applyBasicInfo.age = null;
              }
              item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
              item.name = item.firstName + ' ' + item.lastName;
            });
            this.crimePersonInfoList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.crimePersonInfoList);
          }
        }).catch(err => {
          console.log(err);
        });
    }
  }


  /**
   * 通过申请人信息获取匹配到罪犯
   * @param applyId
   * @param pages
   * @param pageSize
   */
  async getCriminalByNameAndId(noticeListPage: any) {
    try {
      let result = await this.applyCommonService.getCriminalByNameAndId(this.crimeNoticeQuery);
      this.crimePersonInfoList = result.data;
      this.dataCount = result.totalCount;
      if (this.dataCount !== 0 && this.dataCount !== null) {
        this.noticeListPageVisible = false;
      }
      if (this.utilHelper.AssertNotNull(this.crimePersonInfoList)) {
        await this.crimePersonInfoList.forEach(item => {
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
            item.age = null;
          }
          if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
            this.applyBasicInfo.age = null;
          }
          item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
          item.name = item.firstName + ' ' + item.lastName;
        });
        this.crimePersonInfoList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.crimePersonInfoList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 公告列表分页切换
   * @param {*} e
   * @memberof ApplyAnalysisComponent
   */
  pageIndexChange(e: any) {
    this.crimeNoticeQuery.pages = e.pages;
    this.getCriminalByNameAndId(this.crimeNoticeQuery);
  }

  // 获取被驳回信息
  async getRejectedInfo() {
    if (this.utilHelper.AssertNotNull(this.applyId)) {
      try {
        let result = await this.applyCommonService.getApplyInfoByApplyID(this.applyId);
        if (this.utilHelper.AssertNotNull(result)) {
          this.applyInfo = result.applyInfo;
          this.applyBasicInfo = result.applyBasicInfo;
          this.isHasAuditResult = false;
          this.applyAttachmentList = result.attachmentInfoList;

          if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
            this.applyBasicInfo.age = null;
          }
          // 判断之前勾选的犯罪嫌疑人是否有效 默认添加只加入有效的犯罪的嫌疑人
          if (this.utilHelper.AssertNotNull(result.crimePersonInfo)) {
            this.crimePersonInfo = result.crimePersonInfo;
            // 判断当前的犯罪嫌疑人为有效时 加入到关系列表中
            if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.crimePersonInfo.isActive === '1') {
              this.applyAndCriminalRelation.applyInfoId = this.applyInfo.applyId;
              this.applyAndCriminalRelation.criminalId = this.crimePersonInfo.crimePersonId;
              this.hasSelectCrimePersonId = this.crimePersonInfo.crimePersonId;
            } else {
              this.hasSelectCrimePersonId = '';
            }
          }
          // 获取匹配罪犯列表
          this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
          this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
          this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
          this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
          this.getCriminalByNameAndId(this.crimeNoticeQuery);
          // 将之前勾选的罪犯，重新选上
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  selectCriminal(e: any) {
    if (this.utilHelper.AssertNotNull(e.selectedRowsData[0])) {
      this.criminalId = e.selectedRowsData[0].crimePersonId;
    }
  }

  /**
   * 选择其他情况则分析描述为必填
   * '1': 有犯罪记录;
   * '2': 无犯罪记录;
   * '3': 拒绝分析;
   * @param {any} e
   * @memberof ApplyAnalysisComponent
   */
  enterOption(index) {
    this.applyInfo.analysisResultId = this.analysisResultEnum[index].value;
    if (index === 2) {
      // 拒绝分析的时显示拒绝分析原因，并且原因必填
      this.isAnalystReject = false;
      this.required = true;
    } else {
      this.isAnalystReject = true;
      this.required = false;
      this.applyInfo.analysisDescription = null;
    }
  }

  /**
   * 统计分析描述字符数
   */
  countAnalysisDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyInfo) && this.utilHelper.AssertNotNull(this.applyInfo.analysisDescription)) {
      this.analysisDescriptionLength = this.applyInfo.analysisDescription.length;
    } else {
      this.analysisDescriptionLength = 0;
    }
  }

  // 提交验证 弹框显示未通过验证消息
  validateForms() {
    let result = this.validator.first.instance.validate();
    if (this.utilHelper.AssertNotNull(result) && result.brokenRules.length > 0) {
      this.brokenRules = result.brokenRules;
      this.validateVisible = true;
    }
  }


  /**
* 刷新路由
*/
  async refreshRouter() {
    let nowUrl = this.route.url;
    await this.route.navigateByUrl('');
    this.route.navigate([nowUrl]);
  }


  // 保存
  saveAnalysisData() {
    // 1.出现loading效果
    this.showLoadPanel();

    this.applyInfo.analysisPersonName = this.analystName;
    this.applyInfo.analysisPersonId = this.analystId;


    // 格式化分析时间参数
    this.formatDate();

    /**
     * 1.传入对象进行分析席位的更新操作
     * 2.数据更新
     */
    this.certificateApplyInfo = new CertificateApplyInfo(this.applyBasicInfo,
      this.applyInfo,
      this.applyAttachmentList,
      this.applyAndCriminalRelation);

    this.applyAnalysisService.updateCertificateApplyInfo(this.certificateApplyInfo).then(result => {
      if (this.utilHelper.AssertNotNull(result) && result.success === true) {
        this.isSaveSuccess = true;
        this.loadingVisible = false;
        this.completeInfo = result.data;
        this.wizard.next();
        // 保存成功日志记录
        try {
          this.operationLog.level = 'info';
          this.operationLog.action = 'UPDATE';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'update apply-analysis success';
          this.logRecord();
          // this.refreshRouter();
        } catch (error) {
          console.log(error);
        }
        // 将提交按钮隐藏
        this.submitHidden = true;
        // 将提交分析结果按钮不可用
        this.submitHidden = true;
      } else {
        this.isSaveSuccess = false;
        this.loadingVisible = false;
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(this.getTranslateName('save failure'));
        // 将提交分析结果按钮显示
        this.submitHidden = false;
        // 将提交分析结果按钮可用
        this.submitHidden = false;
        try {
          // 保存失败日志记录
          this.operationLog.level = 'error';
          this.operationLog.action = 'UPDATE';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'update apply-analysis failed';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }

      }
      if (this.isSaveSuccess) {
        this.loadingVisible = false;
        this.popupOperationInfo(this.isSaveSuccess);
        // 原来数据置空
        // this.toSetNullForData();
        /*  if (this.applyInfo.auditResultId != null) {
            this.route.navigate(['/crms-system/crime-certify/apply-reject']);
         } else {
           // 扫描数据库是否有待分析任务,重新绑定数据
           this.bindApplyAndNoticeDetailData(this.analystId);
           this.isHasNextTask();
         } */
      }
    }).catch(err => {
      this.loadingVisible = false;
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('save failure'));
      // 将提交分析结果按钮显示
      this.submitHidden = false;
      // 将提交分析结果按钮可用
      this.submitHidden = false;
      console.log(err);
    });
  }

  /**
   * 提交方法
   * 1.获取勾选公告数据，存入关联关系表
   * 2.生成certificateApplyInfo对象传入服务端
   * 3.调用服务端完成数据更新
   */
  onSubmit(e) {
    // 一点击立刻禁用提交分析结果按钮
    this.submitCanCilck = true;
    if (this.utilHelper.AssertEqualNull(this.applyInfo.analysisResultId)) {
      this.toastr.error(this.getTranslateName('analysisResult is required'));
      return;
    }
    if (e !== null && e !== undefined) {
      let isValid = this.validator.first.instance.validate().isValid;
      if (isValid) {
        // 申请与公告信息关联
        this.bindCriminalRelationData();
        this.translateService.get(['please check the crime notice', 'please do not check the crime notice',
          'do not check the crime notice'])
          .subscribe(value => {
            if (this.applyInfo.analysisResultId === '1' && this.utilHelper
              .AssertEqualNull(this.applyAndCriminalRelation.criminalId)) {
              this.toastr.clear();
              this.toastr.error(value['please check the crime notice']);
              this.submitCanCilck = false;
              return;
            } else if (this.applyInfo.analysisResultId === '2' && this.utilHelper
              .AssertNotNull(this.applyAndCriminalRelation.criminalId)) {
              this.toastr.clear();
              this.toastr.error(value['please do not check the crime notice']);
              this.submitCanCilck = false;
              return;
            } else if (this.applyInfo.analysisResultId === '3' && this.utilHelper.
              AssertNotNull(this.applyAndCriminalRelation.criminalId)) {
              this.toastr.clear();
              this.toastr.error(value['do not check the crime notice']);
              this.submitCanCilck = false;
              return;
            }
            this.saveAnalysisData();
          });
      } else {
        // 显示验证不通过的消息
        this.validateForms();
        // 同时将提交分析结果按钮可用
        this.submitCanCilck = false;
      }
    }

  }

  /**
  * 显示loading
  */
  showLoadPanel() {
    this.loadingVisible = true;
  }



  /**
   * 弹出操作结果提示信息
   * @param isSuccess
   */
  popupOperationInfo(isSuccess: boolean) {
    this.loadingVisible = false;
    if (this.utilHelper.AssertNotNull(isSuccess)) {
      if (isSuccess === true) {
        this.toastr.clear();
        // this.toastr.success(this.getTranslateName('save success and need to be audited'));
        this.submitResult = this.getTranslateName('save success and need to be audited');
      }
      if (isSuccess === false) {
        this.toastr.clear();
        this.submitResult = this.getTranslateName('save failure');
      }
    }

  }

  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  /**
   * 日期格式处理
   * 出生日期，证件颁发日期
   * 将年月日转换为年月日时分秒
   * @memberof ApplyAnalysisComponent
   */
  formatDate() {
    if (this.applyBasicInfo.dateOfBirth !== null && typeof (this.applyBasicInfo.dateOfBirth) !== 'undefined') {
      this.applyBasicInfo.dateOfBirth = this.dateFormatHelper.RestURLBeignDateTimeFormat(this.applyBasicInfo.dateOfBirth);
    }
    if (this.applyBasicInfo.credentialsIssueDate !== null && typeof (this.applyBasicInfo.credentialsIssueDate) !== 'undefined') {
      this.applyBasicInfo.credentialsIssueDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(
        this.applyBasicInfo.credentialsIssueDate);
    }
  }

  /**
   *  分析日期格式转换
   * @param dateOfBirth
   * @param credentialsIssueDate
   */
  applyDataHandler(dateOfBirth, credentialsIssueDate) {
    if (this.utilHelper.AssertNotNull(dateOfBirth)) {
      this.applyBasicInfo.dateOfBirth = new Date(dateOfBirth);
    }
    if (this.utilHelper.AssertNotNull(credentialsIssueDate)) {
      this.applyBasicInfo.credentialsIssueDate = new Date(credentialsIssueDate);
    }
  }

  /**
   * 申请信息与犯罪公告的Id关联处理
   *
   * @memberof ApplyAnalysisComponent
   */
  bindCriminalRelationData() {
    let seletedData = this.applyGovermentAnalysisResultComponent.getCheckBoxSelectedData();
    if (this.utilHelper.AssertNotNull(seletedData)) {
      this.applyAndCriminalRelation.applyInfoId = this.applyInfo.applyId;
      this.applyAndCriminalRelation.criminalId = seletedData;
    } else {
      this.applyAndCriminalRelation.applyInfoId = null;
      this.applyAndCriminalRelation.criminalId = null;
    }
    // 页面
    this.crimePersonInfo = null;
    // 获取勾选的罪犯加入关系对象中
    if (this.utilHelper.AssertNotNull(this.criminalId)) {
      this.applyAndCriminalRelation.criminalId = this.criminalId;
    }
  }
  /**
   * 将表单置空
   *
   * @memberof ApplyAnalysisComponent
   */
  /*   toSetNullForData(form) {
      form.resetForm();
    } */

  /**
   * 将对象置空
   * @memberof ApplyAnalysisComponent
   */
  toSetObjectForNull() {
    this.certificateApplyInfo = null;
    this.applyInfo = null;
    this.applyBasicInfo = null;
    this.notices = null;
  }

  /**
   * 如果重新扫描没数据提交按钮禁用，同时发送暂时没有任务的提示
   * 给消息通知发送已空闲消息
   *
   * @memberof ApplyAnalysisComponent
   */
  isHasNextTask() {
    if (JSON.stringify(this.applyInfo) === '{}') {
      this.noTaskSreenVisible = false;
      this.analystFromVisible = true;
    }
  }

  goBack() {
    if (this.routerFlag === 'apply-reject') {
      this.route.navigate(['/crms-system/crime-certify/apply-reject']);
    } else {
      this.refreshRouter();
    }
  }

  // 返回按钮提示信息
  showBackInfo() {
    this.backInfo = !this.backInfo;
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'apply-analysis';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.newContent = null;
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }

  showNotice() {
    this.governmentBox = true;
    this.personBox = false;
  }
  showPerson() {
    this.governmentBox = false;
    this.personBox = true;
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
