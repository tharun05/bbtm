import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateSuffix'
})
export class AppDateSuffixPipe implements PipeTransform {
	suffixes = ["th", "st", "nd", "rd"];
	constructor(public datePipe: DatePipe){}
	transform(value: any, args?: any): any {
		var dtfilter = this.datePipe.transform(value, args);
		var day = parseInt(this.datePipe.transform(value, 'dd'));
		var relevantDigits = (day < 30) ? day % 20 : day % 30;
		var suffix = (relevantDigits <= 3) ? this.suffixes[relevantDigits] : this.suffixes[0];
		return dtfilter.replace('oo', suffix);
	}

}
