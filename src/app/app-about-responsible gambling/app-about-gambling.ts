import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;


@Component({
  selector: 'app-responsible-gambling',
  templateUrl: './app-about-gambling.html',
  styleUrls: ['./app-about-gambling.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppResponsibleGambling implements OnInit {
  constructor(
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService) { }

    ngOnInit() {
      let self = this;
      Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'about-responsible-gambling'}))
      .then(
        aboutLottoday=>{
          $("#dynamic-content").html(aboutLottoday["content"]);
        }
      )
    }
}
