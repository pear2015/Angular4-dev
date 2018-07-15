import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Marriage'
})

export class MarriagePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        switch (value) {
            case '1':
                value = 'unmarried';
                break;
            case '2':
                value = 'married';
                break;
            case '3':
                value = 'divorced';
                break;
            case '4':
                value = 'widower';
                break;
        }
        return value;
    }
}
