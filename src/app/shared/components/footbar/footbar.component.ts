import { Component, OnInit } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

/**
 * footbar 组件
 */
@Component({
    selector: 'mf-foot',
    templateUrl: './footbar.component.html',
    providers: [Modal]
})
export class FootBarComponent implements OnInit {

    constructor(public modal: Modal) {
    }

    ngOnInit(): void {
    }
}
