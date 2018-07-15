import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../../core/services/localstorage.service';
@Pipe({
    name: 'I18nDate'
})
/**
 * 根据语言环境对日期进行国际化
 */
 export class I18nDatePie implements PipeTransform {
    private lang = 'pt-PT';
    private longOptions = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    };
    private shortOptions = {
        year: 'numeric', month: 'numeric', day: 'numeric'
    };
    constructor(private localStorageService: LocalStorageService) {
        try {
            this.lang = this.localStorageService.read('lang');
        } catch (ex) {
            this.lang = 'pt-PT';
        }

    }
    /**
     *  arg 为long 时 输出格式为长日期格式，带时分秒，为short 时 为短日期格式，不带时分秒
     */
    transform(value: any, arg?: string): any {
        try {
            if (value == null || value === undefined || value === '') {
                return;
            } else {
                if (arg != null && arg !== undefined && arg !== '') {
                    if (arg === 'long') {
                        return new Intl.DateTimeFormat(this.lang, this.longOptions).format(Date.parse(value));
                    } else {
                        return new Intl.DateTimeFormat(this.lang, this.shortOptions).format(Date.parse(value));
                    }
                } else {
                    return new Intl.DateTimeFormat(this.lang, this.shortOptions).format(Date.parse(value));
                }

            }
        } catch (ex) {
            return value;
        }
    }
}
