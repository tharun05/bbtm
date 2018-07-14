import {Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { AppLottodayService } from '../app-lottoday.service';
import { CCconfig } from '../utils/general-config';
import { Router, ActivatedRoute } from "@angular/router";
import { lotteryConfig } from "./lotteryConfig";
import { ModalService } from '../services/modal.service';
import {GameWinHistoryService} from '../services/game-win-history.service'


import * as $ from 'jquery';
import * as _ from 'underscore';
window['$'] = window['jQuery'] = $;

@Injectable()
export class Utility {

  private countryArray = [];
  private geoLocationData:any;
  private countryList:any;
  private stateList:any={};
  private stateListQueue=[];
  constructor(private lottodayService:AppLottodayService,
    private router: Router,
    private modalService:ModalService,
    private gameWinHistoryService:GameWinHistoryService
  ){}

  convertToMillions(amount):any {
    return {
      prizeAmt: (amount / 1000000).toString().indexOf(".") == -1 ? (amount / 1000000) : Number((amount / 1000000).toFixed(1)),
      prizeUnit: "Million"
    }
  }

  getGameName(gameId){
    let games= this.gameWinHistoryService.getTotalGames();
    if(games){
      return  games[gameId];
    }else{
      return '';
    }
}

  enableButton(id): void{
    $("#"+id).prop('disabled', false);
    $("#"+id+" i").addClass('hide');
  }
  disableButton(id): void{
    $("#"+id).prop('disabled', true);
    $("#"+id+" i").removeClass('hide');
  }

  enableNewButton(id,status,enableMessage,oldMessage): void{
    enableMessage ? $("#"+id+" span").text(enableMessage): '';
    $("#"+id).removeClass("btn-progress");
    if(status == "SUCCESS"){
      $("#"+id).addClass("btn-success");
    }else if(status == "FAILED"){
      $("#"+id).addClass("btn-failed");
    }

    setTimeout(function(){
      $("#"+id).removeClass("btn-success").removeClass("btn-failed");
      if(!oldMessage.includes("-disable")){
        $("#"+id).prop("disabled", false);
        oldMessage ? $("#"+id+" span").text(oldMessage) : '';
      }else{
        oldMessage ? $("#"+id+" span").text(oldMessage.replace("-disable","")) : '';
      }
    },2000);

    $("#"+id).prop('disabled', false);
    $("#"+id+" i").addClass('hide');
  }
  disableNewButton(id): void{
    $("#"+id).addClass("btn-progress").prop("disabled", true);
    // $("#"+id).prop('disabled', true);
    // $("#"+id+" i").removeClass('hide');
  }

  range(start, end):any {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  round10(value, exp):number {
    return this.decimalAdjust('round', value, exp);
  }

  roundAmount(num):number {
    return this.round10(this.round10(num * 1000, -2) / 1000, -2)
  }

  intRoundUp(num):number {
    return Math.ceil(parseFloat((num * 100).toFixed(2))) / 100;
  }

  decimalAdjust(type, value, exp):number {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  pickRandomNumbers(range, maxPicks, userSeletedNumbers,elgardo_extraNumber):any{
    {
      var randomNumbers = [];
      if (!userSeletedNumbers) {
        userSeletedNumbers = [];
      }else{
        randomNumbers = userSeletedNumbers;
      }
      if(elgardo_extraNumber){
        return elgardo_extraNumber;
      }
      while (randomNumbers.length < maxPicks) {
        var randomNum = range[Math.floor(Math.random() * range.length)]
        var found = false;
        if (randomNum == undefined) {
          found = true;
        }
        for (var i = 0; i < randomNumbers.length; i++) {
          if (randomNumbers[i] == randomNum || _.contains(userSeletedNumbers, randomNum)) {
            found = true;
            break
          }
        }
        if (!found) randomNumbers[randomNumbers.length] = randomNum;
      }
      return randomNumbers;
    }
    //var uniques = chance.unique(chance.natural, 8, {min: 1, max: 100});
  }

  getUserLoginStatus():any{
    if(sessionStorage.getItem("user")){
      return true;
    }
    return false;
  }

  getUserId():any{
    let user = sessionStorage.getItem("user");
    if(user){
      return user['userId'];
    }

  }

  userPostLoginAction(buttonId,erroDiv):Promise<any>{
    return new Promise((resolve,reject)=>{
      //this.lottodayService.getLottodayAccessToken().then(accesstoken=>{
        //if(accesstoken){
          this.lottodayService.getProfileBalanceCurrency()
          .then( profileBalanceCurrency =>{
            let obj = {}
            if(profileBalanceCurrency){
              obj =  {
                cashDetails : profileBalanceCurrency["profile"]["balanceDetails"]["cash"]+profileBalanceCurrency["profile"]["balanceDetails"]["bonus"],
                cashBalance : profileBalanceCurrency["profile"]["balanceDetails"]["cash"],
                bonusBalance : profileBalanceCurrency["profile"]["balanceDetails"]["bonus"],
                currencyDetails : profileBalanceCurrency["currency"],
                profileData : profileBalanceCurrency["profile"]
              }
               buttonId != "" ? this.enableNewButton(buttonId,"SUCCESS","Success","Login") : "";
              resolve(obj);
            }else{
               buttonId != "" ?this.enableNewButton(buttonId,"FAILED","Try Again","Login")  : "";
              reject("");
            }

      })
    })

  }

  creditCardValidation(ccNum): boolean{

    let arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    var
    len = ccNum.length,
    bit = 1,
    sum = 0,
    val;
    if(len >=13 && len <=19){
      while (len) {
        val = parseInt(ccNum.charAt(--len), 10);
        sum += (bit ^= 1) ? arr[val] : val;
      }
    }


    return sum && sum % 10 === 0;
  }

  formControlToParams(values,data){
    Object.keys(values.controls).forEach(field => {
      const control = values.get(field);
      if (control instanceof FormControl) {
        data[field] = control.value;
      } else if (control instanceof FormGroup) {
        this.formControlToParams(control,data);
      }
    });
    return data;
  }

  isUserLoggedIn():boolean{
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      return true;
    }
    return false;
  }

  getCartItemsCount():any{
    let cartList = sessionStorage.getItem("cartList");
    if(cartList){
      cartList = JSON.parse(cartList);
      return Object.keys(cartList).length;
    }
  }

  getLottodayDetails(key):string{
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      return user[key];
    }
    return "";
  }

  getLotteryDetailsForPurchase(lotteryDeatil): any{
    return lotteryDeatil.items.map(function(lotteryItem){
      //lotteryItem.drawId = 84089;
      lotteryItem.orderedLines = lotteryItem.orderedLines.map(function(orderedLines){
        return {
          "numbers": {
            "main": orderedLines.mainNumbers.map(String),
            "extra": orderedLines.extraNumbers.map(String)
          },
          "combinationsCount": 1
        };
      })
      return lotteryItem
    });
  }


  getLotteryLinesStructureForPurchase(lotteryLines): any{
    //return lotteryDeatil.items.map(function(lotteryItem){
    //lotteryItem.drawId = 84089;
    lotteryLines = lotteryLines.map(function(orderedLines){
      return {
        "numbers": {
          "main": orderedLines.mainNumbers.map(String),
          "extra": orderedLines.extraNumbers.map(String)
        },
        "combinationsCount": 1
      };
    })
    return lotteryLines;
    //  return lotteryItem
    //});
  }
  openModal(modalId): void{
    this.modalService.open(modalId);
    // let modal = $("#"+modalId);
    // modal.fadeIn(300, function(){
    //   $(this).css("display", "block");
    //   $('body').css({'overflow': 'hidden', 'position':'fixed'});
    //
    // });
  }

  closeModal(modalId): void{
    this.modalService.close(modalId);
    // let modal = $("#"+modalId);
    // modal.fadeOut(300, function(){ $(this).css("display", "none");
    // $('body').css({'overflow': 'auto', 'position':'initial'});
    //
    // });
}

validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}

removeAllFormFieldsvalidation(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsUntouched({ onlySelf: true });
      control.markAsPristine({ onlySelf: true });
      //control.setErrors({});
    } else if (control instanceof FormGroup) {
      this.removeAllFormFieldsvalidation(control);
    }
  });
}

resetFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.setValue("");
    } else if (control instanceof FormGroup) {
      this.resetFormFields(control);
    }
  });
}

// setPhoneNumberDropDown(inputId,initialSelected,excludedCountries): void{
//     initialSelected = initialSelected ? initialSelected : "GB";
//     excludedCountries = excludedCountries.length > 0 ? excludedCountries : [ "us", "il" ];

//     $("#"+inputId).intlTelInput({
//       initialCountry: initialSelected,
//       nationalMode: false,
//       excludeCountries: excludedCountries,
//       preferredCountries: [],
//       autoPlaceholder: false,
//       separateDialCode: true
//     });
// }

setPhoneNumberDropdown(inputId,initialSelected,excludedCountries,form){
  initialSelected = initialSelected ? initialSelected : "GB";
  excludedCountries = excludedCountries.length > 0 ? excludedCountries : ["us", "il"];
  $("#"+inputId).intlTelInput({
    initialCountry: initialSelected,
    nationalMode: false,
    excludeCountries: excludedCountries,
    preferredCountries: [],
    autoPlaceholder: false,
    separateDialCode: true
  });
  $("#"+inputId).on("countrychange" ,function(e, countryData) {
    form.controls["areaCode"].setValue(countryData.dialCode);
    form.controls["areaCountryCode"].setValue(countryData.iso2.toUpperCase());
  });;
}
shouldShowErrors(controlFormNField,formName): boolean {
  let control;
  let fc = null;
  if(controlFormNField == "password" || controlFormNField == "confirmPassword"){
    control = formName.get("passwords").get(controlFormNField);//.controls["passwords"];
  }else if(controlFormNField == "expMonth" || controlFormNField == "expYear"){
    control = formName.get("expDate").get(controlFormNField);
  }else{
    control = formName.controls[controlFormNField];

  }
  return control &&
  control.errors &&
  (control.dirty || control.touched);
}

getErrorMessage(controlFormNField,formName): string{
  let control;
  let fc = null;
  if(controlFormNField == "password" || controlFormNField == "confirmPassword"){
    control = formName.get("passwords").get(controlFormNField);//formName.controls["passwords"];
  }else if(controlFormNField == "expMonth" || controlFormNField == "expYear"){
    control = formName.get("expDate").get(controlFormNField);
  }else{
    control = formName.controls[controlFormNField];
  }

  return control.errors.message;
}

getButtonClass(formName,formSubmitted):string{
  let className = '';
  if(formName.invalid || formName.pending || formSubmitted) className = 'btn-additional';
  else if(!formName.invalid && !formName.pending ) className = 'btn-primary';
  return className
}

isButtonDisabled(formName):boolean{
  return formName.invalid || formName.pending;
}


winningMatchStr(levelStr,extraNumberName):any {
  if(levelStr) {
    //All separators check
    if(levelStr.indexOf("+") != -1) {//+ is separator
      var data = levelStr.split("+")
      var str = this.oddsMatchStr(data[0],data[1],extraNumberName)
      return (str) ? str : levelStr;
    }

    if(levelStr.indexOf("and") != -1) {//+ is separator
      var data = levelStr.split("and")
      var str = this.oddsMatchStr(data[0].toString().trim(), data[1].toString().trim().split(" ")[0],extraNumberName)
      return (str) ? str : levelStr;
    }

    if(levelStr.indexOf("Number") != -1) {//+ is separator
      var data = levelStr.split("Number")
      var str = this.oddsMatchStr(data[0].toString().trim(), data[1].toString().trim().split(" ")[0],extraNumberName)
      return (str) ? str : levelStr;
    }

    if(levelStr.indexOf("only") != -1) {//+ is separator
      var data = levelStr.split("only")
      var str = this.oddsMatchStr(data[0].toString().trim(), 0,extraNumberName)
      return (str) ? str : levelStr;
    }

    if(!isNaN(levelStr.toString().trim())) {
      var str = this.oddsMatchStr(levelStr.toString().trim(), 0,extraNumberName)
      return (str) ? str : levelStr;
    }
  }
  return levelStr;
}

oddsMatchStr(mainNumbersPicked, extraNumbersPicked,extraNumberName):any {
  if (mainNumbersPicked != 0 && extraNumbersPicked != 0) {
    return mainNumbersPicked + ' Main + ' + extraNumbersPicked + ' ' + extraNumberName;
  } else if (mainNumbersPicked != 0) {
    return mainNumbersPicked + ' Main';
  } else if (extraNumbersPicked != 0) {
    return extraNumbersPicked + ' ' + extraNumberName;
  }
  return "";
}

scrollToPosition($target){
  let scrollPos = $target.offset().top;
  scrollPos = scrollPos-80
  $("body,html").animate({scrollTop: scrollPos});
}

showError(errorDiv){
  if($(errorDiv).length > 0){
    $(errorDiv).removeClass("hide");
    this.scrollToPosition($(errorDiv));
  }
}

gettransactionSuccessfullDeatils(txnId,depositAmount,AccountId,selectedMethod,cardNumber,txnType){
  let length = cardNumber ? cardNumber.length:0;
  let response = {
    ["txnId"]:txnId,
    ["amount"]:depositAmount,
    ["AccountId"]:AccountId,
    accountType:selectedMethod,
    accountNumber:cardNumber ? cardNumber.substring(0,(length/4))+"*".repeat(length-(length/2))+cardNumber.substring(length-4,length) : 'XXXXXXX',
    txnDate:new Date(),
    txnType:txnType
  };
  return response
}

hideMenu(callingFrom){
  if(callingFrom == 'header'){
    $('.menu-items').hide();
    $('#ld_overlay').hide();
  }
}

addToCart(id,lotteryDetails,gameType){
  let cartlist = sessionStorage.getItem("cartList") ? sessionStorage.getItem("cartList") :{};
  cartlist = !_.isEmpty(cartlist) ? JSON.parse(sessionStorage.getItem("cartList")) : {};
  let key =gameType.toLowerCase()+"_"+id;
  cartlist[key]=lotteryDetails;

  sessionStorage.setItem("cartList",JSON.stringify(cartlist));
}

setCountryDetails(countryList){
  var self = this;
  this.countryList = countryList;
}
getCountryList(){
  return this.countryList;
}

getWithdarwAllowedCountries(withdrawEnabledCountries){
  let availableCountryDetails =  this.countryList.filter(function(country){
    return _.indexOf(withdrawEnabledCountries,country.iso) != -1;
  })
  return availableCountryDetails;
}

appendOrderIdToCart(key,orderId):void{
  let cartList = JSON.parse(sessionStorage.getItem("cartList"));
  if(cartList[key]){
    cartList[key]["orderId"] =orderId;
  }

  sessionStorage.setItem("cartList",JSON.stringify(cartList));
}

getStateDetails(conteryDetails){
  if(this.stateList && this.stateList[conteryDetails.countryCode]){
    return this.stateList[conteryDetails.countryCode];
  }else{
    return new Promise((resolve,reject)=>{
      if(this.stateListQueue.length > 0){
        this.stateListQueue.push(resolve)
      }else{
        this.stateListQueue.push(resolve)
        Promise.resolve(this.lottodayService.getStates(conteryDetails))
        .then(data => {
          if(data){
            this.stateList[conteryDetails.countryCode] = data;
          }
          for(let callback in  this.stateListQueue){
              var resp_obj = Object.assign({}, this.stateList[conteryDetails.countryCode]);
              this.stateListQueue[callback](resp_obj);
          }
          this.stateListQueue = [];

        })
      }
    })

  }
}

stateDetails(stateName,formName) {
  let responseData ={};
  let conteryDetails = {
    countryCode: formName.controls["country"].value


  }
  return Promise.resolve(this.getStateDetails(conteryDetails))
  .then(data => {

    if (data && data["stateDetails"] && data["stateDetails"].length != 0) {
      responseData["stateDetails"] = data["stateDetails"];
      let stateControl = new FormControl('');
      if(!formName.controls["state"]){
        formName.addControl('state', stateControl);
      }else{
          stateName = formName.controls["state"].value;
      }
      let filteredState = responseData["stateDetails"].filter(function(state){
        return state.stateCode == stateName;
      })[0];
      if(filteredState){
        formName.controls["state"].setValue(filteredState.stateCode);
      }else{
        formName.controls["state"].setValue("");
      }
      responseData["stateCheck"] = true;
    } else {
      if(formName.controls['state']){
        formName.removeControl('state');
      }
      responseData["stateDetails"] = [];
      responseData["stateCheck"] = false;
    }

    return responseData;
  })
  // }
}
currentGeo(){
  if(this.geoLocationData){
    return this.geoLocationData
  }
return this.lottodayService.getGeoLocation()
        .then(res => {
          this.geoLocationData = res;
          return res;
        });
}

playDeviceCheck(gameType, id,ownNumbers): void {
  // console.log("hit it!!")
  let checkNavi;
  var ww = document.body.clientWidth;
  if (ww <= 992) {

    checkNavi = lotteryConfig[id].gameTypes.includes('groupplay') ? '/ticketSelectionType/' + id : '/selection/standardplay/' + id;
    this.router.navigate([checkNavi]);
  } else {
    checkNavi = '/selection/standardplay/' + id;
    this.router.navigate([checkNavi],{ queryParams: { ownNumbers: ownNumbers }});
  }
}

  setInputWidthResize() {
    $.fn.textWidth = function(text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };
    $('.inputCurrency').on('input', function() {
        var inputWidth = $(this).textWidth();
        $(this).css({
            width: inputWidth
        })
    }).trigger('input');
    function inputWidth(elem) {
        elem = $(this);
    }
    var targetElem = $('.inputCurrency');
    inputWidth(targetElem);
  }
}
