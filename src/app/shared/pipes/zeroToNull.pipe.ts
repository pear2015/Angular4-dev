import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'zeroToNull'
})

export class ZeroToNullPipe implements PipeTransform {
    transform(value: any) {
        if (value === 0 || value === '0') {
            return '';
        } else {
            return value;
        }
    }
}
