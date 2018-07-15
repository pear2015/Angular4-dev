import { Injectable } from '@angular/core';
/**
 * 工具帮助类
 */
@Injectable()
export class UtilHelper {
    // 获取guid
    public getGuid32() {
        return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 格式化时间
    public format(time, format) {
        let t = new Date(time);
        let tf = function (i) { return (i < 10 ? '0' : '') + i; };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getUTCFullYear());
                case 'MM':
                    return tf(t.getUTCMonth() + 1); // 返回 用世界时表示时的月份，该值是 0（一月） ~ 11（十二月） 之间中的一个整数。所以要加1
                case 'mm':
                    return tf(t.getUTCMinutes());
                case 'dd':
                    return tf(t.getUTCDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getUTCSeconds());
            };
        });
    }

    // 验证对象是否为空
    public AssertNotNull(obj: Object): boolean {
        if (obj == null || obj === undefined || obj === '') {
            return false;
        }
        return true;
    }
    // 验证对象是否为空
    public AssertEqualNull(obj: Object): boolean {
        if (obj == null || obj === undefined || obj === '') {
            return true;
        }
        return false;
    }

    /**
     * 去除重复数据
     */
    distinct(data: string[]) {
        if (this.AssertNotNull(data) && data.length !== 0) {
            let result: string[] = [];
            data.forEach(item => {
                if (result.filter(f => f === item).length === 0) {
                    result.push(item);
                }
            });
            return result;
        } else {
            return [];
        }
    }

    /**
     * 格式化字符串
     */
    formatString(str: string, ...args): string {
        if (str != null && str !== undefined && str !== '') {
            if (args.length === 0) {
                return str;
            } else {
                for (let i = 0; i < args.length; i++) {
                    str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
                }
                return str;
            }
        }
        return '';
    }


    /**
     * 数据分组
     */
    groupBy(array, f) {
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    }
}
