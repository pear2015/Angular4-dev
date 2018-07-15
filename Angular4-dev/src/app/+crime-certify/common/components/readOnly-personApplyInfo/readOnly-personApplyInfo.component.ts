import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'readOnly-personApplyInfo',
    templateUrl: './readOnly-personApplyInfo.component.html',
})

export class ReadOnlyPersonApplyInfoComponent implements OnInit {
    @Input()
    applyInfo: any;
    ngOnInit() {

    }
}
