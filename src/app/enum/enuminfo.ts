import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
/**
 * 枚举类型
 * 性别，婚姻状态，申请人类型，国籍,日志操作动作
 * @export
 * @class EnumInfo
 * 2018-03-07 去掉性别枚举中的未知
 */


@Injectable()

export class EnumInfo {
    getGenderEnum: any[] = [
        { value: '1', name: this.translate('male') },
        { value: '2', name: this.translate('female') }
        // { value: '3', name: this.translate('unknown') }
    ];
    // getMarriageEnum: any[] = [
    //     { value: '1', name: this.translate('Solteiro') },
    //     { value: '2', name: this.translate('Casado') },
    //     { value: '3', name: this.translate('Divorciado') },
    //     { value: '4', name: this.translate('widower'),
    //     { value: '5', name: this.translate('widower') }
    // ];
    getApplyPersonTypeEnum: any[] = [
        { value: '1', name: this.translate('myself') },
        { value: '2', name: this.translate('agent') },
    ];
    getCountryOfCitizenshipEnum: any[] = [
        { value: '1', name: this.translate('theCountry') },
        { value: '2', name: this.translate('foreign') },
        { value: '3', name: this.translate('compatriots') }
    ];
    getBirthPlaceEnum: any[] = [
        { value: '1', name: this.translate('demestic') },
        { value: '2', name: this.translate('foreignCountry') },
        { value: '3', name: this.translate('outsideTheCountry') }
    ];
    getAnalysisResultEnum: any[] = [
        { value: '1', name: this.translate('hasCriminalRecord') },
        { value: '2', name: this.translate('noCriminalRecord') },
        { value: '3', name: this.translate('rejectAnalysis') },
    ];
    getAnalysisResult: any[] = [
        { value: '1', name: this.translate('hasCriminalRecord') },
        { value: '2', name: this.translate('noCriminalRecord') },
    ];
    getAnalysisResultOther: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: '1', name: this.translate('noCriminalRecord') },
        { value: '2', name: this.translate('hasCriminalRecord') },
    ];
    getAuditResultEnum: any[] = [
        { value: '1', name: this.translate('pass') },
        { value: '2', name: this.translate('fail') }
    ];
    getNoticeInputStatusEnum: any[] = [
        { value: '1', name: this.translate('agreeeEnter') },
        { value: '2', name: this.translate('rejectEnter') }
    ];
    getUserType: any[] = [
        { value: '1', name: this.translate('operator') },
        { value: '2', name: this.translate('analyst') },
        { value: '3', name: this.translate('auditor') }
    ];
    getApplyStatus: any[] = [
        { value: '0', name: this.translate('submit') },
        { value: '1', name: this.translate('analyzing') },
        { value: '2', name: this.translate('auditing') },
        { value: '3', name: this.translate('toBePrinted') },
        { value: '4', name: this.translate('printed') },
        { value: '5', name: this.translate('refused') }
    ];
    getNoticeStatus: any[] = [
        { value: '1', name: this.translate('auditing') },
        { value: '2', name: this.translate('reanalyse') },
        { value: '3', name: this.translate('hasRatify') },
        { value: '4', name: this.translate('refused') },
        { value: '5', name: this.translate('lapse') }
    ];
    getActionEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: 'ADD', name: this.translate('ADD') },
        { value: 'DELETE', name: this.translate('DELETE') },
        { value: 'UPDATE', name: this.translate('UPDATE') },
        { value: 'QUERY', name: this.translate('QUERY') },
    ];

    getApplyTypeEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: '1', name: this.translate('applyPerson') },
        { value: '2', name: this.translate('applyGovernment') }
    ];

    getStatisticsApplyResultEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: '1', name: this.translate('noCriminalRecord') },
        { value: '2', name: this.translate('hasCriminalRecord') },
    ];
    getStatisticsAuditResultEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: '1', name: this.translate('pass') },
        { value: '2', name: this.translate('fail') }
    ];
    getLogAuditEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: 'login', name: this.translate('login') },
        { value: 'crime-notice', name: this.translate('crime-notice') },
        { value: 'crime-certify', name: this.translate('crime-certify') }
    ];
    getStatisticsAverageTimeEnum: any[] = [
        { value: '', name: this.translate('ALL') },
        { value: '1', name: '0 ~ 15 min' },
        { value: '2', name: '15 ~ 30 min' },
        { value: '3', name: '30 ~ 45 min' },
        { value: '4', name: '45 ~ 60 min' },
        { value: '5', name: '> 60 min' },
    ];

    constructor(
        public translateService: TranslateService
    ) { }

    // 国际化字段
    translate(code) {
        let key: any = this.translateService.get(code);
        return key.value;
    }

}
