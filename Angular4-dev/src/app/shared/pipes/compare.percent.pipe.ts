import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'mfPercentPipe' })
export class ComparePercentPipe implements PipeTransform {
    // 传入两个相同对象的不同实例，进行比较，返回相似度百分比
    transform(value: Object, compareValue: Object) {
        // 总数
        let total: number = 0;
        // 相似数
        let resembleCount: number = 0;
        if (value != null && value !== undefined && compareValue != null && compareValue !== undefined) {
            // tslint:disable-next-line:forin
            for (let index in value) {
                if (value[index] === compareValue[index]) {
                    resembleCount++;
                }
                total++;
            }
        }
        // 计算百分比
        if (resembleCount !== 0 && total !== 0) {
            let floatTotal = parseFloat(total.toString());
            let floatResembleCount = parseFloat(resembleCount.toString());
            return Math.round(floatResembleCount / floatTotal * 10000) / 100.00 + '%';
        } else {
            return '0%';
        }
    }
// tslint:disable-next-line:eofline
}