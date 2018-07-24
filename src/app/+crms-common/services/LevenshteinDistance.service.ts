import { Injectable } from '@angular/core';
import { UtilHelper } from '../../core/';
/**
 * 编辑距离算法，用于计算匹配度,原理计算矩阵.也称为：文史特距离
 * 还可用于：DNA分析，拼字检查，语音辨识，抄袭侦测。
 * 说明：比如，kitten sitting 之间的距离
 *  1、kitten->sitten,替换k为s
 *  2、sitten->sittin,替换e为i
 *  3、sittin->sitting,增加g
 * 所以文史特距离为3,那么相似度就是1-(3/7)=0.4286
 * Create By zhangqiang 2017/11/7
 * @export
 * @class LevenshteinDistanceService
 */
@Injectable()
export class LevenshteinDistanceService {

    _str1: string;
    _str2: string;
    _matrix: any;

    constructor(private utilHelper: UtilHelper) {
    }

    /**
     *
     * 计算距离矩阵表示法
     *
     * @param {string} s
     * @param {string} t
     * @returns {number}
     * @memberof LevenshteinDistanceService
     */
    private levenshteinDistance(s: string, t: string): number {
        if (this.utilHelper.AssertEqualNull(s) && this.utilHelper.AssertEqualNull(t)) {
            return;
        }
        let compareStringArray = this.stringSorderByLength(s, t);
        return this.matrixCaculate(compareStringArray[0], compareStringArray[1]);
    }

    /**
     * 矩阵计算
     * @param {string} str
     * @param {string} strT
     * @returns {string}
     * @memberof LevenshteinDistanceService
     */
    private matrixCaculate(maxLengthStr, minLengthStr) {
        /**
        * 矩阵
        * 编辑s重复次数
        * 编辑t重复次数
        * s中第i个字符
        * t中第j个字符
        * 替换字符花费
        */
        let n = maxLengthStr.length;
        let m = minLengthStr.length;
        let d = [];
        let i;
        let j;
        let s_i;
        let t_j;
        let cost = 0;
        if (n === 0) {
            return m;
        }
        if (m === 0) {
            return n;
        }
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        for (i = 1; i <= n; i++) {
            s_i = maxLengthStr.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                t_j = minLengthStr.charAt(j - 1);
                if (s_i === t_j) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = this.miniNum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        return d[n][m];
    }

    /**
     * 按照长度对两个字符串进行排序
     * @param str
     * @param strT
     */
    private stringSorderByLength(str: string, strT: string): string[] {
        if (this.utilHelper.AssertNotNull(str) && this.utilHelper.AssertNotNull(strT)) {
            let len = str.length;
            let lenT = strT.length;
            let orderArray: Array<string>;
            if (len > lenT) {
                orderArray = [str, strT];
            } else {
                orderArray = [strT, str];
            }
            return orderArray;
        }
    }

    // 求三个数字中的最小值
    private miniNum(a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    }

    // 求两个字符串的相似度,返回相似度百分比
    public levenshteinDistancePercent(s: string, t: string): any {
        let l = s.length > t.length ? s.length : t.length;
        let d = this.levenshteinDistance(s, t);
        return (1 - (d / l)).toFixed(4);
    }
}
