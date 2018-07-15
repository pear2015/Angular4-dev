import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'noticeInfo-read',
    templateUrl: './noticeInfo-read.component.html',
})

export class NoticeInfoReadComponent implements OnInit {

    @Input()
    noticeInfo: any;

    ngOnInit() {
    }
}
