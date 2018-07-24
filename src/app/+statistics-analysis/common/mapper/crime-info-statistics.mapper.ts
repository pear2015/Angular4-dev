import { Injectable } from '@angular/core';
import { MapperService } from './mapper.service';
import { CrimeInfoStatistics } from '../../../model';

/**
 *犯罪信息统计的mapper
 */
@Injectable()
export class CrimeInfoStatisticsMapper implements MapperService {

    constructor() {

    }

    mapper(info: any): CrimeInfoStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        let result = new CrimeInfoStatistics();
        result.center = info.typeName;
        result.count = info.count;
        result.date = info.coord_X; // '2017';
        return result;
    }

    mapperCriminalType(info: any): CrimeInfoStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        let result = new CrimeInfoStatistics();
        result.criminalType = info.typeName;
        result.count = info.count;
        result.date = info.coord_X; // '2017';
        return result;
    }

     mapperCriminalCenterType(info: any): CrimeInfoStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        let result = new CrimeInfoStatistics();
        result.criminalType = info.typeName;
        result.count = info.count;
        result.center = info.typeName;
        result.date = info.coord_X; // '2017';
        return result;
    }
}
