import { Injectable } from '@angular/core';
import { Utility } from '../utils/utility';
import { AppLottodayService } from '../app-lottoday.service';
import { EmitterService } from '../services/emitter.service';
import { Router } from "@angular/router";
import { Subject }    from 'rxjs/Subject';
import { UserDetailsService } from '../services/user-details.service';

@Injectable()
export class RealityCheckService {
  private availableSessionLimit;
  private sessionLimit = new Subject<string>();
  sessionLimit$ = this.sessionLimit.asObservable();

  sessionLimitInterval;
  constructor(private utils:Utility,
    private emitterService: EmitterService,
    private router:Router,
    private lottodayService:AppLottodayService,
    private userDetailsService:UserDetailsService) { }

  setSessionVariable(sessionKey,sessionValue){
      sessionStorage.setItem(sessionKey,JSON.stringify(sessionValue));
      this.sessionLimit.next();
  }

  updateSessionVariable(newLimit){
    let sessionValue = JSON.parse(sessionStorage.getItem("session"))
    if(sessionValue && newLimit != sessionValue.sessionLimit){
      // sessionValue.availableSessionLimit = sessionValue.availableSessionLimit > 1 ? (newLimit - sessionValue.sessionLimit)*60 : newLimit *60;
      sessionValue.availableSessionLimit =
        (sessionValue.availableSessionLimit > 1 && newLimit > sessionValue.sessionLimit)
          ? (newLimit - sessionValue.sessionLimit) * 60
          : (sessionValue.availableSessionLimit > 1 && newLimit <= sessionValue.sessionLimit)
            ? sessionValue.availableSessionLimit - ((sessionValue.sessionLimit - newLimit) * 60)
            : newLimit * 60;
      sessionValue.sessionLimit = newLimit;
      sessionStorage.setItem("session",JSON.stringify(sessionValue));
    }else if(
      (!sessionValue && newLimit > 0) ||
      (sessionValue && newLimit == sessionValue.sessionLimit && sessionValue.availableSessionLimit <= 1 && newLimit > 0 )
      ){
      let sessionNewValues={
        sessionLimit: newLimit,
        availableSessionLimit: newLimit * 60
      }
      this.setSessionVariable("session",sessionNewValues);
    }else if(newLimit == 0){
      sessionStorage.removeItem("session");
    }
    this.startLoginSession();
  }

  resetSessionVariable(){
    let sessionValue = JSON.parse(sessionStorage.getItem("session"))
    let sessionKey = "session";
    sessionValue.availableSessionLimit = sessionValue.sessionLimit * 60;
    sessionStorage.setItem(sessionKey,JSON.stringify(sessionValue));
    this.startLoginSession();
  }

  startLoginSession(){
    var self = this;
    if(!this.sessionLimitInterval){
      this.sessionLimitInterval = setInterval(function(){
        let sessionLimit = JSON.parse(sessionStorage.getItem("session"))
        if(sessionLimit){
          if((sessionLimit.availableSessionLimit - 1) > 0){
            sessionLimit.availableSessionLimit = sessionLimit.availableSessionLimit - 1;
            sessionStorage.setItem("session",JSON.stringify(sessionLimit));
          }else{
            clearInterval(self.sessionLimitInterval);
            self.sessionLimitInterval = undefined;
            self.utils.openModal("sessionExpiredModal");
          }
        }else{
          clearInterval(self.sessionLimitInterval);
          self.sessionLimitInterval = undefined;
        }

      },1000);
    }
  }

  doLogout(){
    Promise.resolve(this.lottodayService.doLogout())
    .then(logoutData => {
        this.emitterService.broadcastLoadHomeBanner();
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("cartList");
        sessionStorage.removeItem("session");
        this.userDetailsService.resetUserDetails();
        this.emitterService.broadcastLoginStatus();
        this.router.navigate(['/']);
        this.utils.closeModal("sessionExpiredModal");
    });
  }

}
