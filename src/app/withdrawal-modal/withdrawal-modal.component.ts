import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Utility} from "../utils/utility";
import {PaymentService} from '../services/payment.service';
import {UserDetailsService} from '../services/user-details.service';
import {EmitterService} from '../services/emitter.service';

import * as _ from 'underscore';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
  selector: 'app-withdrawal-modal',
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['./withdrawal-modal.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class WithdrawalModalComponent implements OnInit {
  qDResponse;
  isCalculateLimit;
  withdrawLimitList;
  cashierDepositLimitList;
  cashierCashoutLimitList;
  availableDepositMethods;
  availableCCTypes;
  availableWithdrawableCC;
  withdrawCCAvailable;
  availableWithdrawMethods;
  withdrawOtherAvailable;
  cashBalance;
  userCurrency;
  @Output() messageEventWithdrawal = new EventEmitter<Boolean>();
  constructor(private paymentService : PaymentService,
              private userService: UserDetailsService,
              private _utils: Utility,
              private emitterService: EmitterService) {
      
      this.emitterService.qDResponse$.subscribe(resp=>{
        this.userCurrency = this.userService.getCurrencyCode();
        this.qDResponse = resp;
        console.log(resp);
      })
  }

  ngOnInit() {
    Promise.resolve(this.paymentService.getAvailablePaymentMethodsLimits())
    .then(availableLimitData => {
        if (availableLimitData && availableLimitData["cashierCashoutLimitList"]) {
            this.cashierCashoutLimitList = availableLimitData["cashierCashoutLimitList"];
        }
        this.isCalculateLimit++;
        this.calculateLimit();
    });
    Promise.resolve(this.paymentService.getCashierDetails())
    .then(cashierData => {
        if (cashierData && cashierData["cashier_deposit_data"]) {
            let cashier_deposit_data = cashierData["cashier_deposit_data"];
            if (_.size(cashier_deposit_data["methods"]["C"]) > 0 || _.size(cashier_deposit_data["methods"]["O"]) > 0) {
                this.availableDepositMethods = cashier_deposit_data["methods"];
                this.availableCCTypes = cashier_deposit_data["usedCC"];
            }
        }
        if (cashierData && cashierData["cashier_withdraw_data"]) {
            let cashier_withdraw_data = cashierData["cashier_withdraw_data"];
            if (cashier_withdraw_data["methods"]) {
                this.availableWithdrawableCC = cashier_withdraw_data["usedCC"];
                this.availableWithdrawMethods = cashier_withdraw_data["methods"];
                this.withdrawCCAvailable = _.size(cashier_withdraw_data["methods"]["C"]) > 0 ? "available" : "not-available";
                this.withdrawOtherAvailable = _.size(cashier_withdraw_data["methods"]["O"]) > 0 ? "available" : "not-available";
            }
        }
        this.cashBalance = this.userService.getCashBalance();
        this.isCalculateLimit++;
        this.calculateLimit();
    });

  }
  ngAfterViewInit(){
    this._utils.openModal("quickWithdrawalModal");
    $(".deposit-header .payment-method").removeClass('hide');
    $("#quickWithdrawalModal .user-reg-modal").removeClass('hide');
    $("#quickWithdrawalModal #quickModalSuccess").addClass("hide");
  }

  onClick(event){
    if (event.target.classList.contains("withdrawmodal") ) {
      this.closeModal("quickWithdrawalModal");
    }    
  }
  closeModal(modalId) {
    this._utils.closeModal(modalId);
    this.messageEventWithdrawal.emit(false);
  }
  calculateLimit() {
    if (this.isCalculateLimit >= 3) {
        let self = this;
        let currency = this.userService ? this.userService.getCurrencyCode : "USD";
        this.withdrawLimitList = this.paymentService.getAvailableLimits(this.cashierCashoutLimitList, "withdraw", currency);
     }
  }

}
