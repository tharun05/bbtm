import {Component, ViewEncapsulation, OnInit, OnDestroy,HostListener} from '@angular/core';
import {PaymentService} from '../services/payment.service';
import {Utility} from '../utils/utility';
import {UserDetailsService} from '../services/user-details.service'
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {DatePipe} from '@angular/common';
import {transactionTypeConfs} from '../utils/lotteryConfig';
import {EmitterService} from '../services/emitter.service';
import {AppLottodayService} from '../app-lottoday.service';
import {availablePaymentMethodsMap, availableWithdrawMethodsMap} from '../utils/lotteryConfig';
import {Router, ActivatedRoute} from "@angular/router";
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

@Component({
    selector: 'app-customer-support',
    templateUrl: './customer-support.component.html',
    styleUrls: ['./customer-support.component.scss']
})
export class CustomerSupportComponent implements OnInit {
    activeMethod: any;

@HostListener('window:resize') onResize() {
    // guard against resize before view is rendered
    var ww = document.body.clientWidth;
    if(ww > 767) {
        $('.mobile-show').hide();
    }else{
        $('.mobile-show').show();
    }
  }
    constructor(
        private activatedRoute:ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe(queryParams => {
          
            let activetag = queryParams["activetab"]
            if(activetag){
                this.activeMethod = activetag;
                this.getMethod(activetag);
            }
            console.log("activeTag:",activetag);
        })
    }

    ngOnInit() {
       // this.activeMethod = 'none';
        var ww = document.body.clientWidth;
        if(ww > 767) {
            $('.mobile-show').hide();
        }else{
            $('.mobile-show').show();
        }
    }

    getMethod(method) {
        this.activeMethod = method;
    }
    goBack() {
        this.activeMethod = 'none';
    }
}
