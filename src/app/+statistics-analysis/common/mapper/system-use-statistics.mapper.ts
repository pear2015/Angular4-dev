import { Injectable } from '@angular/core';
import { MapperService } from './mapper.service';
import { SystemUseStatistics } from '../../../model';

/**
 *系统使用情况统计的mapper
 */
@Injectable()
export class SystemUseStatisticsMapper implements MapperService {

    constructor() {

    }

    mapper(info: any): SystemUseStatistics {
        // 这个只是做个相同属性的映射不同属性的需要单独映射
        // 上方柱状图数据映射
        let result = new SystemUseStatistics();
        result.center = info.typeName;
        result.time = info.count;
        result.date = info.coord_X; // '2017';
        return result;
    }
}
