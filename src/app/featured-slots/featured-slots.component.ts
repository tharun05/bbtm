import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserDetailsService } from '../services/user-details.service';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import 'isotope-layout/dist/isotope.pkgd.js';
import { SlotsPipe } from "../slots.pipe";
import { GameWindowService } from '../game-window/gameWindow.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-featured-slots',
  templateUrl: './featured-slots.component.html',
  styleUrls: ['./featured-slots.component.scss']
})
export class FeaturedSlotsComponent implements OnInit, AfterViewInit {
  slotsData:any;
  slotsGamePlayId;
  windowType;
  siteUrlPath:string = environment.apiUrl;
  gameUrlPath:string = environment.gamePath;
  @HostListener('window:resize') onResize() {
    var ww = document.body.clientWidth;
    if(ww <= 1024){
      this.windowType = "mobile";
    }else{
      this.windowType = "device";
    }
  }

  constructor(
    private slotsPipe:SlotsPipe,
    private router: Router,
    private gmService: GameWindowService,
    private userService : UserDetailsService
  ) { }

  ngOnInit() {
    Promise.resolve(this.gmService.getAllCasinoGames()).then(allGames => {
      this.slotsData = this.slotsPipe.transform(allGames,"isFeatured",true)
      setTimeout(function(){
        $('.masonryContentBlock').isotope({
        itemSelector: '.grid-blks',
        percentPosition: true,
        masonry: {
          columnWidth: '.grid-size'
        }
      })
      },100);
      this.slotsData = this.slotsData.slice(0,8);
    })
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

  // casino games launcher
  gameLauncher(gameType,gameId):void{
    let ww = document.body.clientWidth;
    if(ww <= 1024){
      if(this.userService.getuserProfileDetails()){
        this.router.navigate(['/gamePlay'],{queryParams:{"gameCode":gameId, "gameType": gameType}});
      } else {
        this.router.navigate(["login"])
      }
    } else {
      this.router.navigate(['/gamePlay'],{queryParams:{"gameCode":gameId, "gameType": gameType}});
    }
  }

}
