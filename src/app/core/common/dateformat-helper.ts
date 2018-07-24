import { Injectable } from '@angular/core';

/**
 * 访问 REST API服务地址时间参数格式转换
 */
@Injectable()
export class DateFormatHelper {
    /**
     * @param begindate 开始时间参数
     */
    RestURLBeignDateTimeFormat(begindate: Date): any {
        begindate = new Date(begindate);
        let tf = function (i) { return (i < 10 ? '0' : '') + i; };
        let dformat = [
            tf(begindate.getFullYear()),
            tf((begindate.getMonth() + 1)),
            tf(begindate.getDate())
        ].join('-') + ' ' +
            ['00',
                '00',
                '00'].join(':');
        return dformat;
    }
    /**
     * @param begindate 结束时间参数
     */
    RestURLEndDateTimeFormat(enddate: Date): any {
        enddate = new Date(enddate);
        let tf = function (i) { return (i < 10 ? '0' : '') + i; };
        let dformat = [
            tf(enddate.getFullYear()),
            tf((enddate.getMonth() + 1)),
            tf(enddate.getDate())
        ].join('-') + ' ' +
            ['23',
                '59',
                '59'].join(':');
        return dformat;
    }
    /**
     * 将年月日时分转换为年月日时分秒
     * @param time
     */
    HoursMinutesDateTimeFormat(time: Date): any {
        time = new Date(time);
        let dformat = [time.getFullYear(),
        (time.getMonth() + 1),
        time.getDate()
        ].join('-') + ' ' + [time.getHours(), time.getMinutes(), '00'].join(':');
        return dformat;
    }
    /**
     * 时间格式为年月日
     *
     * @memberof DateFormatHelper
     */
    YearMonthDayTimeFormat(time: Date): any {
        time = new Date(time);
        let dformat = [time.getFullYear(),
        (time.getMonth() + 1),
        time.getDate()
        ].join('-');
        return dformat;
    }
}
