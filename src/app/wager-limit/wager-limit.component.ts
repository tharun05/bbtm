import {Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {Utility} from '../utils/utility';
import {AppLottodayService} from '../app-lottoday.service';
import {UserDetailsService} from '../services/user-details.service';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';
import {EmitterService} from '../services/emitter.service';
import {mixpanelService} from '../services/mixpanel.service';
@Component({
    selector: 'app-wager-limit',
    templateUrl: './wager-limit.component.html',
    styleUrls: ['./wager-limit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WagerLimitComponent implements OnInit {
    @Input() wagerLimitAvailable;
    @Output() onWagerDataChanged: EventEmitter<any> = new EventEmitter<any>();
    changedLimitType;
    hasPendingIncrease;
    confirmationRequired;
    daily;
    monthly;
    weekly;
    period;
    selectedPeriod;
    pendingAmount;
    serverError;
    pendingAmountPeriod;
    pendingTime;
    isDepositLimitTimer = true;
    userService;
    currentLimit;
    remainingLimit;
    defaultValue=0;
    wagerLimit = this.formBuilder.group({
        'limit': [this.defaultValue]
    });
    periodString;

    constructor(private lottodayService: AppLottodayService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetailsService: UserDetailsService,
        private emitterService: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {
        this.emitterService.wagerLimitTimerCompleted$.subscribe(
            status => {
                if (status == "TimerCompleted") {
                    this.getWagerLimits("");
                }
            }
        )
    }


    ngOnInit() {
      this.userService = this.userDetailsService;
      this.hasPendingIncrease = false;
      this.confirmationRequired = false;
      this.period = "daily";
      this.changePeriod(this.period);
    }
    ngAfterViewInit() {
      this.utils.setInputWidthResize()
    }
    closeModal(modalId) {
        this.utils.closeModal(modalId);
    }
    shouldShowErrors(fieldName, formName) {
        return this.utils.shouldShowErrors(fieldName, formName)
    }
    getErrorMessage(fieldName, formName) {
        return this.utils.getErrorMessage(fieldName, formName)
    }
    getButtonClass(formName, fieldName) {
        return this.utils.getButtonClass(formName, fieldName)
    }
    isButtonDisabled(formName) {
        return this.utils.isButtonDisabled(formName)
    }

    changePeriod(prd: string) {
      $('.inputCurrency').css({
        width: '30px'
      })
      this.period = prd;
      this.periodString = (prd === "daily")?'24 Hour':((prd === "weekly")?'7 Day':'30 Day');
      this.utils.removeAllFormFieldsvalidation(this.wagerLimit);
      this.wagerLimit.controls["limit"].setValue(this.defaultValue);
      this.wagerLimit.controls["limit"].setValidators(CustomValidators.validateLossWagerLimits(this.wagerLimitAvailable,this.period));

      if(this.wagerLimitAvailable && this.wagerLimitAvailable["limits"]){
        this.currentLimit = this.wagerLimitAvailable["limits"][this.period]?this.wagerLimitAvailable["limits"][this.period].value:0;
        this.remainingLimit = this.wagerLimitAvailable["limits"][this.period]?this.wagerLimitAvailable["limits"][this.period].remaining:0;
      }

      if(this.wagerLimitAvailable && this.wagerLimitAvailable["pendingLimits"] && this.wagerLimitAvailable["pendingLimits"][this.period]){
        this.hasPendingIncrease = true;
        this.pendingAmountPeriod = this.period;
        this.confirmationRequired = true;
        this.pendingAmount = this.wagerLimitAvailable["pendingLimits"][this.period]["value"];
        if (this.wagerLimitAvailable["pendingLimits"][this.period].remainingTime > 0) {
            this.pendingTime = new Date().getTime() + Number(this.wagerLimitAvailable["pendingLimits"][this.period].remainingTime) * 60000;
            this.isDepositLimitTimer = true;
            this.confirmationRequired = false;
        }
      }else{
        this.confirmationRequired = false;
        this.hasPendingIncrease = false;
      }
    }

    getWagerLimits(buttonId) {
        Promise.resolve(this.lottodayService.getWagerLimit())
            .then(wagerLimit => {
                if (wagerLimit) {
                    this.wagerLimitAvailable = wagerLimit;
                    this.onWagerDataChanged.emit(wagerLimit);
                    this.changePeriod(this.period);
                }
                if (buttonId) {
                    this.utils.openModal("limitSetModal");
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Limit Set Successfully", "Set "+this.periodString+" wager limit to "+this.wagerLimit.controls["limit"].value+"-disable");
                }

            });
    }

    approveIncreaseLimitOpenModal() {
        $('.confirm-set-limit').removeClass('hide');
        $('.set-limit-updated').addClass('hide');
        this.utils.openModal("limitSetModal");
    }

    approveIncreaseLimit(buttonId,isConfirmed) {
        let errorDiv = "#serverErrorWagerLimitApprove";
        $(errorDiv).addClass('hide');
        let data = {
            "limitType": "WAGERLIMIT",
            "isConfirmed": isConfirmed
        }
        data[this.period] = this.pendingAmount;
        this.utils.disableNewButton(buttonId);
        Promise.resolve(this.lottodayService.approveLimits(data))
            .then(wagerData => {
                if (wagerData && wagerData["success"]) {
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Approved", "APPROVE-disable");
                    this.getWagerLimits("");
                    $('.confirm-set-limit').addClass('hide');
                    $('.set-limit-updated').removeClass('hide');
                    this.utils.closeModal("limitSetModal");

                } else {
                    if (wagerData && wagerData["success"]["status"] != "SUCCESS" && wagerData["success"]["errorDescription"]) {
                        this.serverError = wagerData["success"]["errorDescription"];
                    } else {
                        this.serverError = "Oops.. Something went wrong!";
                    }
                    $(errorDiv).removeClass('hide');
                    this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "APPROVE");
                }

                //this.utils.openModal("limitSetModal");
            }, SystemError => {
                this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "APPROVE");
            });
    }

    setLossLimit(buttonId): void {

        let errorDiv = "#serverErrorLossLimit";
        if (this.wagerLimit.valid) {
            this.utils.disableNewButton(buttonId);
            let wagerLimitData = {
                'type': 'wager',
                'error': ''
            }
            wagerLimitData[this.period] = this.wagerLimit.controls["limit"].value;

            Promise.resolve(this.lottodayService.setLimits(wagerLimitData))
                .then(setLimitResp => {
                    if (setLimitResp && setLimitResp["success"]) {
                        this.getWagerLimits(buttonId);
                        this.mixPanelEventCheck('wagerLimitSucess', wagerLimitData);
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Set "+this.periodString+" wager limit to "+this.wagerLimit.controls["limit"].value, "Set "+this.periodString+" wager limit to "+this.wagerLimit.controls["limit"].value+"-disable");
                    } else {
                        this.serverError = "Something Went wrong. Please try again Later";
                        wagerLimitData.error = this.serverError;
                        this.mixPanelEventCheck('wagerLimitFail', wagerLimitData)

                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Set "+this.periodString+" wager limit to "+this.wagerLimit.controls["limit"].value);
                    }
                });
        } else {
            this.utils.validateAllFormFields(this.wagerLimit);
        }
    }
    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile', type, gameName));
    }

    increaseLimit(){
      let limitValue = Number(this.wagerLimit.controls["limit"].value) + 1;
      this.wagerLimit.controls["limit"].setValue(limitValue);
    }

    decreaseLimit(){
      let limitValue = Number(this.wagerLimit.controls["limit"].value) - 1;
      if(limitValue < 0){
        limitValue = 0;
      }
      this.wagerLimit.controls["limit"].setValue(limitValue);
    }

}
