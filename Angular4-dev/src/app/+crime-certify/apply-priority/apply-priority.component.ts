import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, ViewChildren, QueryList } from '@angular/core';

import { DxRadioGroupComponent } from 'devextreme-angular';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as ip from 'internal-ip';

import { ApplyPriorityService } from './apply-priority.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';
import { LocalStorageService, UtilHelper, DateFormatHelper, EventAggregator, LoggerRecordService } from '../../core';
import { UserInfo } from '../../model/auth/userinfo';
import { ApplyInfoParam } from '../../model/application-credentials-management/applyInfoParam';
import { PaginationComponent, CommonFromComponent } from '../../shared';
import { Router } from '@angular/router';
import { OperationLog } from '../../model/logs/operationLog';



@Component({
  templateUrl: './apply-priority.component.html',
  providers: [ApplyPriorityService, ApplyCommonService, DxRadioGroupComponent, DateFormatHelper],
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

export class ApplyPriorityComponent implements OnInit {

  @ViewChild('priorityRadio') priorityRadio: DxRadioGroupComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  @ViewChild('grid') grid: DxDataGridComponent;

  // 用户信息
  userInfo: UserInfo = null;

  // 申请信息列表
  applyList: any[] = [];

  // 申请Id
  applyId: string;

  // 修改后的优先级
  priority: string;

  // 角色欣喜
  roleType: string;

  // 角色Id
  userId: string;

  // 优先级列表
  priorityList: any[] = [];

  // 是否更新成功
  isUpdateSuccess: boolean;
  // 查看按钮是否可用
  isWatchDetail: boolean = true;

  // 修改人信息
  modifyPersonName: string;
  // 修改描述
  modifyDescription: string;

  // 修改的优先级
  currentPriority: string;

  // radio的value是否改变
  radioChanged: boolean = false;


  // confirm是否可见
  confirmVisible: boolean = false;

  // confirm提示信息
  message: string;

  // 定时器
  timerAdmin: any;
  timerOther: any;

  /**
   *表单循环的对象
   *
   */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;

  // 分页菜单(上一页，下一页)是否可见
  pageMenuVisible: boolean = true;

  /**
   * 分页对象
   *
   */
  applySearchInfoParam: ApplyInfoParam;
  /**
   * 页数
   * @type {number}
   * @memberof ApplyPriorityComponent
   */
  dataCount: number;
  /**
   * 管理员ID
   */
  adminId: string;
  loadingVisible: boolean = false; // loading开关
  applyObj: any; // 单行数据

  // 操作日志
  operationLog: OperationLog;
  formConfirmVisible: boolean = false;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  constructor(
    private applyPriorityService: ApplyPriorityService,
    private applyCommonService: ApplyCommonService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private utilHelper: UtilHelper,
    private logger: LoggerRecordService,
    private eventAggregator: EventAggregator,
    private router: Router,
  ) {
    this.applySearchInfoParam = new ApplyInfoParam();
    this.operationLog = new OperationLog();
    this.applySearchInfoParam.pages = 0;
    this.applySearchInfoParam.pageSize = 10;

  }

  ngOnInit() {

    // 获取登录人员的信息
    this.userInfo = this.localStorageService.readObject('currentUser') as UserInfo;

    // 日志记录操作员的name 和 Id
    this.operationLog.operator = this.userInfo.userName;
    this.operationLog.operatorId = this.userInfo.orgPersonId;

    this.toastrService.toastrConfig.positionClass = 'toast-center-center';
    this.roleType = this.userInfo.roleType;
    this.userId = this.userInfo.orgPersonId;
    this.bindApplyList();
    this.bindApplyPriorityData();

    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyPriorityAdjustment');
    // 获取搜索表单的配置对象
    this.initForm();
    sessionStorage.setItem('currentRouter', 'apply-priority');
  }


  // 初始化表单
  async initForm() {
    this.formObjEmit = await this.applyPriorityService.searchFormObj();
  }
  /***
   * 路由绑定header路径
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }


  // 获取申请信息
  bindApplyList() {
    if (this.roleType === 'MONITOR') {
      this.adminId = 'monkey';
      this.getApplyInfoListByAdmin();
    } else {
      this.getApplyInfoListByOther();
    }
  }

  // 初次获取管理员所能管理的申请信息
  getApplyInfoListByAdmin() {
    this.loadingVisible = true;
    this.applyPriorityService.getApplyList(this.applySearchInfoParam, this.adminId)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
          // this.formNum = 0;
          this.applyList = result.data;
          this.pageMenuVisible = false;
          this.dataCount = result.totalCount;
        } else {
          this.applyList = [];
          this.pageMenuVisible = true;
        }
      }).catch(error => {
        console.log(error);
      });
    setTimeout(() => { this.loadingVisible = false; }, 600);
  }

  // 初次获取非管理员所能管理的申请信息
  getApplyInfoListByOther() {
    this.loadingVisible = true;
    this.applyPriorityService.getApplyList(this.applySearchInfoParam, this.userId)
      .then(result => {

        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
          this.formNum = 0;
          this.applyList = result.data;

          // this.applyList.applyTypeName = result.data;
          this.pageMenuVisible = false;
          this.dataCount = result.totalCount;
        } else {
          this.applyList = [];
          this.pageMenuVisible = true;
        }
      }).catch(error => {
        console.log(error);
      });
    setTimeout(() => { this.loadingVisible = false; }, 600);
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
          this.formConfirmVisible = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**确定隐藏搜索表单
   */
  srueHiddenForm() {
    this.form.form.reset();
    this.isWatchDetail = true;
    this.formAnimate = 'show';
    this.formNum = 1;
    this.applySearchInfoParam = new ApplyInfoParam();
    this.applySearchInfoParam.pages = 0;
    this.applySearchInfoParam.pageSize = 10;
    this.bindApplyList();
    this.grid.selectedRowKeys = [];
    this.formConfirmVisible = false;
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.formConfirmVisible = false;
  }


  /**
   * 点击提交搜索表单
   *
   */
  getFormObjChange(data) {
    this.isWatchDetail = true;
    if (this.utilHelper.AssertNotNull(data)) {
      // this.formAnimate = 'hidden';
      this.formNum = 1;
      this.applySearchInfoParam.applyId = data.applyId;
      this.applySearchInfoParam.firstName = data.firstName;
      this.applySearchInfoParam.lastName = data.lastName;
      this.applySearchInfoParam.certificateNum = data.certificateNumber;
      this.applySearchInfoParam.applyPurpose = data.applyPurpose;
      this.applySearchInfoParam.applyStartTime = data.startApplyTime;
      this.applySearchInfoParam.applyEndTime = data.endApplyTime;
      this.applySearchInfoParam.deliveryReceiptNumbr = data.deliveryReceiptNumbr;
      this.applySearchInfoParam.pages = 0;
      this.pagination.first.numPage = 0;
      this.bindApplyList();
      this.grid.selectedRowKeys = [];
    }
  }

  //  获取申请编号
  getApplyNumber(e) {
    this.isWatchDetail = false;
    if (this.utilHelper.AssertNotNull(e)) {
      this.applyId = e;
      if (this.utilHelper.AssertNotNull(this.priority) && (this.radioChanged === true)) {
        this.sureAmend(this.priority, this.applyId, this.modifyPersonName);
        this.radioChanged = false;
      }
    }
  }

  // 获取修改的优先级
  updatePriority(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.radioChanged = true;
      this.priority = e.value;
      this.modifyPersonName = this.userInfo.orgPersonId;
    }
  }

  // 确认修改优先级
  sureAmend(priority: string, applyId: string, modifyPersonName: string) {
    this.confirmVisible = true;
    if (priority === '0') {
      this.currentPriority = this.getTranslateName('common');
    } else {
      this.currentPriority = this.getTranslateName('urgent');
    }
    this.message = this.getTranslateName('sure to modify') + this.currentPriority + '?';
  }

  // 确认修改
  sureUpdate() {
    this.confirmVisible = false;
    this.selectAndUpdate(this.applyId, this.priority, this.modifyPersonName);
  }

  // 取消修改
  cancelUpdate() {
    this.confirmVisible = false;
    this.isWatchDetail = true;
    if (this.utilHelper.AssertNotNull(this.roleType) && this.roleType === 'MONITOR') {
      this.getApplyInfoListByAdmin();
    } else {
      this.getApplyInfoListByOther();
    }
  }


  // 修改优先级
  selectAndUpdate(applyId: string, priority: string, modifyPersonName: string) {
    this.loadingVisible = true;
    this.modifyPersonName = this.userInfo.orgPersonId;
    this.applyPriorityService.updatePriority(applyId, priority, modifyPersonName)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.toastrService.clear();
          this.toastrService.success(this.getTranslateName('modify success'));

          // 修改成功日志记录
          try {
            this.operationLog.level = 'info';
            this.operationLog.action = 'UPDATE';
            let _newContent = JSON.stringify(priority).replace(/"/g, `'`);
            this.operationLog.newContent = _newContent;
            this.operationLog.actionDesc = 'update apply-priority success';
            this.logRecord();
          } catch (error) {
            console.log(error);
          }


        } else {
          this.toastrService.clear();
          this.toastrService.error(this.getTranslateName('modify failed'));

          // 修改失败日志记录
          try {
            this.operationLog.level = 'error';
            this.operationLog.action = 'UPDATE';
            let _newContent = JSON.stringify(priority).replace(/"/g, `'`);
            this.operationLog.newContent = _newContent;
            this.operationLog.actionDesc = 'update apply-priority failed';
            this.logRecord();
          } catch (error) {
            console.log(error);
          }
        }
        this.refreshList();
      }).catch(error => {
        console.log(error);
      });
    setTimeout(() => { this.loadingVisible = false; }, 600);
  }


  /**
  * 分页传输的数据
  *
  */
  getpageObjChange(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.applySearchInfoParam = obj;
      this.bindApplyList();
    }
  }


  // 刷新列表
  refreshList() {
    this.isWatchDetail = true;
    this.applySearchInfoParam = new ApplyInfoParam();
    this.applySearchInfoParam.pages = 0;
    this.applySearchInfoParam.pageSize = 10;
    this.pagination.first.numPage = 0;
    if (this.roleType === 'MONITOR') {
      this.adminId = 'monkey';
      this.getApplyInfoListByAdmin();
    } else {
      this.getApplyInfoListByOther();
    }
    this.grid.selectedRowKeys = [];
  }

  // 选中一行数据
  selectedRow(data) {
    if (this.utilHelper.AssertNotNull(data.selectedRowKeys[0])) {
      this.applyObj = data.selectedRowKeys[0].applyInfo;
    }
  }

  // 查看详情
  detail() {
    let applyIdAndFlag = {
      applyId: this.applyObj.applyId,
      flag: 'apply-priority',
      priorityFlag: '1'
    };

    if (this.applyObj.applyTypeId === '1') {
      this.router.navigate(['/crms-system/crime-certify/personApply-detail', applyIdAndFlag]);
    } else if (this.applyObj.applyTypeId === '2') {
      this.router.navigate(['/crms-system/crime-certify/apply-govermentDetail', applyIdAndFlag]);
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
    this.operationLog.business = 'apply-priority';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-certify';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }
}



