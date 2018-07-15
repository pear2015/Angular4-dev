import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LocalStorageService, EventAggregator, UtilHelper } from '../../core/';

import { ApplyCompleteService } from './apply-complete.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';

import { UserInfo } from '../../model/auth/userinfo';
import { CertificatePrintInfo } from '../../model/certificate-apply/CertificatePrintInfo';
import { DxDataGridComponent } from 'devextreme-angular';
import { OperationLog } from '../../model/logs/operationLog';
import { ApplyInfo } from '../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
import { CrimeRecordPrint } from '../../model/crime-notice/CrimeRecordPrint';
import { CertificatePrintComponent } from '../common/components/certificate-print/certificate-print.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
/**
 * 政府申请记录
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
    templateUrl: './apply-complete.component.html',
    providers: [ApplyCompleteService, ApplyCommonService]
})
export class ApplyCompleteComponent implements OnInit {
    crimeNoticeList: CrimeRecordPrint[];

    userId: string;
    governmentRecordList: any[];
    applyRecord: any;
    showDetailsBtn: boolean = true;
    showPrintCerBtn: boolean = true;
    enterPersonName: string;
    certificatePrintInfo: CertificatePrintInfo;
    certificateInfo: CertificatePrintInfo;
    showPersonRecord: boolean = true;

    @ViewChild(DxDataGridComponent)
    govermentRecordGrids: DxDataGridComponent;

    @ViewChild(CertificatePrintComponent)
    CerPrintComponent: CertificatePrintComponent;
    @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;

    // 历史记录列表
    handleHistoryList: any[] = [];
    // 申请Id
    applyId: string;

    operationLog: OperationLog;
    // 审核列表分页查询
    private govermentRecodePage = { pages: 0, pageSize: 10 };
    // 数据总数
    dataCount: number = 1;
    applyInfo: ApplyInfo;
    applyBasicInfo: ApplyBasicInfo;
    crimeAndNoticeList: CrimeRecordPrint[] = [];
    loadingVisible: boolean = false; // loading开关

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
        this.bindRoutUrl('CrimeCertifyManagement', 'ApplyCompleteRecord');
    }

    /***
  * 路由绑定header路径
  */
    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        if (parentUrl !== null && parentUrl !== undefined && childrenUrl !== null && childrenUrl !== undefined) {
            this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
        }
    }

    ngOnInit() {
        // 获取当前登录人的信息
        let user = this.localStorageService.readObject('currentUser') as UserInfo;
        this.userId = user.orgPersonId;

        // 日志记录操作员的name 和 Id
        this.operationLog.operator = user.userName;
        this.operationLog.operatorId = user.orgPersonId;
        this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
        this.toastr.toastrConfig.positionClass = 'toast-center-center';
        sessionStorage.setItem('currentRouter', 'apply-complete');
        // 收到记录后刷新数据
        this.eventAggregator.subscribe('applyGovermentRecordRefreshTask', '', result => {
            this.govermentRecodePage.pages = 0;
            this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
        });
    }

    /**
    * 获取当天的该用户申请业务数据
    */
    bindTodayHandledApplyQuantity(page, pageSize) {
        this.loadingVisible = true;
        if (page !== null && page !== undefined && pageSize !== null && pageSize !== undefined) {
            this.applyCompleteService.getTodayHandledApplyQuantity(page, pageSize, this.userId)
                .then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.governmentRecordList = result.data;
                        this.dataCount = result.totalCount;
                    }
                }).catch(err => {
                    console.log(err);
                });
        }
        setTimeout(() => { this.loadingVisible = false; }, 600);
    }

    /**
     * 选择列表中的一项 获取状态数据 控制按钮显示
     */
    selectRecordHandle(e) {
        if (this.utilHelper.AssertNotNull(e) && e.selectedRowKeys.length > 0) {
            this.applyRecord = e.selectedRowsData[0];
            this.applyId = this.applyRecord.applyId;
            let recordStatus = this.applyRecord.applyStatusId;
            if (recordStatus === '1' || recordStatus === '2') {
                this.showDetailsBtn = false;
                this.showPrintCerBtn = true;
                this.toastr.clear();
            }
            if (recordStatus === '3' || recordStatus === '4') {
                this.showDetailsBtn = false;
                this.showPrintCerBtn = false;
                this.toastr.clear();
            } else if (recordStatus === '5') {
                let rejectReson = this.applyRecord.auditRejectReason;
                this.showDetailsBtn = false;
                this.showPrintCerBtn = true;

                if (this.utilHelper.AssertNotNull(rejectReson)) {
                    this.toastr.info(rejectReson);
                }
            }
        }
    }

    // 查看选中申请记录详情
    watchGovernmentRecord() {
        let applyTypeId = this.applyRecord.applyTypeId;
        // let flag: string;
        let applyIdAndFlag = {
            applyId: this.applyRecord.applyId,
            applyStatusId: this.applyRecord.applyStatusId,
            applyStatusName: this.applyRecord.applyStatusName,
            flag: 'apply-complete'
        };
        if (applyTypeId === '1') {
            this.router.navigate(['/crms-system/crime-certify/personApply-detail', applyIdAndFlag]);
        }
        if (applyTypeId === '2') {
            this.router.navigate(['/crms-system/crime-certify/apply-govermentDetail', applyIdAndFlag]);
        }

    }
    /**
     * 获取申请详情
     */
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
    async printCertificate() {
        await this.getApplyCrimeRecordByApplyId();
        this.crimeNoticeList = this.crimeAndNoticeList;
        await this.CerPrintComponent.saveInitCertificateInfo(this.applyRecord);
        await this.CerPrintComponent.getCertificatePrintInfo(this.applyRecord);
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
        }
    }

    /**
     * 刷新列表
     */
    refreshList() {
        this.govermentRecodePage.pages = 0;
        this.pagination.first.numPage = 0;
        this.bindTodayHandledApplyQuantity(this.govermentRecodePage.pages, this.govermentRecodePage.pageSize);
        if (this.utilHelper.AssertNotNull(this.govermentRecordGrids.selectedRowKeys)
            && this.govermentRecordGrids.selectedRowKeys.length > 0) {
            this.govermentRecordGrids.selectedRowKeys = [];
        }
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

}
