import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cookie-msg',
  templateUrl: './app-cookie-msg.component.html',
  styleUrls: ['./app-cookie-msg.component.scss'],
      encapsulation: ViewEncapsulation.None

})
export class AppCookieMsgComponent implements OnInit {

  constructor(private utils:Utility,
  private router:Router) { }

  ngOnInit() {
 
  }

}
