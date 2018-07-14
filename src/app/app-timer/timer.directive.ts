import { Directive, ViewContainerRef  } from '@angular/core';

@Directive({
  selector: '[appTimer]'
})
export class TimerDirective {
  constructor(public viewContainerRef: ViewContainerRef){}
}
