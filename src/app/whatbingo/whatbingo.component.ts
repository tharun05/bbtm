import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-whatbingo',
  templateUrl: './whatbingo.component.html',
  styleUrls: ['./whatbingo.component.scss']
})
export class WhatbingoComponent implements OnInit {

  constructor(
    protected translateService: TranslationService,
    private lottodayService:AppLottodayService,
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'what-is-bella-bingo'}))
    .then(
      termsData=>{
        $("#dynamic-content").html(termsData["content"]);
      }
    )
  }


}
