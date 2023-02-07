import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(array: any, field: string, type: 'ASC' | 'DESC'): any[] {
    if (!Array.isArray(array)) {
      return array;
    }
    let sortClone = [...array];
    sortClone.sort((a: any, b: any) => {
      if (Number(a[field]) < Number(b[field])) {
        return type == 'ASC' ? -1 : 1;
      } else if (Number(a[field]) > Number(b[field])) {
        return type == 'ASC' ? 1 : -1;
      } else {
        return 0;
      }
    });
    return sortClone;
  }
}
