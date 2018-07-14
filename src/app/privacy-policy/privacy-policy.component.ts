import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../services/translate.service';
import { AppLottodayService } from "../app-lottoday.service";
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    protected translateService: TranslationService,
    private lottodayService:AppLottodayService,
    private router:Router
  ) { }

  ngOnInit() {
    let self = this;
    Promise.resolve(this.lottodayService.getStaticPage({'lang':this.translateService.getCurrentLang(),'url_path':'privacy-policy-Bingo'}))
    .then(
      termsData=>{
        $("#privacyPolicyContent").html(termsData["content"]);
        setTimeout(function(){
          $("#backToHomePrivacy").on('click',function(){
            self.router.navigate(["/"]);
          });
        },1)
      }
    )
  }
}
