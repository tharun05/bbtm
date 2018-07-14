import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";
import { GameWindowService } from '../game-window/gameWindow.service';
import { SlotsPipe } from '../slots.pipe';
import { environment } from '../../environments/environment';

import * as $ from 'jquery';
import { UserDetailsService } from '../services/user-details.service';
import { EmitterService } from '../services/emitter.service';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-mini-slot',
  templateUrl: './app-minislot.component.html',
  styleUrls: ['./app-minislot.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppMiniSlotComponent implements OnInit,AfterViewInit{
  private featuredLength;
  private allSlotsData;
  private featuredCasioGames;
  private siteUrlPath: string = environment.apiUrl;
  private gameUrlPath: string = environment.gamePath;
  isLoggedIn;
  loginCompletedEvent

  constructor(private utils: Utility,
    private slotsPipe: SlotsPipe,
    private router: Router,
    private userService: UserDetailsService,
    private gmService: GameWindowService, 
    private emitterService:EmitterService
  ) {

    let domelem = $(".ld-footer").hide();
    this.initailStep();
    this.loginCompletedEvent = emitterService.loginComplete$.subscribe(
      message => {
        this.isLoggedIn = this.utils.isUserLoggedIn();
      });
  }

  ngOnInit() {
    this.isLoggedIn = this.utils.isUserLoggedIn();
    Promise.resolve(this.gmService.getAllCasinoGames()).then(allGames => {
      this.allSlotsData = allGames;
      this.featuredLength = this.slotsPipe.transform(this.allSlotsData, "isFeatured", true).length;
      this.featuredCasioGames = this.slotsPipe.transform(this.allSlotsData, "isFeatured", true);
    });

  }

  gameLauncher(gameType, gameId): void {
    let ww = document.body.clientWidth;
    this.gameOpened();
    if (ww <= 1024) {
      if (this.userService.getuserProfileDetails()) {
        this.router.navigate(['/gamePlay'], { queryParams: { "gameCode": gameId, "gameType": gameType,"minislot":1 } });
      } else {
        this.router.navigate(["login"])
      }
    } else {
      this.router.navigate(['/gamePlay'], { queryParams: { "gameCode": gameId, "gameType": gameType,"minislot":1 } });
    }
  }

  ngAfterViewInit(){
   this.gameLoaded();
  }


 private targetWindow;
  initailStep() {
    window.addEventListener("message", this.receiveMessage, false);

  }
  gameLoaded() {
    window.parent.postMessage("open-lobby", "*");

  }

  gameOpened() {
    window.parent.postMessage("open-game", "*");
  }

  gameClosed() {
    window.parent.postMessage("close-game", "*");
  }

  receiveMessage(event) {
    if (event) {
      console.log("message posted are-origin:", event,event.origin, "post data:", event.data)
    } else {
      console.log("something went wrong!!");
    }
  }

  ngOnDestroy(){
    this.loginCompletedEvent.unsubscribe();
  }
}

