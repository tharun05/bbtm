import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Utility } from "../utils/utility";
import { UserDetailsService } from '../services/user-details.service';
import { mixpanelService } from '../services/mixpanel.service';

import * as _ from 'underscore';

@Component({
  selector: 'app-header-menu-dropdown',
  templateUrl: './app-header-menu-dropdown.component.html',
  styleUrls: ['./app-header-menu-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppHeaderMenuDropDown implements OnInit {
  results: any;
  currency;
  currencySymbol;
  isAustraliaPowerBallAvailable;
  constructor(
    private utils: Utility,
    private userService: UserDetailsService,
    private mixpaneldataService:mixpanelService

  ) { }

  ngOnInit() {
    // Promise.resolve(this.lottodayDataService.getExtendLotteries(false)).then(resp => {
    //   if (resp) {
    //     this.results = this.lottodayDataService.extendLotteries;
    //     this.results = _.sortBy(this.results,function(result){
    //       return - result.prizeAmt;
    //     });
    //    this.results= _.first(this.results, 5);
    //   //  _.map(this.results, function(num){ return num * 3; });
    //   let self = this;
    //   _.each(this.results,function(results) {
    //     if(results.nameConstant == "PowerballAustralia"){
    //       self.isAustraliaPowerBallAvailable = true;
    //     }
    //     results.calculatedLinesLimit = results.officialMinLinesPerTicket != null && results.officialMinLinesPerTicket>3 ? results.officialMinLinesPerTicket : 3;
    //    // results.calculatedPrize= results.lotteryLinePrice * results.calculatedLinesLimit;
    //   });
    //   }
    // })
  }

  getCurrencyFromService():any{
  return  { currency: this.userService.getCurrencyCode(),
            currencySymbol: this.userService.getCurrencySymbol()
          }
  }
  hideMenu() {
    this.utils.hideMenu("header");
  }
  playDeviceCheck(gameType, id,ownNumbers): void {
    this.utils.playDeviceCheck(gameType, id,ownNumbers);
  }
  mixPanelEventCheck(type,gameName):void{
    gameName ? Promise.resolve(this.mixpaneldataService.userLoggedIn('headerdropdown', type, gameName)) : Promise.resolve(this.mixpaneldataService.userLoggedIn('headerdropdown', type, ''));

  }
}
