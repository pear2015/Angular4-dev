import { Component, OnInit, trigger, state, style, transition, animate, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CertificateManagementService } from './certificate-management.service';
import { Router } from '@angular/router';
import { EventAggregator, LocalStorageService, UtilHelper, DateFormatHelper } from '../../core';
import { PaginationComponent, CommonFromComponent } from '../../shared';
import { UserInfo } from '../../model/auth/userinfo';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';
import { CertificateParamModel } from '../../model/application-credentials-management/CertificateParamModel';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent } from 'devextreme-angular';
import { CertificatePrintComponent } from '../common/components/certificate-print/certificate-print.component';
import { ToastrService } from 'ngx-toastr';
/**
 * 证书列表
 */
@Component({
  templateUrl: './certificate-management.component.html',
  providers: [CertificateManagementService, PaginationComponent, ApplyCommonService, DateFormatHelper],
  animations: [
    trigger('formAnimation', [
      state('show', style({
        right: 0,
        opacity: 1,
        display: 'block'
      })),
      state('hidden', style({
        right: -500,
        opacity: 0,
        display: 'none'
      })),
      transition('hidden=>show', animate('500ms linear')),
      transition('show=>hidden', animate('500ms linear'))
    ])

  ]
})

export class CertificateManagementComponent implements OnInit {
  @ViewChild(DxDataGridComponent)
  grid: DxDataGridComponent;

  @ViewChild(CertificatePrintComponent)
  CerPrintComponent: CertificatePrintComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  /**
   * 数据列表
   */
  dataList: any;
  /**
   * 证书信息
   */
  managementInfo: any;
  /**
   * 附件信息
   */
  attachmentInfo: any;
  /**
   * 证书列表
   */
  managementList: any[] = [];
  /**
   * 申请相关信息
   */
  applyInfo: any;
  /**
   * 选中行信息
   */
  rowInfo: any;
  /**
   * 申请类型Id
   */
  applyTypeId: string;
  /**
   * 表单循环的对象
   */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  /**
   * 搜索信息
   */
  searchInfo: CertificateParamModel;
  /**
   * 图片预览窗口
   */
  previewImgPopup: boolean = false;

  // 按钮灰度
  isAllow: boolean = true;
  /**
   * 分页对象
   */
  pageObj: any;
  /**
   * 角色Id
   */
  roleId: string;
  /**
   * 角色类型
   */
  roleType: string;
  totalCount: number;
  /**
   * 图片Id
   */
  attId: string;
  /**
   * 轮播图当前index
   */
  activeSlideIndex: number = 0;
  loadingVisible: boolean = false;
  // 详情合并对象
  closeObj: any;


  crimeAndNoticeList: any;
  certificateInfo: any;
  crimeNoticeList: any;
  confirmVisible: boolean = false;

  constructor(
    private service: CertificateManagementService,
    private route: Router,
    private eventAggregator: EventAggregator,
    private localStorageService: LocalStorageService,
    private dateFormatHelper: DateFormatHelper,
    public translateService: TranslateService,
    public applyCommonService: ApplyCommonService,
    public utilHelper: UtilHelper,
    private toastr: ToastrService,

  ) {

    this.formObjEmit = this.service.getSerchObj();
    this.searchInfo = new CertificateParamModel();
    this.searchInfo.pages = 0;
    this.searchInfo.pageSize = 10;

  }
  async ngOnInit() {
    // 从缓存中获取登陆的分析员Id
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    if (this.utilHelper.AssertNotNull(user)) {
      if (user.roleType === 'OPERATOR' || user.roleType === 'ANALYST') {
        this.formObjEmit.selectDatas = [];
      }
      this.roleId = user.orgPersonId;
      this.roleType = user.roleType;
    }
    // 初始化接口地址
    await this.service.initialCrmsService();

    // 初始化获取所有证书列表
    this.bindManagementList();

    // 路由信息
    this.bindRoutUrl('CertificateInfoManagement', 'CertificateInfoSearch');

    // 国际化搜索框的词条
    if (this.formObjEmit.selectDatas.length > 0) {
      this.translateService.get(['applyPerson', 'applyGovernment']).subscribe(value => {
        this.formObjEmit.selectDatas[0].data[0].name = value['applyPerson'];
        this.formObjEmit.selectDatas[0].data[1].name = value['applyGovernment'];
      });
    }

    sessionStorage.setItem('currentRouter', 'certificate-management.component');
    // 初始化消息配置
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.timeOut = 3000;
  }

  // 获取证书列表
  async bindManagementList() {
    this.loadingVisible = true;
    if (this.utilHelper.AssertNotNull(this.roleType) && this.roleType === 'MONITOR') {
      try {
        this.dataList = await this.service.postManagementList('monkey', this.searchInfo);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        this.dataList = await this.service.postManagementList(this.roleId, this.searchInfo);
      } catch (error) {
        console.log(error);
      }
    }
    if (this.utilHelper.AssertNotNull(this.dataList) && this.utilHelper.AssertNotNull(this.dataList.data)) {
      this.managementList = [];
      this.totalCount = this.dataList.totalCount;
      // this.formNum = 0;
      this.dataList.data.forEach(element => {
        this.managementInfo = element.certificateInfo;
        // this.managementInfo.firstName = element.applyBasicInfo.firstName;
        // this.managementInfo.lastName = element.applyBasicInfo.lastName;
        this.managementInfo.xinName = element.applyBasicInfo.firstName + ' ' + element.applyBasicInfo.lastName;
        this.managementInfo.certificateNum = element.applyBasicInfo.certificateNumber;
        this.attachmentInfo = element.attachmentInfo;
        this.applyInfo = element.applyInfo;
        this.managementInfo.applyTypeId = this.applyInfo.applyTypeId;
        this.managementInfo.authCode = this.applyInfo.authCode;
        this.managementInfo.govermentInfo = this.applyInfo.govermentInfo;
        this.managementInfo.deliveryReceiptNumbr = this.applyInfo.deliveryReceiptNumbr;
        this.managementInfo.enteringPersonName = this.applyInfo.enteringPersonName;


        // 计算转换证书状态
        this.translateService.get(['Permanent Validity', 'Validity', 'Lapse']).subscribe(value => {
          if (this.managementInfo.applyTypeId === '2') {
            this.managementInfo.certificateType = 'applyGovernment';
            this.managementInfo.certificateStatus = value['Permanent Validity'];
            this.managementInfo.invalidTimeShow = value['Permanent Validity'];
          } else {
            this.managementInfo.certificateType = 'applyPerson';
            // let nowDate = this.dateFormatHelper.HoursMinutesDateTimeFormat(new Date());
            // nowDate = new Date(nowDate).getTime();
            // let lapseDate = new Date(this.managementInfo.invalidTime).getTime();
            this.managementInfo.invalidTimeShow = this.applyInfo.applyTime;
            if (this.managementInfo.valid) {
              this.managementInfo.certificateStatus = value['Validity'];
            } else {
              this.managementInfo.certificateStatus = value['Lapse'];
            };
          }
        });

        // 生成证书列表
        this.managementList.push(this.managementInfo);
      });
    } else {
      this.managementList = [];
    }
    this.grid.instance.collapseAll(-1);
    setTimeout(() => { this.loadingVisible = false; }, 600);
  }



  // 路由绑定header路径
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 获取选中行的数据
  async  selectedRow(e) {
    this.closeObj = e;
    if (this.utilHelper.AssertNotNull(e.selectedRowKeys[0])) {
      this.rowInfo = e.selectedRowKeys[0]; // 获取选中行数据
      this.applyTypeId = this.rowInfo.applyTypeId;
      this.attId = this.rowInfo.attachmentId;
      this.isAllow = false;
      try {
        let result = await this.service.getImgList(this.attId);
        if (this.utilHelper.AssertNotNull(result)) {
          this.managementInfo.img = 'data:image/jpg;base64,' + result;
        } else {
          this.managementInfo.img = null;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  closeDetail(e) {
    if (this.utilHelper.AssertNotNull(e) && this.utilHelper.AssertNotNull(e.component)) {
      e.component.collapseAll(-1);
    }
  }

  // 根据不同的申请类型跳转向分析页面
  navigateToReanalyse() {
    let applyIdAndFlag = {
      applyId: this.rowInfo.applyId,
      flag: 'certificate-management'
    };
    if (this.applyTypeId === '1') {
      this.route.navigate(['/crms-system/crime-certify/personApply-detail', applyIdAndFlag]);
    }
    if (this.applyTypeId === '2') {
      this.route.navigate(['/crms-system/crime-certify/apply-govermentDetail', applyIdAndFlag]);
    }
  }
  // 点击显示搜索
  async showForm(num) {
    // 获取搜索表单的配置对象
    if (num === 1) {
      this.formAnimate = 'hidden';
      this.formNum = 0;
    } else {
      this.confirmVisible = true;
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


  // 点击提交表单
  getFormObjChange(data) {
    this.grid.selectedRowKeys = [];
    this.isAllow = true;
    this.formNum = 1;
    if (this.utilHelper.AssertNotNull(data)) {
      data.printStartTime = this.formatBeginDate(data.printStartTime);
      data.printEndTime = this.formatEndDate(data.printEndTime);
      // this.formAnimate = 'hidden';
      this.searchInfo = data;
      this.searchInfo.pageSize = 10;
      this.searchInfo.pages = 0;
      this.searchInfo.sortOrder = null;
      this.pagination.first.numPage = 0;
      this.bindManagementList();
    }
  }


  /**确定显示搜索表单
   */
  srueHiddenForm() {
    this.form.form.reset();
    this.refreshRouter();
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.confirmVisible = false;
  }


  // 时间转化
  formatBeginDate(value) {
    if (this.utilHelper.AssertNotNull(value)) {
      value = this.dateFormatHelper.RestURLBeignDateTimeFormat(value);
    }
    return value;
  }

  formatEndDate(value) {
    if (this.utilHelper.AssertNotNull(value)) {
      value = this.dateFormatHelper.RestURLEndDateTimeFormat(value);
    }
    return value;
  }

  /**
   * 选择查询出来的数据点击展开
   */
  expendIndexOfRowData(e) {
    if (e.component.isRowExpanded(e.data)) {
      e.component.collapseRow(e.data);
    } else {
      e.component.collapseAll(-1);
      e.component.expandRow(e.data);
    }
  }

  // 分页传输的数据
  getpageObjChange(obj) {
    this.searchInfo = obj;
    this.isAllow = true;
    this.bindManagementList();
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  // 图片预览
  previewImg() {
    if (this.utilHelper.AssertNotNull(this.managementInfo.img)) {
      this.previewImgPopup = true;
    } else {
      this.toastr.warning('',
        this.getTranslateName('Please confirm whether to print the certificate or select a line of information'));
    }

  }

  /**
   * 刷新列表
   */
  refreshList() {
    this.searchInfo = new CertificateParamModel();
    this.searchInfo.pages = 0;
    this.searchInfo.pageSize = 10;
    this.pagination.first.numPage = 0;
    this.bindManagementList();
    this.closeDetail(this.closeObj);
    this.grid.selectedRowKeys = [];
    this.isAllow = true;
  }

  async getApplyDetailInfoByApplyId() {
    let result = await this.applyCommonService.getApplyInfoByApplyID(this.rowInfo.applyId);
    if (this.utilHelper.AssertNotNull(result)) {
      this.applyInfo = result.applyInfo;
    }
  }

  /**
   * 打印证书前，检查此申请结果是否是有犯罪记录
   * 获取申请详情
   * 有，获取犯罪记录，准备打印
   */
  async  getApplyCrimeRecordByApplyId() {
    await this.getApplyDetailInfoByApplyId();
    if (this.utilHelper.AssertNotNull(this.applyInfo) && this.applyInfo.applyResultId === '2') {
      let result = await this.applyCommonService.getApplyCrimeRecordByApplyId(this.applyInfo.applyId);
      if (this.utilHelper.AssertNotNull(result)) {
        this.crimeAndNoticeList = result;
      }
    }
  }


  // 打印证书前拿到此人的犯罪记录信息,以及申请信息；
  async printCertificate() {
    await this.getApplyCrimeRecordByApplyId();
    this.certificateInfo = this.applyInfo;
    if (this.utilHelper.AssertNotNull(this.crimeAndNoticeList)) {
      this.crimeNoticeList = this.crimeAndNoticeList;
    }
    await this.CerPrintComponent.saveInitCertificateInfo(this.certificateInfo);
    await this.CerPrintComponent.getCertificatePrintInfo(this.certificateInfo);
    await this.bindManagementList();
    this.grid.selectedRowKeys = [];
    this.isAllow = true;
  }



}


