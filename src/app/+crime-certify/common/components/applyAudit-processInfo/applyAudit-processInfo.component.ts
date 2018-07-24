import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'applyAudit-processInfo',
    templateUrl: './applyAudit-processInfo.component.html',
})

export class ApplyAuditProcessInfoComponent implements OnInit {
    @Input()
    applyInfo: any;
    ngOnInit() {

    }
}
