import { Component, OnChanges, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UtilHelper } from '../../../../core/';
import { DxDataGridComponent } from 'devextreme-angular';

/**
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
    selector: 'notice-inquire',
    templateUrl: './notice-inquire.component.html',
    providers: [],
})
export class NoticeInquireComponent implements OnChanges {

    @Input() noticeList;
    @Input() searchInfoParam;
    @Input() dataCount;
    @Input() title;
    @Input() isShowApportionTime;
    @Output() getNoticeIdEmit = new EventEmitter();
    @Output() searchInfoParamEmit = new EventEmitter();

    @ViewChild('grid')
    grid: DxDataGridComponent;


    // 犯罪公告Id
    noticeId: any = [];
    // 登录角色
    currentRole: string;
    // 页数
    totalCount: number;


    constructor(
        private utilHelper: UtilHelper,
    ) {
    }

    ngOnChanges() {
        this.searchInfoParam.pageSize = 10;
        this.totalCount = this.dataCount;

        this.noticeList.forEach(item => {
            if (this.utilHelper.AssertEqualNull(item.firstName)) {
                item.firstName = '';
            }
            if (this.utilHelper.AssertEqualNull(item.lastName)) {
                item.lastName = '';
            }
            item.name = item.firstName + ' ' + item.lastName;
        });

    }
    /**
     * 关闭grid中的展开项
     */
    closeGraidRow() {
        this.grid.instance.collapseAll(-1);
    }
    // 选中一条犯罪公告
    selectNoticeHandle(e) {
        if (this.utilHelper.AssertNotNull(e) && this.utilHelper.AssertNotNull(e.key)) {
            this.noticeId = e.key.noticeId;
            this.getNoticeIdEmit.emit(this.noticeId);
        }
        if (e.component.isRowExpanded(e.data)) {
            e.component.collapseRow(e.data);
        } else {
            e.component.collapseAll(-1);
            e.component.expandRow(e.data);
        }
    }

    // 分页
    getpageObjChange(obj) {
        this.searchInfoParam.pages = obj.pages;
        this.searchInfoParamEmit.emit(this.searchInfoParam.pages);
    }
}
