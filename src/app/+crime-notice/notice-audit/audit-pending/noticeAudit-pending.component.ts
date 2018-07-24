import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NoticeAuditService } from '../../common/services/notice-audit.service';
import { LocalStorageService, UtilHelper, EventAggregator, DateFormatHelper } from '../../../core';
import { Router } from '@angular/router';
import { UserInfo } from '../../../model/auth/userinfo';
import { DxDataGridComponent } from 'devextreme-angular';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
@Component({
    templateUrl: './noticeAudit-pending.component.html',
    providers: [NoticeAuditService]
})

export class NoticeAuditPendingComponent implements OnInit {

    @ViewChild(DxDataGridComponent)
    grid: DxDataGridComponent;
    @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
    requestParameters: any; // 接口参数
    roleId: any; // 角色ID;
    dataList: any; // 数据列表
    auditNoticeList: any; // 待审核公告列表
    dataCount: any; // 数据总条数
    rowData: any; // 单行数据
    LoadingPanelVisible: boolean = false; // loading开关
    isAllow: boolean = true;
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

        // 生成接口参数
        this.requestParameters = {
            pages: 0,
            pageSize: 10,
            auditorId: this.roleId,
            businessType: 3
        };

    }

    async ngOnInit() {

        // 初始化接口地址
        await this.service.initialCrmsService();

        // 初始化待审核公告列表
        this.bindAuditNoticeList();

        // 路由信息
        this.bindRoutUrl('CrimeNoticeManagement', 'NoticeAuditPending');
        sessionStorage.setItem('currentRouter', 'noticeAudit-pending');
        // 当前页收到消息一条待审核的公告,刷新列表记录
        this.eventAggregator.subscribe('noticeAuditPendingRecordRefreshTask', '', result => {
            this.bindAuditNoticeList();
        });

    }

    // 路由绑定header路径
    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }

    // 获取待审核公告列表
    async bindAuditNoticeList() {
        this.LoadingPanelVisible = true;
        this.dataList = await this.service.getWaitAuditNoticeList(this.requestParameters);
        if (!this.utilHelper.AssertEqualNull(this.dataList)) {
            this.auditNoticeList = this.dataList.data;
            if (this.utilHelper.AssertNotNull(this.auditNoticeList)) {
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
        setTimeout(() => { this.LoadingPanelVisible = false; }, 600);
    }

    // 选中单行列表
    selectedRow(data) {
        if (this.utilHelper.AssertNotNull(data.selectedRowKeys[0])) {
            this.rowData = data.selectedRowKeys[0];
            this.rowData.roleId = this.roleId;
            this.isAllow = false;
        }
    }

    // 跳往详情页 2018-2-5 发现status参数没有使用
    navigateToAuditDetail() {
        let noticeIdAndFlag = {
            noticeId: this.rowData.noticeId,
            roleId: this.roleId,
            status: this.rowData.noticeInputStatus,
            flag: 'noticeAudit-pending'
        };
        this.router.navigate(['/crms-system/crime-notice/noticeAudit-detail', noticeIdAndFlag]);
    }

    // 刷新列表
    refreshList() {
        this.requestParameters = {
            pages: 0,
            pageSize: 10,
            auditorId: this.roleId,
            businessType: 3
        };
        this.pagination.first.numPage = 0;
        this.bindAuditNoticeList();
        this.isAllow = true;
        this.grid.selectedRowKeys = [];
    }

    // 分页传输的数据
    getpageObjChange(obj) {
        this.requestParameters = obj;
        this.bindAuditNoticeList();
    }

}
