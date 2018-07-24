import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applyInputStatus'
})

export class ApplyInputStatusPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch (value) {
      case '1':  // 有犯罪记录
        value = 'hasCriminalRecord';
        break;
      case '2': // 无犯罪记录
        value = 'noCriminalRecord';
        break;

      case '3': // 拒绝分析
        value = 'rejectAnalysis';
        break;
    }
    return value;
  }
}
