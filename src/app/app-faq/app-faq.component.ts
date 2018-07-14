import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Utility } from "../utils/utility";
import { faqConfig } from '../utils/general-config';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

@Component({
  selector: 'app-faq',
  templateUrl: './app-faq.component.html',
  styleUrls: ['./app-faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppFaqComponent implements OnInit {
  faqConfig;
  selectedCategory;
  selectedCategoryDetails;
  selectedCategoryQA;
  faqQuestionAns;
  faqCategories;
  constructor(private utils:Utility,
    protected translateService: TranslationService, 
    private lottodayService:AppLottodayService) { }

    ngOnInit() {
      let self = this;
      Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'faq-bingo'}))
      .then(
        aboutLottoday=>{
          $("#faq-content").html(aboutLottoday["content"]);
        }
      )
    }
}
