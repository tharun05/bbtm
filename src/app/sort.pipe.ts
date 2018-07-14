import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})

export class SortPipe implements PipeTransform {
  transform(items: Array<any>, args: any, orderType: boolean): Array<any> {
     items.sort((a, b) => {
       if ( a[args] < b[args] ){
	    	return orderType ? 1 : -1;
	    }else if( a[args] > b[args] ){
	        return orderType ? -1 : 1;
	    }else{
	    	return 0;	
	    }
    });
     return items;
  }
}
