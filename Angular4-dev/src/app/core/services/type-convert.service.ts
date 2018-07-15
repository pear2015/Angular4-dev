import { Injectable } from '@angular/core';

/**
 * 警情类型转换器
 *
 * @export
 * @class TypeConvertService
 */
@Injectable()
export class TypeConvertService {

    /**
     * 将警情Id转换为多语言词条key值
     *
     * @param {string} type
     * @returns
     *
     * @memberOf TypeConvertService
     */
    convert(type: string) {
        return 'types.' + type;
    }


    /**
     * 将警情类型Id转换为ECharts图表的颜色值
     * 用于itemStyle的color属性
     *
     * @param {*} params ECharts传递过来的参数
     * @returns {string}
     *
     * @memberOf TypeConvertService
     */
    convertToColor(params: any): string {
        let id: number;
        if (typeof params.data.id === 'string') {
            id = Number(params.data.id);
        } else {
            id = params.data.id;
        }

        switch (id) {
            case 1:
                return '#2e87d3';
            case 2:
                return '#f0ad4e';
            case 3:
                return '#5cb85c';
            case 4:
                return '#fe9e9e';
            case 5:
                return '#8555e9';
            case 6:
                return '#ffdd00';
            case 7:
                return '#d9534f';
            default:
                return '#a9a9a9';
        }
    }
}
