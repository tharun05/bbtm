import { Component, OnInit, AfterViewInit, ViewEncapsulation, HostListener, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AppLottodayService } from '../app-lottoday.service'
import { EmitterService } from '../services/emitter.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from "@angular/router";
import { UserDetailsService } from '../services/user-details.service';
import { RealityCheckService } from '../services/reality-check.service';
import { Utility } from '../utils/utility';
import { LogoutEmitService } from '../services/logout-emit-service';
import { GameWindowService } from '../game-window/gameWindow.service';
import { SocketService } from '../services/socket.service';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
    selector: 'app-ld-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit, AfterViewInit {
    @Input() isGamePage;
    txtEmail: string;
    txtPassword: string;
    forceNewSession: boolean = false;
    chkRememberMe: boolean = false;
    chkAutoLogin: boolean = false;
    redirectTo: string = "/";
    isLoggedIn: boolean = false;
    cash: number = 0;
    currency: string;
    jackpotDraws: any;
    upcomingDraws: any;
    display_limit: number = 6;
    profileData;
    windowType;
    loadImage = false;
    fullScreen: boolean = false;
    gameId;
    loginCompletedEvent;
    transactionSuccess: boolean = false;
    bonusSelect: boolean = false;
    public paymentMethod;
    paymentType = 'deposit';
    qDResponse;
    userCurrency;
    activeLang;
    selectLang: boolean = false;
    private currentRoute: string = '';
    gameType: string;
    isModalOpen: boolean = false;
    totalPrice = 10;
    isMobile;
    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        var ww = document.body.clientWidth;
        if (ww <= 992) {
            this.windowType = "mobile";
        } else {
            this.windowType = "device";
        }
    }
    //cartItems = this.utility.getCartItemsCount();

    constructor(private lottodayService: AppLottodayService,
        private emitterService: EmitterService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserDetailsService,
        private utility: Utility,
        private realityCheckService: RealityCheckService,
        private logoutEmitService: LogoutEmitService,
        private location: Location,
        private gmService: GameWindowService,
        private socketService: SocketService,
        private userDetailService: UserDetailsService
    ) {
        this.loginCompletedEvent = emitterService.loginComplete$.subscribe(
            message => {
                this.updateHeader(true, message);
            });
        emitterService.updateLoginStatus$.subscribe(
            loginStatus => {
                this.isLoggedIn = JSON.parse(loginStatus)
            }
        );

        logoutEmitService.forceLogout$.subscribe(
            loginStatus => {
                this.logout();
            }
        );

        emitterService.txnComplete$.subscribe(
            loginStatus => {
                Promise.resolve(this.lottodayService.getBalance())
                    .then(balanceDetails => {
                        if (balanceDetails) {
                            this.cash = balanceDetails["cash"] + balanceDetails["bonus"];
                            this.userService.setBonusBalance(balanceDetails["bonus"]);
                            this.userService.setCashBalance(balanceDetails["cash"]);
                            this.userService.setUserBalance(this.cash);
                        }
                    });
            }
        );


        this.userService.balanceUpdated$.subscribe(
            balanceUpdateStatus => {
                this.cash = this.userService.getUserBalance();
            });
        this.emitterService.qDResponse$.subscribe(resp => {
            this.userCurrency = this.userDetailService.getCurrencyCode();
            this.qDResponse = resp;
            console.log(resp)
        });

        this.router.events.subscribe((event: any) => {
            if (event) {
                this.currentRoute = event.url;
            }
        });

    }

    isHeaderAollowed() {

        /*@@You can add route into the below array in-order
             to hide the  header in that Route page */

        let routes = ['/register', '/verification', '/mini-slot-games']
        if (routes.indexOf(this.currentRoute) > -1) {
            return false;
        } else {
            return true;
        }
    }

    isLogoAllowed() {
        let routes = ['/mini-slot-games']
        if (routes.indexOf(this.currentRoute) > -1) {
            return false;
        } else {
            return true;
        }
    }

    closeModal(modalId) {
        this.utility.closeModal(modalId);
        if (modalId == "quickDepositModal") {
            this.paymentMethod = false;
        }
    }
    shouldShowErrors(fieldName, formName) {
        return this.utility.shouldShowErrors(fieldName, formName)
    }
    getErrorMessage(fieldName, formName) {
        return this.utility.getErrorMessage(fieldName, formName)
    }
    getButtonClass(formName, fieldName) {
        return this.utility.getButtonClass(formName, fieldName)
    }
    isButtonDisabled(formName) {
        return this.utility.isButtonDisabled(formName)
    }
    getCartItemsCount() {
        return this.utility.getCartItemsCount();
    }



    ngOnInit() {
        this.activeLang = 'EN';
        this.selectLang = false;
        this.isLoggedIn = this.utility.isUserLoggedIn();
        this.activatedRoute.queryParamMap.subscribe(queryParams => {
            if (queryParams.get('CXD')) {
                localStorage.setItem('affId', queryParams.get('CXD'));
            } else if (queryParams.get('cxd')) {
                localStorage.setItem('affId', queryParams.get('cxd'));
            }
            this.gameId = queryParams.get('gameCode');
            this.gameType = queryParams.get('gameType');
        });
        // Promise.resolve(this.lottodayDataService.getExtendLotteries(false))
        //     .then(resp => {
        //         if (resp) {
        //             this.upcomingDraws = new Object(resp);
        //             this.jackpotDraws = JSON.parse(JSON.stringify(this.upcomingDraws));
        //             this.jackpotDraws = this.jackpotDraws.sort(function (a, b) {
        //                 return b.estimatedJackpotLC - a.estimatedJackpotLC;
        //             });
        //             this.emitterService.broadcastbannerDataAvailable("true");
        //         }
        //     });

        // this.emitterService.updateUpcomingDrawsData$.subscribe(flag => {
        //     this.upcomingDraws = new Object(this.lottodayDataService.extendLotteries);
        //     this.jackpotDraws = JSON.parse(JSON.stringify(this.upcomingDraws));
        //     this.jackpotDraws = this.jackpotDraws.sort(function (a, b) {
        //         return b.estimatedJackpotLC - a.estimatedJackpotLC;
        //     });
        //     this.emitterService.broadcastbannerDataAvailable("true");
        // })

        //  this.checkUserStatus();
        Promise.resolve(this.lottodayService.getLoginStatus())
            .then(data => {
                if (data && data["status"] == true) {
                    this.socketService.setSocketURL(data['riverplayUrl']);
                    this.socketService.setSocketId(data['rvpSessionId']);
                    this.socketService.setPartnerId(data['partnerId']);
                  this.socketService.connectToSocket("authCode")
                    this.updateHeader(true, "hideMenu");
                    Promise.resolve(this.lottodayService.getSessionLimit())
                        .then(sessionData => {
                            if (sessionData) {
                                this.realityCheckService.updateSessionVariable(sessionData["limits"] 
                                && sessionData["limits"].overall.value ? sessionData["limits"].overall.value : 0);
                            }
                        });
                } else {
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("session");
                    this.emitterService.broadcastLoginStatus();
                }
            }, SystemError => {
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("session");
            }
            );

            $(".ld_menu>li a").click(function(){ 
                $( ".ld_menu>li a" ).each(function( i ) {
                    $(this).removeClass("activePage");
                  });
                $(this).addClass('activePage');
            });
        
            $(".inn-dropdown>li a").click(function(){ 
                $( ".inn-dropdown>li a" ).each(function( i ) {
                    $(this).removeClass("activePage");
                  });
                $(this).addClass('activePage');
            });
    }

    switchButtonToggle(type) {
        this.gmService.switchButtonToggle(type, this.gameId);
    }

    getGametypeStatus() {
        return this.gmService.switchInputStatus;
    }
    openPageOrModal(page, modalId) {
        if (document.body.clientWidth <= 992) {
            this.router.navigate([page], { queryParams: { "checkout": "true" } })
        } else {
            this.openModal(modalId);
        }
    }

    openModal(modalId): void {
        this.utility.openModal(modalId);
        if (modalId == "quickDepositModal") {
            this.paymentMethod = true;
            console.log("quickDepositModal", this.paymentMethod);
            $(".deposit-header .payment-method").removeClass('hide');
            $("#quickDepositModal .user-reg-modal").removeClass('hide');
            $("#quickDepositModal #quickModalSuccess").addClass("hide");
        }
    }

    toggleFullScreen() {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen == true) {
            if (document.documentElement['requestFullscreen']) {
                document.documentElement['requestFullscreen']();
            } else if (document.documentElement['webkitRequestFullscreen']) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement['mozRequestFullScreen']) {
                document.documentElement['mozRequestFullScreen']();
            } else if (document.documentElement['msRequestFullscreen']) {
                document.documentElement['msRequestFullscreen']();
            }
        } else {
            if (document['exitFullscreen']) {
                document['exitFullscreen']();
            } else if (document['webkitExitFullscreen']) {
                document['webkitExitFullscreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['msExitFullscreen']) {
                document['msExitFullscreen']();
            }
        }
    }

    windowClose() {
        let prevUrl = this.gmService.getPrevPage();
        this.router.navigate([prevUrl]);
    }

    loginCompleted(data) {
        this.updateHeader(true, 'header-mob/' + data);
    }
    loginFromGameWindow(data) {
        this.emitterService.broadcastLoginComplete("closeModal-loginModal/" + data);
    }
    updateHeader(regEvent, action): void {
        let button = "";
        let errorDiv = "";
        action = action.split("/");
        if (action[1]) {
            button = action[1].split("|")[0];
            errorDiv = action[1].split("|")[1];
        }
        if (regEvent && (action[0] != "reloadToHomeOnly" && action[0] != "closeModal-registerModal" && action[0] != "reloadToCheckoutOnly")) {

            Promise.resolve(this.utility.userPostLoginAction(button, errorDiv))
                .then(userDetails => {
                    if (userDetails) {
                        this.actionAfterUpdateHeader(action[0],
                            userDetails.cashDetails,
                            userDetails.currencyDetails,
                            userDetails.profileData,
                            userDetails.cashBalance,
                            userDetails.bonusBalance
                        );
                    }
                })
        } else if (action[0] == "reloadToHomeOnly") {
            this.emitterService.userDataSourceComplete("User Data Updated");
            this.router.navigate(['/']);
        } else if (action[0] == "reloadToCheckoutOnly") {
            this.emitterService.userDataSourceComplete("User Data Updated");
            this.router.navigate(['/checkout']);
        } else if (action[0] == "closeModal-registerModal") {
            let modalId = action[0].split("-");
            this.emitterService.userDataSourceComplete("User Data Updated");
            setTimeout(() => {
                this.utility.closeModal(modalId[1]);
            }, 2000)
        } else {
            Promise.resolve(this.lottodayService.getProfileBalanceCurrency())
                .then(profileBalanceCurrency => {
                    if (profileBalanceCurrency) {
                        this.actionAfterUpdateHeader(action[0],
                            profileBalanceCurrency["profile"]["balanceDetails"]["cash"] + profileBalanceCurrency["profile"]["balanceDetails"]["bonus"],
                            profileBalanceCurrency["currency"],
                            profileBalanceCurrency["profile"],
                            profileBalanceCurrency["profile"]["balanceDetails"]["cash"],
                            profileBalanceCurrency["profile"]["balanceDetails"]["bonus"]
                        );
                    }
                }
                );
        }
    }

    actionAfterUpdateHeader(action, cashDetais, currencyDetails, profileData, cashBalance, bonusBalance) {
        this.userService.setUserCurrencyCode(currencyDetails["code"]); //userCurrency = this.currency['code'];
        this.userService.setUserCurrencySymbol(currencyDetails["symbol"]); //= this.currency['symbol'];
        this.userService.setuserProfileDetails(profileData);
        this.cash = cashDetais;
        this.userService.setBonusBalance(bonusBalance);
        this.userService.setCashBalance(cashBalance);
        this.userService.setUserBalance(this.cash);

        this.profileData = profileData;
        if (action.includes("closeModal")) {
            action = action.split("-");
            if (action[1].includes("login")) {
                $("#loginModalContent").toggleClass("hide");
                $("#loginModalSuccess").toggleClass("hide").append(`<img class="otp-success-img" src="/assets/img/checkmark.svg" alt="Login Success">
          <p>Welcome Back `+ profileData.firstName + `</p>`);
            }
            setTimeout(() => {
                this.utility.closeModal(action[1]);
                $("#loginModalContent").removeClass("hide");
                $("#loginModalSuccess").addClass("hide").html('');
            }, 2000)
        }
        else if (action.includes("hideMenu")) this.hideMenu();
        else if (action.includes("reloadToHome")) this.router.navigate(['/']);
        else if (action.includes("header-mob")) this.mobileRouting('right', '/');
        else if (action.includes("reloadToCheckout")) this.router.navigate(['/checkout'], { queryParams: { "loginComplete": "true" } });
        this.emitterService.broadcastLoginStatus();
        this.emitterService.userDataSourceComplete("User Data Updated");
        this.currency = this.userService.getUserCurrencySymbol();

    }

    showLogin(): void {
        const $this = $('#myAccount');
        const $ld_menu = $('#ld_menu');
        const $ld_menu_items = $ld_menu.children('li');
        $this.addClass('slided selected');
        $this.children('ul').css('z-index', '9999').fadeTo(10, 1, function () {
            $ld_menu_items.not('.slided').children('ul').hide();
            $this.removeClass('slided');
        });
    };


    openRegistration(): void {
        this.router.navigate(['/register']);
    }

    logout(): void {
        this.realityCheckService.doLogout();
    }

    hideMenu() {
        this.utility.hideMenu("header");
    }

    mobileRouting(side, route): void {
        if (route.includes("logout")) {
            this.logout();
        } else {
            this.router.navigate([route]);
        }
        $('body').toggleClass('navOpen-' + side);
        side == 'right' ? $('.modal-body').toggleClass('modalOpenRight') : $('.modal-body').toggleClass('modalOpenLeft');
    }

    mouseEnter(div: string) {
        if (this.isLoggedIn) {
            $("#ld_overlay").hide();
        }
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            var ww = document.body.clientWidth;
            if (ww <= 992) {
                this.windowType = "mobile";
            } else {
                this.windowType = "device";
            }
        })
        var self = this;

        /* sidebar menu*/
        $('.openNav-left').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('body').toggleClass('navOpen-left');
            $('.modal-body').toggleClass('modalOpenLeft');
        });
        $('.openNav-right').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('body').toggleClass('navOpen-right');
            $('.modal-body').toggleClass('modalOpenRight');
        });
        $('.mobile-menu-items, .mobile-profile-items').click(function (e) {
            e.stopPropagation();
        });

        $("#sessionExpiredModal").bind('click', function (e) {
            if ($('.session-expiry-body').hasClass("modalOpenRight")) {
                $('body').removeClass('navOpen-right');
                $('.modal-body').toggleClass('modalOpenRight');
                e.stopPropagation();
            } else if ($('.session-expiry-body').hasClass("modalOpenLeft")) {
                $('body').removeClass('navOpen-left');
                $('.modal-body').toggleClass('modalOpenLeft');
                e.stopPropagation();
            }
        });

        $('body, html').click(function () {
            if ($("body").hasClass('navOpen-left')) {
                $('body').removeClass('navOpen-left');
                $('.modal-body').toggleClass('modalOpenLeft');
            }
            if ($("body").hasClass('navOpen-right')) {
                $('body').removeClass('navOpen-right');
                $('.modal-body').toggleClass('modalOpenRight');
            }
        })

        $("html").click(function (event) {
            if ($(event.target).closest('.language-selector').length === 0) {
                $('.dropdown').hide();
                $('.wrapper-dropdown-3').removeClass('active');
            }
        });

        var ww = document.body.clientWidth;
        if (ww > 992) {
            $(".ld_menu").on('click', '>li', function () {
                $("#ld_menu li a").addClass("active");
                $(this).children("a").removeClass("active");
                $(this).find("ul").css('display','block');

                    if($(this).children("a").attr('title') == 'Bingo') {
                        $('.dropdown-arrow').addClass('active');
                    }else{
                        $('.dropdown-arrow').removeClass('active');
                    }
            });
            $(".ld_menu>li").click(function () {
                $('.bingo-dropdown').css('display','none');
                $(this).find("span").removeClass("active");
            });
        }

        $(document).ready(function () {
            setInterval(function () {
                let date = new Date();
                let hours: any = date.getHours();
                let minutes: any = date.getMinutes()
                if (minutes <= 9) {
                    minutes = 0 + "" + minutes;
                }
                if (hours <= 9) {
                    hours = 0 + "" + hours;
                }
                $("#timeDetails").html(hours + ':' + minutes);
            }, 10)

            $("body").addClass("addMarginTop");
            if ($(".cookies-msg").length !== 0) {
                $(".myHeader").removeClass("sticky");
                $("body").removeClass("addMarginTop");
            }
            $(document).on('scroll', function () {
                var cookieHeight = $(".cookies-msg").outerHeight(true) || 0;
                var logoScrollHeight = 2 + cookieHeight;
                if ($(document).scrollTop() > logoScrollHeight) {
                    $('#logo-small').show();
                    $('#logo-image').hide();
                } else {
                    $('#logo-small').hide();
                    $('#logo-image').show();
                }
                if ($(".cookies-msg").length > 0) {
                    if ($(document).scrollTop() >= cookieHeight) {
                        $(".myHeader").addClass("sticky");
                        $("body").addClass("addMarginTop");
                        $(".myHeader").removeClass("box-shadow-style");
                    } else {
                        $(".myHeader").removeClass("sticky");
                        $("body").removeClass("addMarginTop");
                    }
                }
                if ($(document).scrollTop() == cookieHeight) {
                    $(".myHeader").removeClass("box-shadow-style");
                } else {
                    $(".myHeader").addClass("box-shadow-style");
                }
            });
        })
    }

    makePayment() {
        Promise.resolve(this.lottodayService.getLoginStatus())
            .then(data => {
                this.utility.openModal("#quickDepositModal");
                this.bonusSelect = false;
                this.paymentMethod = true;
            });
    }
    paymentComplete() {
        Promise.resolve(this.lottodayService.getLoginStatus())
            .then(data => {
                this.utility.openModal("#quickDepositModal");
                this.bonusSelect = false;
                this.paymentMethod = false;
                this.transactionSuccess = true;
                this.qDResponse = true;
            });
    }

    getActiveLang(activeLanguage) {
        this.activeLang = activeLanguage;
        this.setLanguage(this.activeLang);
    }

    changeLanguage(activeClass) {
        if (activeClass) {
            this.selectLang = false;
        } else {
            this.selectLang = true;
        }
        $('.dropdown').toggle();
    }

    setLanguage(newLanguage) {
        this.selectLang = false;
        var opt = $("#" + newLanguage).children();
        var newlang = opt.html();
        $('.selected-language-h').html(newlang);
        $('.selected-language-h').children('.lang-icon').addClass('lang-icon-h');
        $('.lang-icon-h').removeClass('lang-icon');
        $('.selected-language-h').children('.langg-text').addClass('langg-text-h');
        $('.langg-text-h').removeClass('langg-text');
        $('.selected-language-f').html(newlang);
        $('.selected-language-f').children('.lang-icon').addClass('lang-icon-f');
        $('.lang-icon-f').removeClass('lang-icon');
        $('.selected-language-f').children('.langg-text').addClass('langg-text-f');
        $('.langg-text-f').removeClass('langg-text');
        $('.dropdown').hide();
    }

    /*
      getBanners(){
         Promise.resolve(this.lottodayService.getBanners())
         .then(bannerData=>{
           console.log(bannerData);
         })
       }
   */

    ngOnDestroy() {
        this.loginCompletedEvent.unsubscribe();
    }

    togglemodal() {
        Promise.resolve(this.userService.checkUserRegistrationStatus())
        .then(loginStatus => {
        if(loginStatus== false){
            return false;
        }else{
            if (window.location.href.indexOf("myaccount/cashier") <= 0) {
            
                var ww = document.body.clientWidth;
                if (ww <= 992) {
                    //this.isModalOpen=false;
                    //this.isMobile=true;
                    this.router.navigate(['/myaccount/cashier'], { queryParams: { "type": "addFund", "prevUrl": "myaccount" } })
                } else {
                    this.isMobile = false;
                    this.isModalOpen = true;
                }
            }
        }
        });
        
    }
    receiveMessage($event) {
        if ($event == "false"){
            this.isModalOpen = false;
        }else{
            this.isModalOpen = true;
        }
    }

    gotoBingoGuide(linkType) {
        event.stopPropagation();
        switch(linkType){
            case "bingo":
            this.router.navigate(['/bingo']);   
            break;         
            case "bingoGuide":
            this.router.navigate(['/app-bingo-guides']);
            break;
            case "bingo75":
            this.router.navigate(['/what-75-bingo']);
            break;
            case "bing90":
            this.router.navigate(['/what-90-bingo']);
            break;
            case "variant":
            this.router.navigate(['/variant-bingo']);
            break;
        }
        

    }
}
