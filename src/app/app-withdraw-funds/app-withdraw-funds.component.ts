import { Component, OnInit, ViewEncapsulation, AfterViewInit,Input, OnChanges, SimpleChange } from '@angular/core';
import { Utility } from '../utils/utility';
import { UserDetailsService } from '../services/user-details.service';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { AppLottodayService } from '../app-lottoday.service';
import { availableWithdrawCountries } from '../utils/general-config';
import { EmitterService } from '../services/emitter.service';
import { PaymentService } from '../services/payment.service';
import * as _ from 'underscore';
import { availableWithdrawMethods, availableWithdrawMethodsMap } from '../utils/lotteryConfig';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

import 'selectric';

@Component({
  selector: 'app-withdraw-funds',
  templateUrl: './app-withdraw-funds.component.html',
  styleUrls: ['./app-withdraw-funds.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppWithdrawFundsComponent implements OnInit, OnChanges {
  @Input() availableWithdrawableCC;
  @Input() availableWithdrawMethods;
  @Input() withdrawableBalance;
  @Input() withdrawLimitList;
  selectedCardID;
  selectedCard;
  serverError;
  countries;
  availableMethods;
  withdarwData:any ={};
  withdrawEnabledCountries=[];
  availableCountryDetails;
  selectedMethod;
  availableWithdrawMethodsMap;
  depositAmountModel;
  activeForm;
  userProfile;
  wiretransferType;
  stateList;
  countyCode;
  countryName;
  cashierBackClickedSubscribption;
  ccWithdrawForm = this.formBuilder.group({
    'depositAmount': ['', [CustomValidators.minValueNumber(1,null,"WithDraw Amount")]],
    'creditCardID':['', [CustomValidators.required]],
    'optionType':['', [CustomValidators.required]]
  });
  netellerWithdrawForm = this.formBuilder.group({
    'depositAmount': ['', [CustomValidators.minValueNumber(1,null,"WithDraw Amount")]],
    'accountNumber':['', [CustomValidators.required]]
  });
  trustlyWithdrawForm = this.formBuilder.group({
    'depositAmount': ['', [CustomValidators.minValueNumber(1,null,"WithDraw Amount")]],
    'emailAddress':['', [CustomValidators.required]]
  });
  wireTransferWithdrawForm = this.formBuilder.group({
    'depositAmount': ['', [CustomValidators.minValueNumber(1,null,"WithDraw Amount")]],
    'beneficiaryName': ['', [CustomValidators.required]],
    'bankName':['', [CustomValidators.required]],
    'bankCity':['', [CustomValidators.validName(2,50)]],
    'bankCountry':['', [CustomValidators.required]],
    'swiftCode':['', [CustomValidators.required]],
    'bankAddress':['', [CustomValidators.required]],
    'bankState':['', [CustomValidators.required]],
    'accountNumber':[''],
    'comments':[''],
    'iban':[''],
    'formtype':['']
  },{validator:CustomValidators.verifyWireTransfer});
  constructor(private formBuilder:FormBuilder,
    private userDetails:UserDetailsService,
    private utils:Utility,
    private lottodayService:AppLottodayService,
    private emitterService:EmitterService,
    private paymentService:PaymentService) {

      emitterService.userDataSource$.subscribe(
        userDataSource => {
          if (userDataSource == "User Data Updated") {
            this.userProfile = this.userDetails.getuserProfileDetails();
            this.setCountyToWireTransfer();
            this.checkWireTransferEnabled();
          }
        }
      );

      this.cashierBackClickedSubscribption = this.emitterService.backClickedInCashier$.subscribe(
        value => {
          $(".withdarw-type-tabs").removeClass('mob-hide');
          $(".withdarw-type-content").addClass('mob-hide');
          $(".withdarw-type-container p").removeClass('mob-hide');
          $(".select-payment-method-text").addClass("mob-hide");
          $('.down-arrow').addClass('cashier-mask');
        }
      );

      this.userDetails.balanceUpdated$.subscribe(
      message => {
        this.withdrawableBalance = this.userDetails.getCashBalance();
        if(this.activeForm && this.withdrawLimitList && this.selectedMethod){
          let maxLimit = this.withdrawLimitList[this.selectedMethod] && this.withdrawableBalance > this.withdrawLimitList[this.selectedMethod].maxTxnLimit ?  this.withdrawLimitList[this.selectedMethod].maxTxnLimit : this.withdrawableBalance ;
          if(this.withdrawLimitList[this.selectedMethod]){
            this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(this.withdrawLimitList[this.selectedMethod].minTxnLimit,maxLimit,"WithDraw Amount"))
          }else{
            this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(1,maxLimit,"WithDraw Amount"))
          }

        }
      });

    }

  ngOnInit() {
    this.availableWithdrawMethodsMap = availableWithdrawMethodsMap;
    if(this.availableWithdrawMethods){
      this.userProfile  = this.userDetails.getuserProfileDetails();
        Promise.resolve(this.lottodayService.getCountries())
        .then(regData => {
          if (regData && regData["countrylist"]) {
            this.countries = regData["countrylist"];
            this.setCountyToWireTransfer();
          } else {
          }
        });
      if(this.userProfile) this.checkWireTransferEnabled();
    }


  }

  checkWireTransferEnabled(){
    this.wiretransferType = _.indexOf(availableWithdrawCountries.SEPA, this.userProfile.country) != -1
                            ? "SEPA"
                            : (_.indexOf(availableWithdrawCountries.SWIFT, this.userProfile.country)
                                ? "SWIFT" : undefined);
    this.wireTransferWithdrawForm.controls["formtype"].setValue(this.wiretransferType);
    this.availableMethods={};
    let availableCCTypes = this.getAvailableCreditCardMethods(this.availableWithdrawMethods["C"]);
    this.addWithdarwMethods(availableCCTypes);
    this.addWithdarwMethods(this.availableWithdrawMethods["O"]);
    if(!this.wiretransferType){
      this.availableMethods.WIRE_TRANSFER ? delete this.availableMethods.WIRE_TRANSFER : ""
    }
    this.withdarwData.methods = _.intersection(Object.keys(this.availableMethods),availableWithdrawMethods);
    if(this.withdarwData.methods[0] == "CREDITCARD" && this.availableWithdrawableCC.length <= 0){
      this.withdarwData.methods.splice(0,1);
    }
    this.selectedMethod = this.withdarwData.methods[0];

    this.setwithdarwAmount(this.selectedMethod);
    if(this.availableWithdrawableCC.length >0 ){
      this.setLatestCreditCard();
    }
  }
  closeModal(modalId){
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

  setCountyToWireTransfer(){
    if (this.countries && this.userProfile) {
      var self = this;
      let userCountry = this.countries.filter(function (country) {
        return country.iso == self.userProfile["country"];
      })[0];
      if (userCountry) {
        this.wireTransferWithdrawForm.controls["bankCountry"].setValue(userCountry.iso);
        this.countyCode = userCountry.iso;
        this.countryName = userCountry.name;
        this.stateDetails(this.userProfile["state"],userCountry)
      }
    }
  }

  stateDetails(stateName,userCountry): void {
    let countryDetails={
      countryCode: userCountry.iso
    }
    Promise.resolve(this.utils.getStateDetails(countryDetails))
      .then(data => {
          if (data && data["stateDetails"] && data["stateDetails"].length != 0) {
            this.stateList = data["stateDetails"];
          }else{
            this.stateList = [];
          }
          if (this.wireTransferWithdrawForm.controls['bankState']) {
            this.wireTransferWithdrawForm.controls['bankState'].setValidators(CustomValidators.required);
            if(this.stateList.length <= 0){
              this.wireTransferWithdrawForm.controls['bankState'].setValue("-NA-");
            }
          }
      })
    }

  ngOnChanges(changes: {[propName: string]: SimpleChange}): void {

    if(changes['withdrawLimitList']){
      this.withdrawLimitList = changes['withdrawLimitList'].currentValue;

      if(this.activeForm && this.withdrawLimitList && this.selectedMethod){
        let maxLimit = this.withdrawLimitList[this.selectedMethod] && this.withdrawableBalance > this.withdrawLimitList[this.selectedMethod].maxTxnLimit ?  this.withdrawLimitList[this.selectedMethod].maxTxnLimit : this.withdrawableBalance ;
        if(this.withdrawLimitList[this.selectedMethod]){
          this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(this.withdrawLimitList[this.selectedMethod].minTxnLimit,maxLimit,"WithDraw Amount"))
        }else{
          this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(1,maxLimit,"WithDraw Amount"))
        }


      }
    }

  }

  setLatestCreditCard(){
    let lastUsed = this.availableWithdrawableCC[0];
    let expiryDetails = lastUsed.ccDetails.expiry.split('/');
    this.selectedCardID = lastUsed.instrumentId;
    this.ccWithdrawForm.controls["creditCardID"].setValue(lastUsed.instrumentId);
    this.ccWithdrawForm.controls["optionType"].setValue(lastUsed.optionType);
    var self = this;
    this.setSelectricForCC();
  }

  getAvailableCreditCardMethods(ccMethods){
    let availableCCTypes = {}
    let ccTypeArray = [];
    _.each(Object.keys(ccMethods), function(key) {
      availableCCTypes["CREDITCARD"] = ccTypeArray.push(ccMethods[key]);
    });
    return availableCCTypes;
  }

  addWithdarwMethods(withdarwMethods):void{
    var self = this;
    _.each(Object.keys(withdarwMethods), function(key) {
      self.availableMethods[key] = withdarwMethods[key];
    });
  }

  goBackToWithdarwTypes(){
    $(".withdarw-type-tabs").toggleClass('mob-hide');
    $(".withdarw-type-content").toggleClass('mob-hide');
    $(".withdarw-type-container p").toggleClass('mob-hide');
    $(".select-payment-method-text").removeClass("mob-hide");
    $('.down-arrow').addClass('cashier-mask');
    if(document.body.clientWidth <= 992){
      this.utils.scrollToPosition($("body"));
    }else{
      this.utils.scrollToPosition($(".withdarw-type-container"));
    }
  }

  changeWithdrawType(withdarwType):void{
    this.selectedMethod = withdarwType;
    this.setwithdarwAmount(withdarwType);
    $('.tab-content.active').toggleClass('active').toggleClass('hide');
    //$("#"+withdarwType).toggleClass('hide').toggleClass("active");

    if(this.selectedMethod == "CREDITCARD") this.setLatestCreditCard();
    $(".withdarw-type-tabs").toggleClass('mob-hide');
    $(".withdarw-type-content").toggleClass('mob-hide');
    $(".withdarw-type-container p").toggleClass('mob-hide');
    $(".select-payment-method-text").addClass("mob-hide");
    $('.down-arrow').removeClass('cashier-mask');
    //this.filterCC();
  }

  setSelectricForCC(){
    var self = this;
    setTimeout(function(){
      $("#usedCCWithdrawDD").selectric({
        disableOnMobile: false,
        nativeOnMobile: false,
        onChange:function(){
          self.ccWithdrawForm.controls["creditCardID"].setValue($("#usedCCWithdrawDD").val());
        }
      });
    },1)
  }

  setwithdarwAmount(withdarwType){
    let withdrawAmountTemp;
    switch(withdarwType){
      case "CREDITCARD":
      if(this.activeForm != this.ccWithdrawForm){
        this.activeForm = this.ccWithdrawForm;
        withdrawAmountTemp = this.depositAmountModel;
        this.utils.resetFormFields(this.ccWithdrawForm);
        this.ccWithdrawForm.controls['depositAmount'].setValue(withdrawAmountTemp);
        this.utils.removeAllFormFieldsvalidation(this.ccWithdrawForm);
      }
      break;
      case "NETELLER":
      if(this.activeForm != this.netellerWithdrawForm){
        this.activeForm = this.netellerWithdrawForm;
        withdrawAmountTemp = this.depositAmountModel;
        this.utils.resetFormFields(this.netellerWithdrawForm);
        this.netellerWithdrawForm.controls['depositAmount'].setValue(withdrawAmountTemp);
        this.utils.removeAllFormFieldsvalidation(this.netellerWithdrawForm);
      }
      break;
      case "WIRE_TRANSFER":
      if(this.activeForm != this.wireTransferWithdrawForm){
        this.activeForm = this.wireTransferWithdrawForm;
        withdrawAmountTemp = this.depositAmountModel;
        let wiretransferType = this.wireTransferWithdrawForm.controls['formtype'].value;
        this.utils.resetFormFields(this.wireTransferWithdrawForm);
        this.wireTransferWithdrawForm.controls['depositAmount'].setValue(withdrawAmountTemp);
        this.wireTransferWithdrawForm.controls['formtype'].setValue(wiretransferType);
        this.utils.removeAllFormFieldsvalidation(this.wireTransferWithdrawForm);

        this.setCountyToWireTransfer();
      }
      break;
      case "TRUSTLY":
      if(this.activeForm != this.trustlyWithdrawForm){
        this.activeForm = this.trustlyWithdrawForm;        
        withdrawAmountTemp = this.depositAmountModel;
        this.utils.resetFormFields(this.trustlyWithdrawForm);
        this.trustlyWithdrawForm.controls["emailAddress"].setValue(this.userDetails ? this.userDetails.userProfileDetails["email"]:'');
        this.trustlyWithdrawForm.controls['depositAmount'].setValue(withdrawAmountTemp);
        this.utils.removeAllFormFieldsvalidation(this.trustlyWithdrawForm);
      }
      break;
    }
    if(this.withdrawLimitList && this.withdrawLimitList[withdarwType] && withdarwType){
      let maxLimit = this.withdrawableBalance < this.withdrawLimitList[withdarwType].maxTxnLimit ? this.withdrawableBalance : this.withdrawLimitList[withdarwType].maxTxnLimit;
      this.activeForm.controls["depositAmount"].setValidators(CustomValidators.minValueNumber(this.withdrawLimitList[withdarwType].minTxnLimit,maxLimit,"WithDraw Amount"))
    }
  }

  withdraw(buttonId){

    let errorDiv = "#serverErrorWithdraw";
		$(errorDiv).addClass("hide");
    let paymentMethodType = this.selectedMethod == "CREDITCARD" ? 'CARD' : this.selectedMethod != "WIRE_TRANSFER" ? 'WALLET' : 'ACCOUNT'
    if (this.activeForm.valid) {
      this.utils.disableNewButton(buttonId);
      let data ={}

      if(this.selectedMethod == "CREDITCARD" && this.ccWithdrawForm.controls["creditCardID"].value != 0){
        var self = this;
        this.selectedCard =  this.availableWithdrawableCC.filter((ccdet) => {
          return ccdet.instrumentId == self.selectedCardID
        })[0];
        data["depositAmount"] = this.ccWithdrawForm.controls["depositAmount"].value;

        data["creditCardID"] = this.selectedCard.instrumentId;
        data["optionType"] = this.selectedCard.optionType;
      }else if(this.selectedMethod == "NETELLER"){
        data=this.utils.formControlToParams(this.netellerWithdrawForm,{});
        data["cardNumberStore"] = this.netellerWithdrawForm.controls["accountNumber"].value;
      }else if(this.selectedMethod == "WIRE_TRANSFER"){
        data=this.utils.formControlToParams(this.wireTransferWithdrawForm,{});
        data["cardNumberStore"] = this.wireTransferWithdrawForm.controls["accountNumber"].value;
      }else if(this.selectedMethod == "TRUSTLY"){
        data=this.utils.formControlToParams(this.trustlyWithdrawForm,{});
        data["depositAmount"] = this.trustlyWithdrawForm.controls["depositAmount"].value;
        data["txnType"] = "sds";
      }
      data["paymentMethod"] = this.selectedMethod;

        Promise.resolve(this.lottodayService.makeWithdraw(data))
        .then(payementResponse => {
          if(payementResponse && payementResponse["status"] == "SUCCESS" && this.selectedMethod == "TRUSTLY"){
            this.paymentService.paymentPendingFor3dVerification(payementResponse,this.selectedMethod);
          }else if(payementResponse && payementResponse["status"] == "SUCCESS"){
            Promise.resolve(this.lottodayService.getBalance())
            .then(balanceDetails=>{
              if(balanceDetails){
                this.withdrawableBalance = balanceDetails["cash"];
                this.userDetails.setBonusBalance( balanceDetails["bonus"]);
                this.userDetails.setCashBalance(balanceDetails["cash"]);
                this.userDetails.setUserBalance(balanceDetails["cash"]+balanceDetails["bonus"]);
              }
            });
            this.utils.enableNewButton(buttonId,"SUCCESS","Success","CREDIT MY "+paymentMethodType+" NOW-disable");
            this.activeForm.controls["depositAmount"].setValue("");
            this.utils.removeAllFormFieldsvalidation(this.activeForm);
          }else if(payementResponse && payementResponse["status"]=="FAILURE"){
            this.utils.showError(errorDiv);
            this.serverError = payementResponse["errorDescription"];
            this.utils.enableNewButton(buttonId,"FAILED","Please try Again","CREDIT MY "+paymentMethodType+" NOW");
          }else{
            this.utils.showError(errorDiv);
            this.serverError = payementResponse && payementResponse["errorDescription"] ? payementResponse["errorDescription"] : "Something Went Wrong. Please try again later";
            this.utils.enableNewButton(buttonId,"FAILED","Please try Again","CREDIT MY "+paymentMethodType+" NOW");
          }
        },
      SystemError=>{
        this.utils.showError(errorDiv);
        this.serverError = "Something Went Wrong. Please try again later"
        this.utils.enableNewButton(buttonId,"FAILED","Please try Again","CREDIT MY "+paymentMethodType+" NOW");
      })

    }else{
      this.utils.validateAllFormFields(this.activeForm);
      this.utils.enableNewButton(buttonId,"","","CREDIT MY "+paymentMethodType+" NOW-disable");
    }

  }

  ngAfterViewInit() {


  }

}
