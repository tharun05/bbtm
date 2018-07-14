import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './app-payment-methods.component.html',
  styleUrls: ['./app-payment-methods.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppPaymentMethodsComponent implements OnInit {
  @Input() availableCCTypes;
  constructor() {}

  ngOnInit() {}

}
