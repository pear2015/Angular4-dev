import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aduitResult'
})

export class AduitResultPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch (value) {
      case '1':  // 通过
        value = 'pass';
        break;
      case '2': // 拒绝
        value = 'fail';
        break;
    }
    return value;
  }
}
