import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {AppLottodayService} from '../app-lottoday.service';
import {Router, ActivatedRoute} from "@angular/router";

@Injectable()
export class UserDetailsService {
  defaultCurrency:any = "USD";
  defaultCurrencySymbol:any = "$";
  userCurrency:any;
  userCurrencySymbol:any;
  userProfileDetails:any;
  userBalance;
  cashBalance:any;
  bonusBalance:any;
  kycStatus: boolean= false;
  kycVrfnStatus: boolean=false;
  private balanceUpdated = new Subject<string>();
  balanceUpdated$ = this.balanceUpdated.asObservable();

  constructor(private lottodayService: AppLottodayService,
              private router: Router) { }

  resetUserDetails(){
    this.userCurrency = undefined;
    this.userCurrencySymbol = undefined;
    this.userProfileDetails = undefined;
    this.userBalance = undefined;
    this.cashBalance = undefined;
    this.bonusBalance = undefined;
  }

  setUserCurrencyCode(code):any{
  		this.userCurrency = code;
  }


  setUserCurrencySymbol(symbol):any{
  		this.userCurrencySymbol = symbol;
  }

  getUserCurrencyCode():any{
  		return this.userCurrency;
  }

  setCashBalance(cashb):any{
  		this.cashBalance = cashb;
  }

  getCashBalance():any{
  		return this.cashBalance;
  }

  setBonusBalance(bonusb):any{
  		this.bonusBalance = bonusb;
  }

  getBonusBalance():any{
  		return this.bonusBalance;
  }

  setUserBalance(balance):any{
      this.userBalance = balance;
      this.balanceUpdated.next("BalanceUpdated");
  }

  getUserBalance():any{
      return this.userBalance;
  }


  getUserCurrencySymbol():any{
    return this.userCurrencySymbol ? this.userCurrencySymbol : this.defaultCurrencySymbol;	
  }
  getDefaultCurrencyCode():any{
  	return this.defaultCurrency;

  }

  getDefaultCurrencySymbol():any{
  	return this.defaultCurrencySymbol;
  }

  setuserProfileDetails(profileDetails):any{
     
      this.userProfileDetails = profileDetails;
  }

  getuserProfileDetails():any{
      return this.userProfileDetails;
  }

  getCurrencyCode():any{
    return this.userCurrency ? this.userCurrency : this.defaultCurrency;
  }

  getCurrencySymbol():any{
    return this.userCurrencySymbol ? this.userCurrencySymbol : this.defaultCurrencySymbol;
  }
  setKYCVerifiedStatus(kycVrfnStatus: boolean){
    this.kycVrfnStatus= kycVrfnStatus;
  }
  setKYCStatus(kycStatus: boolean){
    this.kycStatus=kycStatus;
  }
  getKYCVerifiedStatus(){
    return this.kycVrfnStatus;
  }
  getKYCStatus(){
    return this.kycStatus;
  }
  loadKYCStatus(): Promise<boolean>{
    return Promise.resolve(this.lottodayService.getAccountVerificationStatus())
      .then(verificationData => {
          if(verificationData && verificationData["documents"]){
             if ((verificationData["documents"].addressStatus == "vrfn_verified" || verificationData["documents"].addressStatus == "vrfn_init") && (verificationData["documents"].identityStatus == "vrfn_verified" || verificationData["documents"].identityStatus == "vrfn_init")) {
                this.setKYCStatus(true);
             }else{
                this.setKYCStatus(false);
             }
             if (verificationData["documents"].addressStatus == "vrfn_verified" && verificationData["documents"].identityStatus == "vrfn_verified") {
                 this.setKYCVerifiedStatus(true);
             } else if ((verificationData["documents"].addressStatus == "vrfn_init" || verificationData["documents"].identityStatus == "vrfn_init") || (verificationData["documents"].addressStatus == "vrfn_failed" || verificationData["documents"].identityStatus == "vrfn_failed")) {
                this.setKYCVerifiedStatus(false);
             } else {
                this.setKYCVerifiedStatus(false);
             }
             return true;
          }
          return false;
      });
  }
checkUserRegistrationStatus(): Promise<boolean>{

    return Promise.resolve(this.lottodayService.checkUserProfile())
        .then(profileData => {
            if(profileData && profileData["userProfileCompleted"]){
                return Promise.resolve(this.lottodayService.getChannelVerificationStatus())
                .then(resp => {
                    if( !resp || !resp["success"]){
                        //this.codereVerify();
                        this.router.navigate(["/verification"]);
                        return false;
                    }
                        return true;
                });
            }else{
                this.router.navigate(["/register"]);
                return false;
            }
        });
}

}
