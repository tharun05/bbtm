import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class LogoutEmitService {

  constructor() { }

  private forceLogout = new Subject<string>();

  forceLogout$ = this.forceLogout.asObservable();

  broadcastForceLogout(loginStatus: string) {
    this.forceLogout.next(loginStatus);
  }

  private TimeOutEvent =  new Subject<String>();

  TimeOutEvent$ = this.TimeOutEvent.asObservable();

  broadcastTimeOutEvent(flag: any) {
    this.TimeOutEvent.next(flag);
  }


  private CountryBlockEvent =  new Subject<String>();

  CountryBlockEvent$ = this.CountryBlockEvent.asObservable();

  broadcastCountryBlockEvent(flag: any) {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cartList");
    sessionStorage.removeItem("session");
    this.CountryBlockEvent.next(flag);
  }
}
