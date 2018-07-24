import { Pipe, PipeTransform } from '@angular/core';

/* tslint:disable */
@Pipe({
    name: 'translate'
})
export class MockTranslatePipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}
