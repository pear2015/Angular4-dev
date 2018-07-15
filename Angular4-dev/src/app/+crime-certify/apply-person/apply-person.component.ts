import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as ip from 'internal-ip';

import { ConfigService, LocalStorageService, EventAggregator, LoggerRecordService, UtilHelper, DateFormatHelper } from '../../core/';

import { ApplyInfo } from '../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../model/common/AttachmentInfo';
import { CertificateApplyInfo } from '../../model/certificate-apply/CertificateApplyInfo';
import { UserInfo } from '../../model/auth/userinfo';
import { CountryInfo } from '../../model/organization/CountryInfo';
import { ProvinceInfo } from '../../model/organization/ProvinceInfo';
import { CityInfo } from '../../model/organization/cityinfo';
import { CommunityInfo } from '../../model/organization/communityinfo';
import { OperationLog } from '../../model/logs/operationLog';

import { EnumInfo } from '../../enum';
import { CertificatePrintInfo } from '../../model/certificate-apply/CertificatePrintInfo';

import { ApplyPersonService } from './apply-person.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';
import { EncodingRulesService } from '../../+crms-common/services/encoding-rules.service';
import { OrganizationService } from '../../+crms-common/services/organization-data.service';
import { Observable } from 'rxjs/Observable';
import { CrmsAttchmentComponent } from '../../+crms-common/components/crms-attchment/crms-attchment.component';

import { confirm } from 'devextreme/ui/dialog';
// import { SimilarityCalculate } from '../../common/similarity-calculate.service';
import { CertificatePrintComponent } from '../common/components/certificate-print/certificate-print.component';
// import { SortorderAlgorithmService } from '../../common/sortorder-algorithm.service';
import { WizardComponent } from '../../shared/components/wizard/wizard.component';
import { CrmsPersonApplyInfoComponent } from './person-applyInfo/person-applyInfo.component';
import { CrmsPersonApplyBasicInfoComponent } from './person-applyBasicInfo/person-applyBasicInfo.component';


@Component({
  templateUrl: './apply-person.component.html',
  providers: [ApplyPersonService, ApplyCommonService, OrganizationService, DateFormatHelper, EnumInfo],
})
export class ApplyPersonComponent implements OnInit {
  reRntryVisible: boolean = true;

  @ViewChild(DxDataGridComponent) personInfoGrids: DxDataGridComponent;
  @ViewChild(CrmsAttchmentComponent) crmsAttchment: CrmsAttchmentComponent;
  @ViewChild(WizardComponent) wizard: WizardComponent;
  @ViewChild(CertificatePrintComponent)
  CerPrintComponent: CertificatePrintComponent;
  @ViewChild(CrmsPersonApplyInfoComponent) crmsPersonApplyInfo: CrmsPersonApplyInfoComponent;
  @ViewChild(CrmsPersonApplyBasicInfoComponent) crmsPersonApplyBasicInfo: CrmsPersonApplyBasicInfoComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  now: Date = new Date();
  /**
   * 中心编码
   * 中心编码名称
   */
  centerCodeName: string;
  centerName: string;


  /**
   * 1.证书申请基本信息
   * 2.证书申请个人基本信息
   * 3.证书申请附件信息
   */
  applyInfo: ApplyInfo;
  applyBasicInfo: ApplyBasicInfo;
  attachmentInfo: AttachmentInfo;
  attachmentList: AttachmentInfo[] = [];
  certificateApplyInfo: CertificateApplyInfo;
  userInfo: UserInfo = null;

  certificateInfo: any;
  certificatePrintInfo: CertificatePrintInfo;



  /**
   * 组织机构列表
   * 国家、省、市、社区
   * 现居住省、市、社区
   */
  countryList: CountryInfo[] = [];
  provinceList: ProvinceInfo[] = [];
  cityList: CityInfo[] = [];
  communityList: CommunityInfo[] = [];

  livingProvinceList: ProvinceInfo[] = [];
  livingCityList: CityInfo[] = [];
  livingCommunityList: CommunityInfo[] = [];
  countryId: string;


  /**
   * 枚举类型
   * 1.性别
   * 2.婚姻状态
   * 3.办理人类型
   * 4.国籍
   * 5.优先级
   * 6.学历
   */
  genderEnum: any[];
  marriageEnum: any[];
  applyPersonTypeEnum: any[];
  countryOfCitizenshipEnum: any[];
  priorityList: any[];
  careerList: any[];


  /**
   * 1.申请类型
   * 2.申请目的
   * 3.证件类型
   * 3.申请状态
   * 4.人口库基础数据列表
   */
  applyTypeList: any[];
  applyPurposeList: any;
  certificateTypeList: any[];
  applyStatusList: any[];
  personInfoList: any[] = [];
  applyPriorityList: any[] = [];

  /**
   * 1.保存信息弹窗可见性
   * 2.保存loading可见性
   * 3.附件图片弹窗可见性
   * 4.非法文件弹窗可见性
   */
  popupVisible: boolean = false;
  loadingVisible: boolean = false;
  popupImageVisible: boolean = false;
  illegalImageVisible: boolean = false;


  /**
   * 1.图片路径
   * 2.非法文件集合
   * 3.附件上传文件对象
   * 4.存取成功的文件列表
   */
  registerPhoto: string = '';




  /**
   * 1.操作提示消息
   * 2.保存是否成功
   *
   */
  operationInfo: string;
  isSaveSucess: boolean;

  /**
   * 图片格式要求
   * 1. 类型
   * 2. 大小
   */
  imageTypeFormat: string[];
  imageSizeFormat: number;



  /**
   * 验证规则日期初始化
   * 1.出生日期不得超过当前日期
   * 2.证件颁发日期不得超过出生日期
   */
  maxDateOfBirth: Date = new Date();

  dateOfBirth: Date;
  credentialsIssueDate: Date;


  /**
   * 初始化Tooltip提示信息可见性
   *
   * 1.移除单个文件按钮
   * 2.预览文件按钮
   * 3.移除所有文件按钮
   * 4.选择文件按钮
   * 5.提交按钮
   */
  removeSingleFileTolVisible: boolean = false;
  previewTolVisible: boolean = false;
  removeAllFileTolVisible: boolean = false;
  selectFileTolVisible: boolean = false;
  submitTolVisible: boolean = false;
  dataBackFillTolVisible: boolean = false;
  enteringNextItemTolVisible: boolean = false;
  printCertificateTolVisible: boolean = false;
  printReciptTolVisible: boolean = false;
  /**
   * 录入人
   * @type {string}
   * @memberof ApplyPersonComponent
   */
  enterPersonName: string = '';
  // 是否有犯罪记录
  isHasCrimeRecord: number;
  applyInfoNew: ApplyInfo = new ApplyInfo();

  /**
   * 代理人证件是否可见
   * 申请其他目的原因是否可见
   */
  showAgent: boolean;
  showOtherPurposeReason: boolean;

  /**
   * 录入成功后显示操作按钮
   * 遮罩层是否显示
   */
  showOperationButton: boolean = true;
  showSubmitButton: boolean = false;
  showFormShadow: boolean = true;
  showReEntryButton: boolean = true;
  showGoBackButton: boolean = true;
  // 提交按钮是否可用
  submitDisabled: boolean = false;
  printCerBtnVisible: boolean = true;

  /**
   * 代理人身份验证开启
   * 其他目的原因验证开启
   */
  agentIDValid: boolean = true;
  // otherPurposeValid: boolean = true;

  validateVisible: boolean = false;
  brokenRules: any[] = [];

  firstTabActive: boolean = true;

  // 保存后打印按钮是否可用
  showPrintButton: boolean = true;

  // 点击上传按钮是否变色
  isWillUpload: boolean = false;

  // 路由传参：applyIdAndStatus
  routeApplyInfo: any;
  routeApplyId: string;
  routeApplyStatusId: string;
  routeApplyStatusName: string;

  uploadFile = { fileName: '', minImgPath: '', uploadFileItem: null };

  // 操作日志
  operationLog: OperationLog;

  // 数据总数
  dataCount: number = 1;
  // 路由守卫判断参数
  canDeactivateInfoOne: any;
  canDeactivateInfoTwo: any;

  attchmentControllObj: any;

  submitBtn: boolean = false; // 是否已保存数据
  seleTab: boolean = true; // tab切换校验
  // 点击清空按钮提示框
  confirmVisible: boolean = false;
  // 清除对象
  clearObject: any;
  hiddenBar: boolean = true;
  attchmentWatchObj: any;
  // 提交结果
  submitResult: string;
  //  成功返回结果
  completeInfo: any;
  constructor(
    private route: ActivatedRoute,
    // private router: Router,
    private dateFormatHelper: DateFormatHelper,
    private utilHelper: UtilHelper,
    private applyCommonService: ApplyCommonService,
    private applyPersonService: ApplyPersonService,
    private organizationService: OrganizationService,
    public enumInfo: EnumInfo,
    private configService: ConfigService,
    private eventAggregator: EventAggregator,
    private toastr: ToastrService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private logger: LoggerRecordService,
    private encodingRulesService: EncodingRulesService,
    // private similarityCalculate: SimilarityCalculate,
    // private sortorderAlgorithmService: SortorderAlgorithmService
  ) {

    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.attachmentInfo = new AttachmentInfo();
    this.operationLog = new OperationLog();
    this.canDeactivateInfoTwo = new ApplyBasicInfo();

    // 枚举和数据库测试数据要保持一致
    this.genderEnum = this.enumInfo.getGenderEnum;
    // this.marriageEnum = this.enumInfo.getMarriageEnum;
    this.applyPersonTypeEnum = this.enumInfo.getApplyPersonTypeEnum;
    this.countryOfCitizenshipEnum = this.enumInfo.getCountryOfCitizenshipEnum;

    this.attchmentControllObj = {
      uploadFile: true,
      preview: true,
      removeSingle: true
    };
    this.attchmentWatchObj = {
      uploadFile: false,
      preview: true,
      ocrRecognize: false,
      removeSingle: false
    };
  }
  /**
   * 初始化组织机构的服务基地址，配置文件config.json
   */
  ngOnInit(): void {

    // 获取登录人员的信息
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;

    if (this.utilHelper.AssertNotNull(this.userInfo)) {
      this.centerCodeName = this.userInfo.centerCodeName;
      this.applyInfo.applyCenterId = this.userInfo.centerCode;
      this.applyInfo.applyCenterName = this.userInfo.centerCodeName;
      this.applyInfo.applyCenterProvince = this.userInfo.applyCenterProvince;

      // 日志记录操作员的name 和 Id
      this.operationLog.operator = this.userInfo.userName;
      this.operationLog.operatorId = this.userInfo.orgPersonId;
    } else {
      this.userInfo = null;
    }
    this.applyInfo.priority = '0';


    // 获取路由导航传递过来的参数
    this.route.params.subscribe(data => {

      if (this.utilHelper.AssertNotNull(data)) {
        this.routeApplyInfo = JSON.stringify(data);
        if (this.routeApplyInfo !== '{}') {
          this.routeApplyInfo = data;
          this.routeApplyId = data.applyId;
          this.routeApplyStatusId = data.applyStatusId;
          this.routeApplyStatusName = data.applyStatusName;
        }
      }
    });
    // 路由导航参数加载申请数据
    if (this.routeApplyInfo !== '{}') {
      this.bindApplyInfoData(this.routeApplyId);
    }
    // 初始化证书申请基础数据
    this.bindApplyPurposeData();
    this.applyPurposeList = this.localStorageService.readObject('applyPurposeList');
    this.bindCertificateTypeData();
    this.bindMarriageData();
    this.bindCareerData();

    // 初始化优先级数据
    this.applyPersonService.initialCrmsService().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.bindApplyPriorityData();
      }
    }).catch(e => {
      console.log(e);
    });

    // 初始化国家ID数据以获取省份
    this.configService.get('countryId').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.countryId = result;
      } else {
        this.countryId = '';
      }
    }).catch(e => {
      console.log(e);
    });

    // 初始化省基础数据
    this.organizationService.initialOrganizationService()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.bindProvinceData(this.countryId);
          this.bindLivingProvinceData(this.countryId);
        }
      }).catch(e => {
        console.log(e);
      });

    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyPersonEntry');


    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-person');
    // 初始化消息配置
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.timeOut = 3000;
    // 初始化分页参数
    // this.applyPersonQuery = new ApplyPersonQuery();

    this.canDeactivateInfoOne = {
      agentIdNumber: undefined,
      agentIdType: undefined,
      applyCenterId: this.applyInfo.applyCenterId,
      applyCenterName: this.applyInfo.applyCenterName,
      applyCenterProvince: this.applyInfo.applyCenterProvince,
      applyDescription: undefined,
      applyPersonType: undefined,
      applyPurposeId: undefined,
      note: undefined,
      otherPurposeReason: undefined,
      priority: this.applyInfo.priority
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
  // 路由守卫判断表单是否发生变化
  canDeactivate(): Observable<boolean> | boolean {
    let x;
    // let y;
    let tip1 = this.getTranslateName('Are you sure to give up edit');
    let tip2 = this.getTranslateName('Hint');
    // 判断是否是传了数据过来的页面
    if (this.submitBtn === true) {
      return true;
    } else if (this.crmsAttchment.imageFileList.length > 0) {
      return new Observable((observer) => {
        confirm(tip1, tip2)
          .then((open) => {
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

      // for (y in this.applyBasicInfo) {
      //     if (this.applyBasicInfo[y] !== this.canDeactivateInfoTwo[y]) {
      //         return new Observable((observer) => {

      //             confirm(tip1, tip2).then((open) => {
      //                 observer.next(open);
      //                 observer.complete();
      //             });
      //         });
      //     }
      // }
    }
    return true;
  }

  /**
* 刷新路由
*/
  async refreshRouter() {
    let nowUrl = this.router.url;
    await this.router.navigateByUrl('');
    this.router.navigate([nowUrl]);
  }
  // 提交方法  通过验证后才可进行保存操作
  onSubmit(form, e) {
    this.submitDisabled = true;
    let result = this.crmsPersonApplyBasicInfo.validator.first.instance.validate();
    let isValid = result.isValid;
    if (isValid) {
      this.firstTabActive = false;
      this.saveAllEnterInfo(form);
    } else {
      this.submitDisabled = false;
      this.stepValidateForms(result, false);
    }
  }

  // 提交验证 弹框显示未通过验证消息
  validateForms(params: any) {
    this.brokenRules = [];
    if (this.utilHelper.AssertNotNull(params)) {
      let result = params.validationGroup.validate();
      if (this.seleTab === true) {
        let tip1 = this.getTranslateName('applyPersonType is required');
        let tip2 = this.getTranslateName('applyPurpose is required');
        let tip3 = this.getTranslateName('agentIdType is required');
        let tip4 = this.getTranslateName('agentIdNumber is required');
        let tip5 = this.getTranslateName('applyOtherPurposeReason is required');

        result.brokenRules.forEach((item, index) => {
          if (item.message === tip1 || item.message === tip2 ||
            item.message === tip3 || item.message === tip4 || item.message === tip5) {
            this.brokenRules.push(item);
          }
        });

      } else {
        this.brokenRules = result.brokenRules;
      }

      this.validateVisible = true;
    }

  }
  // 清空模块数据
  clearThisInfo() {
    if (this.clearObject === 'clearPersonApplyInfo') {
      this.showAgent = true;
      this.showOtherPurposeReason = true;
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
      this.eventAggregator.publish('cleanPersonApplyInfoCharacterCount', '');
    }
    if (this.clearObject === 'clearPersonApplyBasicInfo') {
      this.applyBasicInfo = new ApplyBasicInfo();
      this.applyBasicInfo.dateOfBirth = null;
      this.applyBasicInfo.credentialsIssueDate = null;
      this.eventAggregator.publish('cleanPersonApplyBasicInfoCharacterCount', '');
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
  // 录入下一条
  enterNextItem(form: NgForm) {
    this.clearForm();
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

    this.firstTabActive = true;
    this.showOperationButton = true;
    this.printCerBtnVisible = true;
    this.showSubmitButton = false;
    this.showFormShadow = true;
    this.refreshRouter();
  }

  // 重新录入
  reEntry(form, e) {
    this.clearForm();
  }

  // 打印证书
  async printCertificate() {
    this.toastr.clear();
    this.certificateInfo = this.applyInfoNew;

    await this.CerPrintComponent.saveInitCertificateInfo(this.certificateInfo);
    await this.CerPrintComponent.getCertificatePrintInfo(this.certificateInfo);
  }

  // 清空表单
  clearForm() {
    this.crmsAttchment.clearQueue();

    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    this.dateOfBirth = null;
    this.credentialsIssueDate = null;
    this.eventAggregator.publish('cleanCharacterCount', '');
  }


  /**
   * 获取初始化数据
   */

  // 1、申请目的
  async bindApplyPurposeData() {
    try {
      let result = await this.applyCommonService.getApplyPurposeList();
      if (this.utilHelper.AssertNotNull(result)) {
        this.applyPurposeList = result;
        this.localStorageService.writeObject('applyPurposeList', result);
      }
    } catch (error) {
      console.log(error);
      return [];
    }

  }
  // 2、证件类型
  bindCertificateTypeData() {
    this.applyCommonService.getCertificateTypeList('PERSON').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.certificateTypeList = result;
        // this.certificateTypeList.splice(-1, 1);
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 3、婚姻状态
  bindMarriageData() {
    this.applyCommonService.getMarriageList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.marriageEnum = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  /**
   * 学历
   */
  bindCareerData() {
    this.applyCommonService.getCareerList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.careerList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 优先级类型
  bindApplyPriorityData() {
    this.applyCommonService.getApplyPriorityList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.applyPriorityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 3、省份数据
  bindProvinceData(countryID: string) {
    this.organizationService.getProvinceDataForDisplay(countryID).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.provinceList = result;
      }

    }).catch(err => {
      console.log(err);
    });
  }
  // 4、现居住省份数据
  bindLivingProvinceData(countryID: string) {
    this.organizationService.getProvinceDataForDisplay(countryID).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingProvinceList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 5、城市数据
  bindCityData(provinceID: string) {
    this.organizationService.getCityDataForDisplay(provinceID).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.cityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 6、现居住城市数据
  bindLivingCityData(provinceID: string) {
    this.organizationService.getCityDataForDisplay(provinceID).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingCityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 7、社区数据
  bindCommunityData(cityId: string) {
    this.organizationService.getCommunityDataForDisplay(cityId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.communityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
  // 8、现居住社区数据
  bindLivingCommunityData(cityId: string) {
    this.organizationService.getCommunityDataForDisplay(cityId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.livingCommunityList = result;
      }

    }).catch(err => {
      console.log(err);
    });
  }

  // 通过路由传递过来的参数获取需要查看的消息
  bindApplyInfoData(applyId: string) {
    this.applyCommonService.getApplyInfoByApplyID(applyId)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.applyInfo = result.applyInfo;
          this.applyBasicInfo = result.applyBasicInfo;
          this.attachmentList = result.attachmentInfoList;

          if (this.applyPurposeList) {
            if (this.applyInfo.applyTypeId === this.applyPurposeList[this.applyPurposeList.length - 1].applyPurposeId) {
              this.showOtherPurposeReason = false;
            }
          }
          if (this.applyInfo.agentIdType !== null) {
            this.showAgent = false;
          }

          this.showGoBackButton = false;
          // 时间格式，文本域字符统计处理
          // this.applyDataHandler(this.applyBasicInfo.dateOfBirth, this.applyBasicInfo.credentialsIssueDate);

        };
        // 卡片提示

        if (this.routeApplyStatusId === '5') {
          this.showFormShadow = false;
          this.showReEntryButton = false;
          // this.toastr.clear();

          this.toastr.warning('', this.getTranslateName('this record was rejected and should be re-entryed'),
            { timeOut: 3000, positionClass: 'toast-bottom-center' });
        } else {
          this.showFormShadow = false;
          this.showSubmitButton = true;
          // this.toastr.clear();

          this.toastr.warning('', this.getTranslateName('this record was') + this.routeApplyStatusName +
            this.getTranslateName('record') + this.getTranslateName('can not be edited'),
            { timeOut: 3000, positionClass: 'toast-bottom-center', });
        }
      }).catch(err => {
        console.log(err);
      });
  }


  /**
   * 选择省、市、加载下级目录
   */
  selectIndexOfProvince(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindCityData(e.selectedItem.provinceId);
      // this.bindCommunityData(e.selectedItem.provinceId);
      this.communityList = [];
      this.applyBasicInfo.communityName = null;
    }
  }

  selectIndexOfCity(e) {
    if (this.utilHelper.AssertNotNull(e.selectedItem)) {
      this.bindCommunityData(e.selectedItem.cityId);
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
      this.applyBasicInfo.livingCommunityName = null;
    }
  }

  selectIndexOfLivingCity(e) {
    if (e.selectedItem !== null) {
      this.bindLivingCommunityData(e.selectedItem.cityId);
    }
  }


  /**
   * 控制Tooltip提示的显示与隐藏
   *
   * 1.移除单个文件按钮
   * 2.预览文件按钮
   * 3.移除所有文件按钮
   * 4.选择文件按钮
   * 5.提交按钮
   * 6.数据回填按钮
   */
  removeSingleFileTolToggle() {
    this.removeSingleFileTolVisible = !this.removeSingleFileTolVisible;
  }

  previewTolToggle() {
    this.previewTolVisible = !this.previewTolVisible;
  }
  removeAllFileTolToggle() {
    this.removeAllFileTolVisible = !this.removeAllFileTolVisible;
  }
  selectFileTolToggle() {
    this.selectFileTolVisible = !this.selectFileTolVisible;
  }
  submitToggle() {
    this.submitTolVisible = !this.submitTolVisible;
  }
  dataBackFillTolToggle() {
    this.dataBackFillTolVisible = !this.dataBackFillTolVisible;
  }
  enterNextItemToggle() {
    this.enteringNextItemTolVisible = !this.enteringNextItemTolVisible;
  }
  printCertificateToggle() {
    this.printCertificateTolVisible = !this.printCertificateTolVisible;
  }
  printReciptToggle() {
    this.printReciptTolVisible = !this.printReciptTolVisible;
  }

  /**
   * loading隐藏时下一步操作
   */
  showOperationResult() {
    this.popupOperationInfo(this.isSaveSucess, this.isHasCrimeRecord);
    this.isSaveSucess = null;
  }

  /**
   * 1.点击保存时显示loading
   * 2.操作结果信息提示
   */
  showLoadPanel() {
    this.loadingVisible = true;
  }

  popupOperationInfo(isSuccess: boolean, isHasCrimeRecord: number) {
    if (isSuccess === true && isHasCrimeRecord === 0) {
      this.toastr.toastrConfig.timeOut = 2000;
      this.submitResult = this.getTranslateName('save success and has no crime record');
      this.printCerBtnVisible = false;
      this.wizard.next();
    }
    if (isSuccess === true && isHasCrimeRecord === 1) {
      this.printCerBtnVisible = true;
      this.submitResult = this.getTranslateName('save success and need analysis');
      this.wizard.next();
    }
    if (isSuccess === false) {
      this.submitResult = this.getTranslateName('save failure');
    }
  }

  // 获取回填的个人信息
  getPersonInfo(e) {
    this.applyBasicInfo = e;
  }

  /**
   * 保存证书申请信息之前应该把涉及到时间的字段统一格式化
   */
  formatDate() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
      this.applyBasicInfo.dateOfBirth = this.dateFormatHelper.RestURLBeignDateTimeFormat(this.applyBasicInfo.dateOfBirth);

    }
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssueDate)) {
      this.applyBasicInfo.credentialsIssueDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(
        this.applyBasicInfo.credentialsIssueDate);
    }
  }

  /**
   * 保存基本信息
   * @param form
   */
  async saveCertificateApplyBasicInfo(attachmentList) {
    // (1) 设置申请类型为个人申请,申请状态为提交状态
    this.applyInfo.applyTypeId = '1';
    // (2)转换输入的时间年月日时分秒
    this.formatDate();
    // (3)设置录入人员
    this.applyInfo.enteringPersonName = this.userInfo.personName;
    this.applyInfo.enteringPersonId = this.userInfo.orgPersonId;
    // (4)调用服务，保存3类基本信息
    // 回执单号
    this.applyInfo.deliveryReceiptNumbr = this.encodingRulesService.deliveryReceiptNumber(this.applyBasicInfo.certificateNumber);

    this.certificateApplyInfo = new CertificateApplyInfo(this.applyBasicInfo,
      this.applyInfo, attachmentList, null);
    this.applyPersonService.saveCertificateApplyInfo(this.certificateApplyInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.crimeRecord)) {
          this.isSaveSucess = true;
          console.log(result);
          // this.applyInfoNew = new ApplyInfo();
          this.applyInfoNew = result;
          this.completeInfo = result;
          this.isHasCrimeRecord = this.applyInfoNew.crimeRecord;
          // 保存成功，提交按钮不可用
          this.submitDisabled = true;
        } else {
          this.isSaveSucess = false;
          this.loadingVisible = false;
          // 保存不成功，提交按钮可用
          this.submitDisabled = true;
          setTimeout(() => {
            this.submitDisabled = false;
          }, 3000);
        }
        if (this.isSaveSucess) {
          // (4)保存成功,重载当前页面,页面遮罩
          this.loadingVisible = false;
          this.showOperationResult();
          this.popupImageVisible = false;

          this.personInfoList = null;
          // this.clearCharacterCount();
          this.showOperationButton = false;
          this.showSubmitButton = true;
          this.showFormShadow = false;

          // 保存成功日志记录
          this.operationLog.level = 'info';
          this.operationLog.action = 'ADD';

          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;

          this.operationLog.actionDesc = 'add apply-person success';
          this.logRecord();

        } else {
          this.showOperationResult();

          // 保存失败日志记录
          this.operationLog.level = 'error';
          this.operationLog.action = 'ADD';
          let _newContent = JSON.stringify(this.certificateApplyInfo).replace(/"/g, `'`);
          this.operationLog.newContent = _newContent;
          this.operationLog.actionDesc = 'add apply-person failed';
          this.logRecord();
          // 保存不成功，提交按钮可用
          this.submitDisabled = true;
          setTimeout(() => {
            this.submitDisabled = false;
          }, 3000);
        }
      }).catch(e => {
        // 保存出现异常，提交按钮可用
        // this.submitDisabled = false;
        this.showSubmitButton = true;
        this.reRntryVisible = false;
        this.loadingVisible = false;
        this.showOperationResult();
        console.log(e);
      });
  }

  async saveAllEnterInfo(form: NgForm) {
    // 1.出现loading效果
    this.showLoadPanel();

    // 将已上传的附件和附件基本信息关联
    if (this.crmsAttchment.imageFileList.length > 0) {
      // 附件上传完成后会自动触发保存操作
      this.crmsAttchment.upLoadFile();
      this.submitBtn = true;
    } else {
      // 无附件的情况
      this.saveCertificateApplyBasicInfo(null);
      this.submitBtn = true;
    }
  }

  // 附件上传失败操作
  uploadError(item) {
    if (this.utilHelper.AssertNotNull(item)) {
      let name = item.name.substring(item.name.lastIndexOf('\\') + 1, item.name.length);
      this.reRntryVisible = false;
      this.loadingVisible = false;
      this.showSubmitButton = true;
      this.toastr.toastrConfig.maxOpened = 5;
      this.toastr.toastrConfig.timeOut = 5000;
      this.toastr.error(this.getTranslateName('Server Inner Exception') + name + this.getTranslateName('attachment upload failed'));
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
    this.operationLog.business = 'apply-person';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  // tab切换校验
  selectTab() {
    if (this.utilHelper.AssertEqualNull(this.applyInfo.applyPersonType)) {
      this.seleTab = true;
      return true;
    } else if (this.utilHelper.AssertEqualNull(this.applyInfo.applyPurposeId)) {
      this.seleTab = true;
      return true;
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
    if (result.isValid === true) { // 普通验证操作
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
      let result = this.crmsPersonApplyInfo.validator.first.instance.validate(); // 公告基本信息
      this.stepValidateForms(result, false);
    } else if (step === 3) { // 第四步
      this.wizard.next();
    }
  }
}

