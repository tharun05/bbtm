import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-bingo69-terms-conditions',
  templateUrl: './bingo69-terms-conditions.component.html',
  styleUrls: ['./bingo69-terms-conditions.component.scss']
})
export class Bingo69TermsConditionsComponent implements OnInit {

  constructor( protected translateService: TranslationService, 
    private lottodayService:AppLottodayService) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'bingo-69-terms-conditions'}))
    .then(
      aboutLottoday=>{
        $("#dynamic-content").html(aboutLottoday["content"]);
      }
    )
  }

}
