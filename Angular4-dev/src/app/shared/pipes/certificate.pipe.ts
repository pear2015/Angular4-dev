import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'certificate'
})

export class CertificatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        switch (value) {
            case '1':
                value = 'IDcard';
                break;
            case '2':
                value = 'resident card';
                break;
            case '3':
                value = 'passport';
                break;
            case '4':
                value = 'resident permit';
                break;
            case '5':
                value = 'other';
                break;
            case '6':
                value = 'noCard';
                break;
        }
        return value;
    }
}
