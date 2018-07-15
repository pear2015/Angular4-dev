import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';

import { ApplyAuditService } from './../apply-audit.service';
import { EventAggregator, LocalStorageService, UtilHelper } from '../../../core/';
import { UserInfo } from '../../../model/auth/userinfo';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    templateUrl: './applyAudit-pending.component.html',
    providers: [ApplyAuditService]

})

export class ApplyAuditPendingComponent implements OnInit {
    @ViewChild(DxDataGridComponent)
    auditInfoGrids: DxDataGridComponent;
    @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;

    /**
     * 待审核基本信息
     * 1.applyId 申请信息Id
     * 2.申请信息
     */
    applyId: string;
    auditInfoList: any[];
    historyRecordList: any[];

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
    loadingApply: boolean = false; // loading开关
    constructor(
        private applyAuditService: ApplyAuditService,
        private router: Router,
        private eventAggregator: EventAggregator,
        private localStorageService: LocalStorageService,
        private utilHelper: UtilHelper
    ) { }

    ngOnInit() {
        let user = this.localStorageService.readObject('currentUser') as UserInfo;
        this.auditId = user.orgPersonId;

        this.role = Number(localStorage.role);
        /**
         * 初始化犯罪服务基地址
         * 1.获取待审核申请基本信息
         */
        this.bindWaitAuditApplyInfoData(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        // 路由路径绑定
        this.bindRoutUrl('CrimeCertifyManagement', 'ApplyAuditPending');
        sessionStorage.setItem('currentRouter', 'applyAudit-pending');
        // 收到数据后刷新数据
        this.eventAggregator.subscribe('applyAuditRefreshTask', '', result => {
            this.bindWaitAuditApplyInfoData(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        });
    }


    /**
     * 获取待审核申请基本信息
     *
     * @memberof ApplyAuditComponent
     */
    bindWaitAuditApplyInfoData(pages, pageSize) {
        this.loadingApply = true;
        this.applyAuditService.getWaitAuditApplyInfoForDisplay(pages, pageSize, this.auditId)
            .then(result => {
                if (this.utilHelper.AssertNotNull(result)) {
                    if (result.success) {
                        this.auditInfoList = result.data;
                        this.dataCount = result.totalCount;
                    }
                }

            }).catch(err => {
                console.log(err);
            });
        setTimeout(() => { this.loadingApply = false; }, 600);
    }

    /**
     * 审核按钮路由跳转
     *
     * @memberof ApplyAuditComponent
     */
    navigateToAuditDetail() {
        let applyIdAndFlag: NavigationExtras = {
            queryParams: {
                applyId: this.applyId,
                applyTypeId: this.rowInfo.applyTypeId,
                flag: 'applyAudit-pending'
            }
        };
        this.router.navigate(['/crms-system/crime-certify/applyAudit-detail'], applyIdAndFlag);
        // this.router.navigate(['apply-audit', this.applyId]);
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
        this.applyInfoPage.pages = 0;
        this.pagination.first.numPage = 0;
        this.bindWaitAuditApplyInfoData(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
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
            this.bindWaitAuditApplyInfoData(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        }
    }

}


