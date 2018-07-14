import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import { AppLottodayService } from "../app-lottoday.service"
import { EmitterService } from "../services/emitter.service"
import { UserDetailsService } from "../services/user-details.service"
import { Utility } from '../utils/utility';
import { PaymentService } from '../services/payment.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-txn-status',
  templateUrl: './app-txn-status.component.html',
  styleUrls: ['./app-txn-status.component.scss']
})
export class AppTxnStatusComponent implements OnInit {
  @Input()
  txnDetails:any = {};
  isUserLoggedIn;
  userService;
  userProfile;
  text;
  userCurrency;
  @Input() qDResponse;
  constructor(private lottodayService:AppLottodayService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private userDetailService:UserDetailsService,
    private utils:Utility,
    private emitterService:EmitterService,
    private paymentService:PaymentService
  ) {
    this.userService = this.userDetailService ;
    this.userService.balanceUpdated$.subscribe(
      message => {
        this.txnDetails.totalBalance=this.userService.getUserBalance();
        this.userProfile = this.userService.getuserProfileDetails();
      });
    }

    @HostListener('window:resize') onResize() {
      // guard against resize before view is rendered
      var ww = document.body.clientWidth;
      if(ww <= 992){
        this.text = "Tap";
      }else{
        this.text = "Click";
      }
    }

    ngOnInit() {
      this.isUserLoggedIn = this.utils.isUserLoggedIn();
      if(this.isUserLoggedIn){
        if(this.qDResponse==null){
          this.activatedRoute.queryParamMap.subscribe(queryParams =>{
            var paramKeys = queryParams.keys;
            var self = this;
            paramKeys.forEach(function(key,value){
              self.txnDetails[key]=queryParams.get(key);
            });
          });
        }else{
          this.txnDetails=this.qDResponse;
        }
        if(this.txnDetails.transactionStatus == "FAILURE"){
          this.emitterService.broadcastShowSmallFooterEvent("showSmall");
        }
        this.txnDetails.totalBalance = this.userService.getUserBalance();
        this.userProfile = this.userService.getuserProfileDetails();
      }else{
        this.router.navigate(["/"]);
      }
    }

    ngAfterViewInit(){
      setTimeout(_=>{
        var ww = document.body.clientWidth;
        if(ww <= 992){
          this.text = "Tap";
        }else{
          this.text = "Click";
        }
      })
    }

    retryPayment(buttonId){
        this.router.navigate(["/myaccount/cashier"]);
    }


  }
