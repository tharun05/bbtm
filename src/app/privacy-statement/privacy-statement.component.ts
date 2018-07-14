import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-privacy-statement',
  templateUrl: './privacy-statement.component.html',
  styleUrls: ['./privacy-statement.component.scss']
})
export class PrivacyStatementComponent implements OnInit {

  constructor( protected translateService: TranslationService, 
    private lottodayService:AppLottodayService) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'privacy-statement'}))
    .then(
      aboutLottoday=>{
        $("#dynamic-content").html(aboutLottoday["content"]);
      }
    )
  }

}
