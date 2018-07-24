import { Component, OnInit } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'mf-search',
    templateUrl: './search.component.html',
    providers: [Modal]
})

/**
 * 搜索组件
 */
export class SearchComponent implements OnInit {

    constructor(public modal: Modal) {
    }

    ngOnInit(): void {
    }
}
