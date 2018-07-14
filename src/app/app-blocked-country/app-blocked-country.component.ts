import { Component, OnInit,ViewEncapsulation,Input } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;


@Component({
  selector: 'app-blocked-country',
  templateUrl: './app-blocked-country.component.html',
  styleUrls: ['./app-blocked-country.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppBlockedCountryComponent implements OnInit {
  @Input() countryCode;
  constructor(private utils:Utility,
  private router:Router) { }

  ngOnInit() {
  }

}
