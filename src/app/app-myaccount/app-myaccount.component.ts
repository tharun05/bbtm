import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { EmitterService } from '../services/emitter.service';
import { UserDetailsService } from '../services/user-details.service';
import { Location } from '@angular/common';
import { Utility } from '../utils/utility'
import { Router } from '@angular/router';
import { mixpanelService } from '../services/mixpanel.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-app-myaccount',
  templateUrl: './app-myaccount.component.html',
  styleUrls: ['./app-myaccount.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppMyaccountComponent implements OnInit,AfterViewInit {

  userDeatil;
  sectionName;
  iconName;
  sectionDesc;
  activeTab;
  isUserLoggedIn:boolean;
  constructor(private emitterService: EmitterService,
    private userService:UserDetailsService,
    private location:Location,
    private router:Router,
    private utils:Utility,
    private mixpaneldataService:mixpanelService
  ) {
      this.router.events.subscribe((evt) => {
        var locName =  this.location.path().substr(this.location.path().lastIndexOf('/')+1);
        if(locName.indexOf('?') != -1){
          locName = locName.substr(0,locName.indexOf('?'));
        }
        this.setDeatils(locName);

       });
    emitterService.userDataSource$.subscribe(
      userDataSource => {
        if(userDataSource=="User Data Updated"){
          this.userDeatil = this.userService.getuserProfileDetails();
        }
      }
    );
    this.emitterService.updateLoginStatus$.subscribe(
      loginStatus => {
        this.isUserLoggedIn = JSON.parse(loginStatus);
      }
    );

    this.emitterService.accordianClickEvent$.subscribe(
      accordianName => {
        this.setDeatils(accordianName);
      }
    );
  }


  ngOnInit() {
    $(".mobile-menu").addClass("header-modified");
    this.isUserLoggedIn = this.utils.isUserLoggedIn();
    if(this.isUserLoggedIn){
      $('#headerMyAccountLink').addClass('activePage');
      this.activeTab="myAccount";
      var locName =  this.location.path().substr(this.location.path().lastIndexOf('/')+1);
      if(locName.indexOf('?') != -1){
        locName = locName.substr(0,locName.indexOf('?'));
      }
      this.setDeatils(locName);
      this.userDeatil = this.userService.getuserProfileDetails();
    }else{
      this.router.navigate(["/"]);
    }

  }

  setDeatils(locName){
    switch(locName){
      case 'transactions':
        this.sectionName = 'My Transactions';
        this.iconName = "icon-list-view";
        this.sectionDesc="View payment and transaction history";
        this.activeTab="transactions";
        break;
      case 'myaccount':
        this.sectionName = 'My Account';
        this.iconName = "icon-settings";
        this.sectionDesc="View and edit settings relating to my account";
        this.activeTab="myAccount";
        break;
      case 'bet-history':
        this.sectionName = 'Bet History';
        this.iconName = "icon-date";
        this.sectionDesc="A record of the bets you have placed";
        this.activeTab="betHistory";
        break;
      case 'cashier':
        this.sectionName = 'Cashier';
        this.iconName = "icon-bank";
        this.sectionDesc="Manage funds and payment methods";
        this.activeTab="cashier";
        break;
      case 'Add funds':
        this.sectionName = 'Add funds';
        this.iconName = "icon-secure-payment";
        this.sectionDesc="All transactions 128bit SSL encrypted";
        this.activeTab="cashier";
        break;
      case 'Withdraw funds':
        this.sectionName = 'Withdraw';
        this.iconName = "icon-bank";
        this.sectionDesc="Withdraw funds from my account";
        this.activeTab="cashier";
        break;
      case 'Confirm identity':
        this.sectionName = 'Confirm identity';
        this.iconName = "icon-fingerprint";
        this.sectionDesc="Upload documents securely";
        this.activeTab="cashier";
        break;
    }
  }

  ngAfterViewInit(){

  }

  getActiveTab(toBeActive){
    this.activeTab = toBeActive;
  }

  ngOnDestroy(){
    $('#headerMyAccountLink').removeClass('activePage');
  }
  mixPanelEventCheck(type,gameName):void{
    Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile',type,gameName));
  }
}
