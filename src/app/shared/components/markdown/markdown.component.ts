import { Component, OnInit } from '@angular/core';
import { EventAggregator } from '../../../core';
@Component({
    selector: 'mark',
    templateUrl: './markdown.component.html'
})
export class MarkdownComponent implements OnInit {
    public path: number;
    constructor(private eventAggregator: EventAggregator) {
    }
    ngOnInit(): void {
        this.eventAggregator.subscribe('markdown', '', (para) => {
            let id = para;
            if (id === 1) {
                this.path = 1;
            } else if (id === 2) {
                this.path = 2;
            } else if (id === 3) {
                this.path = 3;
            } else if (id === 4) {
                this.path = 4;
            } else if (id === 5) {
                this.path = 5;
            } else if (id === 6) {
                this.path = 6;
            } else if (id === 7) {
                this.path = 7;
            } else if (id === 8) {
                this.path = 8;
            } else if (id === 9) {
                this.path = 9;
            }
        });
    }
}
