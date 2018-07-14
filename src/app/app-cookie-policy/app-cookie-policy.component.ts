import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-app-cookie-policy',
  templateUrl: './app-cookie-policy.component.html',
  styleUrls: ['./app-cookie-policy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppCookiePolicyComponent implements OnInit {

  constructor(
    protected translateService: TranslationService,
    private lottodayService:AppLottodayService,
    private router:Router
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'bingo-cookie-policy'}))
    .then(
      termsData=>{
        $("#dynamic-content").html(termsData["content"]);
      }
    )
  }
}
