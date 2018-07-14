import {Injectable,Output,EventEmitter} from '@angular/core';
import {AppLottodayService} from '../app-lottoday.service';
import {EmitterService} from "../services/emitter.service";
import {Router, ActivatedRoute} from '@angular/router';
import {Utility} from '../utils/utility';
import {Subject} from 'rxjs/Subject';
import {availablePaymentMethodsMap, availableWithdrawMethodsMap} from '../utils/lotteryConfig';
import {mixpanelService} from '../services/mixpanel.service';
import { DepositModalComponent} from '../deposit-modal/deposit-modal.component';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

@Injectable()
export class PaymentService {
    private formSubmitted = new Subject<string>();
    formSubmitted$ = this.formSubmitted.asObservable();
    private errorMessage = new Subject<string>();
    errorMessage$ = this.errorMessage.asObservable();
    cashierDeatils_callsQueue = [];
    available_payment_methods_limitsQueue = [];

    constructor(private lottodayService: AppLottodayService,
        private emitterService: EmitterService,
        private router: Router,
        private utils: Utility,
        private mixpaneldataService: mixpanelService,
    ) {}

    ClearQueue() {
        this.cashierDeatils_callsQueue = [];
        this.available_payment_methods_limitsQueue = [];
    }
   
    afterPaymentSuccessfull(payementResponse, lotteryDetails, buttonId, errorDiv, retryCount): void {
        let counter = 0;
        let self = this;
        function checkTransactionStatus() {
            let txnDetails;
            Promise.resolve(self.lottodayService.getTransactionStatus({"txnId": payementResponse.txnId}))
                .then(payementStatus => {
                    if (payementStatus && payementStatus["status"] == "SUCCESS" && payementStatus["actualStatusInDB"] == "txn_confirmed_success") {
                        self.emitterService.broadcastPurchaseLoaderEvent(35);
                        if ($("#quickDepositModal").length > 0) {
                            txnDetails = self.utils.gettransactionSuccessfullDeatils(payementStatus["txnId"], payementResponse.depositAmount ? payementResponse.depositAmount : payementStatus["transactionAmount"], payementResponse.AccountId, payementStatus["paymentMethod"], payementStatus["cardNumber"], payementStatus["txnType"]);
                            txnDetails["failiureReason"] = payementStatus["errorDescription"];
                            txnDetails["transactionStatus"] = payementStatus["status"];
                            self.emitterService.broadcastqDResponse(txnDetails);
                            $(".deposit-header .payment-method").addClass('hide');
                            $("#quickDepositModal .user-reg-modal").addClass('hide');
                            $("#quickDepositModal #quickModalSuccess").removeClass("hide");
                            $("#quickDepositAccountModal #quickModalSuccess").removeClass("hide");
                            //setTimeout(function(){
                            //                    self.utils.closeModal("quickDepositModal");
                            //                    $("#quickDepositModal .user-reg-modal").removeClass('hide');
                            //                    $("#quickDepositModal #quickModalSuccess").addClass("hide");
                            //                    $("#quickDepositModal").find('.deposit-btn').removeClass("btn-progress").removeAttr("disabled");
                            //                  },3000);
                        }else if (payementStatus["txnType"] == "deposit") {
                            self.redirectToTranscationSuccessful(payementResponse, payementStatus, "SUCCESS", false);
                        } else if (payementStatus["txnType"] == "deposit-cashier") {
                            //self.emitterService.broadcastqDResponse(payementResponse);
                            self.redirectToTranscationSuccessful(payementResponse, payementStatus, "SUCCESS", false);
                        } else if ((payementStatus["paymentMethod"]=="TRUSTLY" || payementStatus["paymentMethod"]=="SKRILL") && "deposit-quick"){
                            self.redirectToTranscationSuccessful(payementResponse, payementStatus, "SUCCESS", false);
                        }
                    } else if (payementStatus["status"] == "SUCCESS" && payementStatus["actualStatusInDB"] == "txn_initiated") {


                        if (counter < 5) {
                            checkTransactionStatus();
                            counter += 1;
                        } else {
                            self.redirectToTranscationSuccessful(payementResponse, payementStatus, "FAILURE", true);
                        }

                    } else if (payementStatus && payementStatus["status"] == "FAILURE" && payementStatus["actualStatusInDB"] == "txn_confirmed_failure") {

                        if ($("#quickDepositModal").length > 0) {
                            txnDetails = self.utils.gettransactionSuccessfullDeatils(payementStatus["txnId"], payementResponse.depositAmount ? payementResponse.depositAmount : payementStatus["transactionAmount"], payementResponse.AccountId, payementStatus["paymentMethod"], payementStatus["cardNumber"], payementStatus["txnType"]);
                            txnDetails["failiureReason"] = payementStatus["errorDescription"];
                            txnDetails["transactionStatus"] = payementStatus["status"];
                            self.emitterService.broadcastqDResponse(txnDetails);
                            $("#quickDepositModal .user-reg-modal").addClass('hide');
                            $("#quickDepositModal #quickModalFailure").removeClass("hide");
                            $("#quickDepositAccountModal #quickModalFailure").removeClass("hide");
                            $(".quickDepositBtn").on("click", function () {
                                $("#quickDepositModal .user-reg-modal").removeClass('hide');
                                $("#quickDepositModal #quickModalFailure").addClass("hide");
                                $("#quickDepositModal").find('.deposit-btn').removeClass("btn-progress").removeAttr("disabled");
                            })
                        }else{
                            self.redirectToTranscationSuccessful(payementResponse, payementStatus, "FAILURE", false);
                        }
                    } else if (payementStatus && payementStatus["status"] == "FAILURE") {
                        self.redirectToTranscationSuccessful(payementResponse, payementStatus, "FAILURE", false);
                    } else {
                        self.redirectToTranscationSuccessful(payementResponse, "", "FAILURE", false);
                    }
                }, SystemError => {
                    self.emitterService.broadcastCanclePurchaseLoaderEvent(true);
                    self.setError("Something Went wrong Please try again Later", buttonId, errorDiv, undefined);
                });
        }
        checkTransactionStatus();
    }


    // emitCashierDeposit(payementResponse,payementStatus,buttonId){
    //   this.emitterService.broadcasttxnComplete("SUCCESS");
    //   let txnDetails = this.utils.gettransactionSuccessfullDeatils(payementStatus.txnId,payementResponse.depositAmount,payementResponse.AccountId,payementStatus.paymentMethod,payementStatus.cardNumber)
    //   this.setError(undefined,buttonId,undefined,undefined);
    //   this.emitterService.broadcastcashierTxnCompleteSource(JSON.stringify(txnDetails));
    // }


    paymentPendingFor3dVerification(payementResponse, paymentMethod) {

        switch (paymentMethod) {
            case "CREDITCARD":
                if ((undefined != payementResponse["redirectURL"]) && (payementResponse["redirectURL"].length > 0)) {
                    this.emitterService.broadcastPurchaseLoaderEvent(50);
                    //this.utils.openModal("Modal3D");
                    let $iframe = $('<iframe name="cciFrame" id="loaderIframe" class="showIframe" ng-init="init()" src="" style="width: 700px;height: 500px;margin: auto;margin-top: -22px; display: block;border: 0;"></iframe>');

                    let $form;
                    if (payementResponse["redirectParamsList"] != null) {
                        $form = $('<form id="proxy_redirect" method="POST" action="' + payementResponse["redirectURL"] + '"></form>');
                        _.forEach(payementResponse["redirectParamsList"], function (value, key) {
                            if (value != null) {
                                if (key == 'field_3' && parseInt(value) < 10 && !value.includes("0")) {
                                    value = parseInt(value);
                                    if (value < 10) value = "0" + value;
                                }

                                $form.append('<input type="hidden" name="' + key + '" value="' + value + '" />');
                            }
                        });
                    } else {
                        payementResponse["redirectURL"] = payementResponse["redirectURL"].replace('document.forms[0].submit();', '');
                        $form = $(payementResponse["redirectURL"]);
                        $form.addClass("hide");
                    }
                    $("#loaderIframe").empty();
                    if ($("#quickDepositModal").length > 0) {
                        //this.utils.closeModal("quickDepositModal");
                        //this.utils.openModal("Modal3D");
                        $(".payment-type-container").addClass('hide');
                        $("#iframeContainer").removeClass('hide');
                        $("#iframeContainer").append($form);
                        
                        $("#iframeContainer").append($iframe);
                        $("#proxy_redirect").attr('target', 'cciFrame');
                    } else {
                        this.utils.openModal("Modal3D");
                        $("#modal3dBody").append($iframe);
                        $("#modal3dBody").append($form);
                        $("#proxy_redirect").attr('target', 'cciFrame'); //should change the Target to cciFrame
                    }

                    $("#proxy_redirect").submit();
                }
                break;
            case "TRUSTLY":
                window.location.href = payementResponse.redirectURL;
                break;
            case "NETELLER":
            case "SKRILL":            
            case "ZIMPLER":
                $("#loaderIframe").empty();
                if (($("#quickDepositModal").length > 0 && $("#Modal3D").length > 0) || window.location.href.indexOf("myaccount")>0) {
                    let $iframe = $('<iframe name="cciFrame" id="loaderIframe" class="showIframe" ng-init="init()" src="' + payementResponse.redirectURL + '" style="width: 700px;height: 700px;margin: auto;display: block;border: 0;"></iframe>');

                    this.utils.closeModal("quickDepositModal");
                    this.utils.openModal("Modal3D");
                    $("#modal3dBody").append($iframe);
                    $("#proxy_redirect").attr('target', 'cciFrame');
                } else {
                    window.location.href = payementResponse.redirectURL;
                }
                break;
        }
    }


    redirectToTranscationSuccessful(payementResponse, payementStatus, status, isTimeout): void {
        this.emitterService.broadcasttxnComplete("SUCCESS");
        let txnDetails
        if (payementResponse && payementStatus && !isTimeout) {
            txnDetails = this.utils.gettransactionSuccessfullDeatils(payementStatus.txnId, payementResponse.depositAmount ? payementResponse.depositAmount : payementStatus.transactionAmount, payementResponse.AccountId, payementStatus.paymentMethod, payementStatus.cardNumber, payementStatus.txnType);
            txnDetails["failiureReason"] = payementStatus.errorDescription;
        } else {
            txnDetails = this.utils.gettransactionSuccessfullDeatils("", "", "", "", "", "");
        }

        txnDetails["transactionStatus"] = status;
        // this.router.navigate([{outlets: {'txn-check': ['/txn-confirmation', txnDetails]}}]);

        this.router.navigate(['/txn-confirmation'],{ queryParams: txnDetails });
    }



    setError(errorMsg, buttonId, errorDiv, oldMessage) {
        if (errorDiv) {
            this.errorMessage.next(errorMsg);
            this.utils.showError(errorDiv);
        }
        if (buttonId) {
            let text = oldMessage ? oldMessage : "DEPOSIT";
            this.utils.enableNewButton(buttonId, errorDiv ? "FAILED" : "SUCCESS", errorDiv ? "Please Try Again" : "SUCCESS", text);
            this.formSubmitted.next("false");
        };

    }

    getCashierDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.cashierDeatils_callsQueue.length > 0) {
                this.cashierDeatils_callsQueue.push(resolve)
            } else {
                this.cashierDeatils_callsQueue.push(resolve)
                this.lottodayService.getCashierData()
                    .then(data => {
                        for (; this.cashierDeatils_callsQueue.length > 0;) {
                            var resp_obj = data ? JSON.parse(JSON.stringify(data)) : {};
                            this.cashierDeatils_callsQueue[0](resp_obj);
                            this.cashierDeatils_callsQueue.splice(0, 1);
                        }

                    });
            }

        })
    }

    getAvailablePaymentMethodsLimits(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.available_payment_methods_limitsQueue.length > 0) {
                this.available_payment_methods_limitsQueue.push(resolve)
            } else {
                this.available_payment_methods_limitsQueue.push(resolve)
                this.lottodayService.getAvailablePaymentMethodLimits()
                    .then(availableLimitData => {
                        let resp_data = {};
                        if (availableLimitData) {
                            resp_data = {
                                cashierDepositLimitList: availableLimitData["cashierDepositLimitList"],
                                cashierCashoutLimitList: availableLimitData["cashierCashoutLimitList"]
                            }
                        }

                        for (; this.available_payment_methods_limitsQueue.length > 0;) {
                            //var resp_obj = JSON.parse(JSON.stringify(data));
                            this.available_payment_methods_limitsQueue[0](resp_data);
                            this.available_payment_methods_limitsQueue.splice(0, 1);
                        }

                    });
            }
        })
    }

    getAvailableLimits(LimitList, type, currency) {
        let LimitListTemp = {}
        if (type == "deposit") {
            _.each(LimitList, function (limits) {
                if (limits.currency == currency) {
                    if (!LimitListTemp[limits.option]) {
                        LimitListTemp[limits.option] = {};
                    }
                    LimitListTemp[limits.option]["minTxnLimit"] = limits.minTxnLimit;
                    LimitListTemp[limits.option]["maxTxnLimit"] = limits.maxTxnLimit;
                }
            })
        } else {
            _.each(LimitList, function (limits) {
                if (limits.currency == currency) {
                    if (!LimitListTemp[limits.option]) {
                        LimitListTemp[limits.option] = {};
                    }
                    LimitListTemp[limits.option]["minTxnLimit"] = limits.minTxnLimit;
                    LimitListTemp[limits.option]["maxTxnLimit"] = limits.maxTxnLimit;
                }
            })
        }
        return this.getLimitMap(LimitListTemp, type);
    }

    getLimitMap(LimitListTemp, type) {
        let LimitList = {}
        let availableMethodsMap;
        type == "deposit" ? availableMethodsMap = availablePaymentMethodsMap : availableMethodsMap = availableWithdrawMethodsMap;
        _.each(availableMethodsMap, function (paymentType, key) {
            if (typeof paymentType == "object") {
                let keyToPut = key;
                _.each(paymentType, function (paymentTypeInside, key) {
                    if (!LimitList[keyToPut] && LimitListTemp[paymentTypeInside.methodName]) {
                        LimitList[keyToPut] = {
                            "minTxnLimit": LimitListTemp[paymentTypeInside.methodName].minTxnLimit,
                            "maxTxnLimit": LimitListTemp[paymentTypeInside.methodName].maxTxnLimit
                        }
                    } else if (LimitListTemp[paymentTypeInside.methodName]) {
                        LimitList[keyToPut] = {
                            "minTxnLimit": LimitList[keyToPut].minTxnLimit > LimitListTemp[paymentTypeInside.methodName].minTxnLimit ? LimitListTemp[paymentTypeInside.methodName].minTxnLimit : LimitList[keyToPut].minTxnLimit,
                            "maxTxnLimit": LimitList[keyToPut].maxTxnLimit < LimitListTemp[paymentTypeInside.methodName].maxTxnLimit ? LimitListTemp[paymentTypeInside.methodName].maxTxnLimit : LimitList[keyToPut].maxTxnLimit,
                        }
                    }
                })
            } else {
                if (!LimitList[key] && LimitListTemp[key]) {
                    LimitList[key] = {
                        "minTxnLimit": LimitListTemp[key].minTxnLimit,
                        "maxTxnLimit": LimitListTemp[key].maxTxnLimit
                    }
                } else if (LimitListTemp[key]) {
                    LimitList[key] = {
                        "minTxnLimit": LimitList[key].minTxnLimit > LimitListTemp[key].minTxnLimit ? LimitListTemp[key].minTxnLimit : LimitList[key].minTxnLimit,
                        "maxTxnLimit": LimitList[key].maxTxnLimit < LimitListTemp[key].maxTxnLimit ? LimitListTemp[key].maxTxnLimit : LimitList[key].maxTxnLimit,
                    }
                }
            }
        })

        return LimitList;
    }

    mixPanelEventCheck(type, gameName): void {
        gameName = gameName ? gameName : '';
        Promise.resolve(this.mixpaneldataService.userLoggedIn('cashier', type, gameName));
    }
    redirectToCashoutTranscation(payementResponse,payementStatus,status,isTimeout):void{
        this.emitterService.broadcasttxnComplete("SUCCESS");
        let txnDetails
        if(payementResponse && payementStatus && !isTimeout){
          txnDetails =  {
              ["txnId"]:payementResponse.txnId,
              ["amount"]:payementResponse.depositAmount,
              txnDate:new Date(),
              paymentType:"Cashout"
            };
          txnDetails["failiureReason"] = payementStatus.errorDescription;
        }else{
          txnDetails = this.utils.gettransactionSuccessfullDeatils("","","","","","");
        }
    
        txnDetails["transactionStatus"] = status;
        this.router.navigate(['/txn-confirmation'],{ queryParams: txnDetails });
      }
    afterCashoutSuccessfull(payementResponse,lotteryDetails,buttonId,errorDiv,retryCount):void{
        let self = this;
           let txnDetails;
             Promise.resolve(self.lottodayService.getTransactionStatus({"txnId":payementResponse.txnId,"type":payementResponse["paymentType"] }))
             .then(payementStatus=> {
 
                 if(payementStatus &&  payementStatus["status"]=="SUCCESS" && payementStatus["actualStatusInDB"] == "co_initiated"){
                      self.redirectToCashoutTranscation(payementResponse,payementStatus,"PENDING",false);
                 }else if(payementStatus &&  payementStatus["status"]=="SUCCESS" && payementStatus["actualStatusInDB"] == "co_success"){
                     self.redirectToCashoutTranscation(payementResponse,payementStatus,"SUCCESS",false);
                 }else if(payementStatus &&  payementStatus["status"]=="FAILURE" && payementStatus["actualStatusInDB"] == "co_failed"){
                     self.redirectToCashoutTranscation(payementResponse,payementStatus,"FAILURE",false);
                 }else{
                     self.redirectToCashoutTranscation(payementResponse,payementStatus,"FAILURE",false);
                 }  
             })
       }  
}
