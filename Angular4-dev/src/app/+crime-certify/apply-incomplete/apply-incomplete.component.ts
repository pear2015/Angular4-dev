import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LocalStorageService, EventAggregator, UtilHelper } from '../../core/';

import { ApplyCompleteService } from '../apply-complete/apply-complete.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';

import { UserInfo, RoleType } from '../../model/auth/userinfo';
import { DxDataGridComponent } from 'devextreme-angular';
import { OperationLog } from '../../model/logs/operationLog';

import { ApplyInfo } from '../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
import { CrimeRecordPrint } from '../../model/crime-notice/CrimeRecordPrint';
import { CertificatePrintComponent } from '../common/components/certificate-print/certificate-print.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
/**
 * 未完成申请记录
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
  templateUrl: './apply-incomplete.component.html',
  providers: [ApplyCompleteService, ApplyCommonService]
})
export class ApplyInCompleteComponent implements OnInit {

  recordList: any[];
  applyRecord: any;
  showDetailsBtn: boolean = true;
  showPrintCerBtn: boolean = true;
  enterPersonName: string;
  certificateInfo: ApplyInfo;
  user: UserInfo;

  applyInfo: ApplyInfo;
  applyBasicInfo: ApplyBasicInfo;
  crimeAndNoticeList: CrimeRecordPrint[] = [];

  @ViewChild(DxDataGridComponent)
  govermentRecordGrids: DxDataGridComponent;

  @ViewChild(CertificatePrintComponent)
  CerPrintComponent: CertificatePrintComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;

  // 历史记录列表
  handleHistoryList: any[] = [];
  // 申请Id
  applyId: string;
  crimeNoticeList: CrimeRecordPrint[];

  operationLog: OperationLog;
  // 审核列表分页查询
  private govermentRecodePage = { pages: 0, pageSize: 10 };
  // 数据总数
  dataCount: number = 1;
  loadingVisible: boolean = false; // loading开关
  // 未完成数据对象
  incomleteObject: any;
  status: string = '';
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private applyCompleteService: ApplyCompleteService,
    private applyCommonService: ApplyCommonService,
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper
  ) {
    this.operationLog = new OperationLog();
    this.applyInfo = new ApplyInfo();
    this.applyBasicInfo = new ApplyBasicInfo();
  }

  /***
* 路由绑定header路径
*/
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  /**
* 获取未完成的列表的数据
*/
  async getCrimsIncompleteList() {
    try {
      let result = await this.applyCommonService.getCrimsIncompleteListByEnteringPersonId(this.user.orgPersonId);
      if (this.utilHelper.AssertNotNull(result)) {
        this.incomleteObject = result;
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateList(status) {
    if (status === 0) {
      this.status = '0,1';
    } else if (status === 2) {
      this.status = '2';
    } else {
      this.status = '3';
    }
    this.pagination.first.numPage = 0;
    this.govermentRecodePage.pageSize = 10;
    this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
  }
  ngOnInit() {
    // 获取当前登录人的信息
    this.user = this.localStorageService.readObject('currentUser') as UserInfo;
    // this.userId = this.user.orgPersonId;

    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.user.userName;
    this.operationLog.operatorId = this.user.orgPersonId;
    this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
    this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
    sessionStorage.setItem('currentRouter', 'apply-incomplete');
    // 收到记录后刷新数据
    this.eventAggregator.subscribe('recordIncompleteRefreshTask', '', result => {
      this.govermentRecodePage.pages = 0;
      this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
    });
    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyIncompleteRecord');
    this.getCrimsIncompleteList();
  }

  /**
  * 获取当天的该用户申请业务数据
  分析中 '0,1'
  待审核 '2',
  待打印 '3'
  */
  async bindTodayHandledApplyQuantity(page, pageSize) {
    this.loadingVisible = true;
    try {
      let result = await this.applyCompleteService.getTodayUndoneApplyQuantity(page, pageSize, this.user.orgPersonId, this.status);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        this.recordList = result.data;
        this.dataCount = result.totalCount;
        console.log(1);
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => { this.loadingVisible = false; }, 600);
  }

  /**
   * 选择列表中的一项 获取状态数据 控制按钮显示
   */
  selectRecordHandle(e) {
    if (this.utilHelper.AssertNotNull(e.selectedRowKeys[0])) {
      this.applyRecord = e.selectedRowKeys[0];
      this.applyId = this.applyRecord.applyId;
      let recordStatus = this.applyRecord.applyStatusId;
      if (recordStatus === '1' || recordStatus === '2') {
        this.showDetailsBtn = false;
        this.showPrintCerBtn = true;
        this.toastr.clear();
      } else if (recordStatus === '3' || recordStatus === '4') {
        this.showDetailsBtn = false;
        this.showPrintCerBtn = false;
        this.toastr.clear();
      } else if (recordStatus === '5') {
        let rejectReson = this.applyRecord.auditRejectReason;
        this.showDetailsBtn = false;
        this.showPrintCerBtn = true;
        this.toastr.info(rejectReson);
      } else if (recordStatus === '0') {
        this.showDetailsBtn = false;
        this.showPrintCerBtn = true;
      }
    }

  }

  // 查看选中申请记录详情
  watchGovernmentRecord() {
    let applyIdAndStatus = {
      applyId: this.applyRecord.applyId,
      applyStatusId: this.applyRecord.applyStatusId,
      applyStatusName: this.applyRecord.applyStatusName,
      flag: 'apply-incomplete'
    };

    if (this.user.roleType === RoleType[0]) {
      this.router.navigate(['/crms-system/crime-certify/personApply-detail', applyIdAndStatus]);
    } else if (this.user.roleType === RoleType[1]) {
      this.router.navigate(['/crms-system/crime-certify/apply-govermentDetail', applyIdAndStatus]);
    }


  }

  // 查看历史记录
  async watchRecordHistory() {
    let applyId = this.applyId;
    try {
      let result = await this.applyCommonService.getHandleHistory(applyId);
      if (result != null && result !== undefined) {
        this.handleHistoryList = result;
      }
    } catch (error) {
      console.log(error);
    };
  }

  /**
   * 刷新列表
   */
  refreshList() {
    this.status = '';
    this.govermentRecodePage.pages = 0;
    this.pagination.first.numPage = 0;
    this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
    this.govermentRecordGrids.selectedRowKeys = [];
    this.showDetailsBtn = true;
    this.showPrintCerBtn = true;
  }

  /**
   * 点击分页按钮，重新拉取数据
   *
   */
  pageIndexChange(obj) {
    this.govermentRecodePage.pages = obj.pages;
    this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
  }

  async getApplyDetailInfoByApplyId() {
    let result = await this.applyCommonService.getApplyInfoByApplyID(this.applyId);
    if (this.utilHelper.AssertNotNull(result)) {
      this.applyBasicInfo = result.applyBasicInfo;
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

  // 打印证书
  // 打印证书前拿到此人的犯罪记录信息,以及申请信息；
  async printCertificate() {
    await this.getApplyCrimeRecordByApplyId();
    this.certificateInfo = this.applyRecord;
    if (this.utilHelper.AssertNotNull(this.crimeAndNoticeList)) {
      this.crimeNoticeList = this.crimeAndNoticeList;
      console.log(this.crimeAndNoticeList);
    }
    await this.CerPrintComponent.saveInitCertificateInfo(this.certificateInfo);
    await this.CerPrintComponent.getCertificatePrintInfo(this.certificateInfo);
  }
}
