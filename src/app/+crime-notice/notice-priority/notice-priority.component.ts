import { Component, OnInit, trigger, state, style, animate, transition, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import * as ip from 'internal-ip';

import { LocalStorageService, UtilHelper, DateFormatHelper, EventAggregator, LoggerRecordService } from '../../core';

import { CrimeSearchInfo } from '../../model/crime-notice/crimeSearchInfo';
import { NoticeInfo } from '../../model/crime-notice/noticeInfo';
import { PaginationComponent, CommonFromComponent } from '../../shared';
import { UserInfo } from '../../model/auth/userinfo';
import { OperationLog } from '../../model/logs/operationLog';
import { NoticePriorityService } from '../common/services/notice-priority.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';


@Component({
  templateUrl: './notice-priority.component.html',
  providers: [ApplyCommonService, NoticePriorityService],
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
export class NoticePriorityComponent implements OnInit {
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  @ViewChild('grid')
  grid: DxDataGridComponent;

  // 用户信息
  userInfo: UserInfo = null;
  // 当前用户Id
  userId: string;
  // 角色类型
  roleType: string;
  // 公告Id
  noticeId: string;
  // 修改后的优先级
  priority: string;
  // 当前修改的优先级
  currentPriority: string;
  // confirm提示信息
  message: string;
  // 公告优先级
  priorityList: any[] = [];

  // 公告优先级修改对象
  newNoticeInfo: NoticeInfo;

  // 分页
  // 查询对象
  searchInfoParam: CrimeSearchInfo;
  // 页数
  totalCount: number;
  // 公告列表
  noticeList: any[] = [];
  // loading显示
  LoadingPanelVisible: boolean = false;
  // 查看按钮是否可用
  isWatchDetail: boolean = true;

  /**
   *表单循环的对象
   *
   */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;

  // 分页按钮是否可见
  pageMenuVisible: boolean = false;
  // radio的value是否改变
  radioChanged: boolean = false;
  // confirm是否可见
  confirmVisible: boolean = false;
  // 是否确认修改
  toUpdate: boolean;

  operationLog: OperationLog;
  formConfirmVisible: boolean = false;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  constructor(
    private noticePriorityService: NoticePriorityService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private applyCommonService: ApplyCommonService,
    private dateFormatHelper: DateFormatHelper,
    private translateService: TranslateService,
    private utilHelper: UtilHelper,
    private eventAggregator: EventAggregator,
    private router: Router,
    private logger: LoggerRecordService,
  ) {
    this.newNoticeInfo = new NoticeInfo();
    this.searchInfoParam = new CrimeSearchInfo();
    this.operationLog = new OperationLog();

    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
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
    this.bindNoticeList();
    this.bindNoticePriorityData();

    this.bindRoutUrl('CrimeNoticeManagement', 'NoticeProirityAdjustment');
    sessionStorage.setItem('currentRouter', 'notice-priority');
    // 获取搜索表单的配置对象
    this.initForm();
  }

  async initForm() {
    // 获取搜索表单的配置对象
    this.formObjEmit = await this.noticePriorityService.searchFormObj();
  }
  /***
  * 路由绑定header路径
  */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 获取申请优先级
  bindNoticePriorityData() {
    this.applyCommonService.getApplyPriorityList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.priorityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 获取犯罪公告列表
  bindNoticeList() {
    this.LoadingPanelVisible = true;
    this.searchInfoParam.roleType = this.roleType;
    if (this.roleType === 'FILER') {
      this.searchInfoParam.enterPersonId = this.userId;
    }
    this.noticePriorityService.getNoticeList(this.searchInfoParam).then(result => {
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        // this.formNum = 0;
        this.noticeList = result.data;
        this.pageMenuVisible = false;
        this.totalCount = result.totalCount;
        if (this.utilHelper.AssertNotNull(this.noticeList)) {
          this.noticeList.forEach(item => {
            if (this.utilHelper.AssertNotNull(item.noticeCreateTime)) {
              item.noticeCreateTime = this.dateFormatHelper.YearMonthDayTimeFormat(item.noticeCreateTime);
            }
          });
        }
      }
    }).catch(err => {
      console.log(err);
    });
    setTimeout(() => { this.LoadingPanelVisible = false; }, 600);
  }

  //  获取公告Id
  getApplyNumber(e) {
    this.isWatchDetail = false;
    if (this.utilHelper.AssertNotNull(e)) {
      this.noticeId = e;
      if (this.utilHelper.AssertNotNull(this.priority) && (this.radioChanged === true)) {
        this.sureAmend(this.priority);
        this.radioChanged = false;
      }
    }
  }

  // 确认修改优先级
  sureAmend(priority: string) {
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
    this.toUpdate = true;
    this.confirmVisible = false;
    this.newNoticeInfo.noticeId = this.noticeId;
    this.newNoticeInfo.priority = this.priority;
    this.selectAndUpdate(this.newNoticeInfo);
  }

  // 取消修改
  cancelUpdate() {
    this.toUpdate = false;
    this.confirmVisible = false;
    this.bindNoticeList();
    this.isWatchDetail = true;
  }

  // 修改优先级
  selectAndUpdate(newNoticeInfo: NoticeInfo) {
    this.LoadingPanelVisible = true;
    this.noticePriorityService.updatePriority(newNoticeInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.toastrService.clear();
          this.toastrService.success(this.getTranslateName('modify success'));

          // 公告优先级修改成功日志记录
          try {
            this.operationLog.level = 'info';
            this.operationLog.action = 'UPDATE';
            let _newContent = JSON.stringify(newNoticeInfo).replace(/"/g, `'`);
            this.operationLog.newContent = _newContent;
            this.operationLog.actionDesc = 'update notice-priority success';
            this.logRecord();
          } catch (error) {
            console.log(error);
          }

        } else {
          this.toastrService.clear();
          this.toastrService.error(this.getTranslateName('modify failed'));

          // 公告优先级修改失败日志记录
          try {
            this.operationLog.level = 'error';
            this.operationLog.action = 'UPDATE';
            let _newContent = JSON.stringify(newNoticeInfo).replace(/"/g, `'`);
            this.operationLog.newContent = _newContent;
            this.operationLog.actionDesc = 'update notice-priority failed';
            this.logRecord();
          } catch (error) {
            console.log(error);
          }

        }
        this.refreshList();
      }).catch(error => {
        console.log(error);
      });
    setTimeout(() => { this.LoadingPanelVisible = false; }, 600);
  }


  // 获取修改的优先级
  updatePriority(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.radioChanged = true;
      this.priority = e.value;
    }
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
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.bindNoticeList();
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
      this.searchInfoParam.noticeNumber = data.noticeNumber;
      this.searchInfoParam.courtId = data.courtId;
      this.searchInfoParam.enteringTime = data.enteringTime;
      this.searchInfoParam.certificateNumber = data.certificateNumber;
      this.searchInfoParam.startNoticeCreateTime = data.startNoticeCreateTime;
      this.searchInfoParam.endNoticeCreateTime = data.endNoticeCreateTime;
      this.searchInfoParam.pages = 0;
      this.pagination.first.numPage = 0;
      this.bindNoticeList();
      this.grid.selectedRowKeys = [];
    }
  }


  // 刷新列表
  refreshList() {
    this.isWatchDetail = true;
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.pagination.first.numPage = 0;
    this.bindNoticeList();
    this.grid.selectedRowKeys = [];
  }

  /**
   * 分页传输的数据
   */
  getpageObjChange(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.searchInfoParam = obj;
      this.bindNoticeList();
    }
  }

  // 查看公告详情
  watchNoticeDetail() {
    let noticeIdAndFlag = {
      noticeId: this.noticeId,
      flag: 'notice-priority'
    };
    this.router.navigate(['/crms-system/crime-notice/notice-detail', noticeIdAndFlag]);
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
    this.operationLog.business = 'notice-priority';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'crime-notice';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }
}



