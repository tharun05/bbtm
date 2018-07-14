import { Injectable } from '@angular/core';

import { URLSearchParams, RequestOptions } from "@angular/http";
import {Http,Headers} from '@angular/http';
import { environment } from '../environments/environment';
import { LogoutEmitService } from './services/logout-emit-service';

import { Router } from '@angular/router';
//import { urlConstants } from './utils/url-constants';

import * as _ from 'underscore';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
@Injectable()
export class AppLottodayService {

  headers_application_json = new Headers({ "content-type": "application/json",
    "accept": "application/json, text/plain, */*","Access-Control-Allow-Origin":"*   "});
  ld_base_url = environment.ldApiUrl+"/api/v1/" + environment.brandId;
  private promotionsData;
  private idIndexedPromotions;
  constructor(private http:Http,
              private logoutForceService: LogoutEmitService,
              private router:Router) { }

  psPost(url,params): Promise<String>{
    return new Promise((resolve,reject)=>{
      let self =this;
    	let loginMessage:string = "";
      let headers = new Headers({ "content-type": "application/x-www-form-urlencoded",
         "accept": "application/json, text/plain, */*"});
      if(url.includes('upload')){
        headers = new Headers();
        headers.set('Content-Type', undefined);
        //headers.set('Upload-Content-Type', params.type)
        this.http.post(environment.apiUrl+url,params,{withCredentials: true})
        .toPromise().then(
            data => {
              let response = JSON.parse(data["_body"]);
              if(response && response.is_IpBlocked && response.is_IpBlocked == "true"){
                throw new Error("countryBlocked:"+response.countryCode);
              }else{
                resolve (response);
              }
            }
          ).catch(e =>{
            if(e.message && e.message.includes("countryBlocked")){
              self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
            }else{
              if (e.status === 401) {
                self.logoutForceService.broadcastForceLogout("");
              }else if (e.status === 404) {
                self.router.navigate(["/"]);
              }else if(e.status === 504){
                // console.log('504');
              }else{
                // console.log('504');
                //emit a service, event
                if(url.includes("makeCCPayment") || url.includes("makeWalletPayment"))
                  self.logoutForceService.broadcastTimeOutEvent("Transaction Timed Out");

              }
            }
        });
     }else{
       headers = new Headers({ "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json, text/plain, */*"});
      this.http.post(environment.apiUrl+url,params,{withCredentials: true,headers:headers})
      .toPromise().then(
          data => {
            let response = JSON.parse(data["_body"]);
            if(response && response.is_IpBlocked && response.is_IpBlocked == "true"){
              throw new Error("countryBlocked:"+response.countryCode);
            }else{
              resolve (response);
            }

          }
        ).catch(e =>{
          if(e.message && e.message.includes("countryBlocked")){
            self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
          }else{
            if (e.status === 401) {
              self.logoutForceService.broadcastForceLogout("");
            }else if (e.status === 404) {
              self.router.navigate(["/"]);
            }else if(e.status === 504){
              // console.log('504');
            }else{
              // console.log('504');
              //emit a service, event
              if(url.includes("makeCCPayment") || url.includes("makeWalletPayment"))
                self.logoutForceService.broadcastTimeOutEvent("Transaction Timed Out");

            }
          }
        });
     }
    })


    // return this.http.post(environment.apiUrl+url,params,{withCredentials: true,headers:headers})
    // .toPromise().then(
    //     data => {
    //     	return JSON.parse(data["_body"]);;
    //     }
    //   );
  }

  psGet(params,url): Promise<String>{
      return new Promise((resolve,reject)=>{
        let self =this;
        this.http.get(environment.apiUrl+url,{withCredentials: true,search:params})
        .toPromise().then(
            data => {
              let response = JSON.parse(data["_body"]);
              if(response && response.is_IpBlocked && response.is_IpBlocked == "true"){

                throw new Error("countryBlocked:"+response.countryCode);
              }else{
                resolve (response);
              }
            }
          ).catch(e =>{
            if(e.message && e.message.includes("countryBlocked")){
              self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
            }else{
              if (e.status === 401) {
                self.logoutForceService.broadcastForceLogout("");
              }else if (e.status === 404) {
                self.router.navigate(["/"]);
              }else if(e.status === 504){
                // console.log('504');
              }else{
                // console.log('504');
                //emit a service, event
                if(url.includes("makeCCPayment") || url.includes("makeWalletPayment"))
                  self.logoutForceService.broadcastTimeOutEvent("Transaction Timed Out");

              }
            }
          });
      })

  }





  ldPost(url,params): Promise<String>{
    return new Promise((resolve,reject)=>{
       let self =this;
         this.http.post(this.ld_base_url+url,params,{headers:this.headers_application_json})
        .toPromise().then(
            data => {
              // console.log(data);
              if(this.headers_application_json.get('Authorization')){
                this.headers_application_json.delete('Authorization');
              }
              let response = JSON.parse(data["_body"]);
              if(response && response.is_IpBlocked && response.is_IpBlocked == "true"){
                throw new Error("countryBlocked:"+response.countryCode);
              }else{
                resolve(response);
              }
            }
          ).catch(e =>{
            if(e.message && e.message.includes("countryBlocked")){
              self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
            }else{
              if (e.status === 401) {
                self.logoutForceService.broadcastForceLogout("");
              }else if (e.status === 404) {
                self.router.navigate(["/"]);
              }else if(e.status === 504){
                // console.log('504');
              }else{
                // console.log('504');
                //emit a service, event
                if(url.includes("makeCCPayment") || url.includes("makeWalletPayment"))
                  self.logoutForceService.broadcastTimeOutEvent("Transaction Timed Out");

              }
            }
          });
   })

  }

  ldGet(url): Promise<String>{
    return new Promise((resolve,reject)=>{
    let self =this;
     this.http.get(this.ld_base_url+url,{headers:this.headers_application_json})
    .toPromise().then(
        data => {
          // console.log(data);
           if(this.headers_application_json.get('Authorization')){
            this.headers_application_json.delete('Authorization');
          }
          let response = JSON.parse(data["_body"]);
          if(response && response.is_IpBlocked && response.is_IpBlocked == "true"){
            throw new Error("countryBlocked:"+response.countryCode);
          }else{
            resolve(response);
          }
        }
      ).catch(e =>{
        if(e.message && e.message.includes("countryBlocked")){
          self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
        }else{
          if (e.status === 401) {
            self.logoutForceService.broadcastForceLogout("");
          }else if (e.status === 404) {
            self.router.navigate(["/"]);
          }else if(e.status === 504){
            // console.log('504');
          }else{
            // console.log('504');
            //emit a service, event
            if(url.includes("makeCCPayment") || url.includes("makeWalletPayment"))
              self.logoutForceService.broadcastTimeOutEvent("Transaction Timed Out");

          }
        }
      });
    })
  }

  localFileLoader(path):Promise<String>{
   return this.http.get(path).toPromise().then(res =>{
            return  JSON.parse(res["_body"]);
           })
  }
  validateUniqueness(fieldToValidate): Promise<String>{
    let loginDetails = new URLSearchParams();
    // console.log();
    let url;
    _.each(fieldToValidate, function(value,key) {
        loginDetails.append(key, value);
        url = key == "txtNickname" ? '/ajax/registration/isUniqueNickname' : '/ajax/registration/isUniqueEmail';
    });
    return this.psPost(url,loginDetails);
  }

  cancelLimits(data): Promise<String>{
    let cancelDetails = new URLSearchParams();
    // console.log();
    let url;
    _.each(data, function(value,key) {
        cancelDetails.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/cancelLimits',cancelDetails);
  }

  deleteLimits(data): Promise<String>{
    let cancelDetails = new URLSearchParams();
    // console.log();
    let url;
    _.each(data, function(value,key) {
        cancelDetails.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/deleteLimits',cancelDetails);
  }


  doLogin(credentials): Promise<String>{
    let loginDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        loginDetails.append(key, value);
    });

      return Promise.resolve(this.psPost('/ajax/login',loginDetails)).then(resp=>{

      if(resp && resp["success"] === "true"){
          sessionStorage.setItem("user",JSON.stringify(true));
          return resp;
        }else{
          return "";
        }
     });
  }

  forgotPassword(emailDetails): Promise<String>{
    let emailDet = new URLSearchParams();
    _.each(emailDetails, function(value,key) {
        emailDet.append(key, value);
    });
    return this.psPost('/ajax/resetPassword',emailDet);
  }

  resetPassword(pwdDetails): Promise<String>{
    let pwdDet = new URLSearchParams();
    _.each(pwdDetails, function(value,key) {
        pwdDet.append(key, value);
    });
    return this.psPost('/ajax/resetPassword/doResetPassword',pwdDet);
  }

  doRegistration(credentials): Promise<String>{
    let regDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        regDetails.append(key, value);
    });
    return this.psPost('/ajax/registration',regDetails);
  }

  doProfileUpdate(credentials): Promise<String>{
    let regDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        regDetails.append(key, value);
    });
    return this.psPost('/ajax/profile/update',regDetails);
  }

  updateSubscriptionPreferenes(credentials): Promise<String>{
    let subscriptionPref = new URLSearchParams();
    _.each(credentials, function(value,key) {
        subscriptionPref.append(key, value);
    });
    return this.psPost('/ajax/profile/updateSubscriptionPreferenes',subscriptionPref);
  }

  getSubscriptionPreferenes(): Promise<String>{
    return this.psPost('/ajax/profile/getSubscriptionPreferenes',"subscriptionPref");
  }

  suspendAccount(credentials): Promise<String>{
    let reason = new URLSearchParams();
    _.each(credentials, function(value,key) {
        reason.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/lockAccount',reason);
  }

  setLimits(credentials): Promise<String>{
    let limttAndType = new URLSearchParams();
    _.each(credentials, function(value,key) {
        limttAndType.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/setLimits',limttAndType);
  }

  changePassword(credentials): Promise<String> {
    let passwordDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        passwordDetails.append(key, value);
    });
    return this.psPost('/ajax/profile/changePassword',passwordDetails);
  }

  doGenerateOtp(credentials): Promise<String>{
    let details = new URLSearchParams();
    _.each(credentials, function(value,key) {
        details.append(key, value);
    });
    return this.psPost('/ajax/tracker/registration/attempt',details);
  }

  getCashierData(): Promise<String>{
    return this.psGet("",'/ajax/cashier/getCashierData');
  }

  getLastTransactionStatus(): Promise<String>{
    return this.psPost('/ajax/cashier/gettransationStatus',{});
  }

  getTransactionStatus(txnDetails): Promise<String>{
    let details = new URLSearchParams();
    _.each(txnDetails, function(value,key) {
        details.append(key, value);
    });
    return this.psPost('/ajax/cashier/gettransationStatus',details);
  }

  getEnabledCuurencies(): Promise<String>{
    return this.psGet("",'/ajax/profile/getEnabledCurrency');
  }

  getCountries(): Promise<String>{
    return this.psGet("",'/ajax/profile/getcountryDetails');
  }

  resendEmailVerification(credentials): Promise<String>{
    let resendCodeDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        resendCodeDetails.append(key, value);
    });
    return this.psPost('/ajax/registration/sendChannelVeification',resendCodeDetails);
  }

  doVerifyOtp(credentials): Promise<String>{
    let otpVerDetails = new URLSearchParams();
    _.each(credentials, function(value,key) {
        otpVerDetails.append(key, value);
    });
    return this.psPost('/ajax/registration/verifyChannel',otpVerDetails);
  }

  makePayment(cc):Promise<String>{
    let ccDetails = new URLSearchParams();
    _.each(cc, function(value,key) {
        ccDetails.append(key, value);
    });
    return this.psPost(cc.paymentMethod == "CREDITCARD" ? '/ajax/cashier/makeCCPayment' : '/ajax/cashier/makeWalletPayment' ,ccDetails);
  }

  makeWithdraw(cc):Promise<String>{
    let ccDetails = new URLSearchParams();
    _.each(cc, function(value,key) {
        ccDetails.append(key, value);
    });
    return this.psPost(cc.paymentMethod == "CREDITCARD" ? '/ajax/cashier/makeCCWithdrawal' : '/ajax/cashier/makeWalletWithdrawal',ccDetails);
  }

  doLogout(): Promise<String>{
    return this.psPost('/ajax/login/logout',{});
  }

  getBalance(): Promise<String>{
    return this.psPost('/ajax/profile/getbalance',"");
  }

  getCurrency(): Promise<String>{
    return this.psGet("",'/ajax/profile/getCurrency');
  }

  getProfileData(): Promise<String>{
    return this.psGet("",'/ajax/profile/getData');
  }

  getProfileBalanceCurrency(): Promise<String>{
    return this.psGet("",'/ajax/profile/getProfileBalanceCurrency');
  }

  getAccountVerificationStatus(): Promise<String>{
    return this.psGet("",'/ajax/profile/getAccountVerificationStatus');
  }


  getResponsibleGamingData(): Promise<[String,String,String,String,String]>{
    return Promise
      .all([
          Promise.resolve(this.getDepositLimit()),
          Promise.resolve(this.getRealitySessionLimit()),
          Promise.resolve(this.getLossLimit()),
          Promise.resolve(this.getWagerLimit()),
          Promise.resolve(this.getSessionLimit())
        ])
      .then(values => {
        return values;
      });
  }

  getDepositLimit(): Promise<String>{
    return this.psGet("",'/ajax/balance/getDepositLimit');
  }

  getRealitySessionLimit(): Promise<String>{
    return this.psGet("",'/ajax/balance/getRealitySessionLimit');
  }

  getSessionLimit(): Promise<String>{
    return this.psGet("",'/ajax/balance/getSessionLimit');
  }

  getLossLimit(): Promise<String>{
    return this.psGet("",'/ajax/balance/getLossLimit');
  }

  getWagerLimit(): Promise<String>{
    return this.psGet("",'/ajax/balance/getWagerLimit');
  }

  approveDepositLimit(approvedData){
    let data = new URLSearchParams();
    _.each(approvedData, function(value,key) {
        data.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/confirmDepositLimits',data);
  }

  approveLimits(approvedData){
    let data = new URLSearchParams();
    _.each(approvedData, function(value,key) {
        data.append(key, value);
    });
    return this.psPost('/ajax/ResponsibleGaming/confirmLimits',data);
  }


  getLoginStatus(): Promise<String>{
    return this.psGet("",'/ajax/login/status');
  }


  getLottodayAccessToken():Promise<String>{
    return Promise.resolve(this.psGet("",'/ajax/token/getToken')).then(tokenObj=>{
        if(tokenObj && tokenObj["status"] != "FAILURE"){
          sessionStorage.setItem("user",JSON.stringify(tokenObj));
          return tokenObj;
        }else{
          return "";
        }
     });
  }
  getAllLotteries(): Promise<String>{
    return  this.ldGet("/AllLotteries");
  }

  getUpcomingLotteries(): Promise<String>{
    return  this.ldGet("/UpcommingDraws");
  }

  getLatestResults(): Promise<any>{
    return  this.ldGet("/LastDrawsResults");
  }

  getStandardPlayDetails(lotteryId): Promise<String>{
    return  this.ldGet("/game/" +lotteryId+ "/standardplay");
  }

  getGroupPlayDetails(lotteryId): Promise<String>{
    return  this.ldGet("/game/" +lotteryId+ "/groupplay");
  }

  getLotteryPrizeLevels(lotteryId): Promise<String>{
    return  this.ldGet("/PrizeLevels/"+lotteryId);
  }

  makeAnOrder(data): Promise<String>{
    this.headers_application_json.append('Authorization', 'bearer '+this.getUserAccessToken());
    return  this.ldPost("/" + data.userId + "/order",data);
  }

  getUserAccessToken():string{
   let user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      return user.access_token;
    }
    return "";
  }

  getLottodayUserId():string{
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      return user.user_id;
    }
    return "";
  }

  getUserTransactionsHistory(request):any{
    let txnReq = new URLSearchParams();
    txnReq.append("criteria",JSON.stringify(request));
    return this.psPost('/ajax/Report/getTransactionHistory',txnReq);
  }

  getUserBetHistory(request):any{
    let betReq = new URLSearchParams();
    betReq.append("criteria",JSON.stringify(request));
    return this.psPost('/ajax/Report/getTransactionHistory',betReq);
  }


  getUserTickets():Promise<any>{
     this.headers_application_json.append('Authorization', 'bearer '+this.getUserAccessToken());
    return  this.ldGet( "/"+this.getLottodayUserId()+"/tickets");

  }

  getUserTicketByOrderId(orderId):Promise<String>{
     this.headers_application_json.append('Authorization', 'bearer '+this.getUserAccessToken());
    return  this.ldGet( "/"+this.getLottodayUserId()+"/tickets?OrderId="+orderId);

  }

  getLotterPrizeInfo(lotteryId):Promise<String>{

    return this.http.get("https://feed.bingo69.com/api/Draws/"+lotteryId+"?expired=true",{headers:this.headers_application_json})
    .toPromise().then(
        data => {
           return JSON.parse(data["_body"]);
        }
      );
  }

  doContact(contact): Promise<String>{
    let contactDetails = new URLSearchParams();
    _.each(contact, function(value,key) {
        contactDetails.append(key, value);
    });
    return this.psPost('/ajax/registration/contactUs',contactDetails);
  }

  checkUserProfile():Promise<String>{
    return this.psPost('/ajax/profile/checkUserProfile',"");
  }

  getChannelVerificationStatus(){
    return this.psPost('/ajax/cashier/channelVerificationStatus',"");
  }
  getStates(country): Promise<String>{
    let countryName = new URLSearchParams();
    _.each(country, function(value,key) {
      countryName.append(key, value);
  });
    // console.log(countryName);
    return this.psPost('/ajax/profile/getStateDetails',countryName);
  }

  uploadFileToSession(idProof):Promise<String>{
    let formData:FormData = new FormData();
    //var formData = new FormData();
		formData.append('file', idProof.file);
    // let proofDetails = new URLSearchParams();
    // _.each(idProof, function(value,key) {
    //     proofDetails.append(key, value);
    // });
    return this.psPost(idProof.url,formData);
  }

  submitUploadedFiles(){
    return this.psGet("","/ajax/account/Documents/send");
  }

  getAvailablePaymentMethodLimits(){
    return this.psGet("","/ajax/cashier/getAvailablePaymentMethodsLimits");
  }

  getGeoLocation(): Promise<any>{
    return  this.ldGet("/IPInfo");
  }

  getBanners(bannerReqData):Promise<any>{
    return this.psGet(this.getSearchParams(bannerReqData),'/ajax/banner/getBanners');
  }

  isBlockedCountry():Promise<any>{
    return this.psGet("",'/ajax/country/countryblock');
  }

  getStaticPage(data):Promise<any>{
    let staticPage = new URLSearchParams();
    _.each(data, function(value,key) {
      staticPage.set(key, value);
  });
    return this.psGet(staticPage,'/ajax/staticPage/getPage');
  }

  getFaqQuestionsAndCategory():Promise<any>{
    return this.psGet("",'/ajax/faq/getQuestions');
  }

  getCasinoGames():Promise<any>{
    return this.psGet("",'/ajax/game/getgames');
  }

  getBingoRooms(): Promise<String>{
    return this.psGet("",'/ajax/bingo/getBingoRooms');
  }

  getGameUrl(roomId): Promise<String> {
   // return this.ldGet("/game/" +lotteryId+ "/standardplay");
    return this.psGet("",'/ajax/bingo/getGameUrl?roomID='+roomId);
  }

  lauchGame(gameType, gameId,minislot?):Promise<any>{
    if(gameType == "realgames"){
      if(minislot){
        return this.psGet("",'/ajax/launcher/getRealGames?gameSymbol='+gameId+'&pp_minislot='+minislot);
      }else{
        return this.psGet("",'/ajax/launcher/getRealGames?gameSymbol='+gameId);
      }
    }else{
      if(minislot){
        return this.psGet("",'/ajax/launcher/getFreeGames?gameSymbol='+gameId+'&pp_minislot='+minislot);
      }else{
        return this.psGet("",'/ajax/launcher/getFreeGames?gameSymbol='+gameId);
      }
      
    }


    //  return new Promise((resolve,reject)=>{

    //   let self =this;
    //   this.http.get(environment.apiUrl+"/launcher/"+gameType+"/index/"+gameId,{withCredentials: true})
    //   .toPromise().then(
    //       data => {
    //         let response =data["_body"];
    //           resolve (response);
    //       }
    //     ).catch(e =>{
    //       if(e.message && e.message.includes("countryBlocked")){
    //         self.logoutForceService.broadcastCountryBlockEvent(e.message.split(":")[1]);
    //       }else{
    //         if (e.status === 401) {
    //           self.logoutForceService.broadcastForceLogout("");
    //         }else if (e.status === 404) {
    //           self.router.navigate(["/"]);
    //         }
    //       }
    //     });
    // })
  }

  getWithdrawStaticInfo(data){
    let staticPage = new URLSearchParams();
    _.each(data, function(value,key) {
      staticPage.set(key, value);
  });
    return this.psGet(staticPage,'/ajax/staticPage/getPage');
  }

  getSearchParams(searchData){
    let searchParams = new URLSearchParams();
    _.each(searchData, function(value,key) {
        searchParams.set(key, value);
    });
    return searchParams;
  }
  setPromotionsData(promotionsData){
    this.promotionsData = promotionsData
  }

  setIdIndexedPromotionsData(idIndexedPromotions){
    this.idIndexedPromotions = idIndexedPromotions
  }
  getPromos(){
    return this.psGet("",'/ajax/promotions/getPromos');
  }

  getTestimonials(data):Promise<any>{
    return this.psGet(this.getSearchParams(data),'/ajax/jackpot/getWinners');
  }

  getPromotionsData(){
    if(this.promotionsData){
      return this.promotionsData
    }else{
      return Promise.resolve(this.getPromos())
      .then(
        promoData=>{
          this.setPromotionsData(promoData);
          this.setIdIndexedPromotionsData(_.indexBy(promoData,'id'));
          return this.promotionsData;
        }
      );
    }
  }
  getIndexedPromotionData(){
    if(this.idIndexedPromotions){
      return this.idIndexedPromotions
    }else{
      return Promise.resolve(this.getPromos())
      .then(
        promoData=>{
          this.setPromotionsData(promoData);
          this.setIdIndexedPromotionsData(_.indexBy(promoData,'id'));
          return this.idIndexedPromotions;
        }
      );
    }
  }

}
