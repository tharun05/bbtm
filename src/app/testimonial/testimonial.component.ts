import { Component, OnInit,AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { AppLottodayService } from '../app-lottoday.service';
import { GameWinHistoryService} from "./../services/game-win-history.service";

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {

  winnersList: any = [];
  constructor(private lottodayService:AppLottodayService,
    private gameWinHistoryService:GameWinHistoryService) { }

  ngOnInit() {

    let data = {
      type: ['bingo','casino'],
      timeframe: 'monthly'
    };

    Promise.resolve(this.lottodayService.getTestimonials(data))
      .then(testimonials => {
          if(testimonials.winners && testimonials.winners.winnersListDetails){
              this.winnersList = testimonials.winners.winnersListDetails;
              this.gameWinHistoryService.setWinHistoryList(this.winnersList);
              if(testimonials && testimonials.winners){
                this.gameWinHistoryService.setTotalGames(testimonials.winners.gameDataList)
              }
              this.testimonialScroll();
          }
      });

      this.gameWinHistoryService.winListResponse$.subscribe(data =>{
        this.winnersList = data;
      })
      
  }

  testimonialScroll(){
    $(document).ready(function(){
      
      if($(window).width() < 321){
        $(".go-left").click(function() {
            $('.testimonials').animate({
                scrollLeft: '-=320'
            }, 500);
        });
  
        $(".go-right").click(function() {
            $('.testimonials').animate({
                scrollLeft: '+=320'
            }, 500);
        });
      }

      else if($(window).width() > 320 && $(window).width() < 376 ) {
        $(".testimonialCard").css('width', '+=54px');
        $(".go-left").click(function() {
            $('.testimonials').animate({
                scrollLeft: '-=394'
            }, 500);
        });
  
        $(".go-right").click(function() {
            $('.testimonials').animate({
                scrollLeft: '+=394'
            }, 500);
        });
      }

      else if($(window).width() > 376 && $(window).width() < 415 ) {
        $(".testimonialCard").css('width', '+=94px');
        $(".go-left").click(function() {
            $('.testimonials').animate({
                scrollLeft: '-=413'
            }, 500);
        });
  
        $(".go-right").click(function() {
            $('.testimonials').animate({
                scrollLeft: '+=413'
            }, 500);
        });
      }

      else{
        $(".go-left").click(function() {
            $('.testimonials').animate({
                scrollLeft: '-=406'
            }, 500);
        });
  
        $(".go-right").click(function() {
            $('.testimonials').animate({
                scrollLeft: '+=406'
            }, 500);
        });
      }

      window.addEventListener("orientationchange", function() {
        if($(window).width() > 320 && $(window).width() < 376 ){
          $(".testimonialCard").css('width', '311px');
        }
        else if($(window).width() > 600 && $(window).width() < 668 ){
          $(".testimonialCard").css('width', '346px');
        }

        else if($(window).width() > 730 && $(window).width() < 737 ) {
          $(".testimonialCard").css('width', '386px');
        }
        else if($(window).width() > 376 && $(window).width() < 415 ) {
          $(".testimonialCard").css('width', '346px');                   
        }
        
        else if($(window).width() > 320 && $(window).width() < 376 ){
          $(".testimonialCard").css('width', '311px');
        }
        else if($(window).width() > 800 && $(window).width() < 815 ){
          $(".testimonialCard").css('width', '346px');
        }
      }, false);

    });
  }


}
