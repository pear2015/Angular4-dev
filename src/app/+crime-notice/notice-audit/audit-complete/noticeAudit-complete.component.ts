import { Component, OnInit, trigger, state, style, animate, transition, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NoticeAuditService } from '../../common/services/notice-audit.service';
import { LocalStorageService, UtilHelper, EventAggregator, DateFormatHelper } from '../../../core';
import { Router } from '@angular/router';
import { UserInfo } from '../../../model/auth/userinfo';
import { DxDataGridComponent } from 'devextreme-angular';
import { CrimeSearchInfo } from '../../../model/crime-notice/crimeSearchInfo';
import { PaginationComponent, CommonFromComponent } from '../../../shared';
@Component({
  templateUrl: './noticeAudit-complete.component.html',
  providers: [NoticeAuditService],
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
export class NoticeAuditCompleteComponent implements OnInit {

  @ViewChild(DxDataGridComponent)
  grid: DxDataGridComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  // requestParameters: any; // 接口参数
  roleId: any; // 角色ID;
  dataList: any; // 数据列表
  auditNoticeList: any; // 待审核公告列表
  dataCount: any; // 数据总条数
  rowData: any; // 单行数据
  LoadingPane: boolean = false; // loading开关
  isAllow: boolean = true;

  /**
   *表单循环的对象
   *
   */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  // 查询对象
  searchInfoParam: CrimeSearchInfo;
  // 查询按钮是否禁用
  isWatchDetail: boolean = true;
  confirmVisible: boolean = false;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  constructor(

    private service: NoticeAuditService,
    private utilHelper: UtilHelper,
    private router: Router,
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private dateFormatHelper: DateFormatHelper
  ) {

    // 从缓存中获取登陆的分析员ID
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.roleId = user.orgPersonId;
    this.searchInfoParam = new CrimeSearchInfo();
  }

  async ngOnInit() {
    this.initCrimeSearchInfo();
    // 初始化接口地址
    await this.service.initialCrmsService();
    // 初始化待审核公告列表
    this.bindAuditNoticeList();
    // 路由信息
    this.bindRoutUrl('CrimeNoticeManagement', 'NoticeAuditComplete');
    sessionStorage.setItem('currentRouter', 'noticeAudit-complete');
    this.initForm();
  }
  /**
   * 初始化搜索体
   * @memberof NoticeAuditCompleteComponent
   */
  initCrimeSearchInfo() {
    this.searchInfoParam.auditPersonId = this.roleId;
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
  }
  async initForm() {
    // 获取搜索表单的配置对象
    this.formObjEmit = await this.service.searchCompeleteAuditNoticeFormObj();
  }
  // 路由绑定header路径
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 获取已审核公告列表
  async bindAuditNoticeList() {
    this.LoadingPane = true;
    this.dataList = await this.service.getHasAuditedNoticeList(this.searchInfoParam);
    if (this.utilHelper.AssertNotNull(this.dataList)) {
      // this.formNum = 0;
      this.auditNoticeList = this.dataList.data;
      if (this.utilHelper.AssertNotNull(this.auditNoticeList) && this.auditNoticeList.length > 0) {
        this.auditNoticeList.forEach(item => {
          if (this.utilHelper.AssertNotNull(item)) {
            item.criminalName = item.firstName + ' ' + item.lastName;
          }
          if (this.utilHelper.AssertNotNull(item.noticeCreateTime)) {
            item.noticeCreateTime = this.dateFormatHelper.YearMonthDayTimeFormat(item.noticeCreateTime);
          }
        });
      }
      this.dataCount = this.dataList.totalCount;
    }
    setTimeout(() => { this.LoadingPane = false; }, 600);
  }

  // 选中单行列表
  selectedRow(data) {
    if (this.utilHelper.AssertNotNull(data.selectedRowKeys[0])) {
      this.rowData = data.selectedRowKeys[0];
      this.isAllow = false;
    }
  }

  // 跳往详情页
  navigateToAuditDetail() {
    let noticeIdAndFlag = {
      noticeId: this.rowData.noticeId,
      roleId: this.roleId,
      status: this.rowData.noticeInputStatus,
      flag: 'noticeAudit-complete'
    };
    this.router.navigate(['/crms-system/crime-notice/notice-detail', noticeIdAndFlag]);
  }

  // 刷新列表
  refreshList() {
    this.searchInfoParam.auditPersonId = this.roleId;
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.pagination.first.numPage = 0;
    this.bindAuditNoticeList();
    this.isAllow = true;
    this.grid.selectedRowKeys = [];
  }

  // 分页传输的数据
  getpageObjChange(obj) {
    this.searchInfoParam = obj;
    this.bindAuditNoticeList();
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


  /**确定隐藏搜索表单
  */
  srueHiddenForm() {
    this.form.form.reset();
    this.formAnimate = 'show';
    this.formNum = 1;
    this.isWatchDetail = true;
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.auditPersonId = this.roleId;
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.bindAuditNoticeList();
    this.grid.selectedRowKeys = [];
    this.confirmVisible = false;
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.confirmVisible = false;
  }

  /**
   * 点击提交搜索表单
   *
   */
  getFormObjChange(data) {
    if (this.utilHelper.AssertNotNull(data)) {
      this.isWatchDetail = true;
      // this.formAnimate = 'hidden';
      this.formNum = 1;
      this.searchInfoParam.noticeNumber = data.noticeNumber;
      this.searchInfoParam.courtId = data.courtId;
      this.searchInfoParam.startNoticeCreateTime = data.startNoticeCreateTime;
      this.searchInfoParam.endNoticeCreateTime = data.endNoticeCreateTime;
      this.searchInfoParam.certificateNumber = data.certificateNumber;
      this.searchInfoParam.noticeStatus = data.noticeStatus;
      this.searchInfoParam.pages = 0;
      this.pagination.first.numPage = 0;
      this.bindAuditNoticeList();
      this.grid.selectedRowKeys = [];
    }
  }

}
