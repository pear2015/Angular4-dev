import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConfigService, UtilHelper } from '../../../../core';
import { CertificatePrintInfo } from '../../../../model/certificate-apply/CertificatePrintInfo';
import { PersonHasCrimeFileService } from './person-hasCrimentPrint.service';
import * as moment from 'moment';
import { EncodingRulesService } from '../../../../+crms-common/services/encoding-rules.service';
@Component({
  selector: 'person-hasCrimePrint',
  templateUrl: './person-hasCrimePrint.component.html',
  providers: [PersonHasCrimeFileService]
})
export class PersonHasCrimePrintComponent implements OnChanges, OnInit {
  nationalCenterDirector: string;
  @Input() certificatePrintInfo: CertificatePrintInfo;
  @Input() applyBasicInfo;
  @Input() crimeAndNoticeList;
  @Input() isPrint;
  @Input() certificateInfo;
  @Input() certificateId: string;
  @Input() applyInfo;
  showIndicator: boolean;
  list: any;
  noticeImaList: any = [];
  month: number;
  day: number;
  year: number;
  validateCode: string;
  noticeCount: number = 0;
  constructor(
    private configService: ConfigService,
    private personHasCrimeFileService: PersonHasCrimeFileService,
    private utilHelper: UtilHelper,
    private encodingRulesService: EncodingRulesService
  ) {
    this.showIndicator = false;
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
  ngOnChanges() {
    this.list = this.crimeAndNoticeList;
    if (this.utilHelper.AssertNotNull(this.list) && this.list.length > 0) {
      this.noticeCount = this.list.length;
      this.list.forEach(item => {
        if (item.attachmentInfo.length > 0) {
          this.personHasCrimeFileService.getImageFormUploaded(item.attachmentInfo[0].filePath)
            .then(fileByte => {
              item.attachmentInfo[0].filePathContent = 'data:image/jpg;base64,' + fileByte;
            }).catch(e => {
              console.log(e);
            });
        }
      });
    } else {
      this.list = [];
    }
  }

}
