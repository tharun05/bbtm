import { Component, OnInit, EventEmitter } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router,ActivatedRoute } from "@angular/router";

import { EmitterService } from '../services/emitter.service';


@Component({
  selector: 'app-complete-profile-page',
  templateUrl: './complete-profile-page.component.html',
  styleUrls: ['./complete-profile-page.component.scss']
})
export class CompleteProfilePageComponent implements OnInit {

  isCheckoutPage;
  isCashierPage;
  isPaymentPage;
  isSubscriptionAvailable;
  constructor(
  				private router:Router,
          private activatedRoute:ActivatedRoute,
  				private emitterService: EmitterService) {
        }

    ngOnInit() {
      this.activatedRoute.queryParamMap.subscribe(queryParams =>{
        this.isCheckoutPage = queryParams.get("checkout");
        this.isCashierPage = queryParams.get("cashier");
        if(queryParams.get("deposit"))
          this.isPaymentPage = "deposit";
        else if(queryParams.get("buyTicket"))
          this.isPaymentPage = "buyTicket";
        this.isSubscriptionAvailable = queryParams.get("subscription");
      });
  	}

    updateProfileComplete(data):void{
      this.emitterService.userDataSourceComplete("User Data Updated");
      if(this.isCheckoutPage) this.router.navigate(['/checkout']);
      else if(this.isCashierPage) this.router.navigate(['/myaccount/cashier']);
      else if(this.isPaymentPage) this.router.navigate(['/payment/'+this.isPaymentPage], {queryParams: {"subscription":this.isSubscriptionAvailable} });
    }
}
