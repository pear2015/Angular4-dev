import { Injectable } from '@angular/core';
import { MapperService } from './mapper.service';
import { CrimeNoticeStatistics, CrimeCourtStatistics } from '../../../model';

/**
 *犯罪信息统计的mapper
 */
@Injectable()
export class CrimeNoticeStatisticsMapper implements MapperService {

    constructor() {

    }

    mapper(info: any): CrimeNoticeStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        // 上方柱状图数据映射
        let result = new CrimeNoticeStatistics();
        result.court = info.typeName;
        result.count = info.count;
        result.date = info.coord_X; // '2017';
        return result;
    }
    mapperCourt(info: any): CrimeNoticeStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        // 下面柱状图数据映射
        let result = new CrimeNoticeStatistics();
        result.count = info.count;
        result.date = info.coord_X; // '2017';
        return result;
    }
    mapperAllCourtData(info: any): CrimeCourtStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        // 这是法院数据映射
        let result = new CrimeCourtStatistics();
        result.id = info.courtId;
        result.code = info.courtId + '';
        result.codeType = info.courtId + '';
        result.name = info.name; // '2017';
        return result;
    }
}
