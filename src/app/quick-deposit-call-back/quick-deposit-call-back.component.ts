import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Router,ActivatedRoute } from "@angular/router";
import { PaymentService } from '../services/payment.service';
import * as _ from 'underscore';
import { Utility } from '../utils/utility';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;  
@Component({
  selector: 'app-quick-deposit-call-back',
  templateUrl: './quick-deposit-call-back.component.html',
  styleUrls: ['./quick-deposit-call-back.component.scss']
})
export class QuickDepositCallBackComponent implements OnInit {
txnDetails={};
  lotteryDeatil:any;
  constructor(private lottodayService:AppLottodayService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private paymentService:PaymentService,
     private utils:Utility) { }

  ngOnInit() {
    let cartList = JSON.parse(sessionStorage.getItem("cartList"))
    if(cartList){
      //_.values(JSON.parse(sessionStorage.getItem("cartList"))).map(function(element){ return element});
      this.lotteryDeatil = _.values(cartList).map(function(element){ return element});
    }
    this.activatedRoute.queryParamMap.subscribe(queryParams =>{
			if($("#Modal3D").length >0){
        this.utils.closeModal("Modal3D");
        return ;
      }

      var paramKeys = queryParams.keys;
			var self = this;
			paramKeys.forEach(function(key,value){
				self.txnDetails[key]=queryParams.get(key);
			});
      let payementResponse = {};
      payementResponse["depositAmount"]=this.txnDetails["amount"];
      payementResponse["AccountId"] = this.txnDetails["customerId"]
      this.paymentService.afterPaymentSuccessfull(payementResponse,this.lotteryDeatil,undefined,undefined,0);
		});
}

}
