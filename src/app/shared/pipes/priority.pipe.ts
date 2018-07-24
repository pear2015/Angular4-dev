import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Priority'
})

export class PriorityPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        switch (value) {
            case '0':
                value = 'common';
                break;
            case '1':
                value = 'urgent';
                break;
        }
        return value;
    }
}
