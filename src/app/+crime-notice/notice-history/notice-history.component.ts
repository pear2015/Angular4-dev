import { Component, OnInit, trigger, state, style, animate, transition, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { NoticeInquireComponent } from '../common/components/notice-inquire/notice-inquire.component';
import { NoticeInquireService } from '../common/services/notice-inquire.service';
import { LocalStorageService, EventAggregator, DateFormatHelper, UtilHelper } from '../../core/';
import { UserInfo } from '../../model/auth/userinfo';
import { CrimeSearchInfo } from '../../model/crime-notice/crimeSearchInfo';
import { PaginationComponent, CommonFromComponent } from '../../shared';
/**
 *  公告历史列表
 */
@Component({
  templateUrl: './notice-history.component.html',
  providers: [NoticeInquireService],
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
export class NoticeHistoryComponent implements OnInit {

  @ViewChild(NoticeInquireComponent)
  noticeInquire: NoticeInquireComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  // 标题
  title: string;

  // 犯罪公告列表
  noticeList: any = [];
  // 登录角色
  currentRole: string;
  // 当前用户Id
  userId: string;
  // 选中的公告ID
  noticeId: string;
  /**
    *表单循环的对象
    *
    */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;

  // 查询对象
  searchInfoParam: CrimeSearchInfo;

  // 分页菜单(上一页，下一页)是否可见
  pageMenuVisible: boolean = true;

  /**
   * 页数
   */
  totalCount: number;

  // 查询按钮是否禁用
  isWatchDetail: boolean = true;

  // loading显示
  LoadingPanelVisible: boolean = false;
  confirmVisible: boolean = false;
  constructor(
    private noticeInquireService: NoticeInquireService,
    private utilHelper: UtilHelper,
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
    private dateFormatHelper: DateFormatHelper,

    private router: Router,
  ) {
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
  }

  ngOnInit() {
    // 获取当前登录人的信息
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.currentRole = user.roleType;
    this.userId = user.orgPersonId;
    this.bindRecordNoticeList();
    this.bindRoutUrl('CrimeNoticeManagement', 'NoticeHistoryInquire');
    sessionStorage.setItem('currentRouter', 'notice-history');
    // 当前页收到消息公告审核结束,刷新列表记录
    this.eventAggregator.subscribe('noticeHistoryRecordRefreshTask', '', result => {
      this.bindRecordNoticeList();
    });
    this.title = this.getTranslateName('NoticeHistoryInquire');
    this.initForm();
  }

  async initForm() {
    // 获取搜索表单的配置对象
    this.formObjEmit = await this.noticeInquireService.searchHistoryFormObj();
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  /***
   * 路由绑定header路径
   */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  // 获取犯罪公告列表
  bindRecordNoticeList() {
    this.LoadingPanelVisible = true;
    this.searchInfoParam.roleType = this.currentRole;
    this.searchInfoParam.enterPersonId = this.userId;
    this.noticeInquireService.getHistoryNoticeData(this.searchInfoParam).then(result => {
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
        this.noticeInquire.closeGraidRow();
      } else {
        this.noticeList = [];
        this.pageMenuVisible = true;
      }
      this.noticeInquire.grid.instance.collapseAll(-1);
    }).catch(err => {
      console.log(err);
    });
    setTimeout(() => { this.LoadingPanelVisible = false; }, 600);
  }

  // 获取选中的一条公告
  getNoticeId(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      this.noticeId = e;
      this.isWatchDetail = false;
    }
  }


  // 查看公告详情
  watchNoticeDetail() {
    let noticeIdAndFlag = {
      noticeId: this.noticeId,
      flag: 'notice-history'
    };
    this.router.navigate(['/crms-system/crime-notice/notice-detail', noticeIdAndFlag]);
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

  /**确定显示搜索表单
    */
  srueHiddenForm() {
    this.form.form.reset();
    this.formAnimate = 'show';
    this.formNum = 1;
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.bindRecordNoticeList();
    this.isWatchDetail = true;
    this.noticeInquire.grid.selectedRowKeys = [];
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
      this.searchInfoParam = new CrimeSearchInfo();
      this.searchInfoParam.noticeNumber = data.noticeNumber;
      this.searchInfoParam.courtId = data.courtId;
      this.searchInfoParam.startNoticeCreateTime = data.startNoticeCreateTime;
      this.searchInfoParam.endNoticeCreateTime = data.endNoticeCreateTime;
      this.searchInfoParam.certificateNumber = data.certificateNumber;
      this.searchInfoParam.enterPersonName = data.enteringPersonName;
      this.searchInfoParam.noticeStatus = data.noticeStatus;
      this.searchInfoParam.pages = 0;
      this.bindRecordNoticeList();
      this.noticeInquire.grid.selectedRowKeys = [];
    }
  }

  /**
   * 分页传输的数据
   *
   */
  getSearchInfoParamEmit(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.searchInfoParam.pages = obj;
      this.noticeId = null;
      this.bindRecordNoticeList();
      this.isWatchDetail = true;
    }
  }

  /**
   * 刷新
   */
  refreshList() {
    this.noticeId = null;
    this.isWatchDetail = true;
    this.searchInfoParam = new CrimeSearchInfo();
    this.searchInfoParam.pages = 0;
    this.searchInfoParam.pageSize = 10;
    this.bindRecordNoticeList();
    this.noticeInquire.grid.selectedRowKeys = [];
  }
}
