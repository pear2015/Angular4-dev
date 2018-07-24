import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { NoticeInquireComponent } from '../common/components/notice-inquire/notice-inquire.component';

import { NoticeInquireService } from '../common/services/notice-inquire.service';
import { LocalStorageService, EventAggregator, UtilHelper, DateFormatHelper } from '../../core/';
import { UserInfo } from '../../model/auth/userinfo';
import { CrimeSearchInfo } from '../../model/crime-notice/crimeSearchInfo';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
/**
 * 被驳回的公告列表
 */
@Component({
    templateUrl: './notice-reject.component.html',
    providers: [NoticeInquireService],

})
export class NoticeRejectComponent implements OnInit {

    @ViewChild(NoticeInquireComponent)
    noticeInquire: NoticeInquireComponent;
    @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
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

    constructor(
        private noticeInquireService: NoticeInquireService,
        private utilHelper: UtilHelper,
        private localStorageService: LocalStorageService,
        private eventAggregator: EventAggregator,
        private translateService: TranslateService,
        private dateFormatHelper: DateFormatHelper,
        private router: Router
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
        this.bindRejectedNoticeList();
        this.bindRoutUrl('CrimeNoticeManagement', 'NoticeReject');
        this.title = this.getTranslateName('rejected notice');
        sessionStorage.setItem('currentRouter', 'notice-reject');
        // 当前页收到驳回消息一条审公告,刷新列表记录
        this.eventAggregator.subscribe('noticeRejectRecordRefreshTask', '', result => {
            this.bindRejectedNoticeList();
        });
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
    bindRejectedNoticeList() {
        this.LoadingPanelVisible = true;
        this.searchInfoParam.enterPersonId = this.userId;
        this.searchInfoParam.roleType = this.currentRole;
        this.noticeInquireService.getNoticeReplyDataForDisplay(this.searchInfoParam).then(result => {
            if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
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
            flag: 'notice-reject'
        };
        if (this.currentRole === 'FILER') {
            this.router.navigate(['/crms-system/crime-notice/notice-reinput', noticeIdAndFlag]);
        } else {
            this.router.navigate(['/crms-system/crime-notice/notice-detail', noticeIdAndFlag]);
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
            this.isWatchDetail = true;
            this.bindRejectedNoticeList();
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
        this.bindRejectedNoticeList();
        this.noticeInquire.grid.selectedRowKeys = [];
    }
}
