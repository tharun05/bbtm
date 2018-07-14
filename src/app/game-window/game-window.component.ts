import { Component, OnInit, ViewEncapsulation,HostListener,OnDestroy,AfterViewInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { EmitterService } from '../services/emitter.service';
import { Observable, Subscription} from 'rxjs/Rx';
import { UserDetailsService } from '../services/user-details.service';
import { RealityCheckService } from '../services/reality-check.service';
import { Utility } from '../utils/utility';
import { GameWindowService } from '../game-window/gameWindow.service';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../environments/environment';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameWindowComponent implements OnInit,OnDestroy,AfterViewInit {
  isLoggedIn:boolean;
  windowType;
  loginCompletedEvent;
  gameId;
  gameType;
  hideSuccess;
  qDResponse;
  userCurrency;
  gamePathUrl;
  paymentMethod: boolean = false;
  isModalOpen: boolean=false;
  isMobile;
  totalPrice=10;
  @HostListener('window:resize') onResize() {
    let ww = document.body.clientWidth;
    if(ww <= 1024){
      this.windowType = "mobile";
    }else{
      this.windowType = "device";
    }
  }

  constructor(
    private lottodayService: AppLottodayService,
    private emitterService: EmitterService,
    private router:Router,
    private utility:Utility,
    private gmService: GameWindowService,
    private activatedRoute:ActivatedRoute,
    private userDetailService:UserDetailsService
  ) {
    this.emitterService.updateLoginStatus$.subscribe(
      loginStatus => {
        this.isLoggedIn = JSON.parse(loginStatus);
      }
    );
    this.loginCompletedEvent =  emitterService.loginComplete$.subscribe(
    message => {
      this.gmService.switchInputStatus = true;
      this.gmService.loadGame('realgames',this.gameId);
    });


    this.emitterService.qDResponse$.subscribe(resp=>{
     this.userCurrency = this.userDetailService.getCurrencyCode();
     this.qDResponse = resp;
     this.paymentMethod = false;
     console.log(resp)
    })


  }

  ngOnInit() {
    // On Refresh load Casino gameType
    this.isLoggedIn = this.utility.isUserLoggedIn();
    this.activatedRoute.queryParamMap.subscribe(queryParams =>{
        this.gameId = queryParams.get('gameCode');
        this.gameType = queryParams.get('gameType');
        let minislot = queryParams.get('minislot');
        if(this.utility.isUserLoggedIn()){
          this.gmService.loadGame(this.gameType.includes("realgames") ? "realgames" : "freegames" ,this.gameId ,minislot? minislot:'');
        }else if(this.gameType.includes("freegames") ){
          this.gmService.loadGame("freegames" ,this.gameId,minislot? minislot:'');
        }else{
          this.gmService.loadGame("freegames" ,this.gameId,minislot? minislot:'');
        }
        this.gamePathUrl = environment.apiUrl+"/"+environment.gamePath+"/"+this.gameId+"/"+this.gameId+"-bg-image.jpg";
    });

  }

  ngAfterViewInit(){
    setTimeout(_=>{
      var ww = document.body.clientWidth;
      if(ww <= 1024){
        this.windowType = "mobile";
      }else{
        this.windowType = "device";
      }
    })
  }

  openQuickDeposit(){
    if(this.utility.isUserLoggedIn()){
      Promise.resolve(this.userDetailService.checkUserRegistrationStatus())
      .then(loginStatus => {
          if(loginStatus== false){
            return false;
          }else{
            var ww = document.body.clientWidth;
            if (ww <= 992) {
                // this.isModalOpen=false;
                // this.isMobile=true;
                this.router.navigate(['/myaccount/cashier'], {queryParams: {"type": "addFund", "prevUrl": "myaccount"}})
            } else {
                this.isMobile=false;
                this.isModalOpen=true;
            }
          }
      });
    }else{
      this.openPageOrModal('login','loginModal');
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
    if (modalId == "quickDepositGameModal") {
        this.paymentMethod = false;
        $("#quickDepositGameModal #quickModalSuccess").addClass("hide");
        $("#quickDepositGameModal #quickModalFailure").addClass("hide");
        $("#quickDepositGameModal").find('.deposit-btn').removeClass("btn-progress").removeAttr("disabled");
    }
  }

  ngOnDestroy(){
    this.loginCompletedEvent.unsubscribe();
  }

  toggleGameDepositmodal(){
    Promise.resolve(this.userDetailService.checkUserRegistrationStatus())
    .then(loginStatus => {
        if(loginStatus== false)
        return false;
    });
    var ww = document.body.clientWidth;
    if (ww <= 992) {
        // this.isModalOpen=false;
        // this.isMobile=true;
        this.router.navigate(['/myaccount/cashier'], {queryParams: {"type": "addFund", "prevUrl": "myaccount"}})
    } else {
        this.isMobile=false;
        this.isModalOpen=true;
    }
  }
  receiveMessage($event) {
      if($event =="false"){
          this.isModalOpen = false;
      }else{
            this.isModalOpen = true;
      }
  }

}
