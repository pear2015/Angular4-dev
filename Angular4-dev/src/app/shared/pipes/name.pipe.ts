import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'wholeName'
})

export class WholeNamePipe implements PipeTransform {
    transform(value: string, args: string) {
        if ((value !== null && value !== '' && value !== undefined) && args !== null && args !== '' && args !== undefined) {
            return value + ' ' + args;
        }
    }
}
