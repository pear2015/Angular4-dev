import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CrimeInfoDetailService } from './crimeInfo-detail.service';
import { UtilHelper, DateFormatHelper, EventAggregator } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrimeInfo } from '../../../model/crime-notice/crimeInfo';
import { NoticeInfo } from '../../../model/crime-notice/noticeInfo';
import { CourtInfo } from '../../../model/crime-notice/CourtInfo';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

/**
 * 犯罪信息查询详细组件
 */
@Component({
    selector: 'crimeinfo-detail',
    templateUrl: './crimeInfo-detail.component.html',
    providers: [DateFormatHelper, CrimeInfoDetailService]
})
export class CrimeInfoDetailComponent implements OnChanges, OnInit {
    /**
     *  犯罪人编号
     */
    @Input() personId;
    /**
     * 右侧浮动列表
     */
    noticeInfoList: any;
    /**
     * 犯罪绑定对象
     */
    crimeInfo: CrimeInfo;
    count: number = 0;
    /**
     * 公告绑定对象
     */
    noticeInfo: NoticeInfo;
    num: number = 0;
    courtInfoList: CourtInfo[] = [];
    priorityList: any;
    /**
     * 附件
     */
    attachmentInfo: any;
    popupNoticeImageVisible: boolean;
    noticeImagePathList: any[] = [];
    /**
     * 轮播图当前index
     */
    activeSlideIndex: number = 0;
    /**
     * 犯罪类型
     */
    crimeTypeList: any[] = [];
    attchmentControllObj: any;
    constructor(
        private utilHelper: UtilHelper,
        private activatedRoute: ActivatedRoute,
        private crimeInfoDetialService: CrimeInfoDetailService,
        private toastr: ToastrService,
        private eventAggregator: EventAggregator,
        private router: Router
    ) {
        this.crimeInfo = new CrimeInfo();
        this.noticeInfo = new NoticeInfo();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.toastrConfig.timeOut = 1500;
        this.toastr.toastrConfig.positionClass = 'toast-center-center';
        this.attchmentControllObj = {
            uploadFile: false,
            preview: true,
            ocrRecognize: false,
            removeSingle: false
        };
    }

    /**
     获取列表数据
     */
    async getNoticeLtst(crimePersonId: string) {
        try {
            let result = await this.crimeInfoDetialService.findNoticeList(crimePersonId);
            if (this.utilHelper.AssertNotNull(result)) {
                this.noticeInfoList = result.noticeInfoList;
            }
            this.renderResult(result);
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * 获取优先级
     */
    async  bindNoticePriorityData() {
        try {
            let result = await this.crimeInfoDetialService.getApplyPriorityList();
            if (this.utilHelper.AssertNotNull(result)) {
                this.priorityList = result;
            }
        } catch (error) {
            console.log(error);

        }
    }


    /**
     * 点击下翻页
     */
    noticeListNext() {
        let listLength = this.noticeInfoList.length;
        this.count++;
        if (this.count > Math.floor(listLength / 3)) {
            this.count = Math.floor(listLength / 3);
        }
        this.noticeListScroll();
    }

    /**
     * 点击上翻页
     */
    noticeListPrev() {
        this.count--;
        if (this.count <= 0) {
            this.count = 0;
        }
        this.noticeListScroll();
    }


    noticeListScroll() {
        let buttonHeight = - $('.button-list').outerHeight(true) * 3;
        $('.notice-list-button').find('ul').css({
            'transform': 'translate(0,' + this.count * (buttonHeight) + 'px)',
            'transition': 'all 1s'
        });
    }


    /**
     *  左侧数据获取
     */
    async noticeForId(crimePersonId, index) {
        this.num = index;
        try {
            let result = await this.crimeInfoDetialService.singleNotice(crimePersonId);
            this.renderResult(result);
            $('.crime-detial-main').stop(true).animate({
                left: '-800px',
                opacity: 0
            }, 200).animate({ left: 0, opacity: 1 }, 300);
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * 渲染数据的方法
     */
    renderResult(result) {
        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.attachmentInfo)) {
            this.noticeImagePathList = result.attachmentInfo;
            // this.showImg();
        } else {
            this.noticeImagePathList = [];
        }
        if (this.utilHelper.AssertNotNull(result.crimeInfo)) {
            this.crimeInfo = result.crimeInfo;
            let courtInfoObj: any = {
                crimeTypeId: this.crimeInfo.crimeTypeId,
                crimeTypeName: this.crimeInfo.crimeTypeName
            };
            this.crimeTypeList.push(courtInfoObj);
        }
        if (this.utilHelper.AssertNotNull(result.noticeInfo)) {
            this.noticeInfo = result.noticeInfo;
            let courtInfoObj: any = {
                courtId: this.noticeInfo.courtId,
                name: this.noticeInfo.courtName
            };
            this.courtInfoList.push(courtInfoObj);
            this.bindNoticePriorityData();
        }
    }


    /**
     * 图片显示
     */
    /*    showImg() {
            this.noticeImagePathList = [];
            if (this.utilHelper.AssertNotNull(this.attachmentInfo) && this.attachmentInfo.length > 0) {
                this.attachmentInfo.forEach((item, i) => {
                    this.applyCommonService.getImageFormUploaded(item.filePath)
                        .then(fileByte => {
                            let imgList: any = {};
                            imgList.src = 'data:image/jpg;base64,' + fileByte;
                            imgList.fileName = item.fileName;
                            this.noticeImagePathList.push(imgList);
                        }).catch(e => {
                            console.log(e);
                        });
                });
            }
        }*/


    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }

    ngOnChanges(): void {
        // this.bindRoutUrl('crimeBasicinfo manage', 'crimeBasicinfo inquire view');
        if (this.utilHelper.AssertEqualNull(this.personId)) {
            this.getNoticeLtst(this.activatedRoute.params['value'].id);
        } else {
            this.getNoticeLtst(this.personId);
        }

    }
    // 返回上一级
    goBack() {
        this.router.navigate(['../../crimeinfo-search'], { relativeTo: this.activatedRoute });
    }
    ngOnInit(): void {
        if (this.router.url.indexOf('crimeinfo-detail') > -1) {
            this.bindRoutUrl('crimeBasicinfo manage', 'crimeBasicinfo inquire view');
        }
        if (this.utilHelper.AssertEqualNull(this.personId)) {
            this.getNoticeLtst(this.activatedRoute.params['value'].id);
        } else {
            this.getNoticeLtst(this.personId);
        }
    }
}

