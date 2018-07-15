import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { ActivatedRoute, Router } from '@angular/router';
// import { FileUploader } from 'ng2-file-upload';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { confirm } from 'devextreme/ui/dialog';
import * as ip from 'internal-ip';

import { ApplyGovermentService, MinImg } from '../apply-goverment.service';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { ConfigService, EventAggregator, LocalStorageService, DateFormatHelper } from '../../../core';
import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../../model/common/AttachmentInfo';
import { ApplyAndCriminalRelation } from '../../../model/certificate-apply/ApplyAndCriminalRelation';
import { EnumInfo } from '../../../enum';
import { ProvinceInfo } from '../../../model/organization/ProvinceInfo';
import { CityInfo } from '../../../model/organization/cityinfo';
import { CommunityInfo } from '../../../model/organization/communityinfo';
import { CertificateApplyInfo } from '../../../model/certificate-apply/CertificateApplyInfo';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';
import { UserInfo } from '../../../model/auth/userinfo';
import { UtilHelper, LoggerRecordService } from '../../../core';
import { OperationLog } from '../../../model/logs/operationLog';
import { CrimeNoticeQuery } from '../../../model/crime-integrated-business/CrimeNoticeQuery';
import { ApplyPersonQuery } from '../../../model/certificate-apply/ApplyPersonQuery';

// import { ImageFile } from '../../apply-person/apply-person.service';
import { ApplyGovermentInfoComponent } from '../apply-info/apply-govermentInfo.component';
import { ApplyGovermentBasicInfoComponent } from '../basic-info/basic-info.component';
import { ApplyGovermentAnalysisResultComponent } from '../analysis-result/analysis-result.component';
import { SortorderAlgorithmService } from '../../../+crms-common/services/sortorder-algorithm.service';
import { OrganizationService } from '../../../+crms-common/services/organization-data.service';
import { CrmsAttchmentComponent } from '../../../+crms-common/components/crms-attchment/crms-attchment.component';
import { CrimeAndNoticeService } from '../../../+crms-common/services/crime-notice.service';
import { WizardComponent } from '../../../shared/components/wizard/wizard.component';
@Component({
  templateUrl: './apply-analysisGovernmentDetail.component.html',
  providers: [EnumInfo, DateFormatHelper, OrganizationService, ApplyGovermentService, ApplyCommonService, CrimeAndNoticeService]
})
export class ApplyAnalysisGovermentDetailComponent implements OnInit {
  @ViewChild('grids')
  grids: DxDataGridComponent;
  @ViewChild('crimeGrid')
  crimeGrid: DxDataGridComponent;
  @ViewChild(ApplyGovermentInfoComponent) applyGovermentInfo: ApplyGovermentInfoComponent;
  @ViewChild(ApplyGovermentBasicInfoComponent) applyGovermentBasicInfo: ApplyGovermentBasicInfoComponent;
  @ViewChild(CrmsAttchmentComponent) crmsAttchment: CrmsAttchmentComponent;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  @ViewChild(ApplyGovermentAnalysisResultComponent) applyGovermentAnalysisResultComponent: ApplyGovermentAnalysisResultComponent;
  // 附件缩略图src
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
  isDataBackFill: boolean = false;
  /**
   * 申请目的
   * @type {any[]}
   * @memberof ApplyGovermentComponent
   */
  applyPurposeList: any[];
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
  // 分析按钮是否显示
  showAnalysis: boolean = true;
  // 提交分析按钮是否显示
  showAnalysised: boolean = false;

  firstTabActive: boolean = true;
  /**
   * 移除所有文件tooltip
   * removeAllFileTolVisible
   */
  removeAllFileTolVisible: boolean = false;
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
   *人口信息name
   */
  applyPersonName: string;
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
  /**
   * 性别
   */
  genderEnum: any[];
  /**
   * 婚姻状态
   */
  // marriageEnum: any[];
  // marriageid: string;
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
  // 保存后禁用提交按钮
  isNoTouch: boolean = true;

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
  routerFlag: string;
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
  governmentBox: boolean = true;
  personBox: boolean = false;
  isCheckedDisabled: boolean = false;
  /**
 * 政府申请勾选的犯罪人 驳回时使用
 */
  crimePersonInfo: CrimePersonInfo;
  // 提交分析结果是否可用
  submitDisabled: boolean = false;
  // 当前选择的犯罪嫌疑人
  hasSelectCrimePersonId: string;
  showInfoIndex: number = 1;
  completeInfo: any;
  submitResult: string;
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
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
    private sortorderAlgorithmService: SortorderAlgorithmService,
    private logger: LoggerRecordService,
  ) {
    this.operationLog = new OperationLog();
    this.crimeNoticeQuery = new CrimeNoticeQuery();
    this.applyPersonQuery = new ApplyPersonQuery();
    this.crimePersonInfo = new CrimePersonInfo();
    this.applyInfo = new ApplyInfo();
    this.canDeactivateInfoOne = {
      agentIdNumber: undefined,
      agentIdType: undefined,
      // applyCenterId: this.applyInfo.applyCenterId,
      // applyCenterName: this.applyInfo.applyCenterName,
      applyDescription: undefined,
      applyPersonType: undefined,
      applyPurposeId: undefined,
      note: undefined,
      otherPurposeReason: undefined,
      // priority: this.applyInfo.priority
    };
    this.canDeactivateInfoTwo = new ApplyBasicInfo();
    this.applyAndCriminalRelation = new ApplyAndCriminalRelation();
    this.attchmentControllObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
    this.toastr.toastrConfig.timeOut = 3000;
  }

  ngOnInit(): void {
    this.initEvent();
    this.initData();
    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;
    this.applyPersonQuery.pages = 0;
    this.applyPersonQuery.pageSize = 5;
  }
  // 路由守卫判断表单是否发生变化
  canDeactivate(): Observable<boolean> | boolean {
    let tip1 = this.getTranslateName('Are you sure to give up edit');
    let tip2 = this.getTranslateName('Hint');
    let x;
    let y;
    // 判断是否是传了数据过来的页面
    if (this.utilHelper.AssertNotNull(this.routerFlag)) {
      return true;
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
      for (y in this.applyBasicInfo) {
        if (this.applyBasicInfo[y] !== this.canDeactivateInfoTwo[y]) {
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

  // 初始化事件订阅
  initEvent() {
    // 获取路由导航传递过来的参数
    this.route.params.subscribe(data => {
      if (this.utilHelper.AssertNotNull(data) && JSON.stringify(data) !== '{}') {
        this.routeApplyId = data.applyId;
        this.routeApplyStatusId = data.applyStatusId;
        this.routeApplyStatusName = data.applyStatusName;
        this.routerFlag = data.flag;
        // 路由导航参数加载申请数据
        this.bindApplyInfoData(this.routeApplyId);
      }

      /**
     * 判断是否从历史记录页面跳转
     */
      if (data.historyFlag || data.managementFlag) {
        this.isNoTouch = true;
        this.historyFlag = true;
        this.showPrint = false;
      }

      /**
       * 判断是否从未完成页面进来
       */
      if (this.routerFlag === 'apply-incomplete') {
        this.isCheckedDisabled = true;
      }

    });
  }

  // 返回

  async goBack() {
    if (this.route.params['value'].historyFlag === '1') {
      this.router.navigate(['/crms-system/crime-certify/apply-history']);
    } else if (this.route.params['value'].managementFlag === '1') {
      this.router.navigate(['/crms-system/crime-certify/certificate-management']);

    } else if (this.routerFlag === 'apply-goverment-record') {
      this.router.navigate(['/crms-system/crime-certify/apply-goverment-record']);

    } else if (this.routerFlag === 'apply-reject') {
      this.router.navigate(['/crms-system/crime-certify/apply-reject']);

    } else if (this.routerFlag === 'apply-incomplete') {
      this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);
    }
  }

  // 初始化数据
  initData() {
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.attachmentInfo = new AttachmentInfo();
    this.genderEnum = this.enumInfo.getGenderEnum;
    // this.marriageEnum = this.enumInfo.getMarriageEnum;
    this.countryOfCitizenshipEnum = this.enumInfo.getCountryOfCitizenshipEnum;
    // 分析结果
    this.analysisResultEnum = this.enumInfo.getAnalysisResult;
    // 获取登录人员的信息
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;
    this.centerCodeName = this.userInfo.centerCodeName;
    this.applyInfo.applyCenterId = this.userInfo.centerCode;
    this.applyInfo.applyCenterName = this.userInfo.centerCodeName;
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;
    // 初始化证书申请基础数据
    // this.bindApplyPurposeData();
    // 页面已经注释掉优先级的调用
    // this.bindApplyPriorityData();
    // this.configService.get('countryId').then(result => {
    //     if (this.utilHelper.AssertNotNull(result)) {
    //         this.countryId = result;
    //         this.bindProvinceData(this.countryId);
    //         this.bindLivingProvinceData(this.countryId);
    //     }
    // }).catch(e => {
    //     console.log(e);
    // });
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

    this.bindRoutUrl('CrimeCertifyManagement', 'GovernmentApplication');

    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-goverment');
    this.applyInfo.priority = '0';
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
  }



  clearCharacterCount() {
    this.applyBasicDetaileAddressLength = 0;
    this.applyDescriptionLength = 0;
    this.otherFeatureLength = 0;
  }


  // 通过路由传递过来的参数获取需要查看的消息
  bindApplyInfoData(applyId: string) {
    if (applyId !== null && applyId !== undefined && applyId !== '') {
      this.applyCommonService.getApplyInfoByApplyID(applyId)
        .then(result => {
          if (this.utilHelper.AssertNotNull(result)) {
            this.applyInfo = result.applyInfo;
            this.applyBasicInfo = result.applyBasicInfo;
            this.attachmentList = result.attachmentInfoList;
            this.rejectReason = result.applyInfo.auditRejectReason;
            // 判断之前勾选的犯罪嫌疑人是否有效 默认添加只加入有效的犯罪的嫌疑人
            if (this.utilHelper.AssertNotNull(result.crimePersonInfo)) {
              this.crimePersonInfo = result.crimePersonInfo;
              if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.crimePersonInfo.isActive === '1') {
                this.hasSelectCrimePersonId = this.crimePersonInfo.crimePersonId;
              }
              // 判断当前的犯罪嫌疑人为有效时 加入到关系列表中
              if (this.crimePersonInfo.isActive === '1') {
                this.applyAndCriminalRelation.applyInfoId = this.applyInfo.applyId;
                this.applyAndCriminalRelation.criminalId = this.crimePersonInfo.crimePersonId;
              }

            }
          }
          // 时间转化
          this.applyDataHandler(this.applyBasicInfo.dateOfBirth, this.applyBasicInfo.credentialsIssueDate);
          this.translateService.get(['this record was rejected and should be re-entryed', 'this record was',
            'record', 'can not be edited', 'can print certificate']).subscribe(value => {
              this.firstTabActive = false;
              if (this.routeApplyStatusId === '1') { // 分析中
                this.isBack = false;
                this.isEdit = true;
                this.isRejected = false;
                this.showAnalysised = true;
                this.isNoTouch = false;
                this.showAnalysis = false;
                this.uploadFileButton = true; // 隐藏附件上传按钮
                this.bindNoticesByName();
              } else if (this.routeApplyStatusId === '2') { // 审核中
                this.isBack = false;
                this.isSelect = true;
                this.showAnalysis = false;
                this.showAnalysised = false;
                this.isEdit = true;
                this.bindNoticesByName();
              } else if (this.routeApplyStatusId === '3') { // 待打印
                this.isBack = false;
                this.isSelect = true;
                this.showAnalysis = false;
                this.showPrint = true;
                this.isEdit = true;
                this.showAnalysised = false;
                this.bindNoticesByName();
              } else if (this.routeApplyStatusId === '4') {
                this.isBack = false;
                this.isSelect = true;
                this.showAnalysis = false;
                this.showPrint = false;
                this.isEdit = true;
                this.bindNoticesByName();
              } else {
                this.isBack = false;
                this.isEdit = true;
                this.showPrint = false;
                this.showAnalysis = false;
                this.uploadFileButton = true;
              }
            });
          // 从已办理业务记录跳转日志记录
          this.operationLog.level = 'info';
          this.operationLog.action = 'QUERY';
          // 日志记录操作员的name 和 Id
          this.operationLog.operator = this.userInfo.userName;
          this.operationLog.operatorId = this.userInfo.orgPersonId;
          this.operationLog.actionDesc = 'navigated from government or reanalysis record and query apply-data';
        }).catch(error => {
          console.log(error);
        });
    }
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
  /**
   * 勾选犯罪嫌疑人列表时 此时要更新选中的罪犯列表
   */
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




  // 数据回填中的日期格式和字符统计转换
  applyDataHandler(dateOfBirth, credentialsIssueDate) {
    if (dateOfBirth !== null && dateOfBirth !== undefined) {
      this.applyBasicInfo.dateOfBirth = new Date(dateOfBirth);
    }
    if (credentialsIssueDate !== null && credentialsIssueDate !== undefined) {
      this.applyBasicInfo.credentialsIssueDate = new Date(credentialsIssueDate);
    }
    // 回填后更新文本域统计字符
    if (this.applyBasicInfo.otherFeature != null && this.applyBasicInfo.otherFeature !== '' &&
      this.applyBasicInfo.otherFeature !== undefined) {

      this.otherFeatureLength = this.applyBasicInfo.otherFeature.length;
    }
    if (this.applyBasicInfo.description != null && this.applyBasicInfo.description !== '' &&
      this.applyBasicInfo.description !== undefined) {

      this.applyDescriptionLength = this.applyBasicInfo.description.length;
    }
    if (this.applyBasicInfo.detailAddress != null && this.applyBasicInfo.detailAddress !== '' &&
      this.applyBasicInfo.detailAddress !== undefined) {

      this.applyBasicDetaileAddressLength = this.applyBasicInfo.detailAddress.length;
    }
    if (this.applyInfo.auditRejectReason != null && this.applyInfo.auditRejectReason !== '' &&
      this.applyInfo.auditRejectReason !== undefined) {

      this.applyRejectReasonLength = this.applyInfo.auditRejectReason.length;
    }
  }



  /**
   * 显示loading时的操作
   */
  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 1500);
  }

  /**
      * 弹出操作结果提示信息
      * @param isSucess
      */
  popupOperationInfo(isSucess: boolean) {
    this.translateService.get(['save success and has no crime record',
      'save success and need audit', 'analysis failure']).subscribe(value => {
        if (isSucess && this.utilHelper.AssertEqualNull(this.applyAndCriminalRelation.criminalId)
          && this.criminalInfo.length === 0) {
          this.toastr.clear();
          this.toastr.success(
            value['save success and has no crime record']
          );
          this.submitResult = value['save success and has no crime record'];
          /*    if (this.routerFlag === 'apply-incomplete') {
               this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);
             }
             if (this.routerFlag === 'apply-reject') {
               this.router.navigate(['/crms-system/crime-certify/apply-reject']);
             } */
          return;
        } else if (isSucess && this.utilHelper.AssertEqualNull(this.applyAndCriminalRelation.criminalId)
          && this.criminalInfo.length > 0) {
          this.toastr.clear();
          this.toastr.success(
            value['save success and need audit']
          );
          this.submitResult = value['save success and need audit'];
          /* if (this.routerFlag === 'apply-incomplete') {
            this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);
          }
          if (this.routerFlag === 'apply-reject') {
            this.router.navigate(['/crms-system/crime-certify/apply-reject']);
          } */
        }
        if (isSucess && this.utilHelper.AssertNotNull(this.applyAndCriminalRelation.criminalId)) {

          this.toastr.clear();
          this.toastr.success(
            value['save success and need audit']
          );
          this.submitResult = value['save success and need audit'];
          /*  if (this.routerFlag === 'apply-incomplete') {
             this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);
           }
           if (this.routerFlag === 'apply-reject') {
             this.router.navigate(['/crms-system/crime-certify/apply-reject']);
           } */
        }
        if (!isSucess) {
          this.isEdit = false;
          this.isRejected = true;
          this.isNoTouch = false;
          this.toastr.clear();
          this.toastr.error(
            value['analysis failure']
          );
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
  // /**
  //  * 获取申请目的基础数据
  //  */
  // bindApplyPurposeData() {
  //     this.applyCommonService.getApplyPurposeList().then(result => {
  //         this.applyPurposeList = result;
  //     }).catch(err => {
  //         console.log(err);
  //     });
  // }

  // // 获取申请优先级
  // bindApplyPriorityData() {
  //     this.applyCommonService.getApplyPriorityList().then(result => {
  //         this.priorityList = result;
  //     }).catch(err => {
  //         console.log(err);
  //     });
  // }
  selectIndenxOfAnalysisResult() {

  }

  // /**
  //  * 获取省基础数据
  //  */
  // bindProvinceData(countryId: string) {
  //     this.organizationService.getProvinceDataForDisplay(countryId).then(result => {
  //         if (this.utilHelper.AssertNotNull(result)) {
  //             this.provinceList = result;
  //         }
  //     }).catch(err => {
  //         console.log(err);
  //     });
  // }

  // // 现居住省份数据
  // bindLivingProvinceData(countryId: string) {
  //     this.organizationService.getProvinceDataForDisplay(countryId).then(result => {
  //         if (this.utilHelper.AssertNotNull(result)) {
  //             this.livingProvinceList = result;
  //         }
  //     }).catch(err => {
  //         console.log(err);
  //     });
  // }
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
 * 获取个人城市基础数据
 */
  private bindCityData(provinceid: string) {
    this.organizationService.getCityDataForDisplay(provinceid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.cityList = result;
        console.log(result);
      }
    }).catch(err => {
      console.log(err);
    });
  }


  // 选择申请人所在省
  public selectIndexOfProvince(e) {
    if (e !== null && e !== undefined) {
      this.bindCityData(e.selectedItem.provinceId);
      console.log(e.selectedItem.provinceId);
      this.communityList = [];
    }
  }


  /**
     * 选择个人所在城市
     * 根据选择的城市id绑定城市下的社区数据
     */
  public selectIndexOfCity(e) {
    if (e !== null && e !== undefined) {
      this.bindCommunityData(e.selectedItem.cityId);
    }
  }

  /**
* 获取个人社区基础数据
*/
  public bindCommunityData(relationid: string) {
    this.organizationService.getCommunityDataForDisplay(relationid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.communityList = result;
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
* 选择省、市、加载下级目录
*/
  selectIndexOfLivingProvince(e) {
    if (e !== null && e !== undefined) {
      this.bindLivingCityData(e.selectedItem.provinceId);
      //  this.bindLivingCommunityData(e.selectedItem.provinceId);
      this.applyBasicInfo.livingCommunityName = null;
    }
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

  selectIndexOfLivingCity(e) {
    if (e !== null && e !== undefined) {
      this.bindLivingCommunityData(e.selectedItem.cityId);
    }
  }

  formatDate() {
    if (this.applyInfo.applyTime !== null && typeof (this.applyInfo.applyTime) !== 'undefined') {
      this.applyInfo.applyTime = this.utilHelper.format(this.applyInfo.applyTime, 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.applyBasicInfo.credentialsIssueDate !== null && typeof (this.applyBasicInfo.credentialsIssueDate) !== 'undefined') {
      this.applyBasicInfo.credentialsIssueDate = this.utilHelper.format(
        this.applyBasicInfo.credentialsIssueDate, 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.applyBasicInfo.dateOfBirth !== null && typeof (this.applyBasicInfo.dateOfBirth) !== 'undefined') {
      this.applyBasicInfo.dateOfBirth = this.utilHelper.format(this.applyBasicInfo.dateOfBirth, 'yyyy-MM-dd HH:mm:ss');
    }
  }


  updateApplyGovermentAnalysis() {
    this.showLoadPanel();
    // (2)设置录入人员
    this.applyInfo.enteringPersonName = this.userInfo.personName;
    this.applyInfo.enteringPersonId = this.userInfo.orgPersonId;
    this.applyInfo.analysisPersonName = this.userInfo.personName;
    this.applyInfo.analysisPersonId = this.userInfo.orgPersonId;
    // (3)调用服务，保存3类基本信息
    this.applyInfo.applyTypeId = '2';
    this.setApplyInfoStatus();
    this.formatDate();
    // this.attachmentList = this.crmsAttchment.upLoadFile();
    this.certificateApplyInfo = new CertificateApplyInfo(
      this.applyBasicInfo,
      this.applyInfo,
      this.attachmentList,
      this.applyAndCriminalRelation
    );
    this.applyGovermentService.updateCertificateApplyInfo(this.certificateApplyInfo).then(result => {
      if (this.utilHelper.AssertNotNull(result) && result.success === true) {
        this.isSaveSucess = result.success;
        this.isUpdate = result;
      } else {
        this.isSaveSucess = false;
      }
      if (this.isSaveSucess) {
        this.wizard.next();
        this.completeInfo = result.data;
        this.popupOperationInfo(this.isSaveSucess);
        // (4)保存成功,重载当前页面,清空所有数据
        this.popupImageVisible = false;
        this.imageSrc = '';
        this.uploadFileList = [];
        this.clearCharacterCount();
        this.applyInfo.priority = '0';
        if (this.applyBasicInfo.dateOfBirth !== null && this.applyBasicInfo.dateOfBirth !== undefined) {
          this.applyBasicInfo.dateOfBirth = new Date(this.applyBasicInfo.dateOfBirth);
        };
        if (this.applyBasicInfo.credentialsIssueDate !== null && this.applyBasicInfo.credentialsIssueDate !== undefined) {
          this.applyBasicInfo.credentialsIssueDate = new Date(this.applyBasicInfo.credentialsIssueDate);
        };

        // 更新成功日志记录
        try {
          this.operationLog.level = 'info';
          this.operationLog.action = 'UPDATE';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'update apply-reject success';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }
        this.submitDisabled = true;
      } else {
        this.submitDisabled = false;
        this.isEdit = false;
        this.isRejected = true;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(this.getTranslateName('save failure'));

        // 更新成功日志记录
        try {
          this.operationLog.level = 'error';
          this.operationLog.action = 'UPDATE';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'update apply-reject failed';
          this.logRecord();
        } catch (error) {
          console.log(error);
        }

      }
    }).catch(err => {
      this.submitDisabled = false;
      this.loadingVisible = false;
      this.popupOperationInfo(this.isSaveSucess);
      console.log(err);
    });
  }

  // 提交方法  通过验证后才可进行保存操作
  onSubmit() {
    this.submitDisabled = true;
    if (this.utilHelper.AssertEqualNull(this.applyInfo.analysisResultId)) {
      this.toastr.error(this.getTranslateName('analysisResult is required'));
      return;
    }
    let flag = this.checkNoticeAndAnalysis();
    this.firstTabActive = false;
    if (flag === true && this.routeApplyStatusId !== '1') {
      this.SaveAllEnterInfo();
    } else if (flag === true && this.routeApplyStatusId === '1') {   // 判断是否驳回
      this.updateApplyGovermentAnalysis();
    }
  }

  /**
   * 检测是否有公告和分析结果
   * 分析结果为有犯罪记录时 要判断是勾选了有效的犯罪嫌疑人
   */
  checkNoticeAndAnalysis(): boolean {
    let seletedData = this.applyGovermentAnalysisResultComponent.getCheckBoxSelectedData();
    if (this.utilHelper.AssertNotNull(seletedData)) {
      this.applyAndCriminalRelation.applyInfoId = this.applyInfo.applyId;
      this.applyAndCriminalRelation.criminalId = seletedData;
    } else {
      this.applyAndCriminalRelation.applyInfoId = null;
      this.applyAndCriminalRelation.criminalId = null;
    }
    // 将crimPersonInfo 置为空 影响组件 analysis-result
    this.crimePersonInfo = null;
    let flag: boolean;
    this.translateService.get(['please check the crime notice', 'please do not check the crime notice']).subscribe(value => {
      // 有犯罪记录是 测试是否勾选有效的犯罪嫌疑人
      if (this.applyInfo.analysisResultId === '1' && this.utilHelper.AssertEqualNull(this.applyAndCriminalRelation.criminalId)) {
        // this.noticeWarnming = true;
        this.submitDisabled = false;
        this.isAnalysised = true;
        this.showAnalysised = true;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(value['please check the crime notice']);
        flag = false;
      } else if (this.applyInfo.analysisResultId === '2' && this.utilHelper.AssertNotNull(this.applyAndCriminalRelation.criminalId)) {
        // this.noticeWarnming = true;
        this.submitDisabled = false;
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


  // 保存
  SaveAllEnterInfo() {
    // 1.出现loading效果
    this.showLoadPanel();

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
    this.toastr.clear();
    // this.showPrint = false;
    this.certificateInfo = this.applyInfoNew;
  }
  /**
   * 取消打印
   *
   */
  cancelPrint() {
    this.popupVisible = false;
    this.showAnalysis = true;
    this.showPrintButton = true;
  }
  /***
  * 路由绑定header路径
  */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    if (parentUrl !== null && parentUrl !== undefined && childrenUrl !== null && childrenUrl !== undefined) {
      this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }
  }

  showNotice() {
    this.governmentBox = true;
    this.personBox = false;
  }
  showPerson() {
    this.governmentBox = false;
    this.personBox = true;
  }

  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'apply-reject';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date, 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
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
      this.wizard.next();
    } else if (step === 1) {  // 第二步
      this.wizard.next();
    } else if (step === 2) { // 第三步
      this.wizard.next();
    } else if (step === 3) { // 第四步
      this.wizard.next();
    }
  }


  /**
 * 选择其他情况则分析描述为必填
 * '1': 有犯罪记录;
 * '2': 无犯罪记录;
 * @param {any} e
 * @memberof ApplyAnalysisComponent
 */
  enterOption(index) {
    this.applyInfo.analysisResultId = this.analysisResultEnum[index].value;
  }
}
