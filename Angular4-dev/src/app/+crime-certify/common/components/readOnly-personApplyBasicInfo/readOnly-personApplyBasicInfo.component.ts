import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'readOnly-personApplyBasicInfo',
    templateUrl: './readOnly-personApplyBasicInfo.component.html',
})

export class ReadOnlyPersonApplyBasicInfoComponent implements OnInit {
    @Input()
    applyBasicInfo: any;
    ngOnInit() {

    }
}
