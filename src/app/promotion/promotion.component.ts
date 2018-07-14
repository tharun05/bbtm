import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';
@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  promotions;
  tempImagePath= environment.apiUrl+"/uploads/promotion/";
  bannersPromotion;
  constructor(private router:Router,
    private lottodayService:AppLottodayService) { }


  ngOnInit() {
    $('#headerPromotionLink').addClass('activePage');
    Promise.resolve(this.lottodayService.getPromotionsData())
    .then(
      promotionsData =>{
        this.promotions = promotionsData;
        //this.masonryLayout();
      }
    )
    let self = this;
      Promise.resolve(this.lottodayService.getBanners({'zoneId':'2'}))
      .then(
        banners=>{
            if(banners!=null && banners.length >0){
              banners= banners;

            let bannersTest = banners;
            // _.each(bannersTest,function(banner){
            //   banner.content = banner.content.replace(new RegExp('varStart_imagePlaceHolder_varEnd','g'), environment.apiUrl+'/uploads/banner/'+banner.imagePath);
            // })
            this.bannersPromotion = bannersTest;
            setTimeout(function(){
              let bannersButtons = $('.readMore_banner_button');
              _.each(bannersButtons,function(buttons,index){
                $(buttons).data('target',self.bannersPromotion[index].targetUrl);
              })
              $('.readMore_banner_button').on('click',function(){
                if( $(this).data("target") == "register"){
                  self.router.navigate(['/register']);
                }else if($(this).data("target") == "login"){
                  self.router.navigate(['/login']);
                }else{
                  console.log($(this).data("target"));
                  let path=$(this).data("target");
                  self.router.navigate([path])
                }
              })
            },1);
          }else{
            this.bannersPromotion= banners;
          }
        }
      )
  }

  ngOnDestroy(){
    $('#headerPromotionLink').removeClass('activePage');
  }
  loadPromoContent(index){
    this.router.navigate(["promotionsContent/"+index])
  }

}
