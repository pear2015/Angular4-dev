import { OnInit, Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

// import { ToastrService } from 'ngx-toastr';

import { ApplyRejectService } from './apply-reject.service';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';

import { LocalStorageService, EventAggregator, UtilHelper } from '../../core';
import { UserInfo } from '../../model/auth/userinfo';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TranslateService } from 'ng2-translate';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';


@Component({
    templateUrl: './apply-reject.component.html',
    providers: [ApplyRejectService, ApplyCommonService]
})

export class ApplyRejectComponent implements OnInit {

    reanalyseInfoList: any[]; // 分析任务列表
    analystId: string; // 当前操作员Id
    applyTypeId: string; // 申请类型Id
    analystInfo: any; // 申请人信息
    applyRejected: any; // 路由辨别参数
    applyId: any; // 申请人Id
    rejectedCause: string; // 驳回原因
    rejectedName: string; // 驳回人
    historyRecordList: any[] = []; // 历史记录list
    // 重新列表分页查询
    private applyInfoPage = { pages: 0, pageSize: 10 };
    // 数据总数
    dataCount: number = 1;
    loadingVisible: boolean = false; // loading开关
    @ViewChild(DxDataGridComponent)
    replyAnalysisGrid: DxDataGridComponent;
    @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;

    constructor(
        private localStorageService: LocalStorageService,
        private applyRejectService: ApplyRejectService,
        private applyComminService: ApplyCommonService,
        // private toastr: ToastrService,
        private router: Router,
        private eventAggregator: EventAggregator,
        private utilHelper: UtilHelper,
        private translateService: TranslateService,
    ) {

    };

    ngOnInit() {

        // 从缓存中获取登陆的分析员Id
        let user = this.localStorageService.readObject('currentUser') as UserInfo;
        this.analystId = user.orgPersonId;

        // 初始化服务基地址
        this.bindReanalyseInfoList(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        // 路由信息
        this.bindRoutUrl('CrimeCertifyManagement', 'ApplicationOfReAnalysis');
        // 存储当前路由信息
        sessionStorage.setItem('currentRouter', 'apply-reject');
        // 当前页收到消息一条待分析的申请,刷新列表记录
        this.eventAggregator.subscribe('replyAnalysisRefreshTask', '', result => {
            this.bindReanalyseInfoList(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        });
    };

    // 根据当前登陆的操作员Id获取他的任务分析列表
    bindReanalyseInfoList(pages, pageSize) {
        this.loadingVisible = true;
        this.applyRejectService.getReanalyseInfo(pages, pageSize, this.analystId)
            .then(result => {
                if (this.utilHelper.AssertNotNull(result) && result.success) {
                    this.reanalyseInfoList = result.data;
                    this.dataCount = result.totalCount;
                }
            }).catch(err => {
                console.log(err);
            });
        setTimeout(() => { this.loadingVisible = false; }, 600);
    }

    // 根据不同的申请类型跳转向分析页面
    navigateToReanalyse() {
        let applyIdAndFlag = {
            applyId: this.analystInfo.applyId,
            applyStatusId: this.analystInfo.applyStatusId,
            applyStatusName: this.analystInfo.applyStatusName,
            flag: 'apply-reject'
        };
        if (this.analystInfo.applyTypeId === '1') {
            this.router.navigate(['/crms-system/crime-certify/apply-analysis', applyIdAndFlag]);
        }
        if (this.analystInfo.applyTypeId === '2') {
            this.router.navigate(['/crms-system/crime-certify/apply-analysisgovermentDetail', applyIdAndFlag]);
        }

    }

    // 点击的时候就已选中，可获得当前行的数据
    selectRecordHandle(e) {
        if (this.utilHelper.AssertNotNull(e.selectedRowKeys[0])) {
            this.analystInfo = e.selectedRowKeys[0];
        }

    }


    // 获取历史记录列表
    watchRecordHistory() {
        this.applyId = this.analystInfo.applyId;
        this.applyComminService.getHandleHistory(this.applyId)
            .then(result => {
                if (this.utilHelper.AssertNotNull(result)) {
                    this.historyRecordList = result;
                }
            }).catch(e => {
                console.log(e);
            });
    }

    /**
     * 刷新列表
     */
    refreshList() {
        this.applyInfoPage.pages = 0;
        this.pagination.first.numPage = 0;
        this.bindReanalyseInfoList(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
        this.replyAnalysisGrid.selectedRowKeys = [];
        this.analystInfo = null;
    }

    // 路由绑定header路径

    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }
    /**
    * 点击分页按钮，重新拉取数据
    *
    */
    pageIndexChange(obj) {
        this.applyInfoPage.pages = obj.pages;
        this.bindReanalyseInfoList(this.applyInfoPage.pages, this.applyInfoPage.pageSize);
    }


    // 使用translateService对component字段进行国际化
    getTranslateName(code: string) {
        if (this.utilHelper.AssertNotNull(code)) {
            let key: any = this.translateService.get(code);
            return key.value;
        }
    }


}
