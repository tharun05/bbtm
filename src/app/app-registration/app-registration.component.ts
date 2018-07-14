import {Component, OnInit} from '@angular/core';

import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import {Router, ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {PasswordStrengthBarComponent} from '../password-strength-bar/password-strength-bar.component'
import {EmitterService} from '../services/emitter.service';
import * as _ from 'underscore';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

import 'intl-tel-input';

@Component({
    selector: 'app-app-registration',
    templateUrl: './app-registration.component.html',
    styleUrls: ['./app-registration.component.scss']
})
export class AppRegistrationComponent implements OnInit {
    isCheckoutPage;
    regComplete: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private lottodayService: AppLottodayService,
        private utils: Utility,
        private router: Router,
        private formBuilder: FormBuilder,
        private emitterService: EmitterService) {}

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe(queryParams => {
            this.isCheckoutPage = queryParams.get("checkout");
        });
    }

    ngAfterViewChecked(){
        $('.device-header').addClass('hide');
        $('.device-header-nav').addClass('hide');
    }

    registrationComplete(data): void {
        if (data.includes("registerButton1")) {
            this.emitterService.broadcastLoginComplete("nothing/" + data);
        } else {
            if (!this.isCheckoutPage) {
                this.emitterService.broadcastLoginComplete("reloadToHomeOnly/" + data);
            } else {
                this.emitterService.broadcastLoginComplete("reloadToCheckoutOnly/" + data);
            }
        }

    }

    ngOnDestroy(){
        $('.device-header').removeClass('hide');
        $('.device-header-nav').removeClass('hide');
    }

    /*validateNickName(): void{
            console.log(this.registrationForm.controls["nickname"].value);
            console.log(this.registrationForm.controls["nickname"].valid);
    }*/

    goBackToHome() {
        this.router.navigate(['/']);
    }

}
