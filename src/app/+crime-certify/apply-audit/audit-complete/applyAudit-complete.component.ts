import { Component, OnInit, trigger, state, style, animate, transition, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';

import { ApplyAuditService } from './../apply-audit.service';
import { EventAggregator, LocalStorageService, UtilHelper, DateFormatHelper } from '../../../core/';
import { UserInfo } from '../../../model/auth/userinfo';
import { ApplyInfoParam } from '../../../model/application-credentials-management/applyInfoParam';
import { PaginationComponent, CommonFromComponent } from '../../../shared';

@Component({
  templateUrl: './applyAudit-complete.component.html',
  providers: [ApplyAuditService],
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

export class ApplyAuditCompleteComponent implements OnInit {
  @ViewChild(DxDataGridComponent)
  auditInfoGrids: DxDataGridComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  /**
    *表单循环的对象
    *
    */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  /**
   * 待审核基本信息
   * 1.applyId 申请信息Id
   * 2.申请信息
   */
  applyId: string;
  auditInfoList: any[];
  historyRecordList: any[];
  applyInfoParam: ApplyInfoParam;
  /**
   * 判断审核按钮是否可用
   */
  isAllow: boolean = true;
  /**
   * 角色
   * @memberof ApplyAuditComponent
   */
  role: number;

  // 审核员Id
  auditId: string;
  // 审核列表分页查询
  private applyInfoPage = { pages: 0, pageSize: 10 };
  // 数据总数
  dataCount: number = 1;
  rowInfo: any;
  loadingApplyAudit: boolean = false; // loading开关
  confirmVisible: boolean = false;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  constructor(
    private applyAuditService: ApplyAuditService,
    private router: Router,
    private eventAggregator: EventAggregator,
    private localStorageService: LocalStorageService,
    private utilHelper: UtilHelper,
    private dateFormatHelper: DateFormatHelper
  ) {
    this.applyInfoParam = new ApplyInfoParam();
  }

  ngOnInit() {
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.auditId = user.orgPersonId;

    this.role = Number(localStorage.role);
    this.initSeachInfo();
    /**
     * 初始化犯罪服务基地址
     * 1.获取待审核申请基本信息
     */
    this.bindWaitAuditApplyInfoData();
    // 路由路径绑定
    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyAuditComplete');
    sessionStorage.setItem('currentRouter', 'applyAudit-complete');
    // 收到数据后刷新数据
    this.eventAggregator.subscribe('applyAuditRefreshTask', '', result => {
      this.bindWaitAuditApplyInfoData();
    });
    this.initSearchForm();
  }
  /**
   * 初始化搜索对象
   * @memberof ApplyAuditCompleteComponent
   */
  initSeachInfo() {
    this.applyInfoParam.pages = 0;
    this.applyInfoParam.pageSize = 10;
    this.applyInfoParam.auditPersonId = this.auditId;
  }
  /**
   * 初始化搜索对象
   */
  async  initSearchForm() {
    this.formObjEmit = await this.applyAuditService.searchFormObj();
  }
  /**
   * 获取待审核申请基本信息
   *
   * @memberof ApplyAuditComponent
   */
  bindWaitAuditApplyInfoData() {
    this.loadingApplyAudit = true;
    this.applyAuditService.getHasAuditedApplyInfoForDisplay(this.applyInfoParam)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          if (result.success) {
            // this.formNum = 0;
            this.auditInfoList = result.data;
            this.dataCount = result.totalCount;
          }
        }

      }).catch(err => {
        console.log(err);
      });
    setTimeout(() => { this.loadingApplyAudit = false; }, 600);
  }

  /**
   * 审核按钮路由跳转
   *
   * @memberof ApplyAuditComponent
   */
  navigateToAuditDetail() {

    let applyIdAndFlag: NavigationExtras = {
      queryParams: {
        applyId: this.rowInfo.applyId,
        applyTypeId: this.rowInfo.applyTypeId,
        flag: 'applyAudit-complete'
      }
    };
    this.router.navigate(['/crms-system/crime-certify/applyAudit-info-detail'], applyIdAndFlag);
  }

  /**
   * 判断审核按钮是否禁用
   */
  selectChangedHandle(e) {
    if (this.utilHelper.AssertNotNull(e.selectedRowKeys[0])) {
      this.isAllow = false;
      this.rowInfo = e.selectedRowKeys[0];
      this.applyId = this.rowInfo.applyId;
    }
  }
  /**
   * 查看历史记录
   */
  watchHistoryRecord() {
    this.applyAuditService.getHandleHistory(this.applyId)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.historyRecordList = result;
        }
      }).catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.initSeachInfo();
    this.pagination.first.numPage = 0;
    this.bindWaitAuditApplyInfoData();
    this.auditInfoGrids.selectedRowKeys = [];
    this.isAllow = true;
  }


  /***
 * 路由绑定header路径
 */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }
  /**
   * 点击分页按钮，重新拉取数据
   *
   */
  pageIndexChange(obj) {
    if (obj !== null && obj !== undefined) {
      this.applyInfoPage.pages = obj.pages;
      this.applyInfoParam.pages = obj.pages;
      this.bindWaitAuditApplyInfoData();
    }
  }
  /**
   * 点击提交表单
   *
   */
  getFormObjChange(data) {
    if (this.utilHelper.AssertNotNull(data)) {
      // this.formAnimate = 'hidden';
      this.formNum = 1;
      data.startApplyTime = this.formatBeginDate(data.startApplyTime);
      data.endApplyTime = this.formatEndDate(data.endApplyTime);
      this.applyInfoParam.certificateNum = data.certificateNum;
      this.applyInfoParam.deliveryReceiptNumbr = data.deliveryReceiptNumbr;
      this.applyInfoParam.applyStartTime = data.startApplyTime;
      this.applyInfoParam.applyEndTime = data.endApplyTime;
      this.applyInfoParam.applyPurpose = data.applyPurpose;
      this.applyInfoParam.applyType = data.applyType;
      this.applyInfoParam.sortOrder = null;
      this.applyInfoParam.pages = 0;
      this.pagination.first.numPage = 0;
      this.bindWaitAuditApplyInfoData();
    }
  }



  /**确定隐藏搜索表单
   */
  srueHiddenForm() {
    this.form.form.reset();
    this.formAnimate = 'show';
    this.formNum = 1;
    this.applyInfoParam = new ApplyInfoParam();
    this.applyInfoParam.pages = 0;
    this.applyInfoParam.pageSize = 10;
    this.applyInfoParam.auditPersonId = this.auditId;
    this.bindWaitAuditApplyInfoData();
    this.confirmVisible = false;
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.confirmVisible = false;
  }
  /**
   * 点击显示搜索
   *
   */
  async showForm(num) {
    try {
      if (this.utilHelper.AssertNotNull(this.formObjEmit)) {
        if (num === 1) {
          this.formAnimate = 'hidden';
          this.formNum = 0;
        } else {
          this.confirmVisible = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
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
}


