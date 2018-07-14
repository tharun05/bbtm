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
    selector: 'app-loss-limit',
    templateUrl: './loss-limit.component.html',
    styleUrls: ['./loss-limit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LossLimitComponent implements OnInit {
    @Input() lossLimitAvailable;
    @Output() onLossDataChanged: EventEmitter<any> = new EventEmitter<any>();
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
    currentLimit;
    remainingLimit;
    isDepositLimitTimer = true;
    userService;
    defaultValue=0;
    lossLimit = this.formBuilder.group({
        'limit': [this.defaultValue],
    });
    periodString;

    constructor(private lottodayService: AppLottodayService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetailsService: UserDetailsService,
        private emitterService: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {
        this.emitterService.lossLimitTimerCompleted$.subscribe(
            status => {
                if (status == "TimerCompleted") {
                    this.getLossLimits("");
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
      this.utils.setInputWidthResize();
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
        this.utils.removeAllFormFieldsvalidation(this.lossLimit);
        this.lossLimit.controls["limit"].setValue(this.defaultValue);
        this.lossLimit.controls["limit"].setValidators(CustomValidators.validateLossWagerLimits(this.lossLimitAvailable,this.period));

        if(this.lossLimitAvailable && this.lossLimitAvailable["limits"]){
          this.currentLimit = this.lossLimitAvailable["limits"][this.period]?this.lossLimitAvailable["limits"][this.period].value:0;
          this.remainingLimit = this.lossLimitAvailable["limits"][this.period]?this.lossLimitAvailable["limits"][this.period].remaining:0;
        }

        if(this.lossLimitAvailable && this.lossLimitAvailable["pendingLimits"] && this.lossLimitAvailable["pendingLimits"][this.period]){
          this.hasPendingIncrease = true;
          this.pendingAmountPeriod = this.period;
          this.confirmationRequired = true;
          this.pendingAmount = this.lossLimitAvailable["pendingLimits"][this.period]["value"];
          if (this.lossLimitAvailable["pendingLimits"][this.period].remainingTime > 0) {
              this.pendingTime = new Date().getTime() + Number(this.lossLimitAvailable["pendingLimits"][this.period].remainingTime) * 60000;
              this.isDepositLimitTimer = true;
              this.confirmationRequired = false;
          }
        }else{
          this.confirmationRequired = false;
          this.hasPendingIncrease = false;
        }
    }

    getLossLimits(buttonId) {
        Promise.resolve(this.lottodayService.getLossLimit())
            .then(lossLimit => {
                if (lossLimit) {
                    this.lossLimitAvailable = lossLimit;
                    this.onLossDataChanged.emit(lossLimit);
                    this.changePeriod(this.period);
                }
                if (buttonId) {
                    this.utils.openModal("limitSetModal");
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Limit Set Successfully", "Set "+this.periodString+" loss limit to "+this.lossLimit.controls["limit"].value+"-disable");
                }

            });
    }

    approveIncreaseLimitOpenModal() {
        $('.confirm-set-limit').removeClass('hide');
        $('.set-limit-updated').addClass('hide');
        this.utils.openModal("limitSetModal");
    }

    approveIncreaseLimit(buttonId,isConfirmed) {
        let errorDiv = "#serverErrorLossLimitApprove";
        $(errorDiv).addClass('hide');
        let data = {
            "limitType": "LOSSLIMIT",
            "isConfirmed": isConfirmed
        }
        data[this.period] = this.pendingAmount;
        this.utils.disableNewButton(buttonId);
        Promise.resolve(this.lottodayService.approveLimits(data))
            .then(lossData => {
                if (lossData && lossData["success"]) {
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Approved", "APPROVE-disable");
                    this.getLossLimits("");
                    $('.confirm-set-limit').addClass('hide');
                    $('.set-limit-updated').removeClass('hide');
                    this.utils.closeModal("limitSetModal");

                } else {
                    if (lossData && lossData["success"]["status"] != "SUCCESS" && lossData["success"]["errorDescription"]) {
                        this.serverError = lossData["success"]["errorDescription"];
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
        if (this.lossLimit.valid) {
            this.utils.disableNewButton(buttonId);
            let lossLimitData = {
                'type': 'loss',
                // 'daily': this.daily?this.daily.value:0,
                // 'weekly': this.weekly?this.weekly.value:0,
                // 'monthly': this.monthly?this.monthly.value:0,
                'error': ''
            }
            lossLimitData[this.period] = this.lossLimit.controls["limit"].value;
            // this.changedLimitType = this.depositLimit.controls["type"].value;
            // if (this.depositLimitAvailable[this.depositLimit.controls["type"].value]) {
            //
            // }
            // var self = this;
            // _.each(this.depositLimitAvailable, function (value, key) {
            //     if (key != self.depositLimit.controls["type"].value) depositLimitData[key] = value["value"];
            // });
            Promise.resolve(this.lottodayService.setLimits(lossLimitData))
                .then(setLimitResp => {
                    //console.log(depositLimit);
                    if (setLimitResp && setLimitResp["success"]) {
                        this.getLossLimits(buttonId);
                        this.mixPanelEventCheck('lossLimitSucess', lossLimitData);
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Set "+this.periodString+" loss limit to "+this.lossLimit.controls["limit"].value, "Set "+this.periodString+" loss limit to "+this.lossLimit.controls["limit"].value+"-disable");
                    } else {
                        this.serverError = "Something Went wrong. Please try again Later";
                        lossLimitData.error = this.serverError;
                        this.mixPanelEventCheck('lossLimitFail', lossLimitData)

                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Set "+this.periodString+" loss limit to "+this.lossLimit.controls["limit"].value);
                    }
                });
        } else {
            this.utils.validateAllFormFields(this.lossLimit);
            //this.utils.enableNewButton(buttonId,"","","SET LIMIT");
        }
    }
    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile', type, gameName));
    }

    increaseLimit(){
      let limitValue = Number(this.lossLimit.controls["limit"].value) + 1;
      this.lossLimit.controls["limit"].setValue(limitValue);
    }

    decreaseLimit(){
      let limitValue = Number(this.lossLimit.controls["limit"].value) - 1;
      if(limitValue < 0){
        limitValue = 0;
      }
      this.lossLimit.controls["limit"].setValue(limitValue);
    }

}
