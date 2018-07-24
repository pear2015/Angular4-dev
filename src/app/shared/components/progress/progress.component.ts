import { Component, Input } from '@angular/core';


@Component({
    selector: 'mf-progress',
    templateUrl: './progress.component.html',
    styles: ['.active {color:red}']
})
export class ProgressComponent {
    @Input() dataSource: any[] = [];
    @Input() activeIndex: number;

}
