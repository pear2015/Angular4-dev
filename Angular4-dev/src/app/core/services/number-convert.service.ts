import { Injectable } from '@angular/core';

/**
 * 数值转换器
 *
 * @export
 * @class NumberConvertService
 */
@Injectable()
export class NumberConvertService {

    /**
     * 将较大的数值转换为数字加字母的缩写。
     * 例如1000转换为1K，1000000转换为1M。
     * 如果有小数则保留一位小数。
     *
     * @param {number} value  原数值
     * @returns {string}
     *
     * @memberOf NumberConvertService
     */
    convert(value: number): string {
        if (typeof (value) !== 'number') {
            return value;
        }

        const numberOfDecimal = 1;

        let result;
        let M = value / 1000000;
        // let M_remainder = value % 1000000;
        let K = value / 1000;
        let K_remainder = value % 1000;

        if (M >= 1) {
            result = M.toFixed(numberOfDecimal) + 'M';
        } else if (K >= 1 && K_remainder === 0) {
            result = K + 'K';
        } else if (K >= 1 && K_remainder > 0) {
            result = K.toFixed(numberOfDecimal) + 'K';
        } else {
            result = value + '';
        }
        return result;
    }
}
