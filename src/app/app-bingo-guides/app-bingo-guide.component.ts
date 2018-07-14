import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-bingo-guides',
  templateUrl: './app-bingo-guide.component.html',
  styleUrls: ['./app-bingo-guide.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppBingoGuideComponent implements OnInit {
  constructor(
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService
  ) {

  }
   

    ngOnInit() {
      let self = this;
      Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'bingo-guides'}))
      .then(
        aboutLottoday=>{
          $("#dynamic-content").html(aboutLottoday["content"]);
        }
      )
    }
    ngAfterViewInit() {
      $('#headerBingoLink').addClass('activePage');
    }
}
