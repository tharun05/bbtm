import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-what-is-bingo',
  templateUrl: './what-is-bingo.component.html',
  styleUrls: ['./what-is-bingo.component.scss']
})
export class WhatIsBingoComponent implements OnInit {

  

  constructor(
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'what_is_75_bingo'}))
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
