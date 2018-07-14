import { Component, OnInit, HostListener,Input, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import * as _ from 'underscore';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BannerComponent implements OnInit {
  upcomingDraws;
  bannerLottery;
  nameConstant;
  //@Input() bannerLottery;
  @Input() bannerLotteryDetails;
  @Input() isLottery;
  @Input() linePrice;
  @Input() cmsTemplate;
  @Input() otherLine
  @Input() popularLine
  @Input() lotteryId
  windowType;
  bannerImage;
  bannerFromCMS;
  banners;
  siteUrl: string = environment.apiUrl;
  @HostListener('window:resize') onResize() {
    // guard against resize before view is rendered
    var ww = document.body.clientWidth;
    if(ww <= 992){
      if(ww <= 767){
        this.bannerImage = false;
      }else{
        this.bannerImage = true;
      }
      this.windowType = "mobile";
    }else{
      this.windowType = "device";
    }
  }
  constructor(private lottodayService:AppLottodayService,private router:Router,private utils:Utility) { }

  ngOnInit() {
    var self = this;
    self.bannerLottery={
        nameConstant: 'BannerImg@3x'
    }
    $(document).on('click','#bannerPlayButton',function(){
      self.playDeviceCheck(self.lotteryId);
    })
    $(document).on('click','#fastCheckoutPopular',function(){
      self.openTicket(self.popularLine,self.lotteryId);
    })
    $(document).on('click','#fastCheckoutOther',function(){
      self.openTicket(self.otherLine,self.lotteryId);
    });
    this.loadBanner();
  }



  ngAfterViewInit(){
    setTimeout(_=>{
      var ww = document.body.clientWidth;
      if(ww <= 992){
        if(ww <= 767){
          this.bannerImage = false;
        }else{
          this.bannerImage = true;
        }
        this.windowType = "mobile";
      }else{
        this.windowType = "device";
      }
    })
  }

  openTicket(lineNumber,lotteryId): void{
    this.router.navigate(['/selection/standardplay/'+lotteryId],{ queryParams: { lineNumber: lineNumber } });
  }

  playDeviceCheck(id): void {
    this.utils.playDeviceCheck('', id,false);
  }
  loadBanner() {
    var self = this;
    Promise
        .all([
            Promise.resolve(this.lottodayService.getBanners({'zoneId':'1'}))
          //  Promise.resolve(this.lottodayDataService.getExtendLotteries(''))
        ])
        .then(
            banners => {
                if(banners!=null && banners.length >0 && banners[0].length>0){
                    let bannersTest =[ banners[0][0]];
                     _.each(bannersTest,function(banner){
                     banner.content = banner.content.replace(new RegExp('siteUrl','g'), environment.apiUrl)
                    //   // banner.content = banner.content.replace(new RegExp('data-target=""','g'), 'data-target="'+banner.targetUrl+'"');
                    //   // banner.content = banner.content.replace(new RegExp('data-target-member=""','g'), 'data-target-member="'+banner.targetMemberUrl+'"');
                     })
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
                        this.imagePath = self.banners["imagePath"]
                      }else if(self.windowType == 'mobile'){
                        this.imagePath = self.banners["mobileImage"]
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
}
