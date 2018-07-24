import { Component, OnChanges, Input } from '@angular/core';


@Component({
    selector: 'mf-history',
    templateUrl: './history.component.html',
    providers: []
})

// 历史记录组件
export class HistoryComponent implements OnChanges {
    historyVisible: boolean = false;
    @Input() handleHistoryList: any[];
    constructor() {

    }
    ngOnChanges() {
        if (this.handleHistoryList != null && this.handleHistoryList !== undefined && this.handleHistoryList.length > 0) {
            this.historyVisible = true;
        } else {
            this.historyVisible = false;
        }

    }
}
