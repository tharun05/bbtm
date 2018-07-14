import {Component, OnInit, ViewEncapsulation, HostListener} from '@angular/core';
import {BingoDataService} from '../services/bingo-data.service';
import {EmitterService} from '../services/emitter.service';
import {Utility} from '../utils/utility';
import {Router, ActivatedRoute} from "@angular/router";
import { UserDetailsService } from '../services/user-details.service';
import {SlotsPipe} from '../slots.pipe';
import { currency_codes } from '../utils/currency-code';
import {dateMobiScroll} from '../utils/lotteryConfig';
import { SlotsSearchPipe } from '../slots.search.pipe';
import { mobiTimePicker } from '../utils/lotteryConfig';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
    selector: 'app-bingo',
    templateUrl: './bingo.component.html',
    styleUrls: ['./bingo.component.scss'],
      encapsulation: ViewEncapsulation.None

})
export class BingoComponent implements OnInit {
    results: any = "";
    display_limit: number = 6;
    layoutView = "list";
    selectedPage;
    currentPage: boolean = false;
    selectedPagination: number = 0;
    shouldShowErrors: boolean = false;
    userCurrency: any;
    currencySymbol: any;
    searchText;
    showResult: boolean = false;
    isDepositLimitTimer: string = "bingoRooms";
    availableRooms: Array<any>;
    availableBingoTypes: Array<any>;
    datePicker;
    availableFromHourMinutes: Array<any>;
    availableToHourMinutes: Array<any>;
    timePicker;
    //sorting
    key: string = 'jackpotAmountValue';
    reverse: boolean = false;
    filterMap: any = {};
    isLoggedIn: boolean = false;
    curPage : number;
    pageSize : number;
    dateFilterError : boolean = false;
    bingoSubscribe : any;

    constructor(private bingoDataService: BingoDataService,
        private emitterService: EmitterService,
        private utils: Utility,
        private route: Router,
        private userDetailService: UserDetailsService,
        private slotsPipe: SlotsPipe,
        private utility: Utility,
        private slotsSearchPipe: SlotsSearchPipe
    ) {

        this.emitterService.updateLoginStatus$.subscribe(
            loginStatus => {
                this.isLoggedIn = JSON.parse(loginStatus)
            }
        );

        this.userDetailService.balanceUpdated$.subscribe(
            balanceUpdateStatus => {
                this.userCurrency = this.userDetailService.getCurrencyCode();
                this.fetchBingoRooms(true);
            });


        this.emitterService.updateBingoRoomsHighlightTimer$.subscribe(flag => {
            //this.results[flag].highlightTimer = true;
             this.results.forEach( item => {
                if (item.roomID == flag) {
                    item.highlightTimer = true;
                }
             })
        })
    }
    windowType;
    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        var ww = document.body.clientWidth;
        if (ww <= 1199) {
            this.layoutView = "grid";
            this.windowType = "mobile";
        }
        else if(ww <= 767){
            this.layoutView = "grid";
            this.windowType = "mobile";
        }
        else {
            this.windowType = "device";
        }
    }

    ngOnInit() {

        this.bingoSubscribe = this.emitterService.updateUpcomingBingoRooms$.subscribe(flag => {
            this.fetchBingoRooms(true);
        })
        this.datePicker = dateMobiScroll;
        this.isLoggedIn = this.utils.isUserLoggedIn();
        this.curPage = 1;
        this.pageSize = 6; // any page size you want 
        this.timePicker = mobiTimePicker;
        if(!$(".bingo-footer").hasClass('active')){
            $(".bingo-footer").addClass('active');
        }
        if (this.route.url === '/bingo') {
            this.currentPage = true;
            $('#headerBingoLink').addClass('activePage');
            $('#headerBingoRoomLink').addClass('activePage');
            $(".header-row").addClass("search_filter");
        }
        this.filterMap['roomName'] = 'ALL';
        this.filterMap['bingoType'] = 'ALL';
        this.fetchBingoRooms(true);
    }

    // timePicker ={

    //     timeFormat: 'HH:ii'

    // }
    openModal(modalId): void {
        this.utility.openModal(modalId);
    }

    sort (key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    openBingoRoom (roomId) {
        this.getTheGamePlayUrl(roomId);
    }

    getTheGamePlayUrl(roomId) {
        Promise.resolve(this.bingoDataService.getGameUrl(roomId))
            .then(resp => {
                if (resp) {
                    window.open(resp.toString());
                }
            })
    }

    filterRooms(key, value): void {
        this.dateFilterError = false;
        this.filterMap[key] = value;
        if (this.filterMap['fromDate'] && this.filterMap['toDate'] ) {
            let fromHourMins = this.filterMap['fromDate'].split(':');
            let toHourMins = this.filterMap['toDate'].split(':');
            if ((fromHourMins[0] == toHourMins[0] && fromHourMins[1] > toHourMins[1]) ||
            fromHourMins[0] != toHourMins[0] &&  fromHourMins[0] > toHourMins[0]) {
                //showError
                this.dateFilterError = true;
                this.filterMap['toDate'] = 'ALL';
            }
        }
        if (!this.dateFilterError) {
            this.fetchBingoRooms(false);
        }
    }

    filterTheData() {
        let self = this;
        Object.keys(self.filterMap).forEach( item =>{
           if (self.filterMap[item] != 'ALL' && self.results.length != 0) {
               if (item == 'nextGameStart') {
                   self.results = self.results.filter( x => {
                       return (new Date(x[item]).getDate() == self.filterMap[item].getDate())
                   });
               } else if((item == 'fromDate' || item == 'toDate') && self.filterMap[item]) {
                   let currDate = new Date();
                   let filterDate = currDate.getTime();
                   if (self.filterMap['nextGameStart']) {
                        filterDate = self.filterMap['nextGameStart'].getTime();
                   } else {
                        filterDate = new Date((currDate.getMonth() + 1) + "-" + currDate.getDate() + "-" + currDate.getFullYear()).getTime();
                   }
                   let hourMins = self.filterMap[item].split(':');
                   let filerDateInMs = filterDate + hourMins[0] * 3600000 + hourMins[1] * 60000;
                   self.results = self.results.filter( x => {
                       let itemDateInMs = new Date(x['nextGameStart']).getTime();
                       if (item == 'fromDate') {
                            return ( itemDateInMs >=  filerDateInMs)
                       } else {
                            return ( itemDateInMs <=  filerDateInMs)
                       }

                   });
               } else {
                   self.results = self.slotsPipe.transform(self.results, item, self.filterMap[item]);
               }
           }
        })
    }

    fetchBingoRooms(forceful): void {
         let self = this;
         Promise.resolve(this.bingoDataService.getBingoRooms(forceful))
            .then(resp => {
                if (!forceful) {
                    self.results = resp['activeRoomList'];
                    self.filterTheData();
                } else if (resp && resp['activeRoomList'] && resp['activeRoomList'].length > 0) {
                    self.shouldShowErrors = false;
                    self.results = resp['activeRoomList'];
                    let gameCurrency = 'EUR';
                    if (self.userCurrency) {
                        gameCurrency = self.userCurrency;
                    }
                    self.currencySymbol = currency_codes[gameCurrency];
                    self.results.map(result => {
                        result.name = result.roomName;
                        result.jackpotAmount = result.jackpotAmount.filter(x => x.symbol == gameCurrency)[0];
                        result.cardCost = result.cardCost.filter(x =>x.symbol == gameCurrency)[0];
                        result.gamePrize = result.gamePrize.filter(x =>x.symbol == gameCurrency)[0];
                        result.jackpotAmountValue = result.jackpotAmount.value;
                        result.highlightTimer = false;
                        return result;
                    })

                    self.availableBingoTypes = [{value:'ALL', viewValue:'ALL'}];
                    self.availableRooms = [{value:'ALL', viewValue:'ALL'}];
                    self.results.forEach( item => {
                        if (!self.availableRooms.some(function(x) {
                             return self.checkIfExistingValue(x, "value", item.roomID); }) )
                             {
                                self.availableRooms.push({value:item.roomID, viewValue:item.roomName});
                             }
                        if (!self.availableBingoTypes.some(function(x) {
                             return self.checkIfExistingValue(x, "value", item.bingoType); }) )
                            {
                                self.availableBingoTypes.push({value:item.bingoType, viewValue:item.bingoType});
                            }
                    })

                    if (Object.keys(self.filterMap).length == 0) {
                         self.filterMap['roomName'] = 'ALL';
                         self.filterMap['bingoType'] = 'ALL';
                    }

                    self.filterTheData();
                    self.selectedPage = 1;
                } else {
                    if (resp['error']) {
                        self.shouldShowErrors = true;
                    }
                }
            })
    }

    isNextDisabled(): boolean {
        if (this.results) {
            return this.curPage >= this.results.length/this.pageSize;
        }
        return true;
    }

    openSearchResults(): void {
        this.results = this.slotsSearchPipe.transform(this.results, this.searchText);
        this.searchText = '';
        this.showResult = false;
    }

    numberOfPages(): number {
        if (this.results) {
            return Math.ceil(this.results.length / this.pageSize);
        }
        return 0;
    }

    checkIfExistingValue(obj, key, value): boolean {
        return obj.hasOwnProperty(key) && obj[key] === value;
    }

    changeView(view): void {
        this.layoutView = view;
        this.filterMap = {};
        this.dateFilterError = false;
        this.fetchBingoRooms(true);
    }

    valuechange(newValue) {
        this.searchText = newValue;
        this.showResult = true;
        if (this.searchText === '') {
            this.showResult = false;
        }
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            var ww = document.body.clientWidth;
            if (ww <= 1199) {
                this.layoutView = "grid";
                this.windowType = "mobile";
            } else {
                this.windowType = "device";
            }
        })
        $(document).ready(function(){
        $( '.sorting_wrap ul li' ).on( 'click', function() {
            $( this ).parent().find( 'li' ).removeClass( 'active' );
            $( this ).parent().find( 'li > span' ).removeClass( 'uparrow' )
            $( this ).addClass( 'active' );
            $(this).find('span').addClass('uparrow');
           ;
       });
    });
    }

    ngOnDestroy() {
        this.bingoSubscribe.unsubscribe();
        if($(".bingo-footer").hasClass('active')){
            $(".bingo-footer").removeClass('active');
        }
        $('#headerBingoLink').removeClass('activePage');
        $('#headerBingoRoomLink').removeClass('activePage');

    }

}
