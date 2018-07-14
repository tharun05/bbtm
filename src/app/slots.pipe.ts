import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SlotsPipe'
})

export class SlotsPipe implements PipeTransform {
  transform(items: Array<any>, key, value): Array<any> {
    return items.filter(item => {
      return (item[key] == value)
    });
  }
}
 
  