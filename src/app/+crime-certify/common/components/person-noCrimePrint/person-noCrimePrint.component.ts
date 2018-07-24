import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../core';
import { CertificatePrintInfo } from '../../../../model/certificate-apply/CertificatePrintInfo';
import * as moment from 'moment';
import { EncodingRulesService } from '../../../../+crms-common/services/encoding-rules.service';
@Component({
  selector: 'person-noCrimePrint',
  templateUrl: './person-noCrimePrint.component.html',
  providers: []
})
export class PersonNoCrimePrintComponent implements OnInit {
  nationalCenterDirector: string;
  @Input() certificatePrintInfo: CertificatePrintInfo;
  @Input() applyBasicInfo;
  @Input() isPrint;
  @Input() certificateInfo;
  @Input() certificateId: string;
  @Input() applyInfo;
  month: number;
  day: number;
  year: number;
  validateCode: string;
  constructor(
    private configService: ConfigService,
    private encodingRulesService: EncodingRulesService
  ) {
  }

  ngOnInit() {
    this.configService.get('NationalCenterDirector')
      .then(result => {
        this.nationalCenterDirector = result;
      });
    this.month = Number(moment(new Date()).format('MM'));
    this.day = Number(moment(new Date()).format('DD'));
    this.year = Number(moment(new Date()).format('YYYY'));
    this.validateCode = this.encodingRulesService.verificationCodeCreate();
  }


}
