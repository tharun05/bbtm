import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsConditionsComponent implements OnInit {
  termsNCondition;
  private dynamicContent;
  constructor(
    protected translateService: TranslationService,
    private lottodayService:AppLottodayService,
    private router:Router
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'terms-n-conditions-bella-bingo'}))
    .then(
      termsData=>{
        self.dynamicContent = termsData["content"];
        $("#tncContent").html(termsData["content"]);
      }
    )
  }
}
