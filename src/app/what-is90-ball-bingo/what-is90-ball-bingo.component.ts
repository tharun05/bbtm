import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-what-is90-ball-bingo',
  templateUrl: './what-is90-ball-bingo.component.html',
  styleUrls: ['./what-is90-ball-bingo.component.scss']
})
export class WhatIs90BallBingoComponent implements OnInit {

  constructor(
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService
  ) { }

  ngOnInit() {
    let self = this;
      Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'what_is_90_bingo'}))
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
