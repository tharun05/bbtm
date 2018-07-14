import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { UserDetailsService } from '../services/user-details.service';
import { EmitterService } from '../services/emitter.service';
import { Utility } from "../utils/utility";
import { AppAccountSectionComponent } from "../app-account-section/app-account-section.component";
import { HeaderComponent } from "../header/header.component";

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class DepositModalComponent implements OnInit {
  userCurrency;
  qDResponse;
  paymentMethod: boolean = false;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(private _paymentService: PaymentService,
    private _userService: UserDetailsService,
    private _emitterService: EmitterService,
    private _utils: Utility) {
    this._emitterService.qDResponse$.subscribe(resp => {
      this.userCurrency = this._userService.getCurrencyCode();
      this.qDResponse = resp;
      this.paymentMethod = false;
      console.log(resp);
    });
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this._utils.openModal("quickDepositModal");
    this.paymentMethod = true;
    $(".deposit-header .payment-method").removeClass('hide');
    $("#quickDepositModal .user-reg-modal").removeClass('hide');
    $("#quickDepositModal #quickModalSuccess").addClass("hide");
  }

  onClick(event){
    if (event.target.classList.contains("modal") ) {
     // this.closeModal("quickDepositModal");
    }    
  }
  closeModal(modalId) {
    this._utils.closeModal(modalId);
    this.paymentMethod = false;
    this.messageEvent.emit("false");
  }
  retryPayment(buttonId){
    if ($("#quickDepositModal").length > 0) {
      this.paymentMethod=true;
      this.messageEvent.emit("true");
      $("#quickDepositModal .user-reg-modal").removeClass('hide');
      $("#quickDepositModal #quickModalSuccess").addClass("hide");
      $("#quickDepositModal #quickModalFailure").addClass("hide");   
    }
  }
}
