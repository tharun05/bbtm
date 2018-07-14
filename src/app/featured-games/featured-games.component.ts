import {Component, OnInit, HostListener, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {Utility} from '../utils/utility';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import 'isotope-layout/dist/isotope.pkgd.js';
import {SlotsPipe} from "../slots.pipe";
import {UserDetailsService} from '../services/user-details.service';
import {GameWindowService} from '../game-window/gameWindow.service';
import {environment} from '../../environments/environment';
import {EmitterService} from '../services/emitter.service';

@Component({
    selector: 'app-featured-games',
    templateUrl: './featured-games.component.html',
    styleUrls: ['./featured-games.component.scss']
})
export class FeaturedGamesComponent implements OnInit {

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
    siteUrlPath: string = environment.apiUrl;
    gameUrlPath: string = environment.gamePath;
    isLoggedIn: boolean = false;
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
        private emitterService: EmitterService,
        private utils: Utility
    ) {
          emitterService.updateLoginStatus$.subscribe(
              loginStatus => {
                  this.isLoggedIn = JSON.parse(loginStatus);
              }
          );
    }

    ngOnInit() {
        this.isLoggedIn = this.utils.isUserLoggedIn();
        Promise.resolve(this.gmService.getAllCasinoGames()).then(allGames => {
            this.allSlotsData = allGames;
            this.loadGames('featuredgames');
            this.featuredLength = this.slotsPipe.transform(this.allSlotsData, "isFeatured", true).length;
            this.videoLength = this.slotsPipe.transform(this.allSlotsData, 'gameType', "video_slots").length;
            this.classicLength = this.slotsPipe.transform(this.allSlotsData, 'gameType', "classic_slots").length;
            this.tableLength = this.slotsPipe.transform(this.allSlotsData, 'gameType', "table_slots").length;
            this.videoPokerLength = this.slotsPipe.transform(this.allSlotsData, 'gameType', "video_poker").length;
        })
    }

    // casino games launcher
    gameLauncher(gameType, gameId): void {
        let ww = document.body.clientWidth;
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

    masonryLayout() {

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
    }

    valuechange(newValue) {
        this.searchText = newValue;
        this.showResult = true;
        if (this.searchText === '') {
            this.showResult = false;
        }
    }

    loadGames(tab) {
        let gamesData;
        let start = 0;
        let end = 10;
        this.removeClass();
        switch(tab){
          case 'featuredgames':
              gamesData = this.slotsPipe.transform(this.allSlotsData, "isFeatured", true);
              break;
          case 'videoslots':
              gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "video_slots");
              break;
          case 'newgames':
              gamesData = this.slotsPipe.transform(this.allSlotsData, "isNew", true);
              break;
          case 'tableslots':
              gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "table_slots");
              break;
          case 'videopoker':
              gamesData = this.slotsPipe.transform(this.allSlotsData, "gameType", "video_poker");
              break;
          default:
              gamesData = this.allSlotsData;
              break;
        }
        this.slotsData = gamesData.slice(start,end);
        this.activeTab = tab;
        this.masonryLayout();
    }

    myFunction() {
        var checkActiveElePresent = $(".active-menu").find('.games_link').html();
        if (!checkActiveElePresent) {
            var activeEle = $("#menuList").find('.active').html();
            var newHtml = activeEle;
            $(".active-menu").append(newHtml);
            $(".active-menu").addClass("active");
        } else {
            $(".active-menu").children().remove();
            $(".active-menu").removeClass("active");

        }
        var x = document.getElementById("slotsTabsList");
        if (x.className === "slotsTabsList") {
            x.className += " responsive";
        } else {
            x.className = "slotsTabsList";
        }
    }

    removeClass() {
        $(".active-menu").children().remove();
        $(".active-menu").removeClass("active");
        var x = document.getElementById("slotsTabsList");
        if (x.className === "slotsTabsList responsive") {
            x.className = "slotsTabsList";
        }
    }
}
