import { OnInit, Component, Input } from '@angular/core';

@Component({
  selector: 'personInfo-read',
  templateUrl: './personInfo-read.component.html',
})

export class PersonInfoReadComponent implements OnInit {

  @Input()
  crimePersonInfo: any;

  ngOnInit() {

  }
}
