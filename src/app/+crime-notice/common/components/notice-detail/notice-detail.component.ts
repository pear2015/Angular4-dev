import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilHelper, EventAggregator } from '../../../../core';
import { EnumInfo } from '../../../../enum';
import { NoticeInfo } from '../../../../model/crime-notice/noticeInfo';
import { CrimeInfo } from '../../../../model/crime-notice/crimeInfo';
import { CrimePersonInfo } from '../../../../model/crime-notice/crimePersonInfo';
import { NoticeAuditService } from '../../services/notice-audit.service';

@Component({
    templateUrl: './notice-detail.component.html',
    providers: [NoticeAuditService, EnumInfo]
})

export class NoticeDetailComponent implements OnInit {

    noticeId: string;    // 公告编号
    noticeInfo: NoticeInfo; // 公告信息
    crimeInfo: CrimeInfo; // 犯罪基本信息
    crimePersonInfo: CrimePersonInfo; // 犯罪个人信息
    noticeBox: boolean = true; // 公告信息容器
    personBox: boolean = false; // 罪犯信息容器
    attachmentList: any[]; // 附件列表
    attchmentControllObj: any;  // 附件控制
    routerFlag: any;
    constructor(
        private service: NoticeAuditService,
        private route: ActivatedRoute,
        private router: Router,
        private enumInfo: EnumInfo,
        private utilHelper: UtilHelper,
        private eventAggregator: EventAggregator
    ) {
        this.noticeInfo = new NoticeInfo();
        this.crimeInfo = new CrimeInfo();
        this.crimePersonInfo = new CrimePersonInfo();
        this.attchmentControllObj = {
            uploadFile: false,
            preview: true,
            ocrRecognize: false,
            removeSingle: false
        };

    }
    ngOnInit() {

        // 初始化接口地址
        this.service.initialCrmsService()
            .then(result => {
                this.bindDataList();

            });
        // 获取接口参数
        this.route.params.subscribe(data => {
            this.noticeId = data.noticeId;
            this.routerFlag = data.flag;
        });
        sessionStorage.setItem('currentRouter', 'notice-detail');
        // 路由信息
        this.bindRoutUrl('CrimeNoticeManagement', 'notice detail');

    }
    // 获取通知状态
    public get noticeStatus() {
        return this.enumInfo.getNoticeStatus;
    }

    // 路由绑定header路径
    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }

    // 获取数据列表
    async bindDataList() {
        // 获取数据源
        let result = await this.service.getNoticeDetails(this.noticeId);
        if (this.utilHelper.AssertNotNull(result)) {
            this.noticeInfo = result.noticeInfo;
            this.crimePersonInfo = result.crimePersonInfo;
            this.crimeInfo = result.crimeInfo;
            this.attachmentList = result.attachmentInfo;
            if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.crimePersonInfo.age === 0
                && this.utilHelper.AssertEqualNull(this.crimePersonInfo.dateOfBirth)) {
                this.crimePersonInfo.age = null;
            }
        }
    }

    showNotice() {
        this.noticeBox = true;
        this.personBox = false;
    }
    showPerson() {
        this.noticeBox = false;
        this.personBox = true;
    }
    goBack() {
        if (this.routerFlag === 'noticeAudit-pending') {
            this.router.navigate(['/crms-system/crime-notice/noticeAudit-pending']);
        }
        if (this.routerFlag === 'noticeAudit-complete') {
            this.router.navigate(['/crms-system/crime-notice/noticeAudit-complete']);
        }
        if (this.routerFlag === 'notice-reject') {
            this.router.navigate(['/crms-system/crime-notice/notice-reject']);
        }
        if (this.routerFlag === 'notice-history') {
            this.router.navigate(['/crms-system/crime-notice/notice-history']);
        }
        if (this.routerFlag === 'notice-auditing') {
            this.router.navigate(['/crms-system/crime-notice/notice-auditing']);
        }
        if (this.routerFlag === 'notice-priority') {
            this.router.navigate(['/crms-system/crime-notice/notice-priority']);
        }
    }

}
