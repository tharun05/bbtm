import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input, OnChanges, SimpleChange, HostListener} from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { AppLottodayService } from '../app-lottoday.service';
import { currency_codes } from '../utils/currency-code';
import { availablePaymentMethods, availablePaymentMethodsMap } from '../utils/lotteryConfig';
import { Router } from '@angular/router';
import { Utility } from '../utils/utility';
import { UserDetailsService } from '../services/user-details.service'
import { EmitterService } from "../services/emitter.service";
import { PaymentService } from '../services/payment.service';
import { CCconfig } from '../utils/general-config';
import { LogoutEmitService } from '../services/logout-emit-service';
import { mixpanelService } from '../services/mixpanel.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

import 'selectric';

@Component({
  selector: 'app-payment-container-fields',
  templateUrl: './app-payment-container-fields.component.html',
  styleUrls: ['./app-payment-container-fields.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppPaymentContainerFieldsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() 	totalPrice:number;
  @Input() paymentType: string;
  @Input() isSubscription;
  depositLimitList;
  @Input() lotteryDeatil: any;
  depositData: any = {};
  selectedCard:any;
  selectedCardID: any = "0";
  addNewCard:boolean = true;
  serverError;
  availableMethods = {};
  selectedMethod:string;
  availableUsedCC;
  activeForm;
  loaderInit = false;
  @ViewChild('modal3diframe')
  private modal3diframe: ElementRef;
  @ViewChild('modal3dBody')
  private modal3dBody: ElementRef;
  ccReExp;
  ccBlockSep;
  selectedCardType;
  selectedCardTypeBlocks;
  creditCardNumber;
  availablePaymentMethodsMap;
  depositAmountModel;
  isProfileCompleted:boolean = undefined;
  loader_per = 0;
  cashierDepositLimitList;
  isCalculateLimit:number = 0;
  userDetail;
  depositCCAvailable;
  depositOtherAvailable;
  cashierBackClickedSubscribption;
  cancelPurchaseLoaderSubs
  logoutOnTimeoutSubs;
  profileCompletedSubs;
  serverErrorSubs;
  userDataSubs;
  processed;
  payComplete: boolean=true;

  txnDetails={};
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    if(e.data && e.data["message"] && e.data["message"] == "CallBack")
    this.getTransactionResult(e.data["urlParams"]);
  }

  ccForm = this.formBuilder.group({
    'cardNumber': ['', [CustomValidators.required]],
    'CVV': ['', [CustomValidators.reqMinMaxNum(3,5)]],
    'holderFirstName': ['', [CustomValidators.validName(2,50)]],
    'depositAmount':['',[CustomValidators.required]],
    'cardId':['',[CustomValidators.required]],
    'subscription':['false'],
    'expDate': this.formBuilder.group({
      'expMonth': ['',[CustomValidators.validNumbers(1)]],
      'expYear': ['',[CustomValidators.validNumbers(4)]],
    }, {validator: CustomValidators.expCardData()})
  }, {validator: CustomValidators.creditCardValidator(this.utils)});

  netellerForm = this.formBuilder.group({
    'accountNumber': ['', [CustomValidators.required]],
    'secureID': ['',[CustomValidators.maxLength(30)]],
    'depositAmount':['',[CustomValidators.required]]
  });

  skrillForm = this.formBuilder.group({
    'emailAddress': ['', [CustomValidators.validateUniqueness('txtEmail',this.lottodayService,false)]],
    'depositAmount':['',[CustomValidators.required]]
  });
  trustlyForm = this.formBuilder.group({
    'depositAmount':['',[CustomValidators.required]],
    'emailAddress': ['', [CustomValidators.validateUniqueness('txtEmail',this.lottodayService,false)]]
  });

  zimplerForm = this.formBuilder.group({
    'depositAmount':['',[CustomValidators.required]],
    'phone': ['', [CustomValidators.phoneNumberValidator]]
  });

  constructor(private formBuilder:FormBuilder,
    private lottodayService:AppLottodayService,
    private utils:Utility,
    private router:Router,
    private emitterService:EmitterService,
    private userService:UserDetailsService,
    private renderer: Renderer2,
    private paymentService:PaymentService,
    private logoutEmitService:LogoutEmitService,
    private mixpaneldataService:mixpanelService
  ) {

      this.cancelPurchaseLoaderSubs = this.emitterService.cancelPurchaseLoaderEvent$.subscribe(
        value => {
          this.loaderInit = false;
        }
      );

      this.cashierBackClickedSubscribption = this.emitterService.backClickedInCashier$.subscribe(
        value => {
          $(".payment-type-tabs").removeClass('mob-hide');
          $(".payment-type-content").addClass('mob-hide');
          $(".payment-type-container p").removeClass('mob-hide');
          $(".skew-header").removeClass('down-arrow-white');
          $(".select-payment-method-text").addClass("mob-hide");
          $('.down-arrow').addClass('cashier-mask');
        }
      );

      this.logoutOnTimeoutSubs = this.logoutEmitService.TimeOutEvent$.subscribe(
        value => {
          this.emitterService.broadcastCanclePurchaseLoaderEvent(true);
          // let errorDiv = "#paymentError";
          //   if(errorDiv){
          //     this.serverError = "Transaction Timed Out";
          //     this.utils.showError(errorDiv);
          //   }
          //   this.utils.enableNewButton("payButton","FAILED","Timed Out",this.userService.getUserCurrencySymbol()+this.depositAmountModel);
          this.router.navigate(['/order-confirmation-container']);
        })

        this.profileCompletedSubs = this.emitterService.profileCompletedSource$.subscribe(
          value => {
            if(value=="SUCCESS"){
              this.isProfileCompleted = true;
              this.pay("payButton");
            }else{
              let errorDiv = "#paymentError";
              if(errorDiv){
                this.serverError = "Please complete your profile before making a Purchase/Deposit";
                this.utils.showError(errorDiv);
              }
            }

          }
        );
          this.serverErrorSubs = paymentService.errorMessage$.subscribe(
            message => {
              this.serverError=message;
            });


            this.userDataSubs = emitterService.userDataSource$.subscribe(
              userDataSource => {
                if (userDataSource == "User Data Updated") {
                  this.userDetail = this.userService.getuserProfileDetails();
                  if(this.userDetail){
                    this.isCalculateLimit++;
                    this.calculateLimit();
                  }
                }
              }
            );
          }
          closeModal(modalId){
            $('.deposit-btn').prop("disabled", false);
            $('.deposit-btn').removeClass('btn-progress');
            this.utils.closeModal(modalId);
          }
          shouldShowErrors(fieldName,formName){
            return this.utils.shouldShowErrors(fieldName,formName)
          }
          getErrorMessage(fieldName,formName){
            return this.utils.getErrorMessage(fieldName,formName)
          }
          getButtonClass(formName,fieldName){
            return this.utils.getButtonClass(formName,fieldName)
          }
          isButtonDisabled(formName){
            return this.utils.isButtonDisabled(formName)
          }
          getCartItemsCount(){
            return this.utils.getCartItemsCount();
          }

          ngOnInit() {
            //checkUserProfile_post
            Promise.resolve(this.lottodayService.checkUserProfile())
            .then(profileData => {
              if(profileData && profileData["userProfileCompleted"]){
                this.isProfileCompleted = true;
              }else{
                this.isProfileCompleted = false;
              }
            });
            this.availablePaymentMethodsMap = availablePaymentMethodsMap;
            this.ccReExp = CCconfig.re;
            this.ccBlockSep = CCconfig.blocks;
            this.totalPrice = this.totalPrice > 1 ? this.totalPrice : 1;
            this.ccForm.controls["subscription"].setValue(this.isSubscription);
                  if(this.paymentType == "buyTicket"){
                    this.depositAmountModel = this.totalPrice.toFixed(2);
                  }else
                    this.depositAmountModel = this.totalPrice;
            this.ccForm.controls['depositAmount'].setValue(this.depositAmountModel);
            this.userDetail = this.userService.getuserProfileDetails();
            if(this.userDetail){
              this.isCalculateLimit++;
              this.calculateLimit();
            }
            Promise.resolve(this.paymentService.getAvailablePaymentMethodsLimits())
            .then(availableLimitData => {

              if(availableLimitData && availableLimitData["cashierDepositLimitList"]){
                this.cashierDepositLimitList = availableLimitData["cashierDepositLimitList"];
              }
              this.isCalculateLimit++;
              this.calculateLimit();
            });
            Promise.resolve(this.paymentService.getCashierDetails())
            .then(cashierData => {
              if(cashierData && cashierData["cashier_deposit_data"]){
                let cashier_deposit_data = cashierData["cashier_deposit_data"];
                if(_.size(cashier_deposit_data["methods"]["C"]) > 0 || _.size(cashier_deposit_data["methods"]["O"]) > 0){
                  this.availableMethods={};
                  let availableCCTypes = this.getAvailableCreditCardMethods(cashier_deposit_data["methods"]["C"]);
                  this.addPaymentMethods(availableCCTypes);
                  this.addPaymentMethods(cashier_deposit_data["methods"]["O"]);
                  this.depositData.methods = _.intersection(Object.keys(this.availableMethods),availablePaymentMethods);
                  this.selectedMethod = this.depositData.methods[0];
                  this.setpaymentAmount(this.selectedMethod);
                  if(cashier_deposit_data["usedCC"].length > 0){

                    this.availableUsedCC = cashier_deposit_data["usedCC"];
                    this.filterCC();
                    this.setSelectricForCC()
                  }
                  else{
                    this.ccForm.controls["cardId"].setValue("0")
                  }
                  this.depositCCAvailable = "available"
                  this. depositOtherAvailable = "available"
                }else{
                  this.depositCCAvailable = "not-available"
                  this. depositOtherAvailable = "not-available"
                }
                this.isCalculateLimit++;
                this.calculateLimit();
              }
            });
          }

          getButtonDisabled(){
            return this.utils.isButtonDisabled(this.activeForm) && this.isProfileCompleted != undefined
          }

          calculateLimit(){
            if(this.isCalculateLimit >= 3){
              let self = this;
              let currency =  this.userDetail ? this.userDetail.currency : "USD";
              this.depositLimitList = this.paymentService.getAvailableLimits(this.cashierDepositLimitList,"deposit",currency);
              this.setpaymentAmount(this.selectedMethod);
            }
          }

          showProfileCompleteOverlay(){
            var self = this;
            if(document.body.clientWidth <= 992){
              this.router.navigate(['/complete-profile'],{queryParams:{[self.paymentType]:"true"},queryParamsHandling: 'merge'})
            }else{
              setTimeout(function(){
                self.utils.openModal("profileCompleteModal");
              },1)
            }

            // var self = this;
            // setTimeout(function(){
            //   self.utils.openModal("profileCompleteModal");
            // },1)

          }

          backToSavedCards(e){
            this.filterCC();
            this.setSelectricForCC();
              e.stopPropagation();
            if(document.body.clientWidth <= 992){
              this.utils.scrollToPosition($("body"));
            }else{
              this.utils.scrollToPosition($(".payment-type-container"));
            }
          }

          setSelectricForCC(){
            var self = this;
            setTimeout(function(){
              $("#usedCCDD").selectric({
                disableOnMobile: false,
                nativeOnMobile: false,
                onChange:function(){

                  self.ccForm.controls["cardId"].setValue($("#usedCCDD").val());
                }
              });
            },1);
          }


          ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
            if(this.paymentType == "buyTicket"){
              changes['totalPrice'] ? this.ccForm.controls['depositAmount'].setValue(changes['totalPrice'].currentValue.toFixed(2)): '';
            changes['totalPrice'] ? this.depositAmountModel = changes['totalPrice'].currentValue.toFixed(2) : '';
            }else{
            changes['totalPrice'] ? this.ccForm.controls['depositAmount'].setValue(changes['totalPrice'].currentValue): '';
            changes['totalPrice'] ? this.depositAmountModel = changes['totalPrice'].currentValue : '';}
          }

          formatCreditCard(){
            let ccValue = this.ccForm.controls["cardNumber"].value;
            this.ccReExp = CCconfig.re;
            this.ccBlockSep = CCconfig.blocks;
            for (var key in this.ccReExp) {
              if (this.ccReExp[key].test(ccValue)) {
                this.selectedCardType = key;
                this.selectedCardTypeBlocks = this.ccBlockSep[key]
              }
            }

            var v = ccValue ? JSON.stringify(ccValue).replace(/-+/g, '').replace(/[^0-9]/gi, '') : '';
            var matches = v.match(CCconfig.minMaxlines[this.selectedCardType]);
            var match = matches && matches[0] || ''
            var parts = []

            for (var i=0,j=0, len=match.length; i<len && match.length > 4; i+=this.selectedCardTypeBlocks[j++]) {

              parts.push(v.substring(i, i+this.selectedCardTypeBlocks[j]))
            }

            if (parts.length) {
              this.ccForm.controls["cardNumber"].setValue(parts.join('-'));
            } else {
              this.ccForm.controls["cardNumber"].setValue(ccValue);
            }

          }

          getAvailableCreditCardMethods(ccMethods){
            let availableCCTypes = {}
            let ccTypeArray = [];
            _.each(Object.keys(ccMethods), function(key) {
              availableCCTypes["CREDITCARD"] = ccTypeArray.push(ccMethods[key]);
            });
            return availableCCTypes;
          }

          addPaymentMethods(paymentMethods):void{
            var self = this;
            _.each(Object.keys(paymentMethods), function(key) {
              self.availableMethods[key] = paymentMethods[key];
            });
          }

          setpaymentAmount(paymentType){
            let depositAmountTemp = this.depositAmountModel;
            switch(paymentType){
              case "CREDITCARD":
              if(this.activeForm != this.ccForm){
                this.activeForm = this.ccForm;
                this.utils.resetFormFields(this.ccForm);
                this.utils.removeAllFormFieldsvalidation(this.ccForm);
              }
              break;
              case "NETELLER":
              if(this.activeForm != this.netellerForm){
                this.activeForm = this.netellerForm;
                this.utils.resetFormFields(this.netellerForm);
                this.utils.removeAllFormFieldsvalidation(this.netellerForm);
              }
              break;
              case "SKRILL":
              if(this.activeForm != this.skrillForm){
                this.activeForm = this.skrillForm;
                this.utils.resetFormFields(this.skrillForm);
                this.utils.removeAllFormFieldsvalidation(this.skrillForm);
              }
              break;
              case "TRUSTLY":
              if(this.activeForm != this.trustlyForm){
                this.activeForm = this.trustlyForm;
                this.utils.resetFormFields(this.trustlyForm);
                this.utils.removeAllFormFieldsvalidation(this.trustlyForm);
                this.trustlyForm.controls["emailAddress"].setValue(this.userDetail ? this.userDetail.email:'');
              }
              break;
              case "ZIMPLER":
              if(this.activeForm != this.zimplerForm){
                this.activeForm = this.zimplerForm;
                this.utils.resetFormFields(this.zimplerForm);
                this.utils.removeAllFormFieldsvalidation(this.zimplerForm);
              }
              break;
              default:
              if(this.activeForm != this.ccForm){
                this.activeForm = this.ccForm;
                this.utils.resetFormFields(this.ccForm);
                this.utils.removeAllFormFieldsvalidation(this.ccForm);
              }
              break;
            }
            if(this.activeForm.controls['depositAmount'].value != depositAmountTemp)this.activeForm.controls['depositAmount'].setValue(depositAmountTemp);
            this.ccForm.controls['subscription'].setValue(this.isSubscription);

            if(this.depositLimitList && this.depositLimitList[paymentType] && paymentType){
              if(this.depositLimitList[paymentType]){
                this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(this.depositLimitList[paymentType].minTxnLimit,this.depositLimitList[paymentType].maxTxnLimit,this.paymentType.includes("deposit") ? "Deposit Amount":"Purchase Amount"));
              }else{
                this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(1,null,this.paymentType.includes("deposit") ? "Deposit Amount":"Purchase Amount"));
              }

              this.paymentType.includes("deposit") ?'':this.activeForm.controls["depositAmount"].markAsTouched({onlySelf:true});
            }else if((!this.depositLimitList ||  !this.depositLimitList[paymentType] )&& paymentType){
              this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(1,null,this.paymentType.includes("deposit") ? "Deposit Amount":"Purchase Amount"));
            }

          }

          changePaymentType(paymentType):void{
            this.setpaymentAmount(paymentType);
            this.selectedMethod = paymentType;
            //$("#"+paymentType).toggleClass('hide').toggleClass("active");

            if(this.selectedMethod == "CREDITCARD"){
              this.filterCC();
              this.setSelectricForCC();
            }
            $(".payment-type-tabs").toggleClass('mob-hide');
            $(".payment-type-content").toggleClass('mob-hide');
            $(".payment-type-container p").toggleClass('mob-hide');
            $(".skew-header").toggleClass('down-arrow-white');
            $(".select-payment-method-text").addClass("mob-hide");
            $('.down-arrow').removeClass('cashier-mask');
            //this.filterCC();
          }
          goBackToPaymentTypes(){
            $(".payment-type-tabs").toggleClass('mob-hide');
            $(".payment-type-content").toggleClass('mob-hide');
            $(".payment-type-container p").toggleClass('mob-hide');
            $(".skew-header").toggleClass('down-arrow-white');
            $(".select-payment-method-text").removeClass("mob-hide");
            $('.down-arrow').addClass('cashier-mask');
            if(document.body.clientWidth <= 992){
              this.utils.scrollToPosition($("body"));
            }else{
              this.utils.scrollToPosition($(".payment-type-container"));
            }

          }

          filterCC():void{
            if(this.availableUsedCC && this.availableUsedCC.length >0 ){
              this.utils.removeAllFormFieldsvalidation(this.ccForm);
              this.addNewCard = false;
              this.depositData.usedCC = this.availableUsedCC;
              let lastUsed = this.depositData.usedCC[0];
              let expiryDetails = lastUsed.ccDetails.expiry.split('/');
              this.selectedCardID = lastUsed.instrumentId;
              this.ccForm.controls["cardId"].setValue(lastUsed.instrumentId);
              this.ccForm.controls["cardNumber"].setValue(lastUsed.ccDetails.firstDigits+"XXXXXXX"+lastUsed.ccDetails.lastDigits);
              this.ccForm.get("expDate").get("expMonth").setValue(expiryDetails[0])
              this.ccForm.get("expDate").get("expYear").setValue(expiryDetails[1])
              //this.ccForm.controls["expMonth"].setValue(expiryDetails[0]);
              //this.ccForm.controls["expYear"].setValue(expiryDetails[1]);
              this.ccForm.controls["holderFirstName"].setValue(lastUsed.ccDetails.name ? lastUsed.ccDetails.name : 'XXXXX');
              this.ccForm.controls["CVV"].setValue("");
              this.ccForm.controls["cardNumber"].touched;
            }else{
              this.ccForm.controls["cardId"].setValue("0")
            }
          }
          ngAfterViewInit(){
          }

          priceInputFocus(){
            $('.quick-pick-amount input[type="radio"]').prop('checked', false);
          }

          addNew(e):void{
            e.stopPropagation();
            this.addNewCard = !this.addNewCard
            this.ccForm.controls["cardId"].setValue("0");
            this.ccForm.controls["cardNumber"].setValue("");
            this.ccForm.get("expDate").get("expMonth").setValue("")
            this.ccForm.get("expDate").get("expYear").setValue("")
            // this.ccForm.controls["expMonth"].setValue("");
            // this.ccForm.controls["expYear"].setValue("");
            this.ccForm.controls["CVV"].setValue("");
            this.ccForm.controls["holderFirstName"].setValue("");
            this.utils.removeAllFormFieldsvalidation(this.ccForm);
            if(document.body.clientWidth <= 992){
              this.utils.scrollToPosition($("body"));
            }else{
              this.utils.scrollToPosition($(".payment-type-container"));
            }
          }

          pay(buttonId): void{
            if(!this.isProfileCompleted){
              this.showProfileCompleteOverlay();
            }else{
              let errorDiv = "#paymentError";
              $(errorDiv).addClass("hide");
              this.utils.disableNewButton(buttonId);

              if (this.activeForm.valid) {
                this.payComplete=false;
                let data ={}
                if(this.selectedMethod == "CREDITCARD"){
                  if(this.ccForm.controls["cardId"].value != 0){
                    var self = this;
                    this.selectedCard =  this.depositData.usedCC.filter((ccdet) => {
                      return ccdet.instrumentId == self.selectedCardID
                    })[0];
                    this.ccForm.controls["cardNumber"].setValue(this.selectedCard.ccDetails.firstDigits+
                      "X".repeat(CCconfig.maxdigits[this.selectedCard.optionType.toLowerCase()] - (this.selectedCard.ccDetails.firstDigits.length + this.selectedCard.ccDetails.lastDigits.length))+
                      this.selectedCard.ccDetails.lastDigits);
                      data["depositAmount"] = this.ccForm.controls["depositAmount"].value;

                      data["creditCardID"] = this.selectedCard.instrumentId;
                      data["optionType"] = this.selectedCard.optionType;
                      data["CVV"] = this.ccForm.controls["CVV"].value;
                      data["subscription"] = this.ccForm.controls["subscription"].value;
                      data["cardNumber"] = this.ccForm.controls["cardNumber"].value.replace("*","X");
                      let expiryDetails = this.selectedCard.ccDetails.expiry.split('/');
                      data["expMonth"] = expiryDetails[0];
                      data["expYear"] = expiryDetails[1];
                      data["internal"] = this.selectedCard.internal;
                    }else{
                      data=this.utils.formControlToParams(this.ccForm,{});
                      data["expMonth"]=Number(data["expMonth"]);
                    }
                    if(data["cardNumber"] && data["cardNumber"].includes("-")){
                      data["cardNumber"] = data["cardNumber"].split('-').join('');
                    }
                    data["cardNumberStore"] = this.ccForm.controls["cardNumber"].value;
                  }else if(this.selectedMethod == "NETELLER"){
                    data=this.utils.formControlToParams(this.netellerForm,{});
                    data["cardNumberStore"] = this.netellerForm.controls["accountNumber"].value;
                  }else if(this.selectedMethod == "SKRILL"){
                    data=this.utils.formControlToParams(this.skrillForm,{});
                    data["cardNumberStore"] = this.skrillForm.controls["emailAddress"].value;
                  }else if(this.selectedMethod == "TRUSTLY"){
                    data=this.utils.formControlToParams(this.trustlyForm,{});
                    data["cardNumberStore"] = this.trustlyForm.controls["emailAddress"].value;
                  }else if(this.selectedMethod == "ZIMPLER"){
                    data=this.utils.formControlToParams(this.zimplerForm,{});
                    data["cardNumberStore"] = this.zimplerForm.controls["phone"].value;
                  }


                  data["txnType"] = this.paymentType;
                  data["paymentMethod"] = this.selectedMethod;
                  data["depositAmount"] = Number(data["depositAmount"]).toFixed(2);

                  if(this.paymentType == "buyTicket"){
                    this.loaderInit = true;
                    this.loader_per =5;
                  }
                  let buttonOldMessage = data["txnType"].includes('deposit') ? 'DEPOSIT' : 'PAY';
                  Promise.resolve(this.lottodayService.makePayment(data))
                  .then(payementResponse => {
                    this.emitterService.broadcastPurchaseLoaderEvent(10);

                    if(payementResponse && payementResponse["status"]){
                      if(payementResponse["status"]=="SUCCESS"  && payementResponse["txnStatus"]=="txn_confirmed_success"){
                        let purchaseRequest=  Object.assign({}, this.lotteryDeatil);

                        this.paymentService.afterPaymentSuccessfull(payementResponse,purchaseRequest,buttonId,errorDiv,0);
                      }else if(payementResponse["status"]=="SUCCESS" && payementResponse["txnStatus"]=="txn_initiated"){
                        this.paymentService.paymentPendingFor3dVerification(payementResponse,this.selectedMethod);
                      }else if(payementResponse["status"]=="FAILURE" && payementResponse["errorCode"]=="RG_LIMITS_EXCEEDED"){
                        this.emitterService.broadcastCanclePurchaseLoaderEvent(true);
                        this.paymentService.setError("Txn Limit Exceeded",buttonId,errorDiv,buttonOldMessage +" " +this.userService.getUserCurrencySymbol()+" "+this.depositAmountModel);
                        this.mixPanelEventCheck('depositfail','Txn_Limit_Exceeded')
                        
                      }
                      else if(payementResponse["status"]=="FAILURE" && payementResponse["errorDescription"]){
                        this.emitterService.broadcastCanclePurchaseLoaderEvent(true);
                        this.paymentService.setError(payementResponse["errorDescription"],buttonId,errorDiv,buttonOldMessage +" " +this.userService.getUserCurrencySymbol()+" "+this.depositAmountModel);
                      this.mixPanelEventCheck('depositfail',payementResponse["errorDescription"])
                      
                    }else{
                        this.failureTxn(buttonId,errorDiv,buttonOldMessage);
                        
                      }
                    }else{
                      this.failureTxn(buttonId,errorDiv,buttonOldMessage);
                      
                    }
                    this.payComplete=true;
                  },SystemError => {
                    this.failureTxn(buttonId,errorDiv,buttonOldMessage);
                  });
                }else{
                  this.utils.validateAllFormFields(this.activeForm);
                  this.utils.enableNewButton(buttonId,"","",this.userService.getUserCurrencySymbol()+this.depositAmountModel);
                }
              }


            }

            failureTxn(buttonId,errorDiv,buttonOldMessage):void{
              this.emitterService.broadcastCanclePurchaseLoaderEvent(true);
              this.paymentService.setError("Something Went wrong Please try again Later",buttonId,errorDiv,buttonOldMessage +" "+this.userService.getUserCurrencySymbol()+" "+this.depositAmountModel);
              this.mixPanelEventCheck('depositfail','Something_Went_wrong_Please_Try_again_Later')
              
            }

            ngOnDestroy(): void {
               this.cashierBackClickedSubscribption.unsubscribe();
               this.cancelPurchaseLoaderSubs.unsubscribe();
               this.logoutOnTimeoutSubs.unsubscribe();
               this.profileCompletedSubs.unsubscribe();
               this.serverErrorSubs.unsubscribe();
               this.userDataSubs.unsubscribe();
              }
              mixPanelEventCheck(type,reason):void{
                reason = reason? reason: '';
                Promise.resolve(this.mixpaneldataService.userLoggedIn('cashier',type,reason));
              }
              getTransactionResult(data){
                var paramKeys = data.split("&");
                var self = this;
                paramKeys.forEach(function(param){
                  self.txnDetails[param.split("=")[0]]=param.split("=")[1];
                });
                let paymentResponse = {};
                paymentResponse['paymentType'] = this.txnDetails['paymentType'];
          
          
                paymentResponse["depositAmount"]=this.txnDetails["amount"];
                paymentResponse["AccountId"] = this.txnDetails["customerId"]
          
                if(paymentResponse['paymentType']){
                  paymentResponse['txnId'] = this.txnDetails['merchantTransactionId'];
                  this.paymentService.afterCashoutSuccessfull(paymentResponse,this.lotteryDeatil,undefined,undefined,0);
                }else{
                  this.paymentService.afterPaymentSuccessfull(paymentResponse,this.lotteryDeatil,undefined,undefined,0);
                }
            }
          }
