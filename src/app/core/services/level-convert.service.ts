import { Injectable } from '@angular/core';

/**
 * 警情等级转换器
 *
 * @export
 * @class LevelConvertService
 */
@Injectable()
export class LevelConvertService {

    /**
     * 将警情等级Id转换为多语言词条key值
     *
     * @param {string} level
     * @returns {string}
     *
     * @memberOf LevelConvertService
     */
    convert(level: string): string {
        return 'grades.' + level;
    }

    /**
     * 将警情等级Id转换为ECharts图表的颜色值
     *
     * @param {*} params
     * @returns {string}
     *
     * @memberOf LevelConvertService
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
                return '#5cb85c';
            case 2:
                return '#ffdd00';
            case 3:
                return '#f0ad4e';
            case 4:
                return '#d9534f';
            default:
                return '#0275d8';
        }
    }
}
