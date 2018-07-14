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
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss']
})
export class ScratchComponent implements OnInit {

    scratchesData: any;
    gamesData: any;
    scratchesDataLength: number = 0;
    allScratchesData: boolean = false;
    showResults: boolean = false;
    searchText;
    windowType;
    currentPage: boolean = false;
    siteUrlPath: string = environment.apiUrl;
    gameUrlPath: string = environment.gamePath;
    gameType: string = 'freegames';
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
        private userService: UserDetailsService,
        private gmService: GameWindowService,
        private utils: Utility
    ) {}

    ngOnInit() {
        if(!$(".scratch-footer").hasClass('active')){
            $(".scratch-footer").addClass('active');
        }
        if (this.router.url === '/scratch') {
            this.currentPage = true;
            $('#headerScratchLink').addClass('activePage');
        }
        this.getAllScratchGames();
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            var ww = document.body.clientWidth;
            if (ww <= 1024) {
                this.windowType = "mobile";
            } else {
                this.windowType = "device";
            }
        });
        setTimeout(function () {
            $('#headerScratchLink').addClass('activePage');
        }, 100);
    }

    masonryLayout() {
        setTimeout(function () {
            (<any> $('.masonryContentBlock')).isotope({
                itemSelector: '.grid-blks',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-size'
                }
            });
        }, 1);
    }

    gameLauncher(gameType, gameId): void {
        let ww = document.body.clientWidth;
        this.gmService.setPrevPage("/scratch");
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

    getAllScratchGames(){
      if (this.utils.isUserLoggedIn()) {
          this.gameType = "realgames";
      }
      Promise.resolve(this.gmService.getAllCasinoGames()).then(allGames => {
          this.gamesData = this.slotsPipe.transform(allGames, 'gameType', "scratch");
          this.scratchesDataLength = this.gamesData.length;
          this.scratchesData = this.gamesData.slice(this.start,this.end);
          this.masonryLayout();
      });
    }

    valuechange(newValue) {
        this.searchText = newValue;
        this.showResults = true;
        if (this.searchText === '') {
            this.showResults = false;
        }
    }

    openSearchResultGames(gameId) {
        this.utils.isUserLoggedIn() ? this.gameLauncher("realgames", gameId) : this.gameLauncher("freegames", gameId);
    }

    handleScroll(event: ScrollEvent) {
        if (event.isReachingBottom) {
            this.end = this.end + this.offset;
            if(this.scratchesDataLength < this.end){
              this.end = this.scratchesDataLength;
            }
            this.scratchesData = this.gamesData.slice(this.start,this.end);
        }
    }

    ngOnDestroy() {

        if($(".scratch-footer").hasClass('active')){
            $(".scratch-footer").removeClass('active');
        }
        $('#headerScratchLink').removeClass('activePage');
    }

}
