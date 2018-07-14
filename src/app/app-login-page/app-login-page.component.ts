import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
  selector: 'app-app-login-page',
  templateUrl: './app-login-page.component.html',
  styleUrls: ['./app-login-page.component.scss'],
      encapsulation: ViewEncapsulation.None

})
export class AppLoginPageComponent implements OnInit {

  constructor(private utils:Utility,
  private router:Router) { }

  ngOnInit() {
    if(this.utils.isUserLoggedIn()){
      this.router.navigate(["/"]);
    }else{
      $('#headerMyAccountLink').addClass('activePage');
    }
  }

  ngOnDestroy(){
    $('#headerMyAccountLink').removeClass('activePage');
  }

}
