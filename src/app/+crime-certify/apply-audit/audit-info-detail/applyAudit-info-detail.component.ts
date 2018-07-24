import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventAggregator, LocalStorageService, UtilHelper, DateFormatHelper } from '../../../core';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { EnumInfo } from '../../../enum/';

import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../../model/common/AttachmentInfo';
import { ApplyAndCriminalRelation } from '../../../model/certificate-apply/ApplyAndCriminalRelation';
import { CertificateApplyInfo } from '../../../model/certificate-apply/CertificateApplyInfo';
import { UserInfo } from '../../../model/auth/userinfo';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';

import { ApplyAuditService } from './../apply-audit.service';
@Component({
  templateUrl: './applyAudit-info-detail.component.html',
  providers: [ApplyCommonService, ApplyAuditService, DateFormatHelper, EnumInfo]

})
export class ApplyAuditInfoDetailComponent implements OnInit {

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
  criminalList: any;
  auditorId: string;

  /**
   * 审核主页路由传递过来的待审核applyId
   * 审核结果枚举类型
   */
  applyId: string;
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
  // 操作记录日志
  // 当前用户
  userInfo: UserInfo = null;
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
  applyTypeId: string;
  // 当前选择的罪犯Id
  hasSelectCrimePersonId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enumInfo: EnumInfo,
    private utilHelper: UtilHelper,
    private applyCommonService: ApplyCommonService,
    private eventAggregator: EventAggregator,
    private localStorageService: LocalStorageService,
  ) {
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
    // 获取路由导航传递过来的参数
    this.route.queryParams.subscribe(data => {
      this.applyId = data.applyId;
      this.applyTypeId = data.applyTypeId;
      this.routerFlag = data.flag;
    });
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
    // 获取申请基本信息
    this.bindApplyInfoListData();
    // 路由路径绑定
    this.bindRoutUrl('CrimeCertifyManagement', 'applyAuditDetail');
    // 缓存路由
    sessionStorage.setItem('currentRouter', 'apply-audit-detail');
  }
  // 获取申请枚举
  public get applyStatus() {
    return this.enumInfo.getApplyStatus;
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

  showNotice() {
    this.noticeBox = true;
    this.personBox = false;
  }
  showPerson() {
    this.noticeBox = false;
    this.personBox = true;
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

  /***
   * 路由绑定header路径
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }


}
