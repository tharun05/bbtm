import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { TranslationService } from '../services/translate.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-variant-bingo',
  templateUrl: './variant-bingo.component.html',
  styleUrls: ['./variant-bingo.component.scss']
})
export class VariantBingoComponent implements OnInit {

  constructor(
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'variant-bingo'}))
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
