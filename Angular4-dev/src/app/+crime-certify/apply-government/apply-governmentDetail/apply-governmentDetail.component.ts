import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { ApplyBasicInfo } from '../../../model/certificate-apply/ApplyBasicInfo';
import { AttachmentInfo } from '../../../model/common/AttachmentInfo';
import { UtilHelper, EventAggregator } from '../../../core';
import { EnumInfo } from '../../../enum';
@Component({
    templateUrl: './apply-governmentDetail.component.html',
    providers: [EnumInfo, ApplyCommonService]
})
export class ApplyGovermentDetailComponent implements OnInit {

    /**
      *1.政府申请信息
     * 2.政府申请基本信息
     * 3.附件基本信息
     * 4.申请和公告关联
     * 5.申请和公告关联列表
     * 6.保存合并信息
      */
    applyInfo: ApplyInfo;
    applyBasicInfo: ApplyBasicInfo;
    attachmentInfo: AttachmentInfo;
    attachmentList: AttachmentInfo[] = [];



    // 路由传参：applyIdAndStatus
    routeApplyId: string;
    routeApplyStatusId: string;
    routeApplyStatusName: string;
    routerFlag: string;
    // 犯罪公告列表
    attchmentControllObj: any;
    governmentBox: boolean = true;
    personBox: boolean = false;
    /**
     * 构造函数，初始化参数
     * @param applyGovermentService
     */
    constructor(
        private applyCommonService: ApplyCommonService,
        private utilHelper: UtilHelper,
        private enumInfo: EnumInfo,
        private route: ActivatedRoute,
        private router: Router,
        private eventAggregator: EventAggregator
    ) {
        this.applyInfo = new ApplyInfo();
        this.attchmentControllObj = {
            uploadFile: false,
            preview: true,
            ocrRecognize: false,
            removeSingle: false
        };
    }

    ngOnInit(): void {
        this.initEvent();
        this.initData();
    }
    // 获取申请枚举
    public get applyStatus() {
        return this.enumInfo.getApplyStatus;
    }
    // 初始化事件订阅
    initEvent() {
        // 获取路由导航传递过来的参数
        this.route.params.subscribe(data => {
            if (this.utilHelper.AssertNotNull(data) && JSON.stringify(data) !== '{}') {
                this.routeApplyId = data.applyId;
                this.routeApplyStatusId = data.applyStatusId;
                this.routeApplyStatusName = data.applyStatusName;
                this.routerFlag = data.flag;
                // 路由导航参数加载申请数据
                this.bindApplyInfoData(this.routeApplyId);
            }
        });
    }

    // 返回
    async goBack() {
        if (this.routerFlag === 'apply-history') {
            this.router.navigate(['/crms-system/crime-certify/apply-history']);
        } else if (this.routerFlag === 'certificate-management') {
            this.router.navigate(['/crms-system/crime-certify/certificate-management']);

        } else if (this.routerFlag === 'apply-goverment-record') {
            this.router.navigate(['/crms-system/crime-certify/apply-goverment-record']);

        } else if (this.routerFlag === 'apply-reject') {
            this.router.navigate(['/crms-system/crime-certify/apply-reject']);

        } else if (this.routerFlag === 'apply-incomplete') {
            this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);

        } else if (this.routerFlag === 'apply-complete') {
            this.router.navigate(['/crms-system/crime-certify/apply-complete']);

        } else if (this.routerFlag === 'apply-priority') {
            this.router.navigate(['/crms-system/crime-certify/apply-priority']);
        }
    }

    // 初始化数据
    initData() {
        this.applyInfo = new ApplyInfo();
        this.applyBasicInfo = new ApplyBasicInfo();
        this.attachmentInfo = new AttachmentInfo();
        this.bindRoutUrl('CrimeCertifyManagement', 'GovernmentApplication');
    }

    // 通过路由传递过来的参数获取需要查看的消息
    bindApplyInfoData(applyId: string) {
        if (applyId !== null && applyId !== undefined && applyId !== '') {
            this.applyCommonService.getApplyInfoByApplyID(applyId)
                .then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.applyInfo = result.applyInfo;
                        this.applyBasicInfo = result.applyBasicInfo;
                        this.attachmentList = result.attachmentInfoList;
                        if (this.utilHelper.AssertNotNull(this.applyBasicInfo) && this.applyBasicInfo.age === 0
                            && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
                            this.applyBasicInfo.age = null;
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
        }
    }

    /***
    * 路由绑定header路径
    */
    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        if (parentUrl !== null && parentUrl !== undefined && childrenUrl !== null && childrenUrl !== undefined) {
            this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
        }
    }

    showNotice() {
        this.governmentBox = true;
        this.personBox = false;
    }
    showPerson() {
        this.governmentBox = false;
        this.personBox = true;
    }

}
