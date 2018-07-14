import {Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {Utility} from '../utils/utility';
import {ActivatedRoute} from '@angular/router';
import {UserDetailsService} from '../services/user-details.service'
import {Router} from '@angular/router';
import {EmitterService} from '../services/emitter.service';
import {AppLottodayService} from '../app-lottoday.service';
import {PaymentService} from '../services/payment.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

@Component({
    selector: 'app-app-payment',
    templateUrl: './app-payment.component.html',
    styleUrls: ['./app-payment.component.scss']
})
export class AppPaymentComponent implements OnInit {
    cartList: any;
    totalPrice: number = 0;
    paymentType: string;
    lotteryDeatil: any = {};
    callPaymentFields: boolean = false;
    userBalance;
    isSubscription;
    showCartSummary: boolean = false;
    isUserLoggedIn;
    cartPrice;
    transactionSuccess: boolean = false;
    bonusSelect: boolean = false;
    paymentMethod: boolean = false;
    qDResponse;
    userCurrency;
    availableDepositMethods;
    availableCCTypes;
    availableWithdrawableCC;
    withdrawCCAvailable;
    availableWithdrawMethods;
    withdrawOtherAvailable;
    cashBalance;
    isCalculateLimit;
    withdrawLimitList;
    cashierDepositLimitList;
    cashierCashoutLimitList;
    constructor(private activatedRoute: ActivatedRoute,
        private utils: Utility,
        private router: Router,
        private lottodayService: AppLottodayService,
        private userService: UserDetailsService,
        private emitterService: EmitterService,
        private paymentService: PaymentService) {
        userService.balanceUpdated$.subscribe(message => {
            this.userBalance = this.userService.getUserBalance();
            if (sessionStorage.getItem("cartList") && this.paymentType == "buyTicket") {
                this.totalPrice = this.utils.roundAmount(this.cartList.reduce((sum, item) => sum + Number(item['finalOrderPriceUC']), 0));
                this.cartPrice = this.totalPrice;
                if (this.userBalance) {
                    this.totalPrice = this.totalPrice - this.userBalance;
                    this.totalPrice = this.totalPrice > 1 ? this.totalPrice : 1;
                }
            } else {
                this.totalPrice = 10;
            }


            if (!isNaN(this.totalPrice)) this.callPaymentFields = true;
        });
    }

    getCartItemsCount() {
        return this.utils.getCartItemsCount();
    }
    ngOnInit() {
        this.isUserLoggedIn = this.utils.isUserLoggedIn();
        if (this.isUserLoggedIn) {
            this.activatedRoute.params.subscribe(params => {
                this.paymentType = params['type'];
                if (!this.paymentType) {
                    //                    if (this.router.url.includes("gamePlay")) {
                    this.paymentType = "deposit-cashier";
                    $("#quickDepositModal").find('.deposit-btn').removeClass("btn-progress").removeAttr("disabled");
                    //                    }
                }
                if(this.paymentType=='withdrawal'){
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
            });
            this.activatedRoute.queryParamMap.subscribe(queryParams => {
                this.isSubscription = queryParams.get("subscription");
            });

            if (sessionStorage.getItem("cartList") && this.paymentType == "buyTicket") {
                this.cartList = _.values(JSON.parse(sessionStorage.getItem("cartList")));
                this.userBalance = this.userService.getUserBalance();
                this.lotteryDeatil = _.values(JSON.parse(sessionStorage.getItem("cartList"))).map(function (element) {return element});
                this.totalPrice = this.utils.roundAmount(this.cartList.reduce((sum, item) => sum + Number(item['finalOrderPriceUC']), 0));
                this.cartPrice = this.totalPrice;
                if (this.userBalance) {
                    this.totalPrice = this.totalPrice - this.userBalance;
                    this.totalPrice = this.totalPrice > 1 ? this.totalPrice : 1;
                }

            } else {
                this.totalPrice = 10;
            }

            if (!isNaN(this.totalPrice) && this.totalPrice > 0) this.callPaymentFields = true;
        } else {
            this.router.navigate(["/"]);
        }
    }
    closeProfileCompleteModal(modalId) {
        this.emitterService.broadcastProfileCompletedSource("FAILED");
        this.utils.closeModal(modalId);
    }

    updateProfileComplete() {
        this.emitterService.broadcastProfileCompletedSource("SUCCESS");
        this.utils.closeModal("profileCompleteModal");
    }

    showInfo(divId): void {
        $("#" + divId).slideToggle();
        $("#summary-" + divId + ">span").toggleClass("hide");
    }

    // closeModal(modalId) {
    //     this.utils.closeModal(modalId);
    //     if (modalId == "quickDepositModal") {
    //         this.bonusSelect = false;
    //         this.paymentMethod = false;
    //     }
    // }
    // openPageOrModal(page, modalId) {
    //     if (document.body.clientWidth <= 992) {
    //         this.router.navigate([page], {queryParams: {"checkout": "true"}})
    //     } else {
    //         this.openModal(modalId);
    //     }
    // }

    // openModal(modalId): void {
    //     this.utils.openModal(modalId);
    //     if (modalId == "quickDepositModal") {
    //         this.bonusSelect = true;
    //         this.paymentMethod = false;
    //     }
    // }

    makePayment() {
        Promise.resolve(this.lottodayService.getLoginStatus())
            .then(data => {
                this.utils.openModal("#quickDepositModal");
                this.bonusSelect = false;
                this.paymentMethod = true;
            });
    }
    paymentComplete() {
        Promise.resolve(this.lottodayService.getLoginStatus())
            .then(data => {
                this.utils.openModal("#quickDepositModal");
                this.bonusSelect = false;
                this.paymentMethod = false;
                this.transactionSuccess = true;
                this.qDResponse = true;
            });
    }
    calculateLimit() {
        if (this.isCalculateLimit >= 3) {
            let self = this;
            let currency = this.userService ? this.userService.getCurrencyCode : "USD";
            this.withdrawLimitList = this.paymentService.getAvailableLimits(this.cashierCashoutLimitList, "withdraw", currency);
         }
    }

}
