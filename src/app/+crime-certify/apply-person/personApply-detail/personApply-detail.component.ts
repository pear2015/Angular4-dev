import { OnInit, Component } from '@angular/core';
import { ApplyBasicInfo } from '../../../model/certificate-apply/ApplyBasicInfo';
import { ApplyPersonService } from '../apply-person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilHelper, EventAggregator } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { EnumInfo } from '../../../enum/enuminfo';
@Component({
    templateUrl: './personApply-detail.component.html',
    providers: [ApplyPersonService, EnumInfo]
})

export class PersonApplyDetailComponent implements OnInit {

    requestParameters: any; // 数据接口参数
    dataList: any; // 数据列表
    applyInfo: ApplyInfo; // 个人申请申请信息
    applyBasicInfo: ApplyBasicInfo; // 个人申请个人信息
    noticeBox: boolean = true; // 公告信息容器
    personBox: boolean = false; // 罪犯信息容器

    attachmentList: any[]; // 附件列表
    attchmentControllObj: any; // 附件各功能控制
    routerFlag: string;
    constructor(
        private service: ApplyPersonService,
        private route: ActivatedRoute,
        private router: Router,
        private utilHelper: UtilHelper,
        private toastr: ToastrService,
        private enuminfo: EnumInfo,
        private eventAggregator: EventAggregator,
        public translateService: TranslateService,
    ) {
        this.applyInfo = new ApplyInfo();
        this.applyBasicInfo = new ApplyBasicInfo();
        this.attchmentControllObj = {
            uploadFile: false,
            preview: true,
            ocrRecognize: false,
            removeSingle: false
        };
    }
    async ngOnInit() {

        // 初始化接口地址
        await this.service.initialCrmsService();

        // 获取接口参数
        this.route.params.subscribe(data => {
            if (this.utilHelper.AssertNotNull(data) && JSON.stringify(data) !== '{}') {
                this.requestParameters = data.applyId;
                this.routerFlag = data.flag;
            }
        });

        // 初始化数据列表
        this.bindDataList();

        // 路由信息
        this.bindRoutUrl('CrimeCertifyManagement', 'PersonApplyDetail');

    }
    // 获取申请枚举
    public get applyStatus() {
        return this.enuminfo.getApplyStatus;
    }
    // 路由绑定header路径
    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }

    // 获取数据列表
    async bindDataList() {
        // 获取数据源
        this.dataList = await this.service.getApplyInfoList(this.requestParameters);
        if (!this.utilHelper.AssertEqualNull(this.dataList)) {
            this.applyInfo = this.dataList.applyInfo;
            this.applyBasicInfo = this.dataList.applyBasicInfo;
            this.attachmentList = this.dataList.attachmentInfoList;
            if (this.utilHelper.AssertNotNull(this.applyBasicInfo) && this.applyBasicInfo.age === 0
                && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
                this.applyBasicInfo.age = null;
            }
        } else {
            this.translateService.get(['Data abnormal']).subscribe(value => {
                this.toastr.error(value['Data abnormal']);
            });
        };
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
        if (this.routerFlag === 'apply-incomplete') {
            this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);

        } else if (this.routerFlag === 'apply-complete') {
            this.router.navigate(['/crms-system/crime-certify/apply-complete']);

        } else if (this.routerFlag === 'certificate-management') {
            this.router.navigate(['/crms-system/crime-certify/certificate-management']);

        } else if (this.routerFlag === 'apply-history') {
            this.router.navigate(['/crms-system/crime-certify/apply-history']);
        } else if (this.routerFlag === 'apply-priority') {
            this.router.navigate(['/crms-system/crime-certify/apply-priority']);
        }
    }
}
