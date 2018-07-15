import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
})

/**
 * 分页组件
 */
export class PaginationComponent implements OnChanges {
    @Input() pageObjEmit;
    // 总条目数
    @Input() totalCount;

    // 总页数
    @Input() totalPage;
    @Output() pageObjChange = new EventEmitter();
    //  maxSize: number; // 显示的页数
    bigTotalItems: number;  // 总条数
    itemsPerPage: number;  // 每页显示多少条数据
    numPage: number = 0; // 显示第几页
    constructor() {
    }

    // 分页点击事件
    pageChanged(event: any): void {
        this.pageObjEmit.pages = event.page - 1;
        this.pageObjChange.emit(this.pageObjEmit);
    }


    // 接收到的参数发生变化时
    ngOnChanges(): void {
        // this.totalCount =  this.pageObjEmit.totalCount;
        // this.maxSize  = Math.ceil(this.totalCount / this.pageObjEmit.pages);
        /*  this.bigCurrentPage = this.pageObjEmit.pages;
          alert(this.bigCurrentPage);*/
        this.numPage = this.pageObjEmit.pages;
        this.itemsPerPage = this.pageObjEmit.pageSize;
        this.bigTotalItems = this.totalCount;
    }
}
