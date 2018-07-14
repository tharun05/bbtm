import { Injectable ,OnInit, OnDestroy} from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../utils/utility';
import { UserDetailsService } from '../services/user-details.service';
import { EmitterService } from '../services/emitter.service';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Injectable()
export class GameWindowService implements OnInit, OnDestroy {
  switchInputStatus: boolean;
  gameId;
  gameTypeVal;
  loginCompletedEvent;
  isLoggedIn;
  gameType;
  allSlotsData;
  userCurrency;
  qDResponse;

  previousPage: string = "/casino";
  constructor(
    private lottodayService :AppLottodayService,
    private emitterService: EmitterService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private utility:Utility,
    private userService:UserDetailsService
  ){
    this.emitterService.qDResponse$.subscribe(resp=>{
      this.userCurrency = this.userService.getCurrencyCode();
      this.qDResponse = resp;
      console.log(resp);
  })
  }

  ngOnInit() {
  }

  getAllCasinoGames(){
    if(this.allSlotsData) {
      return this.allSlotsData;
    } else{
      return Promise.resolve(this.lottodayService.getCasinoGames()).then(allGames => {
        this.allSlotsData = allGames;
        return this.allSlotsData;
      })
    }
  }

  // casino games Gamelauncher function
  loadGame(gameType,gameId,minislot?):void{
    Promise.resolve(this.lottodayService.lauchGame(gameType,gameId,minislot)).then(resp => {
      let $iframe;

      resp = resp.gameDetails;

      let ww = document.body.clientWidth;
        if(ww <= 1024 && resp && resp['url']){
          window.location.href = resp['url'];
          return;
        }

      if(gameType == "realgames"){
        $("#practiceRealToggle").addClass("checked");
        this.switchInputStatus = true;
        if (resp["url"]) {
          $iframe = $('<iframe name="gamePlayIframe" id="gamePlayIframe" src="'+resp["url"]+'"></iframe>');
        } else if(resp.length > 10) {
          $iframe = $('<iframe name="gamePlayIframe" id="gamePlayIframe" src='+resp+'></iframe>');
        } else if (resp == "session expired") {
          $iframe = "<h1>"+resp+". Please Login.</h1>";
        } else if(resp && (resp["problem_loading"] || resp["unable_to_find_game"])){
          $iframe = "<h1 style='color:white'>"+resp["problem_loading"]+" "+resp["unable_to_find_game"]+"</h1>";
        } else {
          $iframe = "<h1 style='color:white'>"+resp+"</h1>";
        }
        $("#gameIframeWrapper").html('');
        $("#gameIframeWrapper").append($iframe);
      } else {
        $("#practiceRealToggle").removeClass("checked");
        this.switchInputStatus = false;
        if (resp["url"]) {
          $iframe = $('<iframe name="gamePlayIframe" id="gamePlayIframe" src="'+resp["url"]+'"></iframe>');
        } else if (resp == "session expired") {
          $iframe = "<h1>"+resp+". Please Login.</h1>";
        } else if(resp && (resp["problem_loading"] || resp["unable_to_find_game"])){
          $iframe = "<h1 style='color:white'>"+resp["problem_loading"]+" "+resp["unable_to_find_game"]+"</h1>";
        } else {
          $iframe = "<h1 style='color:white'>"+resp+"</h1>";
        }
        $("#gameIframeWrapper").html('')
        $("#gameIframeWrapper").append($iframe);
      }
    })
   }

   // Onload casino Gamewindow update switchButtonToggle
   slotsOnLoad() {
       if(this.utility.isUserLoggedIn()){
         this.loadGame("realgames",this.gameId)
       } else {
         this.loadGame("freegames",this.gameId)
       }
   }

   // On click switch button in Gamewindow Toggle Practice and Real
   switchButtonToggle(type,gameId){
     if((!type && this.switchInputStatus) || type == 'freegames'){
       this.switchInputStatus = false;
       this.loadGame('freegames',gameId);
     } else if((!type && !this.switchInputStatus) || type == 'realgames'){
       if(this.utility.isUserLoggedIn()){
         this.switchInputStatus = true;
         this.loadGame('realgames',gameId);
       }else{
         this.openPageOrModal('login','loginModal');
       }
     }else{

     }
   }

   openPageOrModal(page,modalId){
     if(document.body.clientWidth <= 992){
       this.router.navigate([page])
     }else{
       this.openModal(modalId);
     }
   }

   openModal(modalId): void {
     this.utility.openModal(modalId);
   }

   closeModal(modalId): void {
     this.utility.closeModal(modalId);
   }

   setPrevPage(page): void {
     this.previousPage = page;
   }

   getPrevPage(){
     return this.previousPage;
   }

   ngOnDestroy(){
     this.loginCompletedEvent.unsubscribe();
   }
}
