import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as ip from 'internal-ip';

import { ApplyGovermentService, MinImg } from './apply-goverment.service';

import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';

import { ApplyInfo } from '../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../model/common/AttachmentInfo';
import { ApplyAndCriminalRelation } from '../../model/certificate-apply/ApplyAndCriminalRelation';
import { ProvinceInfo } from '../../model/organization/ProvinceInfo';
import { CityInfo } from '../../model/organization/cityinfo';
import { CommunityInfo } from '../../model/organization/communityinfo';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { CrimePersonInfo } from '../../model/crime-notice/crimePersonInfo';
import { UserInfo } from '../../model/auth/userinfo';
import { OperationLog } from '../../model/logs/operationLog';
import { CrimeNoticeQuery } from '../../model/crime-integrated-business/CrimeNoticeQuery';
import { ApplyPersonQuery } from '../../model/certificate-apply/ApplyPersonQuery';
import { Observable } from 'rxjs/Observable';
import { confirm } from 'devextreme/ui/dialog';
import { ApplyGovermentInfoComponent } from './apply-info/apply-govermentInfo.component';
import { ApplyGovermentBasicInfoComponent } from './basic-info/basic-info.component';
import { EnumInfo } from '../../enum';


import { ConfigService, EventAggregator, LocalStorageService, DateFormatHelper, LoggerRecordService, UtilHelper } from '../../core';


import { CertificatePrintComponent } from '../common/components/certificate-print/certificate-print.component';
import { ApplyGovermentAnalysisResultComponent } from './analysis-result/analysis-result.component';
import { CrmsAttchmentComponent } from '../../+crms-common/components/crms-attchment/crms-attchment.component';
import { SortorderAlgorithmService } from '../../+crms-common/services/sortorder-algorithm.service';
import { OrganizationService } from '../../+crms-common/services/organization-data.service';
import { EncodingRulesService } from '../../+crms-common/services/encoding-rules.service';
import { CrimeAndNoticeService } from '../../+crms-common/services/crime-notice.service';
import { WizardComponent } from '../../shared/components/wizard/wizard.component';
@Component({
  templateUrl: './apply-goverment.component.html',
  providers: [EnumInfo, DateFormatHelper, OrganizationService, ApplyGovermentService, ApplyCommonService, CrimeAndNoticeService]
})
export class ApplyGovermentComponent implements OnInit {

  @ViewChild('grids')
  grids: DxDataGridComponent;

  @ViewChild('crimeGrid')
  crimeGrid: DxDataGridComponent;


  @ViewChild(ApplyGovermentInfoComponent) applyGovermentInfo: ApplyGovermentInfoComponent;
  @ViewChild(ApplyGovermentBasicInfoComponent) applyGovermentBasicInfo: ApplyGovermentBasicInfoComponent;
  @ViewChild(CrmsAttchmentComponent) crmsAttchment: CrmsAttchmentComponent;
  @ViewChild(CertificatePrintComponent)
  CerPrintComponent: CertificatePrintComponent;
  @ViewChild(ApplyGovermentAnalysisResultComponent) applyGovermentAnalysisResultComponent: ApplyGovermentAnalysisResultComponent;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  // 上传文件按钮是否变色
  isWillUpload: boolean = false;

  /**
  * 提交时分析结果
  */
  isCrimed: boolean = true;

  // 附件缩略图src
  minImg: MinImg;
  minImgPath: string;
  uploadFileList: MinImg[] = [];

  /**
   * 图片字节数组列表
   * 轮播图当前index
   * 缩略图容器宽度
   */
  imageList: any[] = [];
  activeSlideIndex: number = 0;
  thumbnailWidth: string;


  // 回填按钮是否可用
  isDataBackFill: boolean = true;

  // 回填弹窗可见性
  fillDataVisible: boolean = false;

  /**
   * 申请目的
   * @type {any[]}
   * @memberof ApplyGovermentComponent
   */
  applyPurposeList: any;

  // 采集点
  centerCodeName: string;

  // 证件类型
  certificateTypeList: any[];

  certificateInfo: any;

  // 是否有犯罪记录
  isHasCrimeRecord: number;
  applyInfoNew: ApplyInfo = new ApplyInfo();

  // 是否分析成功
  isUpdate: any;

  // 是否显示返回按钮
  isBack: boolean = true;

  // 保存后打印按钮是否可用
  showPrintButton: boolean = true;

  // 保存后录入下一条按钮是否可用
  showInputNext: boolean = false;

  // 保存后是否打印证书
  showPrint: boolean = false;

  // 保存后禁用提交按钮
  isNoTouch: boolean = true;

  // 分析按钮是否显示
  showAnalysis: boolean = true;

  // 提交分析按钮是否显示
  showAnalysised: boolean = false;

  // // 保存时遮罩层是否显示
  showFormShadow: boolean = true;

  // 保存失败提示
  failedInfo: any;

  // 姓名必填提示
  nameRequire: any;

  firstTabActive: boolean = true;

  // 保存前验证必填项是否已填
  validateVisible: boolean = false;
  brokenRules: any[] = [];

  /**
  * 移除单个文件tooltip
  * removeSingleFileTolVisible
  */
  removeSingleFileTolVisible: boolean = false;

  /**
   * 移除所有文件tooltip
   * removeAllFileTolVisible
   */
  removeAllFileTolVisible: boolean = false;

  /**
  * 选择文件tooltip
  * selectTolVisible
  */
  selectFileTolVisible: boolean = false;

  /**
   * 预览tooltip
   * previewTolVisible
   */
  previewTolVisible: boolean = false;

  /**
    *1.政府申请信息
   * 2.政府申请基本信息
   * 3.附件基本信息
   * 4.申请和公告关联
   * 5.申请和公告关联列表
   * 6.保存合并信息
    */
  applyInfo: ApplyInfo;
  applyBasicInfo: ApplyBasicInfo;
  attachmentInfo: AttachmentInfo;
  attachmentList: AttachmentInfo[] = [];
  applyAndCriminalRelation: ApplyAndCriminalRelation;
  certificateApplyInfo: CertificateApplyInfo;
  userInfo: UserInfo = null;

  /**
   * 犯罪人相关的信息
   */
  criminalInfo: any[] = [];
  /**
   * 政府申请勾选的犯罪人 驳回时使用
   */
  crimePersonInfo: CrimePersonInfo;
  //  *获取公告noticeID

  noticeIDs: any[] = [];
  // noticeID: string;
  // noticeIDList: any[] = [];

  /**
   * 犯罪公告附件预览
   */
  pupopSee: boolean = false;
  seeSrc: string;

  /**
   *人口信息name
   */
  applyPersonName: string;

  /**
   *人口信息证件号及模糊查询列表
   */
  applyPersonList: ApplyBasicInfo[] = [];

  /**
* 申请人基本信息
* 1. 姓
* 2. 名
* 3. 身份证号码
* 4. 人口库基础数据列表
*/
  firstName: string;
  lastName: string;
  certificateNumber: string;
  personInfoList: any[] = [];

  /**
   * 组织机构列表
   * 1.国家
   * 2.省
   * 3.城市
   * 4.社区
   */
  provinceList: ProvinceInfo[] = [];
  govermentProvinceList: ProvinceInfo[] = [];
  cityList: CityInfo[] = [];
  govermentCityList: CityInfo[] = [];
  communityList: CommunityInfo[] = [];
  govermentCommunityList: CommunityInfo[] = [];

  // 现居住省、市、区
  livingProvinceList: ProvinceInfo[] = [];
  livingCityList: CityInfo[] = [];
  livingCommunityList: CommunityInfo[] = [];
  countryId: string;

  // 外籍国家可见性
  showLivingDetailAddress: boolean = false;
  showCountryDetailPlace: boolean = false;

  // 点击清空按钮提示框
  confirmVisible: boolean = false;
  // 清除对象
  clearObject: any;

  /**
   * 性别
   */
  genderEnum: any[];

  /**
   * 判断国家是否必填
   */
  isRequire: boolean = false;
  showCountryName: boolean = true;

  /**
   * 判断其他目的原因是否必填
   */
  isReason: boolean = false;
  otherReason: boolean;



  //  申请优先级
  priorityList: any[];

  /**
   * 国籍
   */
  countryOfCitizenshipEnum: any[];

  /**
   * 分析结果
   */
  analysisResultEnum: any[];

  /**
   * 分析描述是否必填
   */
  isOther: boolean = false;

  // 分析结果是否必选
  isAnalysised: boolean = false;

  // 分析结果是否可选
  isSelect: boolean = false;

  // 驳回原因
  rejectReason: string;

  // 驳回原因是否可见
  isRejected: boolean = true;

  // 信息只读
  isEdit: boolean = false;

  // /**
  //  *初始化国家id,从config.json中获取
  //  */
  // countryId: string;

  /**
   * 发证时间验证：不能早于出生时间
   */
  MincredentialsIssueDate: Date;

  /**
   * 出生时间不能大于等于当前时间
   */
  MaxbirthDate: Date = new Date();

  now: Date = new Date();

  /**
   * 统计地址描述字符数
   */
  applyBasicDetaileAddressLength: number = 0;

  /**
   * 统计描述字符数
   */
  applyDescriptionLength: number = 0;

  /**
   * 统计其他特征描述字符数
   */
  otherFeatureLength: number = 0;

  /**
   * 统计备注描述字符数
   */
  applynoteDescriptionLength: number = 0;

  /**
   * 统计备注描述字符数
   */
  analysisDescriptionLength: number = 0;

  // 统计驳回原因字符数
  applyRejectReasonLength: number = 0;

  // 其他目的原因字符数
  applyOtherPurposeReasonLength: number = 0;

  /**
   * 点击保存时的loading
   */
  loadingVisible: boolean = false;

  /**
  * 附件弹窗pupop是否可见
  */
  popupVisible: boolean = false;

  /**
   * 图片弹窗
   */
  popupImageVisible: boolean = false;

  /**
  * 图片路径
  */
  imageSrc: string = '';

  /**
   * 操作提示消息
   */
  operationInfo: string;
  noticeInfo: string;

  /**
   * 是否保存成功
   */
  isSaveSucess: boolean;

  /**
   * 非法文件集合
   */
  illegalImage: string[] = [];


  /**
   * FileLoader文件上传对象
   */
  uploader: FileUploader = new FileUploader({});

  /**
   * 图片格式要求
   * 1. 类型
   * 2. 大小
   */
  imageTypeFormat: string[];
  imageSizeFormat: number;

  /**
   * 上传图片路径
   */
  registerPhoto: string = '';

  /**
   * 存取成功的文件ID列表
   * @type {string[]}
   * @memberof CrimeAndNoticeComponent
   */
  storeFileID: string[] = [];

  /**
  * 录入人
  * @type {string}
  * @memberof ApplyPersonComponent
  */
  enterPersonName: string = '';

  // 路由传参：applyIdAndStatus
  routeApplyId: string;
  routeApplyStatusId: string;
  routeApplyStatusName: string;

  /**
   * 有犯罪记录时，未选择犯罪公告提示框
   */
  noticeWarnming: boolean = false;
  /**
   *  是否显示文件的添加按钮
   */
  uploadFileButton: boolean = false;

  // 操作记录日志
  operationLog: OperationLog;

  historyFlag: boolean; // 历史记录页面跳转

  // 犯罪公告分页对象
  crimeNoticeQuery: CrimeNoticeQuery;

  // 公告列表总数
  dataCount: number;

  // 人员列表分页
  applyPersonQuery: ApplyPersonQuery;

  // 人员列表总数
  totalCount: number;

  // 分页是否显示
  pageMenuVisible: boolean;
  noticeImagePathList: any[] = [];
  popupNoticeImageVisible: boolean = false;
  // 表单对比对象
  canDeactivateInfoOne: any;
  canDeactivateInfoTwo: any;

  // 是否显示高拍仪窗口
  popupCameraVisible: boolean = false;

  // 是否显示犯罪嫌疑人详情
  popupNoticeVisible: boolean = false;

  // 犯罪公告列表
  noticeList: any = [];
  attchmentControllObj: any;
  // 电话号码正则
  telephoneRegex: string;
  submitBtn: boolean = false; // 是否保存了数据
  seleTab: boolean = true; // tab切换校验
  // 提交按钮是否可用
  submitDisabled: boolean = false;
  // 分析按钮是否可用
  analysisDisabled: boolean = false;

  reRntryVisible: boolean = true;
  hiddenBar: boolean = true;
  // 当前已选的犯罪嫌疑人
  hasSelectCrimePersonId: string = '';
  // 职业列表
  careerList: any[];
  attchmentWatchObj: any;
  showCrimeList: boolean = true;
  showNext: boolean = false;
  showAnalysisButton: boolean = true;
  // 提交结果
  submitResult: string;
  completeInfo: string;
  /**
   * 构造函数，初始化参数
   * @param applyGovermentService
   */
  constructor(
    private organizationService: OrganizationService,
    private configService: ConfigService,
    private applyCommonService: ApplyCommonService,
    private applyGovermentService: ApplyGovermentService,
    private utilHelper: UtilHelper,
    private enumInfo: EnumInfo,
    private toastr: ToastrService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
    private logger: LoggerRecordService,
    private dateFormatHelper: DateFormatHelper,
    private encodingRulesService: EncodingRulesService,
    private sortorderAlgorithmService: SortorderAlgorithmService,
  ) {
    this.operationLog = new OperationLog();
    this.crimeNoticeQuery = new CrimeNoticeQuery();
    this.applyPersonQuery = new ApplyPersonQuery();
    this.applyInfo = new ApplyInfo();

    this.canDeactivateInfoTwo = new ApplyBasicInfo();
    this.applyAndCriminalRelation = new ApplyAndCriminalRelation();
    this.crimePersonInfo = new CrimePersonInfo();
    this.attchmentControllObj = {
      uploadFile: true,
      preview: true,
      ocrRecognize: false,
      removeSingle: true
    };
    this.attchmentWatchObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
  }

  ngOnInit(): void {
    this.initData();
    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;
    this.applyPersonQuery.pages = 0;
    this.applyPersonQuery.pageSize = 5;
    this.getIdNumberAndPhoneRegx();
    this.canDeactivateInfoOne = {
      analysisResultId: undefined,
      applyCenterId: this.applyInfo.applyCenterId,
      applyCenterName: this.applyInfo.applyCenterName,
      centerCodeProvince: this.userInfo.applyCenterProvince,
      applyPurposeId: undefined,
      cityName: undefined,
      communityName: undefined,
      govermentInfo: undefined,
      govermentProcess: undefined,
      note: undefined,
      otherPurposeReason: undefined,
      priority: this.applyInfo.priority,
      provinceName: undefined
    };

    this.eventAggregator.subscribe('hiddenLeftBar', '', result => { // 附件预览接收的订阅
      if (result === false) {
        this.hiddenBar = false;
      } else {
        this.hiddenBar = true;
      }
    });
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
      * 初始化身份证和联系电话的正则表达式
      *
      * @memberof CrmsPersonApplyBasicInfoComponent
      */
  async getIdNumberAndPhoneRegx() {
    try {
      let result = await this.configService.get(['telephoneRegex']);
      this.telephoneRegex = result[0];
    } catch (error) {
      console.log(error);
    }

  }
  // 路由守卫判断表单是否发生变化
  canDeactivate(): Observable<boolean> | boolean {
    let tip1 = this.getTranslateName('Are you sure to give up edit');
    let tip2 = this.getTranslateName('Hint');
    let x;
    // let y;
    // 判断是否是传了数据过来的页面
    if (this.submitBtn === true) {
      return true;
    } else if (this.crmsAttchment.imageFileList.length > 0) {
      return new Observable((observer) => {
        confirm(tip1, tip2).then((open) => {
          observer.next(open);
          observer.complete();
        });
      });
    } else {
      for (x in this.applyInfo) {
        if (this.applyInfo[x] !== this.canDeactivateInfoOne[x]) {
          return new Observable((observer) => {
            confirm(tip1, tip2).then((open) => {
              observer.next(open);
              observer.complete();
            });
          });
        }
      }
    }
    return true;
  }


  // 初始化数据
  initData() {
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.attachmentInfo = new AttachmentInfo();
    this.genderEnum = this.enumInfo.getGenderEnum;

    this.countryOfCitizenshipEnum = this.enumInfo.getCountryOfCitizenshipEnum;
    // 分析结果
    this.analysisResultEnum = this.enumInfo.getAnalysisResult;
    this.otherReason = true;
    // 获取登录人员的信息
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;
    this.centerCodeName = this.userInfo.centerCodeName;
    this.applyInfo.applyCenterId = this.userInfo.centerCode;
    this.applyInfo.applyCenterName = this.userInfo.centerCodeName;
    this.applyInfo.applyCenterProvince = this.userInfo.applyCenterProvince;
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;
    // 初始化证书申请基础数据
    this.bindApplyPurposeData();
    this.applyPurposeList = this.localStorageService.readObject('applyPurposeList');
    this.bindApplyPriorityData();
    this.bindCareerList();

    this.configService.get('countryId').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.countryId = result;
      }
    }).catch(e => {
      console.log(e);
    });



    // 初始化文件类型和大小限制配置
    this.configService.get('imageFormat').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.imageTypeFormat = result;
      }
    }).catch(e => {
      console.log(e);
    });
    this.configService.get('imageSize').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.imageSizeFormat = Number(result) * 1024 * 1024;
      }
    }).catch(e => {
      console.log(e);
    });

    // 初始化文件上传地址
    this.configService.get('storeFileUrl').then(result => {
      // 初始化文件上传FileUpLoader,上传的数据库服务路径
      if (this.utilHelper.AssertNotNull(result)) {
        this.uploader = new FileUploader({
          url: result,
          method: 'Post',
        });
      }
    }).catch(e => {
      console.log(e);
    });
    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyGovernmentInput');

    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-goverment');
    this.applyInfo.priority = '0';
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
  }


  // 清除字符数
  clearCharacterCount() {
    this.applyBasicDetaileAddressLength = 0;
    this.applyDescriptionLength = 0;
    this.otherFeatureLength = 0;
  }

  /**
   * 点击清空按钮弹出提示框
   */
  showConfirmPopup(e) {
    this.confirmVisible = true;
    this.clearObject = e;
  }

  // 通过applyBasicInfo获取相关犯罪信息
  async bindNoticesByName() {
    this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
    this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
    this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
    this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
    await this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
          this.isAnalysised = true;
          this.criminalInfo = result.data;
          this.dataCount = result.totalCount;
        }
        if (this.utilHelper.AssertNotNull(this.criminalInfo)) {
          this.criminalInfo.forEach(item => {
            if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
              item.age = null;
            }
            if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
              this.applyBasicInfo.age = null;
            }
            item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
            item.name = item.firstName + ' ' + item.lastName;
          });
          this.criminalInfo = this.sortorderAlgorithmService.insertSortSimilarityUse(this.criminalInfo);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  getCrimeNoticeEmit(obj) {
    this.hasSelectCrimePersonId = this.applyGovermentAnalysisResultComponent.getCheckBoxSelectedData();
    if (this.utilHelper.AssertNotNull(obj)) {
      this.crimeNoticeQuery.pages = obj;
      this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
            this.isAnalysised = true;
            this.criminalInfo = result.data;
            this.dataCount = result.totalCount;
          }
          if (this.utilHelper.AssertNotNull(this.criminalInfo)) {
            this.criminalInfo.forEach(item => {
              if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
                item.age = null;
              }
              if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
                this.applyBasicInfo.age = null;
              }
              item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
              item.name = item.firstName + ' ' + item.lastName;
            });
            this.criminalInfo = this.sortorderAlgorithmService.insertSortSimilarityUse(this.criminalInfo);
          }
        }).catch(err => {
          console.log(err);
        });
    }
  }

  /**
   *选中已选的犯罪嫌疑人
   */
  selectdefaultCrimer(e) {
    this.criminalInfo.forEach((item, index) => {
      if (item.crimePersonId === this.applyAndCriminalRelation.criminalId) {
        this.crimeGrid.instance.selectRowsByIndexes([index]);
      }
    });
  }

  /**
   * 预览
   */
  seeAllImage(item, idx) {
    this.popupImageVisible = true;
    this.thumbnailClick(idx);
  }


  // 缩略图点击
  thumbnailClick(num: number) {
    if (num !== null && num !== undefined) {
      this.activeSlideIndex = num;
    }

  }


  /**
   * 显示loading时的操作
   */
  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  /**
   * 验证年龄类型
   * @param e
   */
  validateAgePattern(e) {
    let reg = new RegExp('^(-?\\d+)(\\.\\d+)?$');
    if (this.utilHelper.AssertNotNull(e)) {
      if (reg.test(e)) {
        this.applyBasicInfo.age = e;
      }
    }
  }

  // 清空模块数据
  clearThisInfo() {
    if (this.clearObject === 'clearApplyInfo') {
      this.applyInfo = new ApplyInfo();
      if (this.utilHelper.AssertNotNull(this.userInfo)) {
        this.applyInfo.applyCenterId = this.userInfo.centerCode;
        this.applyInfo.applyCenterName = this.userInfo.centerCodeName;
        this.applyInfo.applyCenterProvince = this.userInfo.applyCenterProvince;
      } else {
        this.applyInfo.applyCenterId = '';
        this.applyInfo.applyCenterName = '';
        this.applyInfo.applyCenterProvince = '';
      }
      this.applyInfo.priority = '0';
      this.eventAggregator.publish('cleanCharacterCount', '');
    }
    if (this.clearObject === 'clearApplyBasicInfo') {
      this.applyBasicInfo = new ApplyBasicInfo();
      this.applyBasicInfo.dateOfBirth = null;
      this.applyBasicInfo.credentialsIssueDate = null;
      this.clearCharacterCount();
    }
    this.confirmVisible = false;
  }

  /**
 * 取消清除，隐藏提示框
 */
  cancelclear() {
    this.confirmVisible = false;
  }


  /**
     * 弹出操作结果提示信息
     * @param isSucess
     */
  popupOperationInfo(isSucess: boolean, isHasCrimeRecord: number, isCrimed: boolean) {
    this.translateService.get(['save success and has no crime record',
      'save success and need audit', 'analysis failure']).subscribe(value => {
        if (isSucess === true && this.noticeIDs.length === 0 && this.criminalInfo.length === 0) {
          this.submitResult = value['save success and has no crime record'];
          this.showPrint = true;
          this.isRejected = true;
          this.isEdit = false;
          this.showInputNext = true;
          this.showAnalysis = false;
          this.isAnalysised = false;
          this.showAnalysised = false;
          this.isNoTouch = true;
          return;
        } else if (isSucess === true && this.noticeIDs.length === 0 && this.criminalInfo.length > 0) {
          this.submitResult = value['save success and need audit'];
          this.isRejected = true;
          this.isEdit = false;
          this.showInputNext = true;
          this.showAnalysis = false;
          this.isAnalysised = false;
          this.showAnalysised = false;
          this.isNoTouch = true;
        }
        if (isSucess === true && this.noticeIDs.length > 0) {
          this.isEdit = false;
          this.submitResult = value['save success and need audit'];
          this.showInputNext = true;
          this.showAnalysis = false;
          this.isAnalysised = false;
          this.showAnalysised = false;
          this.isRejected = true;
          this.isNoTouch = true;
        }
        if (isSucess === false) {
          this.analysisDisabled = false;
          this.isRejected = true;
          if (this.isNoTouch === false) {
            this.showAnalysis = false;
            this.isEdit = true;
          } else {
            this.showAnalysis = true;
            this.isEdit = false;
          }
          this.submitResult = value['analysis failure'];
        }
      });
  }



  /**
   * 显示loading
   */
  showLoadPanel() {
    this.loadingVisible = true;
  }


  /**
  * select國籍控件选中内容事件
  */
  selectIndexOfCountryShip(e) {
    if (e.selectedItem !== null && e.selectedItem !== undefined) {
      if (e.selectedItem.value === '1') {
        this.showCountryDetailPlace = false;
        this.bindProvinceData(this.countryId);
      } else {
        // 国家不为本国时不可编辑并清除数据
        this.showCountryDetailPlace = true;
        this.clearCountryShipAddressData();
        this.provinceList = [];
        this.cityList = [];
        this.communityList = [];
      }
    }
  }

  /**
       * 选择国籍处理省市区可见性
       * 国籍切换时清除其他数据
       */
  selectIndexOfLivingCountry(e) {
    if (e.selectedItem != null && e.selectedItem !== undefined) {
      if (e.selectedItem.value === '1') {
        this.showLivingDetailAddress = false;
        this.bindLivingProvinceData(this.countryId);
      } else {
        this.showLivingDetailAddress = true;
        this.livingProvinceList = [];
        this.livingCityList = [];
        this.livingCommunityList = [];
        this.clearLivingAddressData();
      }
    }
  }

  /**
  * 点击分页按钮，重新拉取数据
  *
  */
  changeCriminalInfo(obj) {
    this.crimeNoticeQuery.pages = obj.pages;
    this.bindNoticesByName();
  }


  /**
   * 加载犯罪公告列表的方法
  */
  async bindNoticesByIDAndName() {
    if (this.utilHelper.AssertEqualNull(this.applyBasicInfo.certificateNumber)) {
      this.applyBasicInfo.certificateNumber = '';
    }
    this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
    this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
    this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
    this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
    try {
      let result = await this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery);
      if (this.utilHelper.AssertNotNull(result)) {
        this.criminalInfo = result.data;
        this.dataCount = result.totalCount;
      }
      if (this.utilHelper.AssertNotNull(this.criminalInfo) && this.criminalInfo.length > 0) {
        this.criminalInfo.forEach(item => {
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
            item.age = null;
          }
          if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
            this.applyBasicInfo.age = null;
          }
          item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
          item.name = item.firstName + ' ' + item.lastName;
        });
        this.criminalInfo = this.sortorderAlgorithmService.insertSortSimilarityUse(this.criminalInfo);
      }
      if (this.utilHelper.AssertNotNull(this.criminalInfo) && this.criminalInfo.length === 0) {
        this.applyInfo.analysisResultId = '2';
        this.isAnalysised = false;
        this.showAnalysised = false;
        this.analysisDisabled = true;
        this.SaveAllEnterInfo();
        this.showNext = false;
        this.showAnalysisButton = false;
      } else {
        this.showCrimeList = false;  // 列表组件显示
        this.showNext = true;  // 显示下一步按钮
        this.showAnalysisButton = false; // 隐藏分析按钮
        this.wizard.activeStep.crimeList = true;
        this.analysisDisabled = true;
        this.showAnalysis = false;
        this.isAnalysised = true;
        this.showAnalysised = true;
        this.isNoTouch = false;
        this.wizard.next();
      }
    } catch (error) {
      console.log(error);
    }

  }


  //  获取犯罪公告
  toAnalysis(e) {
    let result: any = {
      isValid: false,
      brokenRules: []
    };
    let result1 = this.applyGovermentBasicInfo.validator.first.instance.validate();
    let result2 = this.validator.first.instance.validate();
    if (result1.isValid === true && result2.isValid === true) { // 验证通过
      result.isValid = true;
    } else {
      result.isValid = false;
    }
    result.brokenRules = result1.brokenRules.concat(result2.brokenRules); // 提示信息数组
    this.stepValidateForms(result, 'analysis');
  }


  /**
   * 获取申请目的基础数据
   */
  async bindApplyPurposeData() {
    try {
      let result = await this.applyCommonService.getApplyPurposeList();
      if (this.utilHelper.AssertNotNull(result)) {
        this.localStorageService.writeObject('applyPurposeList', result);
      }
    } catch (error) {
      console.log(error);
      return [];
    }

  }
  // 获取申请优先级
  bindApplyPriorityData() {
    this.applyCommonService.getApplyPriorityList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.priorityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  /**
   * 获取职业列表
   */
  bindCareerList() {
    this.applyCommonService.getCareerList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.careerList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * 获取省基础数据
   */
  bindProvinceData(countryId: string) {
    this.organizationService.getProvinceDataForDisplay(countryId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.provinceList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 现居住省份数据
  bindLivingProvinceData(countryId: string) {
    this.organizationService.getProvinceDataForDisplay(countryId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingProvinceList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * 获取个人城市基础数据
   */
  bindCityData(provinceid: string) {
    this.organizationService.getCityDataForDisplay(provinceid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.cityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }


  // 现居住城市数据
  bindLivingCityData(provinceId: string) {
    this.organizationService.getCityDataForDisplay(provinceId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingCityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }


  /**
   * 获取个人社区基础数据
   */
  bindCommunityData(relationid: string) {
    this.organizationService.getCommunityDataForDisplay(relationid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.communityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 现居住社区数据
  bindLivingCommunityData(cityId: string) {
    this.organizationService.getCommunityDataForDisplay(cityId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingCommunityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 选择申请人所在省
  selectIndexOfProvince(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindCityData(e.selectedItem.provinceId);
      this.communityList = [];
    }
  }

  /**
     * 选择个人所在城市
     * 根据选择的城市id绑定城市下的社区数据
     */
  selectIndexOfCity(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindCommunityData(e.selectedItem.cityId);
    }
  }



  // 清除现下拉选择的省市区数据
  clearCountryShipAddressData() {
    this.applyBasicInfo.provinceName = '';
    this.applyBasicInfo.cityName = '';
    this.applyBasicInfo.communityName = '';
  }
  clearLivingAddressData() {
    this.applyBasicInfo.livingProvinceName = '';
    this.applyBasicInfo.livingCityName = '';
    this.applyBasicInfo.livingCommunityName = '';
  }




  /**
   * 选择省、市、加载下级目录
   */
  selectIndexOfLivingProvince(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindLivingCityData(e.selectedItem.provinceId);
      //  this.bindLivingCommunityData(e.selectedItem.provinceId);
      this.applyBasicInfo.livingCommunityName = null;
      this.livingCommunityList = [];
    }
  }

  selectIndexOfLivingCity(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindLivingCommunityData(e.selectedItem.cityId);
    }
  }

  formatDate() {
    if (this.applyInfo.applyTime !== null && typeof (this.applyInfo.applyTime) !== 'undefined') {
      this.applyInfo.applyTime = this.dateFormatHelper.RestURLEndDateTimeFormat(this.applyInfo.applyTime);
    }
    if (this.applyBasicInfo.credentialsIssueDate !== null && typeof (this.applyBasicInfo.credentialsIssueDate) !== 'undefined') {
      this.applyBasicInfo.credentialsIssueDate = this.dateFormatHelper.RestURLEndDateTimeFormat(
        this.applyBasicInfo.credentialsIssueDate);
      this.MincredentialsIssueDate = this.dateFormatHelper.RestURLEndDateTimeFormat(this.MincredentialsIssueDate);
    }
    if (this.applyBasicInfo.dateOfBirth !== null && typeof (this.applyBasicInfo.dateOfBirth) !== 'undefined') {
      this.applyBasicInfo.dateOfBirth = this.dateFormatHelper.RestURLEndDateTimeFormat(this.applyBasicInfo.dateOfBirth);
    }
  }


  /**
   * 政府申请状态设置，根据分析结果
   * 1.有犯罪记录：状态为待审核
   * 2.无犯罪记录：状态为待打印
   * 3.其他情况：待审核
   */
  setApplyInfoStatus() {
    if (this.applyInfo.analysisResultId === '1' || this.applyInfo.analysisResultId === '3') {
      this.applyInfo.applyStatusId = '3';
    } else if (this.applyInfo.analysisResultId === '2') {
      this.applyInfo.applyStatusId = '4';
    }
  }

  /**
   * 最终的保存方法
   */
  saveApplyGovermentInfo(attchmentList) {
    this.applyInfo.deliveryReceiptNumbr = this.encodingRulesService.deliveryReceiptNumber(this.applyBasicInfo.certificateNumber);
    // (2)设置录入人员
    this.applyInfo.enteringPersonName = this.userInfo.personName;
    this.applyInfo.enteringPersonId = this.userInfo.orgPersonId;
    this.applyInfo.analysisPersonName = this.userInfo.personName;
    this.applyInfo.analysisPersonId = this.userInfo.orgPersonId;


    // (3)调用服务，保存3类基本信息
    this.applyInfo.applyTypeId = '2';
    this.setApplyInfoStatus();
    // 保存的模型
    this.certificateApplyInfo = new CertificateApplyInfo(
      this.applyBasicInfo,
      this.applyInfo,
      // this.attachmentList,
      attchmentList,
      this.applyAndCriminalRelation
    );
    // 调用服务保存数据
    this.applyGovermentService.saveCertificateApplyInfo(this.certificateApplyInfo).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.isSaveSucess = true;
        this.applyInfoNew = result;
        this.completeInfo = result;
        this.isHasCrimeRecord = this.applyInfoNew.crimeRecord;
        this.wizard.next();
      } else {
        this.isSaveSucess = false;
      }
      if (this.isSaveSucess) {
        this.submitDisabled = true;
        this.popupOperationInfo(this.isSaveSucess, this.isHasCrimeRecord, this.isCrimed);
        // (4)保存成功,重载当前页面,清空所有数据
        this.popupImageVisible = false;
        this.loadingVisible = false;
        this.imageSrc = '';
        this.clearCharacterCount();
        this.uploader.clearQueue();
        this.showFormShadow = false;
        this.applyInfo.priority = '0';
        if (this.applyBasicInfo.dateOfBirth !== null && this.applyBasicInfo.dateOfBirth !== undefined) {
          this.applyBasicInfo.dateOfBirth = new Date(this.applyBasicInfo.dateOfBirth);
        };
        if (this.applyBasicInfo.credentialsIssueDate !== null && this.applyBasicInfo.credentialsIssueDate !== undefined) {
          this.applyBasicInfo.credentialsIssueDate = new Date(this.applyBasicInfo.credentialsIssueDate);
          this.MincredentialsIssueDate = this.applyBasicInfo.dateOfBirth;
        };

        // 保存成功日志记录
        try {
          this.operationLog.level = 'info';
          this.operationLog.action = 'ADD';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'add apply-government success';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }


      } else {
        this.loadingVisible = false;
        this.popupOperationInfo(this.isSaveSucess, this.isHasCrimeRecord, this.isCrimed);
        this.submitDisabled = false;
        // 保存失败日志记录
        try {
          this.operationLog.level = 'error';
          this.operationLog.action = 'ADD';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'add apply-government failed';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }

      }
    }).catch(e => {
      this.isSaveSucess = false;
      this.reRntryVisible = false;
      this.loadingVisible = false;
      this.popupOperationInfo(this.isSaveSucess, this.isHasCrimeRecord, this.isCrimed);
      console.log(e);
    });
  }



  // 提交方法  通过验证后才可进行保存操作
  onSubmit(form, e) {
    if (this.utilHelper.AssertEqualNull(this.applyInfo.analysisResultId)) {
      // 是否选择录入意见
      this.toastr.error(this.getTranslateName('analysisResult is required'));
      return;
    }
    let flag = this.checkNoticeAndAnalysis(form);
    if (e !== null && e !== undefined) {
      let isValid = e.validationGroup.validate().isValid;
      if (isValid) {
        this.firstTabActive = false;
        if (flag === true) {
          // 提交按钮禁用
          this.submitDisabled = true;
          this.SaveAllEnterInfo();
        } else {
          this.submitDisabled = false;
        }
      } else {
        this.submitDisabled = false;
        this.isNoTouch = false;
        this.validateForms(e);
      }
    }
  }


  // 附件上传失败操作
  uploadError(item) {
    if (this.utilHelper.AssertNotNull(item)) {
      let name = item.name.substring(item.name.lastIndexOf('\\') + 1, item.name.length);
      this.reRntryVisible = false;
      this.isNoTouch = true;
      this.loadingVisible = false;
      this.toastr.toastrConfig.maxOpened = 5;
      this.toastr.toastrConfig.timeOut = 5000;
      this.toastr.error(this.getTranslateName('Server Inner Exception') + name + this.getTranslateName('attachment upload failed'));
    }
  }

  /**
   * 获取回填的对象
   */
  getapplyBasicInfo(e) {
    this.applyBasicInfo = e;
  }


  /**
   * 检测是否有公告和分析结果
   */
  checkNoticeAndAnalysis(form): boolean {
    let seletedData = this.applyGovermentAnalysisResultComponent.getCheckBoxSelectedData();
    if (this.utilHelper.AssertNotNull(seletedData)) {
      this.applyAndCriminalRelation.applyInfoId = this.applyInfo.applyId;
      this.applyAndCriminalRelation.criminalId = seletedData;
    } else {
      this.applyAndCriminalRelation.applyInfoId = null;
      this.applyAndCriminalRelation.criminalId = null;
    }
    let flag: boolean;
    this.translateService.get(['please check the crime notice', 'please do not check the crime notice']).subscribe(value => {
      if (this.applyInfo.analysisResultId === '1' && this.utilHelper.AssertEqualNull(this.applyAndCriminalRelation.criminalId)) {
        // this.crimeGrid.select
        // this.noticeWarnming = true;
        this.isAnalysised = true;
        this.showAnalysised = true;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(value['please check the crime notice']);
        flag = false;
      } else if (this.applyInfo.analysisResultId === '2' && this.utilHelper.AssertNotNull(this.applyAndCriminalRelation.criminalId)) {
        // this.noticeWarnming = true;
        this.isAnalysised = true;
        this.showAnalysised = true;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(value['please do not check the crime notice']);
        flag = false;
      } else {
        this.isAnalysised = true;
        this.showAnalysised = true;
        this.isRejected = true;
        flag = true;
      }
    });
    return flag;
  }
  /**
  * select分析结果选中内容事件
  *
  */
  public selectIndenxOfAnalysisResult(e) {
    if (e.value != null && e.value !== undefined) {
      this.isOther = false;
      if (e.value === '1') {
        this.isCrimed = true;
      };
      if (e.value === '2') {
        this.isCrimed = false;
      };
    }
  }



  // 提交验证 弹框显示未通过验证消息
  validateForms(params: any) {
    this.brokenRules = [];
    if (params !== null && params !== undefined) {
      let result = params.validationGroup.validate();
      if (this.seleTab === true) {
        this.translateService
          .get(['govermentProcess is required', 'applyPurpose is required', 'applyOtherPurposeReason is required'])
          .subscribe(value => {
            result.brokenRules.forEach((item, index) => {
              if (item.message === value['govermentProcess is required'] ||
                item.message === value['applyPurpose is required'] ||
                item.message === value['applyOtherPurposeReason is required']
              ) {
                this.brokenRules.push(item);
              }
            });
          });

      } else {
        this.brokenRules = result.brokenRules;
      }
      this.validateVisible = true;
    }
  }

  /**
* 刷新路由
*/
  async refreshRouter() {
    let nowUrl = this.router.url;
    await this.router.navigateByUrl('');
    this.router.navigate([nowUrl]);
  }

  // 录入下一条
  enterNextItem(form: NgForm, e) {
    this.applyAndCriminalRelation.criminalId = null;
    this.initData();
    this.firstTabActive = true;
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();

    this.applyBasicInfo.dateOfBirth = null;
    this.applyBasicInfo.credentialsIssueDate = null;

    this.applyInfo.applyCenterId = this.userInfo.centerCode;
    this.applyInfo.applyCenterName = this.userInfo.centerCodeName;
    this.applyInfo.applyCenterProvince = this.userInfo.applyCenterProvince;

    this.applyInfo.priority = '0';

    this.showFormShadow = true;
    this.showAnalysis = true;
    this.showPrint = false;
    this.showInputNext = false;
    this.uploadFileButton = false;
    this.isReason = false;

    this.uploadFileList = [];
    this.attachmentList = [];
    this.storeFileID = [];
    this.crmsAttchment.clearQueue();
    this.refreshRouter();
  }

  // 保存
  SaveAllEnterInfo() {
    // 1.出现loading效果
    this.showLoadPanel();
    this.formatDate();
    if (this.crmsAttchment.imageFileList.length > 0) {
      this.crmsAttchment.upLoadFile();
      this.submitBtn = true;
    } else {
      // 无附件情况
      this.saveApplyGovermentInfo(null);
      this.submitBtn = true;
    }
  };



  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }




  /**
   * 打印证书按钮点击
   *
   */

  async printCertificate() {
    try {
      this.toastr.clear();
      this.certificateInfo = this.applyInfoNew;
      await this.CerPrintComponent.saveInitCertificateInfo(this.certificateInfo);
      await this.CerPrintComponent.getCertificatePrintInfo(this.certificateInfo);
    } catch (error) {
      console.log(error);
    }
  }

  /***
  * 路由绑定header路径
  */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    if (parentUrl !== null && parentUrl !== undefined && childrenUrl !== null && childrenUrl !== undefined) {
      this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'apply-government';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date, 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }


  // 点击犯罪嫌疑人列表时 查看公告详情
  lookNoticeList(e) {
    this.popupNoticeVisible = true;
    this.getNoticeLtst(e);
  }
  /**
      获取当前列表数据
   */
  async getNoticeLtst(crimePersonId: string) {
    try {
      let result = await this.applyGovermentService.findNoticeList(crimePersonId);
      if (this.utilHelper.AssertNotNull(result)) {
        this.noticeList = result.noticeInfoList;
      }
    } catch (error) {
      console.log(error);
    }

  }

  // tab切换校验
  selectTab() {
    if (this.utilHelper.AssertEqualNull(this.applyInfo.govermentProcess)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.applyInfo.applyPurposeId)) {
      this.seleTab = true;
      return true;
    } else if (this.applyInfo.applyPurposeId === '5') {
      if (this.utilHelper.AssertEqualNull(this.applyInfo.otherPurposeReason)) {
        this.seleTab = true;
        return true;
      }
    }
    this.seleTab = false;
    return false;
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
      this.analysisDisabled = true;
      this.attchmentControllObj.uploadFile = false;
      this.isEdit = true;
      this.bindNoticesByIDAndName();
    } else if (result.isValid === true && flag === false) { // 普通验证操作
      this.wizard.next();
    } else {
      this.toastr.clear();
      this.validateVisible = true;
    }
  }

  /**
 * @param e 点击下一步表单验证
 */
  nextEventValidata(step) {
    if (step === 0) {
      this.wizard.next(); // 直接进行下一步
    } else if (step === 1) {  // 第二步
      let result = this.applyGovermentInfo.validator.first.instance.validate(); // 公告基本信息
      this.stepValidateForms(result, false);
    } else if (step === 2) { // 第四步
      this.wizard.next();
    } else if (step === 3) { // 第四步
      this.wizard.next();
    }
  }

  /**
    * 录入意见的点击事件
    * @param num
    */
  enterOption(num) {
    if (num === 1) {
      this.applyInfo.analysisResultId = '1';
    } else {
      this.applyInfo.analysisResultId = '2';
    }
  }
}
