import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'crimeInfo-read',
    templateUrl: './crimeInfo-read.component.html',
})

export class CrimeInfoReadComponent implements OnInit {

    @Input()
    crimeInfo: any;

    ngOnInit() {
    }
}
