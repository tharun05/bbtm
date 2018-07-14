import { Component, OnInit,OnDestroy } from '@angular/core';
import { AppIconSvgComponent } from './app-icon-svg/app-icon-svg.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TranslationService } from './services/translate.service';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { RealityCheckService } from './services/reality-check.service';
import { AppLottodayService } from './app-lottoday.service';
import { Location } from '@angular/common';
import { Utility } from './utils/utility';
import { EmitterService } from './services/emitter.service';
import { UserDetailsService } from './services/user-details.service';
import { LogoutEmitService } from './services/logout-emit-service';
import { SlotsPipe } from './slots.pipe';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  footerDisable: boolean = false;
  sessionLimit;
  userDetail;
  name;
  balance;
  currentRoute;
  currencySymbol;
  bannerAvailable;
  routerEvent:any;
  countryCode:any = undefined;
  isCountryBlocked:boolean = false;
  isGameLaunch = false;
  testVal;
  constructor(private translate: TranslationService,
    private router: Router,
    private location: Location,
    private utils: Utility,
    private realityCheckService: RealityCheckService,
    private emitterService: EmitterService,
    private userService: UserDetailsService,
    private lottodayService: AppLottodayService,
    private logoutEmitService:LogoutEmitService,
    private activatedRoute: ActivatedRoute,
  ) 
  {

    this.routerEvent = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((e) => {


      if(window.location.href.includes("gamePlay")){
        this.isGameLaunch = true;
        this.testVal = "hello";
      }else{
        this.isGameLaunch = false;
      }

      if(this.countryCode == undefined || this.countryCode == "-NA-"){
        Promise.resolve(this.lottodayService.isBlockedCountry())
         .then(res=>{
           if(res && res["is_IpBlocked"] && JSON.parse(res["is_IpBlocked"]) == true){
             this.isCountryBlocked = true;
             this.countryCode = res["countryCode"];
           }else if(res && res["is_IpBlocked"] && JSON.parse(res["is_IpBlocked"]) == false){
             this.isCountryBlocked = false;
             this.countryCode = res["countryCode"];
           }else{
             this.isCountryBlocked = false;
             this.countryCode = "-NA-";
           }
         },
         SystemError=>{}
       );

      }else{
        this.isCountryBlocked = false;
      }
     });

    this.logoutEmitService.CountryBlockEvent$.subscribe(country=>{
     this.isCountryBlocked = true;
     this.countryCode = country;
    })
    translate.setDefaultLang('en');
    realityCheckService.sessionLimit$.subscribe(
      () => {
        if (sessionStorage.getItem("session")) {
          this.sessionLimit = JSON.parse(sessionStorage.getItem("session")).sessionLimit
        }
      });

    emitterService.userDataSource$.subscribe(
      userDataSource => {
        if (userDataSource == "User Data Updated") {
          this.userDetail = this.userService.getuserProfileDetails();
          this.currencySymbol = this.userService.getCurrencySymbol();
          // console.log(this.userDetail);
          this.name = this.userDetail.firstName + " " + this.userDetail.lastName;
          this.balance = this.currencySymbol + " " + this.userDetail.balanceDetails.cash;
        }
      }
    );
    // this.emitterService.bannerDataAvailable$.subscribe(data => {
    //   this.bannerAvailable = data;
    // })
    this.emitterService.showSmallFooterEvent$.subscribe(smallFooter => {
      if (smallFooter == "showSmall") {
        this.footerDisable = true;
      }

    })
    this.router.events.subscribe((event: any) => {
      if (event) {
        this.currentRoute = event.url;
      }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
  ngOnInit(): void {
    if(window.location.href.includes("gamePlay")){
      this.isGameLaunch = true;
    }else{
      this.isGameLaunch = false;
    }
    $("body").on('mousedown', ".mat-input-infix", function(e) {
      if ($(this).find('.mat-input-element')[0] && e.offsetX > $(this).find('.mat-input-element')[0].offsetWidth && (!$($($(this).parent()[0]).parent()[0]).parent().hasClass("ng-valid"))) {
        $(this).find('.mat-input-element').val(undefined);
      }
    });

    // $(document).bind('touchstart', function preventZoom(e) {
    //     var t2 = e.timeStamp
    //       , t1 = $(this).data('lastTouch') || t2
    //       , dt = t2 - t1
    //       , fingers = e.originalEvent.touches.length;
    //     $(this).data('lastTouch', t2);
    //     if (!dt || dt > 500 || fingers > 1) return; // not double-tap
    //
    //     e.preventDefault(); // double tap - prevent the zoom
    //     // also synthesize click events we just swallowed up
    //     $(this).trigger('click').trigger('click');
    //   });

    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
      if (this.location.path().includes('/selection') || this.location.path().includes('/checkout') || this.location.path().includes('/payment') || this.location.path().includes('/register')|| this.location.path().includes('/verification')|| this.location.path().includes('/bonus')) {
        this.footerDisable = true;
      } else {
        this.footerDisable = false;
      }
    });
    if (sessionStorage.getItem("session")) {
      this.sessionLimit = JSON.parse(sessionStorage.getItem("session")).sessionLimit
    }
    this.userDetail = this.userService.getuserProfileDetails();

    /*console.log('calling'); resetSessionVariable */
  }

  sessionContinue() {

    Promise.resolve(this.lottodayService.getSessionLimit())
      .then(responsibleGamingData => {
        if (responsibleGamingData) {
          var realityDetails = responsibleGamingData;
          this.realityCheckService.updateSessionVariable(realityDetails["limits"] && realityDetails["limits"].overall.value ? realityDetails["limits"].overall.value : 0);
          this.utils.closeModal("sessionExpiredModal");
        }
      });
    //this.realityCheckService.resetSessionVariable();
  }

  moveToTransaction() {
    this.sessionContinue();
    this.router.navigate(['/myaccount/transactions'])
  }

  moveToRealityCheck() {
    this.sessionContinue();
    this.router.navigate(['/myaccount'])
  }

  logout() {
    this.realityCheckService.doLogout();
  }
  ngOnDestroy(){
        this.routerEvent.unsubscribe();
  }

  isLogoAllowed() {
    let routes = ['/register']
    if (routes.indexOf(this.currentRoute) > -1) {
      return true;
    } else {
      return false;
    }
  }
}

