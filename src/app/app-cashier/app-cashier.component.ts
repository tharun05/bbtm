import {Component, ViewEncapsulation, OnInit, OnDestroy, HostListener} from '@angular/core';
import {PaymentService} from '../services/payment.service';
import {Utility} from '../utils/utility';
import {UserDetailsService} from '../services/user-details.service'
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {DatePipe} from '@angular/common';
import {transactionTypeConfs} from '../utils/lotteryConfig';
import {EmitterService} from '../services/emitter.service';
import {AppLottodayService} from '../app-lottoday.service';
import {availablePaymentMethodsMap, availableWithdrawMethodsMap} from '../utils/lotteryConfig';
import {Router, ActivatedRoute} from "@angular/router";
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';


@Component({
    selector: 'app-app-cashier',
    templateUrl: './app-cashier.component.html',
    styleUrls: ['./app-cashier.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppCashierComponent implements OnInit, OnDestroy {
    totalBalance;
    cashBalance = undefined;
    bonusBalance;
    totalPrice;
    availableCCTypes;
    availableDepositCC;
    availableDepositMethods;
    availableWithdrawableCC;
    availableWithdrawMethods;
    kycVerified: boolean = true;
    isProfileCompleted: boolean = undefined;
    balanceSubscription;
    profileCompletedSubscription;
    cashierDepositLimitList;
    cashierCashoutLimitList;
    isCalculateLimit: number = 0;
    userDetail;
    availablePaymentMethodsMap;
    availableWithdrawMethodsMap;
    withdrawLimitList;
    addressVerified;
    idVerified;
    userDetails;
    accordianOpen;
    withdrawCCAvailable;
    withdrawOtherAvailable;
    activeMethod: any;
    confirmIdentity: boolean = false;
    qDResponse;
    userCurrency;

    @HostListener('window:resize') onResize() {
        let ww = document.body.clientWidth;
        if (ww <= 767) {
            $("#withdraw-info-icon").hide();
        }else{
            $("#withdraw-info-icon").show();;
        }
    }
    constructor(private paymentService: PaymentService,
        protected translateService: TranslationService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetailsService: UserDetailsService,
        public datePipe: DatePipe,
        private emitterService: EmitterService,
        private lottodayService: AppLottodayService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.userDetails = this.userDetailsService
        this.balanceSubscription = this.userDetails.balanceUpdated$.subscribe(
            message => {
                this.totalBalance = this.userDetails.getUserBalance();
                this.cashBalance = this.userDetails.getCashBalance();
                this.bonusBalance = this.userDetails.getBonusBalance();
            });

        this.profileCompletedSubscription = this.emitterService.profileCompletedSource$.subscribe(
            value => {
                if (value == "SUCCESS") {
                    this.isProfileCompleted = true;
                    //this.pay("payButton");
                    this.accordianOrBackClick($("#addFundsAccordian"));
                } else {
                }

            }
        );

        emitterService.userDataSource$.subscribe(
            userDataSource => {
                if (userDataSource == "User Data Updated") {
                    this.userDetail = this.userDetails.getuserProfileDetails();
                    if (this.userDetail) {
                        this.isCalculateLimit++;
                        this.calculateLimit();
                    }
                }
            }
        );

        emitterService.docUploadedEvent$.subscribe(
            docuploadStatus => {

                // this.closeAccordionOrBack("");
                // this.utils.scrollToPosition($("#confirmIdentityAccordianHead"));
                this.getAccountVerificationStatus(true);
            }
        );
        this.emitterService.qDResponse$.subscribe(resp => {
            this.userCurrency = this.userDetailsService.getCurrencyCode();
            this.qDResponse = resp;
            console.log(resp)
        });

    }

    openModal(modalId): void {
        this.loadWithdrawInfo();
        this.utils.openModal(modalId);
    }

    closeModal(modalId) {
        this.utils.closeModal(modalId);
    }

    updateProfileComplete(data) {
        this.utils.closeModal("profileCompleteModal");
        this.isProfileCompleted = true;
        this.accordianOrBackClick($("#addFundsAccordian"));
    }

    ngOnInit() {
        this.qDResponse=null;
        this.activeMethod='none';
        this.activatedRoute.queryParamMap.subscribe(queryParams => {
            this.accordianOpen = queryParams.get("type") == "addFund" ? "addFundsAccordian" : '';
        })
        this.isCalculateLimit = 0;
        this.availablePaymentMethodsMap = availablePaymentMethodsMap;
        this.availableWithdrawMethodsMap = availableWithdrawMethodsMap;

        var self = this;
        this.totalPrice = 10;
        this.totalBalance = this.userDetails.getUserBalance();
        this.cashBalance = this.userDetails.getCashBalance();
        this.bonusBalance = this.userDetails.getBonusBalance();
        this.userDetail = this.userDetails.getuserProfileDetails();
        if (this.userDetail) {
            this.isCalculateLimit++;
            this.calculateLimit();
        }
        Promise.resolve(this.userDetails.checkUserRegistrationStatus())
        .then(loginStatus => {
           if(loginStatus== false)
            return false;
        });
        Promise.resolve(this.lottodayService.getBalance())
            .then(balanceDetails => {
                if (balanceDetails) {
                    this.userDetails.setBonusBalance(balanceDetails["bonus"]);
                    this.userDetails.setCashBalance(balanceDetails["cash"]);
                    this.userDetails.setUserBalance(balanceDetails["cash"] + balanceDetails["bonus"]);
                }
            });
        Promise.resolve(this.paymentService.getAvailablePaymentMethodsLimits())
            .then(availableLimitData => {
                if (availableLimitData && availableLimitData["cashierDepositLimitList"]) {
                    this.cashierDepositLimitList = availableLimitData["cashierDepositLimitList"];
                }
                if (availableLimitData && availableLimitData["cashierCashoutLimitList"]) {
                    this.cashierCashoutLimitList = availableLimitData["cashierCashoutLimitList"];
                }
                this.isCalculateLimit++;
                this.calculateLimit();
            });
        Promise.resolve(this.lottodayService.checkUserProfile())
            .then(profileData => {
                if (profileData && profileData["userProfileCompleted"]) {
                    this.isProfileCompleted = true;
                } else {
                    this.isProfileCompleted = false;
                }
                this.accordianOpen ? this.accordianOrBackClick($("#" + this.accordianOpen)) : "";
            });
        this.getAccountVerificationStatus(false);
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
                this.isCalculateLimit++;
                this.calculateLimit();
            });
        $('.accordionHeadline').click(function () {
            if (self.isProfileCompleted != undefined) {
                if (self.isProfileCompleted && !(this.classList.value && (this.classList.value.includes('verified-headline-class') || this.classList.value.includes('verif-init-headline-class')))) {
                    self.accordianOrBackClick(this);
                } else if (!self.isProfileCompleted) {
                    self.showProfileCompleteOverlay();
                }
            }
        });

        let ww = document.body.clientWidth;
        if (ww <= 767) {
            $("#withdraw-info-icon").hide();
        }else{
            $("#withdraw-info-icon").show();;
        }
    
    }

    getAccountVerificationStatus(uploadedDoc) {
        Promise.resolve(this.userDetailsService.loadKYCStatus())
        .then(verificationData => {
            if(verificationData==true){
                this.confirmIdentity=this.userDetailsService.getKYCStatus();
                this.kycVerified= this.userDetailsService.getKYCVerifiedStatus();
                if (uploadedDoc) {
                    this.utils.scrollToPosition($("#confirmIdentityAccordianHead"))
                    this.closeAccordionOrBack("");
                }
            }
        });
    }

    setVerificationStatus(status) {
        let response;
        switch (status) {
            case 'vrfn_init':
                response = "initiated";
                break;
            case 'vrfn_failed':
                response = "failed";
                break;
            case 'vrfn_verified':
                response = "verified";
                break;
        }
        return response;
    }

    calculateLimit() {
        if (this.isCalculateLimit >= 3) {
            let self = this;
            let currency = this.userDetail ? this.userDetail.currency : "USD";
            this.withdrawLimitList = this.paymentService.getAvailableLimits(this.cashierCashoutLimitList, "withdraw", currency);
         }
    }



    showProfileCompleteOverlay() {
        var self = this;
        if (document.body.clientWidth <= 992) {
            this.router.navigate(['/complete-profile'], {queryParams: {"cashier": "true"}})
        } else {
            this.utils.openModal("profileCompleteModalCheckout");
        }
        setTimeout(function () {
            self.utils.openModal("profileCompleteModal");
        }, 1)

    }
    closeProfileCompleteModal(modalId) {
        this.utils.closeModal(modalId);
    }
    accordianOrBackClick(accordian) {
        if (accordian) {
            var accordionRow = $(accordian).parent();
            var accordionHeader = accordionRow.find('.accordionHeadline');
            var accordionConent = accordionRow.find('.accordionText');
            if (!accordionConent.hasClass('activeAccordionText') && !accordionRow.hasClass("not-verified")) {
                this.emitterService.broadcastAccordianClickEvent(accordionHeader.find("h1")[0].innerText.trim());
                $('.accordionHeadline').removeClass('flipButton').addClass('mob-hide');
                accordionHeader.addClass('flipButton');
                $('.bal-types').addClass('mob-hide');
                if (accordionRow.hasClass("payment-type-accordian") || accordionRow.hasClass("withdraw-type-accordian")) {
                    $('.select-payment-method-text').removeClass('mob-hide');
                    //$('.down-arrow').removeClass('cashier-mask');
                } else {
                    $('.down-arrow').removeClass('cashier-mask');
                }
                $('.accordionRow').addClass('mob-hide')
                $(accordionRow).removeClass('mob-hide');
                $('.cashier-back').removeClass('mob-hide');
                $('.accordionText').removeClass('activeAccordionText').css("display", "none");
                $('.alert-info-box').addClass('mob-hide');
                accordionConent.slideToggle();
                accordionConent.addClass('activeAccordionText');
                accordionConent.removeClass('mob-hide');
            } else if (accordionConent.hasClass('activeAccordionText')) {
                this.closeAccordionOrBack(accordionConent);
            }
            if (document.body.clientWidth <= 992) {
                accordionRow.hasClass("not-verified") ? "" : this.utils.scrollToPosition($('body'));
            } else {
                accordionRow.hasClass("not-verified") ? "" : this.utils.scrollToPosition(accordionRow);
            }
        } else {
            this.closeAccordionOrBack("");
            this.emitterService.broadcastbackClickedInCashier("cashierBackClicked");
            $('.kyc-mobile').removeClass('hide');
            $('.confirm-identity').removeClass('show');
            this.utils.scrollToPosition($('body'));
        }


    }

    closeAccordionOrBack(accordionConent) {
        $('.accordionHeadline').removeClass('flipButton').removeClass('mob-hide');
        $('.bal-types').removeClass('mob-hide');
        if ($('.accordionRow').hasClass("payment-type-accordian") || $('.accordionRow').hasClass("withdraw-type-accordian"))
            $('.select-payment-method-text').addClass('mob-hide');
        else
            $('.down-arrow').addClass('cashier-mask');
        $('.cashier-back').addClass('mob-hide');
        $('.accordionRow').removeClass('mob-hide');
        $('.alert-info-box').removeClass('mob-hide');
        accordionConent != "" ? accordionConent.slideToggle() : $('.accordionText').css("display", "none");
        $('.accordionText').removeClass('activeAccordionText');
        $('.accordionText').addClass('mob-hide');
        this.emitterService.broadcastAccordianClickEvent("cashier");
    }

    ngOnDestroy(): void {
        this.paymentService.ClearQueue();
        this.balanceSubscription.unsubscribe();
        this.profileCompletedSubscription.unsubscribe();

    }

    getMethod(method) {
        this.activeMethod = method;
        if(this.activeMethod=='addFunds'){
            this.qDResponse=null;
        }
    }

    confirmid() {
        this.confirmIdentity = true;
    }

    goBack() {
        this.confirmIdentity = this.userDetailsService.getKYCStatus();
        this.activeMethod='none';
    }

    loadWithdrawInfo(){
        let self = this;
        Promise.resolve(this.lottodayService.getWithdrawStaticInfo({'lang':this.translateService.getCurrentLang(),'url_path':'withdraw-info-lottoday'}))
        .then(
          termsData=>{
              if(termsData !== null){
                console.log("static withdraw:",termsData)
                $("#withdraw_info").html(termsData["content"]);
              }else{
                $("#withdraw_info").html(`<p>Something went woring!!<br>
                Please try after some time</p>`);
              }
          
          }
        )
    }
}
