import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ptMonth'
})

export class PtMonthPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch (value) {
      case 1:
        value = 'Janeiro';
        break;
      case 2:
        value = 'Fevereiro';
        break;
      case 3:
        value = 'Março';
        break;
      case 4:
        value = 'Abril';
        break;
      case 5:
        value = 'Maio';
        break;
      case 6:
        value = 'Junho';
        break;
      case 7:
        value = 'Julho';
        break;
      case 8:
        value = 'Agosto';
        break;
      case 9:
        value = 'Setembro';
        break;
      case 10:
        value = 'Outubro';
        break;
      case 11:
        value = 'Novembro';
        break;
      case 12:
        value = 'Dezembro';
        break;
    }
    return value;
  }
}
