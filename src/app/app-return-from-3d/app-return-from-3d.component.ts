import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Router,ActivatedRoute } from "@angular/router";
import { PaymentService } from '../services/payment.service';
import * as _ from 'underscore';
import { Utility } from '../utils/utility';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;  
@Component({
  selector: 'app-app-return-from-3d',
  templateUrl: './app-return-from-3d.component.html',
  styleUrls: ['./app-return-from-3d.component.scss']
})
export class AppReturnFrom3dComponent implements OnInit {
  txnDetails={};
  lotteryDetail:any;
  constructor(private lottodayService:AppLottodayService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private paymentService:PaymentService,
     private utils:Utility) { }

  ngOnInit() {
     let cartList = JSON.parse(sessionStorage.getItem("cartList"))
    if(cartList){
      //_.values(JSON.parse(sessionStorage.getItem("cartList"))).map(function(element){ return element});
      this.lotteryDetail = _.values(cartList).map(function(element){ return element});
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
      let paymentResponse = {};
      paymentResponse['paymentType'] = this.txnDetails['paymentType'];

     
      paymentResponse["depositAmount"]=this.txnDetails["amount"];
      paymentResponse["AccountId"] = this.txnDetails["customerId"]

      if(paymentResponse['paymentType']){
        paymentResponse['txnId'] = this.txnDetails['merchantTransactionId'];
        this.paymentService.afterCashoutSuccessfull(paymentResponse,this.lotteryDetail,undefined,undefined,0);

      }else{
        this.paymentService.afterPaymentSuccessfull(paymentResponse,this.lotteryDetail,undefined,undefined,0);

      }

  });
  }
}
