import {Component, OnInit, HostListener, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {Utility} from '../utils/utility';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import {SlotsPipe} from "../slots.pipe";
import {UserDetailsService} from '../services/user-details.service';
import {GameWindowService} from '../game-window/gameWindow.service';
import {environment} from '../../environments/environment';
import {ScrollEvent} from 'ngx-scroll-event';

@Component({
    selector: 'app-app-slots',
    templateUrl: './app-slots.component.html',
    styleUrls: ['./app-slots.component.scss']
})
export class AppSlotsComponent implements OnInit, AfterViewInit {
    gamesData: any;
    slotsData: any;
    allSlotsData: any;
    activeTab = 'featuredgames';
    slotsGamePlayId;
    windowType;
    searchText;
    showResult: boolean = false;
    featuredLength: number = 0;
    videoLength: number = 0;
    classicLength: number = 0;
    tableLength: number = 0;
    videoPokerLength: number = 0;
    allGamesLength: number = 0;
    gamesLength: number = 0;
    gameType: string;
    siteUrlPath: string = environment.apiUrl;
    gameUrlPath: string = environment.gamePath;
    currentPage: boolean = false;
    buttonText: string = 'Try Game';
    start = 0;
    end = 12;
    offset = 12;
    @HostListener('window:resize') onResize() {
        let ww = document.body.clientWidth;
        if (ww <= 1024) {
            this.windowType = "mobile";
        } else {
            this.windowType = "device";
        }
    }
    constructor(
        private slotsPipe: SlotsPipe,
        private router: Router,
        private gmService: GameWindowService,
        private userService: UserDetailsService,
        private utils: Utility
    ) {}

    ngOnInit() {
        if(!$(".casino-footer").hasClass('active')){
            $(".casino-footer").addClass('active');
        }
        if (this.router.url === '/casino') {
            this.currentPage = true;
            $('#headerSlotsLink').addClass('activePage');
        }
        if (this.utils.isUserLoggedIn()) {
            this.buttonText = 'Play Game';
        }
        Promise.resolve(this.gmService.getAllCasinoGames()).then(allGames => {
            this.allSlotsData = allGames;
            this.loadGames(this.activeTab);
            this.featuredLength = this.slotsPipe.transform(allGames, "isFeatured", true).length;
            this.videoLength = this.slotsPipe.transform(allGames, 'gameType', "video_slots").length;
            this.classicLength = this.slotsPipe.transform(allGames, 'gameType', "classic_slots").length;
            this.tableLength = this.slotsPipe.transform(allGames, 'gameType', "table_slots").length;
            this.videoPokerLength = this.slotsPipe.transform(allGames, 'gameType', "video_poker").length;
            this.allGamesLength = allGames.length;
        });
    }

    // casino games launcher
    gameLauncher(gameType, gameId): void {
        let ww = document.body.clientWidth;
        this.gmService.setPrevPage("/casino");
        if (ww <= 1024) {
            if (this.userService.getuserProfileDetails()) {
                this.router.navigate(['/gamePlay'], {queryParams: {"gameCode": gameId, "gameType": gameType}});
            } else {
                this.router.navigate(["login"])
            }
        } else {
            this.router.navigate(['/gamePlay'], {queryParams: {"gameCode": gameId, "gameType": gameType}});
        }
    }

    // casino games search game launcher
    openSearchResultGames(gameId) {
        this.utils.isUserLoggedIn() ? this.gameLauncher("realgames", gameId) : this.gameLauncher("freegames", gameId);
    }


    ngAfterViewInit() {
        setTimeout(_ => {
            var ww = document.body.clientWidth;
            if (ww <= 1024) {
                this.windowType = "mobile";
            } else {
                this.windowType = "device";
            }
        })
        setTimeout(function () {
            $('#headerSlotsLink').addClass('activePage');
        }, 100)
    }

    valuechange(newValue) {
        this.searchText = newValue;
        this.showResult = true;
        if (this.searchText === '') {
            this.showResult = false;
        }
    }

    loadGames(tab) {
        this.start = 0;
        this.end = this.offset;
        switch(tab){
          case 'featuredgames':
              this.gamesData = this.slotsPipe.transform(this.allSlotsData, "isFeatured", true);
              this.gamesLength = this.gamesData.length;
              break;
          case 'videoslots':
              this.gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "video_slots");
              this.gamesLength = this.gamesData.length;
              break;
          case 'classicslots':
              this.gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "classic_slots");
              this.gamesLength = this.gamesData.length;
              break;
          case 'tableslots':
              this.gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "table_slots");
              this.gamesLength = this.gamesData.length;
              break;
          case 'videopoker':
              this.gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "video_poker");
              this.gamesLength = this.gamesData.length;
              break;
          default:
              this.gamesData = this.allSlotsData;
              this.gamesLength = this.gamesData.length;
              break;
        }
        this.slotsData = this.gamesData.slice(this.start,this.end);
        this.activeTab = tab;
    }

    handleScroll(event: ScrollEvent) {
        if (event.isReachingBottom) {
            this.end = this.end + this.offset;
            if(this.gamesLength < this.end){
              this.end = this.gamesLength;
            }
            this.slotsData = this.gamesData.slice(this.start,this.end);
        }
    }

    ngOnDestroy() {
        if($(".casino-footer").hasClass('active')){
            $(".casino-footer").removeClass('active');
        }
        $('#headerSlotsLink').removeClass('activePage');
    }

}
