import { Injectable } from '@angular/core';
import { ConfigService, ServiceBase } from '../../../core';

/**
 * 个人申请业务统计Service
 *
 * @export
 * @class PersonalStatisticsService
 */
@Injectable()
export class StatisticsPersonalService extends ServiceBase {

    constructor(
        public configService: ConfigService,
    ) {
        super(configService);
    }

}


export class CustomTimeSerchInfo {
    dateType: string;
    startDate: string;
    endDate: string;
    fo: string;
    timePoint: string;
}










