import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { confirm } from 'devextreme/ui/dialog';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import * as ip from 'internal-ip';

import { ConfigService, LocalStorageService, EventAggregator, UtilHelper, DateFormatHelper, LoggerRecordService } from '../../core/';

import { NoticeInputService } from '../common/services/notice-input.service';
import { CrimeAndNoticeService } from '../../+crms-common/services/crime-notice.service';
import { EnumInfo } from '../../enum/enuminfo';
import { AttachmentInfo } from '../../model/common/AttachmentInfo';
import { CrimeInfo } from '../../model/crime-notice/crimeInfo';
import { CrimePersonInfo } from '../../model/crime-notice/crimePersonInfo';
import { NoticeInfo } from '../../model/crime-notice/noticeInfo';
import { CourtInfo } from '../../model/crime-notice/CourtInfo';
import { CrimeAndNoticeExtendInfo } from '../../model/crime-notice/CrimeAndNoticeExtendInfo';
import { CountryInfo } from '../../model/organization/CountryInfo';
import { ProvinceInfo } from '../../model/organization/ProvinceInfo';
import { CityInfo } from '../../model/organization/cityinfo';
import { CommunityInfo } from '../../model/organization/communityinfo';
import { UserInfo } from '../../model/auth/userinfo';
import { CrimeNoticeQuery } from '../../model/crime-integrated-business/CrimeNoticeQuery';
import { OperationLog } from '../../model/logs/operationLog';
import { OrganizationDictionaryService } from '../common/services/organization-dictionary.service';
import { LockExtend } from '../../model/crime-notice/lockExtend';
import { WaitmergeCriminalComponent } from '../common/components/waitmerge-criminal/waitmerge-criminal.component';
import { EncodingRulesService } from '../../+crms-common/services/encoding-rules.service';
import { NoticeAttachmentComponent } from '../../+crms-common/components/notice-attachment/notice-attachment.component';
import { CrmsCrimePersonInfoComponent } from '../../+crms-common/components/crime-personInfo/crime-personInfo.component';
import { CrmsNoticeComponent } from '../../+crms-common/components/crime-notice/crime-notice.component';
import { CrmsCrimeInfoComponent } from '../../+crms-common/components/crime-info/crime-info.component';
import { SimilarityCalculate } from '../../+crms-common/services//similarity-calculate.service';
import { SortorderAlgorithmService } from '../../+crms-common/services/sortorder-algorithm.service';
import { OrganizationService } from '../../+crms-common/services/organization-data.service';
import { WizardComponent } from '../../shared/components/wizard/wizard.component';
/**
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
  selector: 'notice-input',
  templateUrl: './notice-input.component.html',
  providers: [CrimeAndNoticeService, NoticeInputService, OrganizationService,
    EnumInfo, CrimeAndNoticeService, OrganizationDictionaryService]
})
export class NoticeInputComponent implements OnInit {
  @ViewChild(DxDataGridComponent) personInfoGrids: DxDataGridComponent;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChild(NoticeAttachmentComponent) noticeAttachmentComponent: NoticeAttachmentComponent;
  @ViewChild(WaitmergeCriminalComponent) waitmergeCriminalComponent: WaitmergeCriminalComponent;
  @ViewChild(CrmsCrimePersonInfoComponent) crmsCrimePersonInfoComponent: CrmsCrimePersonInfoComponent;
  @ViewChild(CrmsNoticeComponent) CrmsNoticeComponent: CrmsNoticeComponent;
  @ViewChild(CrmsCrimeInfoComponent) CrmsCrimeInfoComponent: CrmsCrimeInfoComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  public uploader: FileUploader = new FileUploader({});

  selectedImgLength = 0;
  previewImgPopup: boolean = false; // 图片预览窗口
  activeSlideIndex: number = 0; // 轮播图当前index
  thumbnailWidth: string; // 缩略图容器宽度
  brokenRules: any[] = []; // 校验提示

  // 拒绝录入原因字符数
  auditDescriptionLength: number = 0;
  rejectEnterReasonLength: number = 0;

  // 判断是否由路由跳转
  routerFlag: string;

  // 返回按钮是否可用
  isBack: boolean = true;

  // 路由传来公告Id
  noticeId: string;

  //  公告犯罪犯罪人信息清除按钮
  clearBtnVisible: boolean = false;

  /**
   * 填充的基本信息
   * 1.公告基本信息
   * 2.犯罪基本信息
   * 3.犯罪个人基本信息
   * 4.访问服务时的requestBody
   * 5.附件基本信息
   */
  noticeInfo: NoticeInfo;
  crimeInfo: CrimeInfo;
  crimePersonInfo: CrimePersonInfo;
  crimeAndNoticeExtendInfo: CrimeAndNoticeExtendInfo;
  attachmentInfo: AttachmentInfo;
  attachmentList: any[] = [];


  /**
   * 1. 法院列表
   * 2. 证件类型列表
   */
  courtInfoList: CourtInfo[] = [];
  certificateTypeList: any[];
  /**
   * 组织机构列表
   * 1.国家
   * 2.省
   * 3.城市
   * 4.社区
   */
  countryList: CountryInfo[] = [];
  provinceList: ProvinceInfo[] = [];
  cityList: CityInfo[] = [];
  communityList: CommunityInfo[] = [];

  livingCountryList: CountryInfo[] = [];
  livingProvinceList: ProvinceInfo[] = [];
  livingCityList: CityInfo[] = [];
  livingCommunityList: CommunityInfo[] = [];

  // 犯罪区域
  crimeRegionList: ProvinceInfo[] = [];

  countryId: string;

  showCountryDetailPlace: boolean = false;
  showLivingDetailAddress: boolean = false;

  /**
   * 性别
   * 婚姻状态
   */
  genderEnum: any[];
  marriageEnum: any[];
  birthPlaceEnum: any[];
  careerList: any[];
  countryOfCitizenshipEnum: any;
  /**
   * 图片格式要求
   * 1. 类型
   * 2. 大小
   */
  imageTypeFormat: string[];
  imageSizeFormat: number;


  /**
   * 公告列表是否看见
   * 这里的隐藏和显示规则需要定义，目前暂时始终显示
   * noticeListHidden
   */
  noticeListHidden: boolean = false;

  /**
   * 点击保存时的loading
   */
  loadingVisible: boolean = false;
  imageSrc: string = '';
  registerPhoto: string = '';
  /**
   * 存取成功的文件ID列表
   * @type {string[]}
   * @memberof CrimeAndNoticeComponent
   */
  storeFileId: string[] = [];
  /**
   * 是否保存成功
   * 操作提示消息
   */
  isSaveSuccess: boolean;
  operationInfo: string;
  /**
   * 提交前输入验证提示
   * @type {boolean}
   * @memberof CrimeAndNoticeComponent
   */
  validateVisible: boolean = false;
  /**
   * 图片字节数组列表
   * @type {any[]}
   * @memberof CrimeAndNoticeComponent
   */
  imageList: any[] = [];
  ocrTextVisible: boolean = false;
  ocrText: string;
  // 登陆人员信息
  user: any;
  // 上传文件按钮是否变色
  isWillUpload: boolean = false;
  // 表单对比对象
  canDeactivateInfoOne: any;
  canDeactivateInfoTwo: any;
  canDeactivateInfoThr: any;

  priorityList: any[] = [];
  crimeTypeInfoList: any[] = [];
  noticeInputStatusList: any[] = [];
  crimeTypeList: any[] = [];

  checkNoticeNumberBoolean: boolean;
  // 查询可回填罪犯
  crimeNoticeQuery: CrimeNoticeQuery;
  personInfoList: any;
  fillDataVisible: boolean = false;
  dataBackDisabled: boolean = true;
  dataCount: Number;
  firstTabActive: boolean = true;
  secondTabActive: boolean = false;
  clearPageTolVisible: boolean = false;
  showFormShadow: boolean = true;
  nextItemBtnVisible: boolean = true;
  submitBtnVisible: boolean = true;

  popupCameraVisible: boolean = false;
  /**
   * 附件组件的各种控制展示
   */
  attchmentControllObj: any;
  attchmentWatchObj: any;
  /**
   * 查询可合并罪犯,分析按钮
   */
  showCanbeMergeQuery: boolean = false;
  // 查询可合并罪犯
  canMergeCriminalQuery: CrimeNoticeQuery;
  // 可合并罪犯列表是否显示
  isMergeCriminalQuery: boolean = true;
  // 可合并罪犯
  canMergeCriminalList: any[] = [];
  // 可合并组件数目
  canMergeCriminalDataCount: any;
  // 已勾选待合并罪犯id列表（包括回填的罪犯）
  waitCriminalIds: string[] = [];
  // 充分分析时回填数据列表
  replyWaitCriminalIds: string[] = [];
  submitBtn: boolean = false; // 数据是否保存判断
  // 回填查询放大镜是否可用
  backfillSearchVisible: boolean = false;
  // 公告罪犯是否可编辑
  isReadOnly: boolean = false;
  seleTab: boolean = true; // tab切换校验
  operationLog: OperationLog;
  // 审核信息是够可见
  auditResultVisible: boolean = true;
  // 审核结果名称
  auditResultName: string = '';
  // 审核描述
  auditDescription: string = '';
  // 录入意见和拒绝录入是否可编辑，提交后不可编辑
  enterSuggetion: boolean = false;
  // 点击清空按钮提示框
  confirmVisible: boolean = false;
  // 清除对象
  clearObject: any;

  reRntryVisible: boolean = true;
  // 被锁的数据列表
  lockList: string[] = [];
  // 重新分析时 上次选择的待合并的列表
  startWaitCriminalIds: string[] = [];
  hiddenBar: boolean = true;
  // 是否完成
  isDown: boolean = false;
  // 公告基本信息下一步按钮控制
  noticeBasicInfoNextButton: boolean = false;
  // 录入完成后页面显示的数据
  completeInfo: any;
  submitResult: string;
  /**
   * 构造函数，初始化参数
   * @param crimeAndNoticeService
   */
  constructor(
    private crimeAndNoticeService: CrimeAndNoticeService,
    private noticeInputService: NoticeInputService,
    private organizationService: OrganizationService,
    private enumInfo: EnumInfo,
    private configService: ConfigService,
    private eventAggregator: EventAggregator,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private utilHelper: UtilHelper,
    private route: ActivatedRoute,
    private router: Router,
    private encodingRulesService: EncodingRulesService,
    private organizationDictionaryService: OrganizationDictionaryService,
    private dateFormatHelper: DateFormatHelper,
    private similarityCalculate: SimilarityCalculate,
    private sortorderAlgorithmService: SortorderAlgorithmService,
    private logger: LoggerRecordService,
  ) {

    this.noticeInfo = new NoticeInfo();
    this.crimeInfo = new CrimeInfo();
    this.crimePersonInfo = new CrimePersonInfo();
    this.attachmentInfo = new AttachmentInfo();
    this.crimeNoticeQuery = new CrimeNoticeQuery();
    this.operationLog = new OperationLog();


    this.canDeactivateInfoTwo = new CrimeInfo();
    this.canDeactivateInfoThr = new CrimePersonInfo();

    // 枚举和数据库测试数据要保持一致
    this.genderEnum = this.enumInfo.getGenderEnum;
    // this.marriageEnum = this.enumInfo.getMarriageEnum;
    this.birthPlaceEnum = this.enumInfo.getBirthPlaceEnum;
    this.countryOfCitizenshipEnum = this.enumInfo.getCountryOfCitizenshipEnum;
    this.noticeInputStatusList = this.enumInfo.getNoticeInputStatusEnum;

    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.timeOut = 3000;
    this.attchmentControllObj = {
      uploadFile: true,
      preview: true,
      ocrRecognize: true,
      removeSingle: true
    };
    this.attchmentWatchObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
    this.canMergeCriminalQuery = new CrimeNoticeQuery();
  }


  /**
   * 初始化组织机构的服务基地址，基地址配置文件config.json
   */
  ngOnInit(): void {
    this.eventAggregator.subscribe('hiddenLeftBar', '', result => { // 附件预览接收的订阅
      if (result === false) {
        this.hiddenBar = false;
      } else {
        this.hiddenBar = true;
      }
    });
    this.initData();
    this.user = this.localStorageService.readObject('currentUser') as UserInfo;

    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.user.userName;
    this.operationLog.operatorId = this.user.orgPersonId;

    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;

    this.canMergeCriminalQuery.pages = 0;
    this.canMergeCriminalQuery.pageSize = 5;
    /**
     * 初始化法院信息
     * 初始化公告优先级信息
     * 初始化犯罪类型信息
     */
    this.bindBaseDictionaryData();
    this.bindCountryAndProvince();
    this.bindRoutUrl('CrimeNoticeManagement', 'CrimeNoticeEntry');
    // 初始化消息配置
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
    // 缓存路由
    sessionStorage.setItem('currentRouter', 'crime-notice');

    this.noticeInfo.priority = '0';

    // 初始化路由对比对象
    this.canDeactivateInfoOne = {
      auditDescription: undefined,
      auditResultId: undefined,
      courtId: undefined,
      note: undefined,
      noticeCreateTime: undefined,
      noticeDescription: undefined,
      noticeInputStatus: this.noticeInfo.noticeInputStatus,
      noticeNumber: undefined,
      priority: this.noticeInfo.priority,
      rejectEnterReason: undefined
    };
  }

  /**
  * 绑定基础数据
  * 证件类型，优先级，犯罪类型,法院,犯罪区域
  */
  async bindBaseDictionaryData() {
    this.certificateTypeList = await this.organizationDictionaryService.bindCertificateTypeData();
    this.priorityList = await this.organizationDictionaryService.bindNoticePriorityData();
    this.crimeTypeList = await this.organizationDictionaryService.bindCrimeTypeData();
    this.courtInfoList = await this.organizationDictionaryService.bindCourtListData();
    this.crimeRegionList = await this.organizationDictionaryService.bindCrimeRegion();
    this.marriageEnum = await this.crimeAndNoticeService.getMarriageList();
    this.careerList = await this.crimeAndNoticeService.getCareerList();

  }

  /*
   tab 按钮切换
   */
  tabToggle(flag) {
    if (flag === 1) {
      this.firstTabActive = true;
    } else {
      this.firstTabActive = false;
    }
  }
  /**
   * 绑定国家省市的数据
   *
   * @memberof NoticeInputComponent
   */
  async bindCountryAndProvince() {
    let result = await this.configService.get('countryId');
    if (this.utilHelper.AssertNotNull(result)) {
      this.countryId = result;
      this.bindProvinceData(this.countryId);
      this.bindLivingProvinceData(this.countryId);
    }
  }

  // 获取路由导航传递过来的参数
  initData() {
    this.route.params.subscribe(data => {
      if (this.utilHelper.AssertNotNull(data) && JSON.stringify(data) !== '{}') {
        this.noticeId = data.noticeId;
        this.routerFlag = data.flag;
        // 返回按钮可用
        this.isBack = false;
        // 分析按钮可用
        this.showCanbeMergeQuery = false;
        // 提交按钮禁用
        this.submitBtnVisible = true;
        this.reRntryVisible = true;
        this.bindNoticeDetail(this.noticeId);
      }
    });

  }
  /**
   * 第一次公告录入
   * 查询可合并罪犯
   * 2018-2-1 发现 重新回填还是要走这个方法
   *
   * @memberof NoticeInputComponent
   */
  async queryCanBeMergeCriminal() {
    // 分析前验证是否填写了姓名和证件，和姓名,验证公告号是否重复等；
    //  查询可合并罪犯，查询成功后，将按钮禁用。
    this.canMergeCriminalQuery.firstName = this.crimePersonInfo.firstName;
    this.canMergeCriminalQuery.lastName = this.crimePersonInfo.lastName;
    this.canMergeCriminalQuery.certificateType = this.crimePersonInfo.certificateType;
    this.canMergeCriminalQuery.certificateNumber = this.crimePersonInfo.certificateNumber;
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.backFillCriminalId)) {
      this.crimePersonInfo.backFillCriminalId = '';
    }
    try {
      let result = await this.noticeInputService.getNoticeListByNumberAndName(this.canMergeCriminalQuery,
        this.crimePersonInfo.backFillCriminalId);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        // 可合并罪犯列表数据
        this.canMergeCriminalList = result.data;
        // 可合并罪犯列表数目
        this.canMergeCriminalDataCount = result.totalCount;
        // 将分析按钮隐藏
        this.showCanbeMergeQuery = true;
        // 待合并列表显示
        this.isMergeCriminalQuery = false;
        // 显示提交按钮
        this.submitBtnVisible = false;
        // 选择录入意见可用
        this.enterSuggetion = false;
        await this.canMergeCriminalList.forEach(item => {
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
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
          item.point = this.crimeAndNoticeService.comparsionInformation(item, this.crimePersonInfo);
          item.name = item.firstName + ' ' + item.lastName;
        });
        // 第一次录入，点击分析，只将正在合并中的罪犯设置不可选
        this.waitmergeCriminalComponent.deselectRowsBecauseIsMerging(this.canMergeCriminalList);
        // 排序
        this.canMergeCriminalList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.canMergeCriminalList);
        if (this.noticeInfo.status === '2') {
          // 第二次录入，将之前的正在合并中的罪犯选中
          this.waitmergeCriminalComponent.selectedCriminalIds(this.canMergeCriminalList);
          // 同时要控制哪些罪犯能被勾选
          this.waitmergeCriminalComponent.deselectRowsBecauseReplyEnter(this.canMergeCriminalList, this.startWaitCriminalIds,
            !this.showCanbeMergeQuery);
        } else {
          // 第一次录入，点击分析，只将正在合并中的罪犯设置不可选
          this.waitmergeCriminalComponent.deselectRowsBecauseIsMerging(this.canMergeCriminalList);
        }
      } else {
        // reuslt为null说明可合并罪犯或者服务异常，显示提交按钮和录入意见
        // 将分析按钮隐藏
        this.showCanbeMergeQuery = true;
        // 显示提交按钮
        this.submitBtnVisible = false;
        // 选择录入意见可用
        this.enterSuggetion = false;
        // 待合并列表不显示
        this.isMergeCriminalQuery = false;
      }
    } catch (err) {
      // 将分析按钮隐藏
      this.showCanbeMergeQuery = false;
      // 待合并列表不显示
      this.isMergeCriminalQuery = true;
      // 显示提交按钮
      this.submitBtnVisible = true;
      // 选择录入意见可用
      this.enterSuggetion = true;
      console.log(err);
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('System Exception'));
    }

  }

  /**
   * 重新录入公告
   * 查询可合并罪犯
   * 此处调用了待合并列表中的方法
   * （将之前的已选择的罪犯进行勾选,
   *   此处要和第一次录入的公告时做区分
   *   第一次录入的公告 合并中的公告是不能勾选的
   *   重新分析  合并中 被自己的合并的 是可以勾选的）
   * 缺陷 只有第一页的数据被选中
   *
   * @memberof NoticeInputComponent
   */
  async queryCanBeMergeCriminalReplyEnter() {
    // 分析前验证是否填写了姓名和证件，和姓名,验证公告号是否重复等；
    //  查询可合并罪犯，查询成功后，将按钮禁用。
    this.canMergeCriminalQuery.firstName = this.crimePersonInfo.firstName;
    this.canMergeCriminalQuery.lastName = this.crimePersonInfo.lastName;
    this.canMergeCriminalQuery.certificateType = this.crimePersonInfo.certificateType;
    this.canMergeCriminalQuery.certificateNumber = this.crimePersonInfo.certificateNumber;
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.backFillCriminalId)) {
      this.crimePersonInfo.backFillCriminalId = '';
    }
    try {
      let result = await this.noticeInputService.getNoticeListByNumberAndName(this.canMergeCriminalQuery,
        this.crimePersonInfo.backFillCriminalId);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        // 可合并罪犯列表数据
        this.canMergeCriminalList = result.data;
        // 可合并罪犯列表数目
        this.canMergeCriminalDataCount = result.totalCount;
        // 待合并列表显示
        this.isMergeCriminalQuery = false;
        // 选择录入意见可用
        this.enterSuggetion = false;
        await this.canMergeCriminalList.forEach(item => {
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
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
          item.point = this.crimeAndNoticeService.comparsionInformation(item, this.crimePersonInfo);
          item.name = item.firstName + ' ' + item.lastName;
          item.isCheckedDisabled = !this.showCanbeMergeQuery;
        });
        // 排序
        this.canMergeCriminalList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.canMergeCriminalList);
        // 重新录入时，将之间勾选的罪犯选中
        this.waitmergeCriminalComponent.selectedCriminalIds(this.canMergeCriminalList);
        // 同时勾选按钮设置为不可用 此处去掉 页面的按钮是否可勾选 取决于是否点击分析按钮
        this.waitmergeCriminalComponent.disabledRowsCheckedReplyEnter(this.canMergeCriminalList);
        // 将合并中的设置为不可勾选 ()上次被自己
        this.waitmergeCriminalComponent.deselectRowsBecauseReplyEnter(this.canMergeCriminalList, this.startWaitCriminalIds,
          !this.showCanbeMergeQuery);
        // this.isReplyInput = true;
      } else {
        // reuslt为null说明可合并罪犯或者服务异常，显示提交按钮和录入意见
        // 将分析按钮隐藏
        this.showCanbeMergeQuery = true;
        // 显示提交按钮
        this.submitBtnVisible = false;
        // 选择录入意见可用
        this.enterSuggetion = false;
        // 待合并列表显示
        this.isMergeCriminalQuery = false;
      }
    } catch (err) {
      // 将分析按钮隐藏
      this.showCanbeMergeQuery = false;
      // 显示提交按钮
      this.submitBtnVisible = true;
      // 选择录入意见可用
      this.enterSuggetion = true;
      console.log(err);
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('System Exception'));
    }
  }


  /**
   * 可合并罪犯列表点击下一页
   * 点击下一页的时候匹配度有问题
   * 将合并中的罪犯设为不可选
   * 上次选中的罪犯再次选中
   * @param e
   */
  async changeQueryPage(e) {
    let isShowCanbeMergeQuery: boolean = !this.showCanbeMergeQuery;
    if (this.utilHelper.AssertNotNull(e)) {
      this.canMergeCriminalQuery.pages = e;
      let result = await this.noticeInputService.getNoticeListByNumberAndName(this.canMergeCriminalQuery,
        this.crimePersonInfo.backFillCriminalId);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        this.canMergeCriminalList = result.data;
        this.canMergeCriminalDataCount = result.totalCount;
        this.canMergeCriminalList.forEach(item => {
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
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
          item.point = this.crimeAndNoticeService.comparsionInformation(item, this.crimePersonInfo);
          item.name = item.firstName + ' ' + item.lastName;
          // 分析按钮显示时 待合并列表置灰
          item.isCheckedDisabled = isShowCanbeMergeQuery;
        });
      }
      if (this.noticeInfo.status === '2') {
        // 将之前选中的罪犯选中
        this.waitmergeCriminalComponent.selectedCriminalIds(this.canMergeCriminalList);
        this.waitmergeCriminalComponent.deselectRowsBecauseReplyEnter(this.canMergeCriminalList, this.startWaitCriminalIds,
          !this.showCanbeMergeQuery);
      } else {
        this.waitmergeCriminalComponent.deselectRowsBecauseIsMerging(this.canMergeCriminalList);
      }
      this.canMergeCriminalList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.canMergeCriminalList);


    }
  }

  // 通过路由传来公告Id获取公告详情
  async bindNoticeDetail(noticeId: string) {
    if (this.utilHelper.AssertNotNull(noticeId)) {
      let result = await this.noticeInputService.getNoticeDetail(noticeId);
      if (this.utilHelper.AssertNotNull(result)) {
        this.crimePersonInfo = result.crimePersonInfo;
        // 将重新录入时回填人员ID设置为空，视为手填；
        this.crimePersonInfo.backFillCriminalId = '';
        this.crimeInfo = result.crimeInfo;
        this.noticeInfo = result.noticeInfo;
        this.attachmentList = result.attachmentInfo;
        this.auditResultName = this.noticeInfo.auditResultName;
        this.auditDescription = this.noticeInfo.auditDescription;
        // 重新录入的时候 初始化录入状态
        this.noticeInfo.noticeInputStatus = '';
        this.auditResultVisible = false;
        if (this.utilHelper.AssertNotNull(result.waitCriminalIds) && result.waitCriminalIds.length > 0) {
          this.crimeAndNoticeService.onRedisReleaseList(result.waitCriminalIds);
          this.waitCriminalIds = result.waitCriminalIds;
          this.replyWaitCriminalIds = result.waitCriminalIds;
          this.startWaitCriminalIds = result.waitCriminalIds;
        }
        this.noticeDataFormat();
        // this.checkIsEdit();
        this.countAuditDescriptionCharacter();
        // 调用子组件显示附件
        this.noticeAttachmentComponent.getImageFileListByteData(this.attachmentList);
        this.queryCanBeMergeCriminalReplyEnter();
      }
    }

  }

  noticeDataFormat() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.dateOfBirth)) {
      this.crimePersonInfo.dateOfBirth = new Date(this.crimePersonInfo.dateOfBirth);
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.credentialsIssueDate)) {
      this.crimePersonInfo.credentialsIssueDate = new Date(this.crimePersonInfo.credentialsIssueDate);
    }
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeJudgeTime)) {
      this.crimeInfo.crimeJudgeTime = new Date(this.crimeInfo.crimeJudgeTime);
    }
    if (this.utilHelper.AssertNotNull(this.noticeInfo.noticeCreateTime)) {
      this.noticeInfo.noticeCreateTime = new Date(this.noticeInfo.noticeCreateTime);
    }
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeTime)) {
      this.crimeInfo.crimeTime = new Date(this.crimeInfo.crimeTime);
    }

    if (this.crimePersonInfo.age === 0 && this.utilHelper.AssertEqualNull(this.crimePersonInfo.dateOfBirth)) {
      this.crimePersonInfo.age = null;
    }
    if (this.crimePersonInfo.height === 0) {
      this.crimePersonInfo.height = null;
    }
    this.countRejectEnterReasonCharacter();
  }


  //  返回
  goBack() {
    if (this.routerFlag === 'notice-reject') {
      this.router.navigate(['/crms-system/crime-notice/notice-reject']);
    } else {
      this.refreshRouter();
    }
  }
  /**
   * 刷新路由
   */
  async refreshRouter() {
    let nowUrl = this.router.url;
    console.log(this.router.url);
    await this.router.navigateByUrl('');
    this.router.navigate([nowUrl]);
  }
  // 路由守卫判断表单是否发生变化
  // 获取回填罪犯Id 和待合并的列表
  canDeactivate(): Observable<boolean> | boolean {
    let tip1 = this.getTranslateName('Are you sure to give up edit');
    let tip2 = this.getTranslateName('Hint');
    let x;
    let y;
    let z;
    let redislockList: string[] = this.getLockList();
    if (this.submitBtn === true || this.utilHelper.AssertNotNull(this.routerFlag)) {
      if (this.showCanbeMergeQuery) {
        if (redislockList.length > 0) {
          // this.crimeAndNoticeService.onRedisReleaseList(redislockList);
          this.crimeAndNoticeService.onRedisReleaseListAndUserId(redislockList, this.user.orgPersonId);
        }
      }
      return true;
    } else if (this.noticeAttachmentComponent.imageFileList.length > 0) {
      return new Observable((observer) => {
        confirm(tip1, tip2).then((open) => {
          observer.next(open);
          observer.complete();
        });
      });
    } else {
      for (x in this.noticeInfo) {
        if (this.noticeInfo[x] !== this.canDeactivateInfoOne[x]) {
          return new Observable((observer) => {
            confirm(tip1, tip2).then((open) => {
              if (redislockList.length > 0) {
                // this.crimeAndNoticeService.onRedisReleaseList(redislockList);
                this.crimeAndNoticeService.onRedisReleaseListAndUserId(redislockList, this.user.orgPersonId);
              }
              observer.next(open);
              observer.complete();
            });
          });
        }
      }

      for (y in this.crimePersonInfo) {
        if (this.crimePersonInfo[y] !== this.canDeactivateInfoTwo[y]) {
          return new Observable((observer) => {
            confirm(tip1, tip2).then((open) => {
              if (redislockList.length > 0) {
                // this.crimeAndNoticeService.onRedisReleaseList(redislockList);
                this.crimeAndNoticeService.onRedisReleaseListAndUserId(redislockList, this.user.orgPersonId);
              }
              observer.next(open);
              observer.complete();
            });
          });
        }
      }
      for (z in this.crimeInfo) {
        if (this.crimeInfo[z] !== this.canDeactivateInfoTwo[z]) {
          return new Observable((observer) => {
            confirm(tip1, tip2).then((open) => {
              if (redislockList.length > 0) {
                // this.crimeAndNoticeService.onRedisReleaseList(redislockList);
                this.crimeAndNoticeService.onRedisReleaseListAndUserId(redislockList, this.user.orgPersonId);
              }
              observer.next(open);
              observer.complete();
            });
          });
        }
      }
    }
    return true;
  }
  /**
   * 获取锁数据列表
   */
  getLockList() {
    let lockList: string[] = this.waitmergeCriminalComponent.getDataGridCheckedCriminal();
    // 回填罪犯
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.crimePersonInfo.backFillCriminalId) {
      lockList.push(this.crimePersonInfo.backFillCriminalId);
    }
    return lockList;
  }
  /**
   * 获取省基础数据
   */
  async bindProvinceData(countryid: string) {
    try {
      let result = await this.organizationService.getProvinceDataForDisplay(countryid);
      if (this.utilHelper.AssertNotNull(result)) {
        this.provinceList = result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 获取城市基础数据
   */
  async bindCityData(provinceid: string) {
    try {
      let result = await this.organizationService.getCityDataForDisplay(provinceid);
      if (this.utilHelper.AssertNotNull(result)) {
        this.cityList = result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 获取社区基础数据
   */
  async bindCommunityData(relationid: string) {
    try {
      let result = await this.organizationService.getCommunityDataForDisplay(relationid);
      if (this.utilHelper.AssertNotNull(result)) {
        this.communityList = result;
      }
    } catch (error) {
      console.log(error);
    }

  }

  // 现居住省份数据
  async bindLivingProvinceData(countryID: string) {
    let result = await this.organizationService.getProvinceDataForDisplay(countryID);
    if (this.utilHelper.AssertNotNull(result)) {
      this.livingProvinceList = result;
    }

  }

  // 现居住城市数据
  async  bindLivingCityData(provinceID: string) {
    let result = await this.organizationService.getCityDataForDisplay(provinceID);
    if (this.utilHelper.AssertNotNull(result)) {
      this.livingCityList = result;
    }
  }

  // 现居住社区数据
  async bindLivingCommunityData(cityId: string) {
    let result = await this.organizationService.getCommunityDataForDisplay(cityId);
    if (this.utilHelper.AssertNotNull(result)) {
      this.livingCommunityList = result;
    }
  }

  clearCountryShipAddressData() {
    this.crimePersonInfo.provinceName = '';
    this.crimePersonInfo.cityName = '';
    this.crimePersonInfo.communityName = '';
  }
  clearLivingAddressData() {
    this.crimePersonInfo.livingProvinceName = '';
    this.crimePersonInfo.livingCityName = '';
    this.crimePersonInfo.livingCommunityName = '';
  }

  /**
   * 选择国籍处理省市区可见性
   * 国籍切换时清除其他数据
   */
  selectIndexOfBirthCountry(e) {
    if (e.selectedItem !== null) {
      if (e.selectedItem.value === '1') {
        this.showCountryDetailPlace = false;
        this.cityList = [];
        this.communityList = [];
      } else {
        // 国家不为本国时不可编辑并清除数据
        this.showCountryDetailPlace = true;
        this.clearCountryShipAddressData();
      }
    }
  }

  /**
   * 选择国家
   * 根据国家id绑定该国家下所有省数据
   * @param e
   */
  selectIndexOfCountry(e) {
    if (e.selectedItem !== null) {
      this.bindProvinceData(e.selectedItem.countryId);
    }
  }

  /**
   * 选择省
   * 根据选择的省id绑定城市数据
   * @param e
   */
  selectIndexOfProvince(e) {
    if (e.selectedItem !== null) {
      // 绑定城市数据
      this.bindCityData(e.selectedItem.provinceId);
      this.communityList = [];
    }

  }

  /**
   * 选择城市
   * 根据选择的城市id绑定城市下的社区数据
   * @param e
   */
  selectIndexOfCity(e) {
    // 绑定城市下的社区数据
    if (e.selectedItem !== null) {
      this.bindCommunityData(e.selectedItem.cityId);
    }
  }
  /**
   * 选择国籍处理省市区可见性
   * 国籍切换时清除其他数据
   */
  selectIndexOfLivingCountry(e) {
    if (e.selectedItem !== null) {
      if (e.selectedItem.value === '1') {
        this.showLivingDetailAddress = false;
        this.livingCityList = [];
        this.livingCommunityList = [];
      } else {
        this.showLivingDetailAddress = true;
        this.clearLivingAddressData();
      }
    }
  }
  /**
   * 选择省、市、加载下级目录
   */
  selectIndexOfLivingProvince(e) {
    if (e.selectedItem !== null) {
      this.bindLivingCityData(e.selectedItem.provinceId);
      // this.bindLivingCommunityData(e.selectedItem.provinceId);
      this.livingCommunityList = [];
      this.crimePersonInfo.livingCommunityName = null;
    }
  }

  selectIndexOfLivingCity(e) {
    if (e.selectedItem !== null) {
      this.bindLivingCommunityData(e.selectedItem.cityId);
    }
  }

  /**
   * 选择法院
   */
  selectIndexOfCourt(e) {
    if (e.selectedItem !== null) {
      this.noticeInfo.courtId = e.selectedItem.courtID;
    }
  }

  /**
   * 公告编号查重
   * 检测到重复返回true;否则返回false;
   */
  async checkCrimeNoticeNumber() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.noticeNumber)) {
      this.toastr.clear();
      this.noticeInputService.checkCrimeNoticeNumber(encodeURIComponent(this.noticeInfo.noticeNumber),
        encodeURIComponent(this.noticeInfo.noticeId)).then(result => {
          if (this.utilHelper.AssertNotNull(result)) {
            if (result === true) {
              this.checkNoticeNumberBoolean = true;
            } else {
              this.checkNoticeNumberBoolean = false;
            }
          }
          if (this.checkNoticeNumberBoolean) {
            this.toastr.error(this.getTranslateName('this noticeNumber has already exists'));
          }
        });
    }
  }

  countAuditDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.auditDescription)) {
      this.auditDescriptionLength = this.noticeInfo.auditDescription.length;
    } else {
      this.auditDescriptionLength = 0;
    }
  }

  // 统计拒绝录入原因字符数；
  countRejectEnterReasonCharacter() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.rejectEnterReason)) {
      this.rejectEnterReasonLength = this.noticeInfo.rejectEnterReason.length;
    } else {
      this.rejectEnterReasonLength = 0;
    }
  }

  /**
   * 保存犯罪公告和犯罪信息之前应该把涉及到时间的字段同一格式化
   * 原数据为：年月日时分，目标数据为：年月日时分秒
   */
  formatDate() {
    if (this.utilHelper.AssertNotNull(this.noticeInfo.noticeCreateTime)) {
      this.noticeInfo.noticeCreateTime = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.noticeInfo.noticeCreateTime);
    }
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeJudgeTime)) {
      this.crimeInfo.crimeJudgeTime = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.crimeInfo.crimeJudgeTime);
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.dateOfBirth)) {
      this.crimePersonInfo.dateOfBirth = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.crimePersonInfo.dateOfBirth);
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.credentialsIssueDate)) {
      this.crimePersonInfo.credentialsIssueDate = this.dateFormatHelper.
        HoursMinutesDateTimeFormat(this.crimePersonInfo.credentialsIssueDate);
    }
    if (this.utilHelper.AssertNotNull(this.crimeInfo.crimeTime)) {
      this.crimeInfo.crimeTime = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.crimeInfo.crimeTime);
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
   * @param isSucess
   */
  popupOperationInfo(isSuccess: boolean, isReject: boolean) {
    this.translateService.get(['save success', 'save failure']).subscribe(value => {
      if (isSuccess === true) {
        if (!isReject) {
          // 如果是重新录入，提示提交成功，同时返回按钮,禁用录入一条和提交按钮
          // this.toastr.success(value['save success']);
          this.submitResult = value['save success'];
          this.nextItemBtnVisible = true;
          this.showFormShadow = false;
          this.submitBtnVisible = true;
          this.enterSuggetion = true;
          this.submitBtn = true;
        } else {
          // this.toastr.success(value['save success']);
          this.submitResult = value['save success'];
          this.showFormShadow = false;
          this.nextItemBtnVisible = false;
          this.submitBtnVisible = true;
          this.enterSuggetion = true;
          this.submitBtn = true;
        }
        this.isDown = true;
      } else {
        // this.toastr.error(value['save failure']);
        this.submitResult = value['save failure'];
        this.submitBtnVisible = false;
        this.enterSuggetion = false;
        this.isDown = false;
      }
      this.wizard.next();
    });

  }

  /**
   * 清除所有字符数统计
   */
  clearCharacterCount() {
    this.eventAggregator.publish('cleanCharacterCount', '');
  }


  /**
   * 通过tab页active判断清空当前页数据内容
   */
  clearThisInfo() {
    if (this.clearObject === 'noticeInfo') {
      this.noticeInfo = new NoticeInfo();
      this.noticeInfo.noticeCreateTime = null;
      this.noticeInfo.priority = '0';
      this.noticeInfo.noticeInputStatus = null;
      this.eventAggregator.publish('cleanNoticeInfoCharacterCount', '');
    }
    if (this.clearObject === 'crimeInfo') {
      this.crimeInfo = new CrimeInfo();
      this.crimeInfo.crimeJudgeTime = null;
      this.crimeInfo.crimeTime = null;
      this.eventAggregator.publish('cleanCrimeInfoCharacterCount', '');
    }
    if (this.clearObject === 'crimePersonInfo') {
      this.crimePersonInfo = new CrimePersonInfo();
      this.crimePersonInfo.dateOfBirth = null;
      this.crimePersonInfo.credentialsIssueDate = null;
      this.eventAggregator.publish('cleanPersonInfoCharacterCount', '');
    }
    this.confirmVisible = false;
  }
  /**
   * 点击清空按钮弹出提示框
   */
  showConfirmPopup(e) {
    this.confirmVisible = true;
    this.clearObject = e;
  }
  /**
   * 取消清除，隐藏提示框
   */
  cancelclear() {
    this.confirmVisible = false;
  }
  /**
   * 通过姓名获取回填犯罪人员数据
   * 此处做修改 和待合并列表不是同一个接口
   * 犯罪人回填要访问人口库
   * @param crimeNoticeQuery
   */
  async getPersonInfoByName(objCrime: any) {
    this.fillDataVisible = false;
    let result = await this.noticeInputService.getCrimePersonListByNumberAndName(objCrime.crimeNoticeQuery);
    if (this.utilHelper.AssertNotNull(result)) {
      this.personInfoList = result;
      // this.dataCount = result.totalCount;
      await this.personInfoList.forEach(item => {
        item.name = item.firstName + ' ' + item.lastName;
        item.point = this.similarityCalculate.criminalSimilarityBF(item, objCrime.crimeNoticePamter);
      });
      this.personInfoList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.personInfoList);
      this.fillDataVisible = true;
    } else {
      this.fillDataVisible = false;
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.warning(this.getTranslateName('searched and no result'));
    }
    //  将正在合并的罪犯设置不可勾选，这里要判断是第一次回填，还是第二次回填
    if (this.utilHelper.AssertNotNull(this.noticeInfo) && this.noticeInfo.status === '2') {
      this.crmsCrimePersonInfoComponent.deselectRowsBecauseReplyEnter(this.personInfoList, this.startWaitCriminalIds);
    } else {
      this.crmsCrimePersonInfoComponent.deselectRowsBecauseIsMerging(this.personInfoList);
    }
  }

  /**
   * 回填的数据, 如果是重新录入公告
   * 由于回填的罪犯发生变化还需要将可合并罪犯列表更新
   * 重新回填 此处还待验证
   */
  getCrimePersonInfo(personInfo) {
    let backFillCriminalId = this.crimePersonInfo.backFillCriminalId;
    this.crimePersonInfo = personInfo;
    // 数据解锁 若回填的数据发生改变
    if (this.utilHelper.AssertNotNull(backFillCriminalId) &&
      backFillCriminalId !== personInfo.crimePersonId) {
      this.crimeAndNoticeService.onRedisRelease(backFillCriminalId, this.user.orgPersonId).then(result => {
      }).catch(e => { });
    }
    if (this.noticeInfo.status === '2') {
      this.queryCanBeMergeCriminal();
    }
  }



  /**
   * ocr 识别信息回填s
   * @param obj
   */
  ocrFillBack(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.crimePersonInfo = obj;
    }
  }
  /**
   * 录入下一条
   * 将历史查询到的可合并罪犯列表设置为空同时隐藏
   * 提交按钮隐藏，查询可合并罪犯按钮显示
   */
  enterNextItem() {
    this.submitBtn = true;
    if (this.routerFlag === 'notice-reject') {
      this.router.navigate(['/crms-system/crime-notice/notice-reject']);
    } else {
      this.refreshRouter();
    }
  }

  /**
   * 清空表单
   */
  clearForm() {
    this.noticeAttachmentComponent.clearQueue();
    this.clearCharacterCount();
    this.noticeInfo = new NoticeInfo();
    this.crimeInfo = new CrimeInfo();
    this.crimePersonInfo = new CrimePersonInfo();
    this.noticeInfo.priority = '0';
    this.noticeInfo.noticeInputStatus = null;
    this.noticeInfo.noticeCreateTime = null;
    this.crimeInfo.crimeJudgeTime = null;
    this.crimePersonInfo.dateOfBirth = null;
    this.crimePersonInfo.credentialsIssueDate = null;
  }

  /**
   * 检查公告编号是否重复
   *
   * @memberof NoticeInputComponent
   */
  async checkNoticeNumberIsRepeat() {
    if (!this.checkNoticeNumberBoolean) {
      this.backfillSearchVisible = true;
      this.isReadOnly = true;
      this.clearBtnVisible = true;
      this.toastr.clear();
      this.queryCanBeMergeCriminal();
    } else {
      this.backfillSearchVisible = false;
      this.isReadOnly = false;
      this.clearBtnVisible = false;
      this.toastr.clear();
      this.toastr.error(this.getTranslateName('this noticeNumber has already exists'));
    }
  }
  /**
   * 录入意见的点击事件
   * @param num
   */
  enterOption(num) {
    if (num === 1) {
      this.noticeInfo.noticeInputStatus = '1';
      this.noticeInfo.rejectEnterReason = '';
    } else {
      this.noticeInfo.noticeInputStatus = '2';
    }
  }
  /**
   * 检查录入意见，是拒绝录入时，不能勾选可合并罪犯
   * @memberof NoticeInputComponent
   */
  async  checkEnterSuggestion(e) {
    // 是否选择录入意见
    if (this.utilHelper.AssertEqualNull(this.noticeInfo.noticeInputStatus)) {
      this.toastr.error(this.getTranslateName('Input comments is required'));
      return;
    }
    // 提交前验证输入
    let result = this.validator.first.instance.validate();
    this.brokenRules = result.brokenRules;
    if (result.isValid) {
      let data = this.waitmergeCriminalComponent.getDataGridCheckedCriminal();
      if (this.noticeInfo.noticeInputStatus === '2') {
        if (data.length < 1) {
          this.saveAllEnterInfo(result);
        } else {
          this.backfillSearchVisible = false;
          this.isReadOnly = false;
          this.clearBtnVisible = false;
          this.toastr.clear();
          this.toastr.error(this.getTranslateName('Do not check any criminal when reject enter'));
        }
      } else {
        if (this.utilHelper.AssertNotNull(this.crimePersonInfo.backFillCriminalId)) {
          data.push(this.crimePersonInfo.backFillCriminalId);
        }
        if (data.length > 0) {
          let lockExtend: LockExtend = new LockExtend();
          lockExtend.lockList = data;
          lockExtend.userId = this.user.orgPersonId;
          let lockList: any = await this.crimeAndNoticeService.isValidLock(lockExtend);
          if (this.utilHelper.AssertNotNull(lockList) && lockList.length === 0) {
            this.saveAllEnterInfo(e);
          } else {
            // 发布订阅 该犯罪嫌疑人已被合并
            this.waitmergeCriminalComponent.resolveLockList(data, this.crimePersonInfo.backFillCriminalId);
          }
        } else {
          this.saveAllEnterInfo(e);
        }


      }
    } else {
      this.toastr.clear();
      this.validateVisible = true;
    }
  }
  /**
   * 保存犯罪公告和犯罪信息方法,返回Boolean
   * 1.展示loading效果
   * 2.附件上传
   * 3.保存基本信息
   * 此处做修改 判断选择的附件中有没有失效后被其他公告合并的罪犯
   */
  async saveAllEnterInfo(e) {
    this.submitBtnVisible = true;
    // 1.出现loading效果
    this.showLoadPanel();
    try {
      if (this.utilHelper.AssertNotNull(this.noticeInfo.status) && this.noticeInfo.status === '2') {
        // 重新录入公告，需要判断之前的附件数，和需要上传的附件数
        // 1.获取子组件中需要上传的附件计数,需要上传的附件计数大于0，说明需要重新上传所有附件
        let shouldUploaderSum = this.noticeAttachmentComponent.getShouldUploaderSum();
        if (this.utilHelper.AssertNotNull(shouldUploaderSum) && shouldUploaderSum > 0) {
          // 1.调用上传文件的方法
          this.noticeAttachmentComponent.upLoadFile();
          let uploader: any = this.noticeAttachmentComponent.getUploaderObject();
          uploader.onSuccessItem = (item, res, status, headers) => {
            if (status === 200) {
              this.noticeAttachmentComponent.uploadSuccess(res);
            }
          };
          uploader.onCompleteAll = () => {
            this.noticeAttachmentComponent.uploaderCompleteAll();
            // 2.拿到上传文件后的文件DTO列表
            let attachment: any[] = this.noticeAttachmentComponent.getCompleteUploaderFile();
            // 3.调用保存的方法
            if (this.utilHelper.AssertNotNull(attachment) && attachment.length > 0) {
              this.savaNoticeAndCrimeBasicInfo(attachment);
            } else {
              this.savaNoticeAndCrimeBasicInfo(null);
            }
          };
        } else {
          if (this.utilHelper.AssertNotNull(this.attachmentList) && this.attachmentList.length > 0) {
            // 重新录入时，之前有附件但是没有增加操作，需要额外判断有没有移除的操作
            let removeSignalSum = this.noticeAttachmentComponent.getRemoveSigalSum();
            if (this.utilHelper.AssertNotNull(removeSignalSum) && removeSignalSum < 0) {
              // 1.调用上传文件的方法
              this.noticeAttachmentComponent.upLoadFile();
              // 2.拿到上传文件后的文件DTO列表
              let attachment: any[] = this.noticeAttachmentComponent.getCompleteUploaderFile();
              // 3.调用保存的方法
              if (this.utilHelper.AssertNotNull(attachment) && attachment.length > 0) {
                this.savaNoticeAndCrimeBasicInfo(attachment);
              } else {
                this.savaNoticeAndCrimeBasicInfo(null);
              }
            } else {
              this.savaNoticeAndCrimeBasicInfo(this.attachmentList);
            }
          } else {
            this.savaNoticeAndCrimeBasicInfo(null);
          }
        }
      } else {
        // 第一次录入公告
        let shouldUploaderSum = this.noticeAttachmentComponent.getShouldUploaderSum();
        if (this.utilHelper.AssertNotNull(shouldUploaderSum) && shouldUploaderSum > 0) {
          // 1.调用上传文件的方法
          this.noticeAttachmentComponent.upLoadFile();
          let uploader: any = this.noticeAttachmentComponent.getUploaderObject();
          uploader.onSuccessItem = (item, res, status, headers) => {
            if (status === 200) {
              this.noticeAttachmentComponent.uploadSuccess(res);
            }
          };
          uploader.onCompleteAll = () => {
            this.noticeAttachmentComponent.uploaderCompleteAll();
            let attachment: any[] = this.noticeAttachmentComponent.getCompleteUploaderFile();
            // 3.调用保存的方法
            if (this.utilHelper.AssertNotNull(attachment) && attachment.length > 0) {
              this.savaNoticeAndCrimeBasicInfo(attachment);
            } else {
              this.savaNoticeAndCrimeBasicInfo(null);
            }
          };
        } else {
          this.savaNoticeAndCrimeBasicInfo(null);
        }
      }
    } catch (e) {
      this.submitBtnVisible = false;
      this.loadingVisible = false;
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('save failure'));
      console.log(e);
    }
  }

  // 附件上传失败操作
  uploadError(item) {
    if (this.utilHelper.AssertNotNull(item)) {
      let name = item.name.substring(item.name.lastIndexOf('\\') + 1, item.name.length);
      this.reRntryVisible = false;
      this.loadingVisible = false;
      this.toastr.toastrConfig.maxOpened = 5;
      this.toastr.toastrConfig.timeOut = 5000;
      this.toastr.error(this.getTranslateName('Server Inner Exception') + name + this.getTranslateName('attachment upload failed'));
    }
  }

  /**
   * 获取子组件中选中的可合并罪犯
   */
  getChildComponentSelectCriminal() {
    this.waitCriminalIds = this.waitmergeCriminalComponent.getDataGridCheckedCriminal();
    // 判断当前数据是否回填 若是回填 将回填数据加入待合并列表
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.backFillCriminalId)) {
      this.waitCriminalIds.push(this.crimePersonInfo.backFillCriminalId);
    }
  }

  /**
   * 保存基本信息
   * @param form
   */
  async savaNoticeAndCrimeBasicInfo(attachmentList) {
    let isAdd: boolean = true;
    if (this.noticeInfo.status === '2') {
      isAdd = false;
    } else {
      isAdd = true;
    }
    this.getChildComponentSelectCriminal();
    // (1)转换输入的时间年月日时分秒
    this.formatDate();
    this.firstTabActive = false;
    this.crimeInfo.enteringPersonName = this.user.personName;
    this.crimeInfo.enterPersonId = this.user.orgPersonId;
    this.noticeInfo.enteringPersonName = this.user.personName;
    this.noticeInfo.enterPersonId = this.user.orgPersonId;
    this.crimePersonInfo.enteringPersonName = this.user.personName;
    this.crimePersonInfo.enterPersonId = this.user.orgPersonId;
    if (isAdd) {
      this.crimePersonInfo.archivesCode = this.encodingRulesService.archivesCodeCreate(this.crimePersonInfo.certificateNumber);
    } else {
      // 防止点击清空按钮后，审核信息不见
      this.noticeInfo.auditDescription = this.auditDescription;
    }
    // (3)调用服务，保存3类基本信息
    this.crimeAndNoticeExtendInfo = new CrimeAndNoticeExtendInfo(this.crimeInfo,
      this.crimePersonInfo, this.noticeInfo, attachmentList, this.waitCriminalIds);
    try {
      let result: any = null;
      if (isAdd) {
        result = await this.noticeInputService.saveNoticeAndCrimeInfo(this.crimeAndNoticeExtendInfo);
      } else {
        result = await this.noticeInputService.updateNoticeAndCrimeInfo(this.crimeAndNoticeExtendInfo);
      }
      if (this.utilHelper.AssertNotNull(result) && result.success === true) {
        this.completeInfo = result.data;
        this.isSaveSuccess = true;
        this.loadingVisible = false;
        this.popupOperationInfo(this.isSaveSuccess, isAdd);
      } else {
        this.submitBtnVisible = false;
        this.loadingVisible = false;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        // this.toastr.error(this.getTranslateName('save failure'));
        this.submitResult = this.getTranslateName('save failure');
        this.wizard.next();
      }
    } catch (err) {
      console.log(err);
      // 路由守卫开启
      this.submitBtnVisible = false;
      this.loadingVisible = false;
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('save failure'));
    }
    this.logRecordToLogServer(this.isSaveSuccess, isAdd);
  }

  /**
   * 记录日志
   * @param {boolean} isSaveSuccess
   * @param {boolean} isAdd
   * @memberof NoticeInputComponent
   */
  logRecordToLogServer(isSaveSuccess: boolean, isAdd: boolean) {
    if (isSaveSuccess) {
      this.operationLog.level = 'info';
      if (isAdd) {
        this.operationLog.actionDesc = 'update notice-input success';
      } else {
        this.operationLog.actionDesc = 'add notice-input success';
      }
      this.operationLog.level = 'info';
    } else {
      this.operationLog.level = 'error';
      if (isAdd) {
        this.operationLog.actionDesc = 'add notice-input failed';

      } else {
        this.operationLog.actionDesc = 'update notice-input failed';
      }
    }
    this.operationLog.action = 'ADD';
    let _newContent = JSON.stringify(this.crimeAndNoticeExtendInfo).replace(/"/g, `'`);
    this.operationLog.newContent = _newContent;
    this.logRecord();
  }

  /**
   * 路由绑定header路径
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // tab切换校验
  selectTab() {
    if (this.utilHelper.AssertEqualNull(this.noticeInfo.noticeNumber)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.noticeInfo.noticeCreateTime)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.noticeInfo.courtId)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.crimeInfo.crimeDescription)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.crimeInfo.crimeTime)) {
      this.seleTab = true;
      return true;
    }
    this.seleTab = false;
    return false;
  }

  // 使用translateService对component字段进行国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  // 操作日志记录
  logRecord() {
    try {
      this.operationLog.business = 'notice-input';
      this.operationLog.isBatchAction = false;
      this.operationLog.module = 'crime-notice';
      this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.operationLog.system = 'crms';
      this.operationLog.oldContent = null;
      this.operationLog.operationIp = ip();
      this.logger.record(this.operationLog);
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * 此处判断保存的时候有没有被其他公告合并的罪犯
   */
  async getHasLockList(lockExtend: LockExtend) {
    this.lockList = [];
    try {
      let result = await this.crimeAndNoticeService.isValidLock(lockExtend);
      if (this.utilHelper.AssertNotNull(result)) {
        this.lockList = result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 从待合并列表接收到的订阅 上次选择选择的罪犯在重新分析的时候被清除
   */
  async changeMergeCrimePerson(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.waitCriminalIds = this.waitCriminalIds.filter(item => item !== e
      );
    }
  }
  /**
   * 分步表单验证的方法
   * @param {any} result
   * @memberof NoticeInputComponent
   */
  async stepValidateForms(result, flag) {
    this.brokenRules = [];
    this.brokenRules = result.brokenRules;
    if (result.isValid === true && flag === 'analysis') { // 进行分析操作
      this.wizard.next();
      this.attchmentControllObj.uploadFile = false;
      this.checkNoticeNumberIsRepeat();
    } else if (result.isValid === true && flag === false) { // 普通验证操作
      this.wizard.next();
    } else {
      this.toastr.clear();
      this.validateVisible = true;
      this.backfillSearchVisible = false;
      this.isReadOnly = false;
      this.clearBtnVisible = false;
      this.isDown = false;
    }
  }

  /**
   * @param e 点击下一步表单验证
   */
  nextEventValidata(step) {
    if (step === 0) {
      this.wizard.next(); // 直接进行下一步
    } else if (step === 1) {  // 第二步
      let result1 = this.CrmsNoticeComponent.validator.first.instance.validate(); // 公告基本信息
      let result2 = this.CrmsCrimeInfoComponent.validator.first.instance.validate();  // 犯罪信息
      let result: any = {
        isValid: false,
        brokenRules: []
      };
      if (result1.isValid === true && result2.isValid === true && this.checkNoticeNumberBoolean !== true) { // 验证通过，并且公告编号不重复
        result.isValid = true;
        this.noticeBasicInfoNextButton = true;
        result.brokenRules = result1.brokenRules.concat(result2.brokenRules); // 提示信息数组
        this.stepValidateForms(result, false);
      } else if (this.checkNoticeNumberBoolean === true) { // 验证通过，公告编号重复
        this.toastr.error(this.getTranslateName('this noticeNumber has already exists'));
      } else if (result1.isValid === false || result2.isValid === false) { // 验证不通过
        result.isValid = false;
        this.noticeBasicInfoNextButton = false;
        result.brokenRules = result1.brokenRules.concat(result2.brokenRules); // 提示信息数组
        this.stepValidateForms(result, false);
      }
    } else if (step === 2) { // 第三步
      let result = this.crmsCrimePersonInfoComponent.validator.first.instance.validate();
      this.stepValidateForms(result, 'analysis');
    } else if (step === 3) { // 第四步
      this.wizard.next();
    }
  }

  ocrFillBackEmit(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.crimePersonInfo = e.crimePersonInfo;
      this.noticeInfo = this.noticeInfo;
      this.crimeInfo = e.crimeInfo;
    }
  }
}
