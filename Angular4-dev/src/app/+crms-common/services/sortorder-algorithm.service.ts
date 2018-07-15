import { Injectable } from '@angular/core';
import { UtilHelper } from '../../core/';

/**
 * 排序算法
 * Create By zhangqiang 2017/11/16
 * @export
 * @class SortorderAlgorithmService
 */
@Injectable()
export class SortorderAlgorithmService {
    constructor(private utilHelper: UtilHelper) { }
    /**
     * 插入排序.默认升序排序
     */
    public insertSort(array: any[]) {
        if (this.utilHelper.AssertNotNull(array) && array.length > 0) {
            if (array.length === 1) {
                return array;
            }
            let len = array.length, i, j, tmp, result;
            // 设置数组副本
            result = array.slice(0);
            // 1.数组的第一个值为比较的基值
            for (i = 1; i < len; i++) {
                // 2.将第二个元素和之前的值作比较
                tmp = result[i];
                // 排序后的数组最后一个
                j = j - 1;
                while (j >= 0 && tmp < result[j]) {// 3.如果j大于0（否则越界）与最后一个值作比较，如果小了
                    // 则将最后一个值后移一位
                    result[j + 1] = result[j];
                    // j向前推进一位
                    j--;
                }
                // 比较完成，这是result[j]<tmp或者j=-1,则将tmp的值赋值给j+1;
                result[j + 1] = tmp;
            }
            return result;
        } else {
            return array;
        }
    }

    /**
     *
     * 用于包含匹配度字段的数组
     * 插入排序,用于包含匹配度的数组排序，升序后返回；
     * @param {any[]} array
     * @returns
     * @memberof SortorderAlgorithmService
     */
    public insertSortSimilarityUse(array: any[]) {
        if (this.utilHelper.AssertNotNull(array) && array.length > 0) {
            let len = array.length, i, j, tmp;
            let result: any[] = [];
            // 设置数组副本
            result = array.slice(0);
            // 1.数组的第一个值为比较的基值
            for (i = 1; i < len; i++) {
                // 2.将第二个元素和之前的值作比较
                tmp = result[i];
                // 排序后的数组最后一个
                j = i - 1;
                let tempV: string = tmp.point.toString().substring(0, tmp.point.toString().length - 1);
                // 3.如果j大于0（否则越界）与最后一个值作比较，如果小了
                while (j >= 0 && parseFloat(tempV) <
                    parseFloat(result[j].point.toString().substring(0, result[j].point.toString().length - 1))) {
                    // 则将最后一个值后移一位
                    result[j + 1] = result[j];
                    // j向前推进一位
                    j--;
                }
                // 比较完成，这是result[j]<tmp或者j=-1,则将tmp的值赋值给j+1;
                result[j + 1] = tmp;
            }
            return result.reverse();
        } else {
            return array;
        }
    }
}
