import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-about-Bingo',
  templateUrl: './about-bellaBingo.component.html',
  styleUrls: ['./about-bellaBingo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutBellaBingoComponent implements OnInit {

  constructor(
    protected translateService: TranslationService,
    private lottodayService:AppLottodayService,
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'about-Bingo-69'}))
    .then(
      aboutLottoday=>{
        $("#aboutLottodayContent").html(aboutLottoday["content"]);
      }
    )
  }

}
