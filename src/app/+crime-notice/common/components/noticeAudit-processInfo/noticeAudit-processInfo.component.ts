import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'noticeAudit-processInfo',
    templateUrl: './noticeAudit-processInfo.component.html',
})

export class NoticeAuditProcessInfoComponent implements OnInit {
    @Input()
    noticeInfo: any;
    ngOnInit() {

    }
}
