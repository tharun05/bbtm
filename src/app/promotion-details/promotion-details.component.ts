import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLottodayService } from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import * as $ from 'jquery';
import * as _ from 'underscore';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html',
  styleUrls: ['./promotion-details.component.scss']
})
export class PromotionDetailsComponent implements OnInit {
  isPageAvailable;
  loader = true;
  promoId;
  isUserLoggedIn: boolean = false;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private lottodayService:AppLottodayService,
    private utils: Utility
  ) { }

  ngOnInit() {
    this.isUserLoggedIn = this.utils.isUserLoggedIn();
  }
  ngAfterViewInit(){
    $('#headerPromotionLink').addClass('activePage');
    this.activatedRoute.params.subscribe(
      params=>{
        this.promoId = params.index;
        // params["promoId"];
        this.loader = true;
        var self = this;
        Promise.resolve(this.lottodayService.getIndexedPromotionData())
        .then(
          promotionsData =>{
            this.loader = false;
            let promo=this.promoId;
            if(promotionsData && promotionsData[this.promoId] && promotionsData[this.promoId]["content"]){
              this.isPageAvailable = true;
              setTimeout(function(){
                // promotionsData[promo].content = promotionsData[promo].content.replace(new RegExp('promotionsImagePath','g'), environment.apiUrl);
                promotionsData[promo].content = promotionsData[promo].content.replace(new RegExp('promoheading','g'), promotionsData[promo].title)
                $("#promoViewContent").html(promotionsData[promo].content);
              },1);
              setTimeout(function(){
                let bannersButtons = $('.promotionbutton');
                _.each(bannersButtons,function(buttons,index){
                  if($(buttons).hasClass('registerbutton'))
                    $(buttons).data('target','register');
                  if($(buttons).hasClass('depositButton'))
                    $(buttons).data('target','deposit');
                  if($(buttons).hasClass('loginButton'))
                    $(buttons).data('target','login');
                })
                $('.promotionbutton').on('click',function(){
                  if( $(this).data("target") == "register"){
                    self.router.navigate(['/register']);
                  }else if($(this).data("target") == "login"){
                    self.router.navigate(['/login']);
                  }else if($(this).data("target") == "deposit"){
                    self.router.navigate(['/deposit']);
                  }
                })
              },3);
            }else{
              this.isPageAvailable = false;
            }
          }
        )
      }
    )
  }

}
