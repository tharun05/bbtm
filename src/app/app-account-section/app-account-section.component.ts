import {Component, ViewEncapsulation, OnInit, HostListener} from '@angular/core';

import {EmitterService} from '../services/emitter.service';
import {UserDetailsService} from '../services/user-details.service';
import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from "../utils/utility";
import {PaymentService} from '../services/payment.service';
import { Router,ActivatedRoute, } from "@angular/router";

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

import * as _ from 'underscore';

@Component({
    selector: 'app-account-section',
    templateUrl: './app-account-section.component.html',
    styleUrls: ['./app-account-section.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppAccountSectionComponent implements OnInit {

    userDeatil;
    confirmIdentity: boolean = false;
    private cash: number = -1;
    private currency: string;
    paymentMethod;
    userCurrency;
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
    isModalOpen: boolean=false;
    isWithdrawalModalOpen: boolean =false;
    isMobile;
    totalPrice = 10;
    kycVerified;
    @HostListener('window:resize') onResize() {
        var ww = document.body.clientWidth;
        if (ww <= 767) {
            $(".logo").addClass("my-acc-logo");
        }else{
            $(".logo").removeClass("my-acc-logo");
        }
    }
    constructor(private emitterService: EmitterService,
        private userService: UserDetailsService,
        private lottodayService:AppLottodayService,
        private utils: Utility,
        private paymentService : PaymentService,
        private router: Router) {
        emitterService.userDataSource$.subscribe(
            userDataSource => {
                if (userDataSource == "User Data Updated") {
                    this.userDeatil = this.userService.getuserProfileDetails();
                }
            }
        );
        this.userService.balanceUpdated$.subscribe(
            balanceUpdateStatus => {
                this.cash = this.userService.getUserBalance();
        });
        
        this.emitterService.qDResponse$.subscribe(resp=>{
            this.userCurrency = this.userService.getCurrencyCode();
            this.qDResponse = resp;
            this.paymentMethod = false;
            console.log(resp);
        })
      
    }
   

    closeModal(modalId) {
        this.utils.closeModal(modalId);
        if (modalId == "quickDepositAccountModal") {
            this.paymentMethod = false;
        }
        if (modalId == "quickWithdrawalAccountModal") {
            this.paymentMethod = false;
        }
    }
    shouldShowErrors(fieldName, formName) {
        return this.utils.shouldShowErrors(fieldName, formName)
    }
    getErrorMessage(fieldName, formName) {
        return this.utils.getErrorMessage(fieldName, formName)
    }
    getButtonClass(formName, fieldName) {
        return this.utils.getButtonClass(formName, fieldName)
    }
    isButtonDisabled(formName) {
        return this.utils.isButtonDisabled(formName)
    }

    accordianOrBackClick(accordian) {
        if (accordian) {
            var accordionRow = $(accordian).parent();
            var accordionHeader = accordionRow.find('.accordionHeadline');
            var accordionConent = accordionRow.find('.accordionText');
            if (!accordionConent.hasClass('activeAccordionText')) {
                $('.accordionHeadline').removeClass('flipButton');
                accordionHeader.addClass('flipButton');
                $('.accordionText').removeClass('activeAccordionText').css("display", "none");
                accordionConent.slideToggle();
                accordionConent.addClass('activeAccordionText');
            } else if (accordionConent.hasClass('activeAccordionText')) {
                this.closeAccordionOrBack(accordionConent);
            }
            this.utils.scrollToPosition(accordionRow);
        } else {
            this.closeAccordionOrBack("");
        }


    }

    closeAccordionOrBack(accordionConent) {
        $('.accordionHeadline').removeClass('flipButton');
        accordionConent != "" ? accordionConent.slideToggle() : $('.accordionText').css("display", "none");
        $('.accordionText').removeClass('activeAccordionText');
    }

    ngOnInit() {
        this.cash = this.userService.getUserBalance();
        var ww = document.body.clientWidth;
        if (ww <= 767) {
            $(".logo").addClass("my-acc-logo");
        }
        $(".mobile-menu").addClass("header-modified");
        $(".header-row").addClass("mob-header-row");
        var self = this;
        $('.accordionHeadline').click(function () {
            self.accordianOrBackClick(this);
        });

        this.userDeatil = this.userService.getuserProfileDetails();
        this.getKycVerficationStatus();
        var ww = document.body.clientWidth;
        if (ww <= 992) {       
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
                console.log(this.cashBalance);
                this.isCalculateLimit++;
                this.calculateLimit();
            });
        }
       
      
    }

    confirmid() {
        $(".confirm-identity-box").show();
        $(".accordionBox").hide();
    }
    ngOnDestroy(){
        $('.mobile-menu').removeClass('header-modified');
        $(".header-row").removeClass("mob-header-row");
        var ww = document.body.clientWidth;
        if (ww <= 767) {
            $(".logo").removeClass("my-acc-logo");
        }
    }
    goBack() {
        $(".confirm-identity-box").hide();
        $(".accordionBox").show();
    }

    getKycVerficationStatus(){
        Promise.resolve(this.userService.loadKYCStatus())
        .then(verificationData => {
            if(verificationData==true){
                this.confirmIdentity=this.userService.getKYCStatus();
                this.kycVerified= this.userService.getKYCVerifiedStatus();
            }
        });        
    }

    calculateLimit() {
        if (this.isCalculateLimit >= 3) {
            let self = this;
            let currency = this.userService ? this.userService.getCurrencyCode : "USD";
            this.withdrawLimitList = this.paymentService.getAvailableLimits(this.cashierCashoutLimitList, "withdraw", currency);
         }
    }
    toggleDepositmodal(){
        Promise.resolve(this.userService.checkUserRegistrationStatus())
        .then(loginStatus => {
           if(loginStatus== false){
            return false;
           }else{
            var ww = document.body.clientWidth;
            if (ww <= 992) {
                //this.isModalOpen=false;
                //this.isMobile=true;
                this.router.navigate(['/myaccount/cashier'], {queryParams: {"type": "addFund", "prevUrl": "myaccount"}})
            } else {
                this.isMobile=false;
                this.isModalOpen=true;
            }
           }
        });
        
        
    }
    receiveMessage($event) {
        if($event =="false"){
            this.isModalOpen = false;
        }else{
            this.isModalOpen = true;
        }
    }
    toggleWithdrawModal(){
        var ww = document.body.clientWidth;
        if (ww <= 992) {
            //this.isWithdrawalModalOpen=false;
            //this.isMobile=true;
           
        } else {
            this.isMobile=false;
            this.isWithdrawalModalOpen=true;
        }
    }
    receiveWithdrawMessage($event) {
        this.isWithdrawalModalOpen = false;
    }
}
