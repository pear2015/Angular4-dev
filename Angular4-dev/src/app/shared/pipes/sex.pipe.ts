import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Sex'
})

export class SexPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        switch (value) {
            case '1':
                value = 'male';
                break;
            case '2':
                value = 'female';
                break;
            case '3':
                value = 'unknown';
                break;
        }
        return value;
    }
}
