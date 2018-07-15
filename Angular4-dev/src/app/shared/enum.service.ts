import { Injectable } from '@angular/core';
import { EnumItem } from '../model/enumItem';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class EnumService {

    constructor(private translate: TranslateService) {

    }

    /**
     * 获取枚举列表
     */
    getList(enumType: any): EnumItem[] {
        let result: EnumItem[] = [];
        for (let item in enumType) {
            if (typeof (enumType[item]) === 'number') {
                let enumItem = new EnumItem();
                enumItem.value = enumType[item];
                enumItem.text = enumType[enumType[item]];
                this.translate.get(enumItem.text).toPromise().then(data => {
                    enumItem.translateText = data;
                    result.push(enumItem);
                });
            }
        }
        return result;
    }

}
