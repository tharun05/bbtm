import {Component, OnInit, ComponentFactoryResolver, ViewChild, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import {BannerComponent} from '../banner/banner.component';
import {TimerDirective} from '../app-timer/timer.directive';
import {AppTimerComponent} from '../app-timer/app-timer.component';
import * as _ from 'underscore';
import * as $ from 'jquery';
import {environment} from '../../environments/environment';
import {EmitterService} from '../services/emitter.service';
import {mixpanelService} from '../services/mixpanel.service';

@Component({
    selector: 'app-app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent implements OnInit {
    // @ViewChild(TimerDirective) timerView: TimerDirective;
    upcomingDraws
    bannerLottery;
    linePrice
    windowType;
    bannerImage;
    bannerFromCMS;
    bannerLotteryDetails;
    bannerDataFromCMS;
    popularLine;
    otherLine;
    lotteryId;
    banners;
    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered

    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private lottodayService: AppLottodayService,
        private router: Router,
        private utils: Utility,
        private emitter: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {}


    ngOnInit() {
        //this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        //let adItem = this.ads[this.currentAdIndex];
       // this.loadBanner();

        this.emitter.loadHomeBanner$.subscribe(
            () => {
                //this.loadBanner();
            }
        );
        $('#headerHomeLink').addClass('activePage');
    }

    loadBanner() {
        var self = this;
        //this.setBannerComponant(true, undefined);
        Promise
            .all([
                Promise.resolve(this.lottodayService.getBanners({'zoneId':'1'}))
              //  Promise.resolve(this.lottodayDataService.getExtendLotteries(''))
            ])
            .then(
                banners => {
                    if(banners!=null && banners.length >0){
                        let bannersTest = [banners[0]];
                        // _.each(bannersTest,function(banner){
                        //   banner.content = banner.content.replace(new RegExp('varStart_imagePlaceHolder_varEnd','g'), environment.apiUrl+'/')
                        //   // banner.content = banner.content.replace(new RegExp('data-target=""','g'), 'data-target="'+banner.targetUrl+'"');
                        //   // banner.content = banner.content.replace(new RegExp('data-target-member=""','g'), 'data-target-member="'+banner.targetMemberUrl+'"');
                        // })
                        this.banners = bannersTest;
                        setTimeout(function(){
                          let bannersButtons = $('.cm-slider__btn--cta');
                          _.each(bannersButtons,function(buttons,index){
                            $(buttons).data('target',self.banners[index].targetUrl);
                          })
                          $('.cm-slider__btn--cta').on('click',function(){
                            if( $(this).data("target") == "register"){
                              self.router.navigate(['/register']);
                            }else if($(this).data("target") == "login"){
                              self.router.navigate(['/login']);
                            }else{
                              self.router.navigate([$(this).data("target")]);
                            }
                          })
                          if(self.windowType == 'device'){
                            this.imagePath = self.banners[0]["imagePath"]
                          }else if(self.windowType == 'mobile'){
                            this.imagePath = self.banners[0]["mobileImage"]
                          }
                          // $(".bannerContainer").css({
                          //   "background":"url("+environment.apiUrl+"/uploads/banner/"+this.imagePath+") no-repeat",
                          //   "min-height": "300px",
                          //   "background-size": "100% 100%"
                          //  });
                        },1);
                      }else{
                        banners= banners;
                      }
                },
                SystemError => {

                }
            );
    }

    formBannerLotteryData() {
        let tempBannerContent = this.bannerDataFromCMS["content"];
        _.each(this.bannerLottery, function (value, key) {
            tempBannerContent = tempBannerContent.replace(new RegExp('varStart_bannerLottery.' + key + '_varEnd', 'g'), value);
        })
        _.each(this.bannerLotteryDetails, function (value, key) {
            tempBannerContent = tempBannerContent.replace(new RegExp('varStart_bannerLotteryDetails.' + key + '_varEnd', 'g'), value);
        })
        let availablePricesPopular = tempBannerContent.match(/varStart_calculateLinePopular.*_varEnd/g);
        tempBannerContent = this.calculatLinePriceforCMSBanner(availablePricesPopular, tempBannerContent);
        let availablePricesOther = tempBannerContent.match(/varStart_calculateLineOther.*_varEnd/g);
        tempBannerContent = this.calculatLinePriceforCMSBanner(availablePricesOther, tempBannerContent);

        var ww = document.body.clientWidth;
        if (ww > 767) {
            tempBannerContent = tempBannerContent.replace("<image-place-holder></image-place-holder>", `<div class="banner-img"><img src="` + environment.apiUrl + `/uploads/banner/` + this.bannerDataFromCMS["imagePath"] + `" srcset="` + environment.apiUrl + `/uploads/banner/` + this.bannerDataFromCMS["imagePath"] + ` 1x, "` + environment.apiUrl + `/uploads/banner/` + this.bannerDataFromCMS["imagePath2x"] + ` 2x" alt="` + this.bannerLottery.nameConstant + `"></div>`);
        }

        this.lotteryId = this.bannerLotteryDetails.lotteryId;
        let future = new Date(this.bannerLotteryDetails.endsOn);
        let diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
        let timer_list = this.dhms(diff);
        tempBannerContent = tempBannerContent.replace(new RegExp('varStart_timer.date_varEnd', 'g'), timer_list[0]);
        tempBannerContent = tempBannerContent.replace(new RegExp('varStart_timer.hrs_varEnd', 'g'), timer_list[1]);
        tempBannerContent = tempBannerContent.replace(new RegExp('varStart_timer.mins_varEnd', 'g'), timer_list[2]);
        tempBannerContent = tempBannerContent.replace(new RegExp('varStart_timer.secs_varEnd', 'g'), timer_list[3]);
        //this.setBannerComponant(true, tempBannerContent);
    }

    calculatLinePriceforCMSBanner(availablePrices, tempBannerContent) {
        var self = this;
        _.each(availablePrices, function (availablePrice) {
            let lineCalculationArray = availablePrice.replace("varStart_", "").replace("_varEnd", "").split(":");
            let calclulationtype = lineCalculationArray[0];
            let lineNumber = JSON.parse(lineCalculationArray[1]);
            let linePrice
            if (calclulationtype.includes("Popular") && !calclulationtype.includes("PopularPrice")) {
                let newLineNumber = self.bannerLotteryDetails.officialMinLinesPerTicket && lineNumber < self.bannerLotteryDetails.officialMinLinesPerTicket ?
                    self.bannerLotteryDetails.officialMaxLinesPerTicket : lineNumber
                linePrice = newLineNumber * self.linePrice
                tempBannerContent = tempBannerContent.replace(new RegExp(availablePrice, 'g'), newLineNumber);
                tempBannerContent = tempBannerContent.replace(new RegExp("varStart_" + calclulationtype + 'Price:' + lineNumber + "_varEnd", 'g'), linePrice);
                self.popularLine = newLineNumber;
            } else {
                let newLineNumber = self.bannerLotteryDetails.officialMaxLinesPerTicket && lineNumber > self.bannerLotteryDetails.officialMaxLinesPerTicket ?
                    self.bannerLotteryDetails.officialMaxLinesPerTicket : lineNumber
                linePrice = newLineNumber * self.linePrice
                tempBannerContent = tempBannerContent.replace(new RegExp(availablePrice, 'g'), newLineNumber);
                tempBannerContent = tempBannerContent.replace(new RegExp("varStart_" + calclulationtype + 'Price:' + lineNumber + "_varEnd", 'g'), linePrice);
                self.otherLine = newLineNumber;
            }

            //console.log(lineNumber);
        })
        return tempBannerContent;
    }

//     setBannerComponant(isLottery, cmsTemplate) {
//         var self = this;
//         let componentFactory = this.componentFactoryResolver.resolveComponentFactory(BannerComponent);
//         let viewContainerRef = this.bannerView.viewContainerRef;
//         viewContainerRef.clear();
//         let componentRef = viewContainerRef.createComponent(componentFactory);
//         (<BannerComponent> componentRef.instance).isLottery = isLottery;
//         (<BannerComponent> componentRef.instance).linePrice = this.linePrice;
//         (<BannerComponent> componentRef.instance).bannerLotteryDetails = this.bannerLotteryDetails;
//         (<BannerComponent> componentRef.instance).bannerLottery = this.bannerLottery;
//         cmsTemplate && cmsTemplate != "image" ? (<BannerComponent> componentRef.instance).cmsTemplate = cmsTemplate : cmsTemplate == "image" ? (<BannerComponent> componentRef.instance).cmsTemplate = '.' : '';
//         (<BannerComponent> componentRef.instance).otherLine = this.otherLine;
//         (<BannerComponent> componentRef.instance).popularLine = this.popularLine;
//         (<BannerComponent> componentRef.instance).lotteryId = this.lotteryId;
//         if (cmsTemplate && cmsTemplate != "") {
//             setTimeout(function () {
//                 $("#cmsTemplateHolder").html(cmsTemplate);
//                 if (isLottery) {
//                     setInterval(function () {
//                         let future = new Date(self.bannerLotteryDetails.endsOn);
//                         let diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
//                         let timer_list = self.dhms(diff);
//                         $("#bannerTimerDate").html(timer_list[0] + "<span>days</span>")
//                         $("#bannerTimerHour").html(timer_list[1] + "<span>hrs</span>")
//                         $("#bannerTimerMin").html(timer_list[2] + "<span>mins</span>")
//                         $("#bannerTimerSecs").html(timer_list[3] + "<span>secs</span>")
//                     }, 1000);
//                 } else {
//                     let imagePath;
//                     if (self.windowType == 'device') {
//                         imagePath = self.bannerDataFromCMS["imagePath"]
//                     } else if (self.windowType == 'mobile') {
//                         imagePath = self.bannerDataFromCMS["mobileImage"]
//                     }
//                     $("#cmsTemplateHolder").data("url", self.bannerDataFromCMS["targetUrl"]);

//                     $("#cmsTemplateHolder").css({
//                         "background": "url(" + environment.apiUrl + "/uploads/banner/" + imagePath + ") no-repeat",
//                         "min-height": "300px",
//                         "background-size": "100% 100%"
//                     });
// //                    console.log($("#cmsTemplateHolder").data("url"));
//                     $("#cmsTemplateHolder").on('click', function (e) {
//                         if ($(this).data("url") && $(this).data("url") != "") {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             self.router.navigate([$(this).data("url")]);
//                         }
//                     })
//                     // $("#heyTag").on('click',function(e){
//                     //   e.preventDefault();
//                     //   e.stopPropagation();
//                     //   self.router.navigate(["/login"]);
//                     // })
//                 }
//             }, 1)
//         }
//     }
    //`+environment.apiUrl+`"uploads/banner`+this.bannerDataFromCMS["imagePath1x"]+`

    dhms(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;

        return [
            ('0' + days).slice(-2),
            ('0' + hours).slice(-2),
            ('0' + minutes).slice(-2),
            ('0' + seconds).slice(-2)
        ]
    }

    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('feturedlogic', type, gameName));
    }

    setBannerLottery(isCMSBanner) {
        //this.setBannerComponant(true, "")
        // if (this.lottodayDataService.extendendLotteries_map[this.bannerLottery.lotteryId] && this.lottodayDataService.extendendLotteries_map[this.bannerLottery.lotteryId]["standardplay"]) {
        //     this.bannerLotteryDetails = this.lottodayDataService.extendendLotteries_map[this.bannerLottery.lotteryId];
        //     this.linePrice = this.bannerLotteryDetails.standardplay.deliveries[0]['b2CLinePrices'][this.bannerLotteryDetails.currencyCode.toLowerCase()].price;
        //     if (isCMSBanner) {
        //         this.formBannerLotteryData();
        //     } else {
        //         this.setBannerComponant(true, "")
        //     }
        //
        // } else {
        //     //Promise.resolve(this.lottodayDataService.getStandardPlayDetails(this.bannerLottery.lotteryId))
        //         .then(resp => {
        //             if (resp) {
        //                 this.bannerLotteryDetails = resp;
        //                 this.linePrice = this.bannerLotteryDetails.standardplay.deliveries[0]['b2CLinePrices'][this.bannerLotteryDetails.currencyCode.toLowerCase()].price;
        //                 if (isCMSBanner) {
        //                     this.formBannerLotteryData();
        //                 } else {
        //                     this.setBannerComponant(true, "")
        //                 }
        //             }
        //         });
        // }
    }

    ngOnDestroy() {
        $('#headerHomeLink').removeClass('activePage');
    }
}
