import { Component,ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { EmitterService } from '../services/emitter.service';
import { Location } from '@angular/common';
import { mixpanelService } from '../services/mixpanel.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;


@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppLoginComponent implements OnInit {

  @Input() isLogIn;
  @Input() callingfrom;
  @Output() isLogInChange = new EventEmitter<boolean>();
  @Input() cashDetails;
  @Output() cashDetailsChange = new EventEmitter<string>();
  @Input() currencyDetails;
  @Input() loadImage;
  @Output() currencyDetailsChange = new EventEmitter<string>();
  isCheckoutPage;

  constructor(
    private activatedRoute:ActivatedRoute,
    private lottodayService:AppLottodayService,
    private utils:Utility,
    private router:Router,
    private formBuilder:FormBuilder,
    private emitterService:EmitterService,
    private location:Location,
    private mixpaneldataService:mixpanelService

  ) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParams =>{
      this.isCheckoutPage = queryParams.get("checkout");
    });
  }

  openRegistration():void{
    $('.menu-items').hide();
    this.router.navigate(['/register'],{queryParams:{"checkout":this.isCheckoutPage}});
  };

  loginCompleted(data):void{
    if(!this.isCheckoutPage){
      if(this.callingfrom == "header") this.emitterService.broadcastLoginComplete("hideMenu/"+data);
      else if(this.callingfrom == "page") this.emitterService.broadcastLoginComplete("reloadToHome/"+data);
    }else {
      this.emitterService.broadcastLoginComplete("reloadToCheckout/"+data);
    }

  }

  goBackToCheckout(){
    this.router.navigate(['/checkout']);
  }

  mixPanelEventCheck(type,gameName):void{
    Promise.resolve(this.mixpaneldataService.mobileMenuLeftRight('upcomingDraws',type,gameName));
  }
}
