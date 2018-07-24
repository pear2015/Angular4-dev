import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Result'
})

export class ResultPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        switch (value) {
            case '1':
                value = 'agreeeEnter';
                break;
            case '2':
                value = 'rejectEnter';
                break;
        }
        return value;
    }
}
