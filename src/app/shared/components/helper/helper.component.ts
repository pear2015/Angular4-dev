import { Component, OnInit } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { EventAggregator } from '../../../core';
@Component({
    selector: 'helper',
    templateUrl: './helper.component.html',
    providers: [Modal]
})

/**
 * 搜索组件
 */
export class HelperComponent implements OnInit {
    public oneAtTime: boolean = true;
    ngOnInit(): void {
    }

    constructor(private eventAggregator: EventAggregator) { }

    push(type: number) {
        if (type === 1) {
            this.eventAggregator.publish('markdown', 1);
        } else if (type === 2) {
            this.eventAggregator.publish('markdown', 2);
        } else if (type === 3) {
            this.eventAggregator.publish('markdown', 3);
        } else if (type === 4) {
            this.eventAggregator.publish('markdown', 4);
        } else if (type === 5) {
            this.eventAggregator.publish('markdown', 5);
        } else if (type === 6) {
            this.eventAggregator.publish('markdown', 6);
        } else if (type === 7) {
            this.eventAggregator.publish('markdown', 7);
        } else if (type === 8) {
            this.eventAggregator.publish('markdown', 8);
        } else if (type === 9) {
            this.eventAggregator.publish('markdown', 9);
        }
    }

}
