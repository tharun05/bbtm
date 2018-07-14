import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ceil'
})
export class AppMathCeilPipe implements PipeTransform {
	constructor(){}
	transform(value: any): any {
		return Math.ceil(value);
	}
}
