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
    selector: 'app-deposit-limit',
    templateUrl: './app-deposit-limit.component.html',
    styleUrls: ['./app-deposit-limit.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppDepositLimitComponent implements OnInit {
    @Input() depositLimitAvailable;
    @Output() onDepositDataChanged: EventEmitter<any> = new EventEmitter<any>();
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
    periodString;
    defaultValue =0;
    depositLimit = this.formBuilder.group({
        'limit': [this.defaultValue],
    });

    constructor(private lottodayService: AppLottodayService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetailsService: UserDetailsService,
        private emitterService: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {
       this.emitterService.depositLimitTimerCompleted$.subscribe(
           status => {
               if (status == "TimerCompleted") {
                   this.getDepositLimits("");
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
        this.utils.removeAllFormFieldsvalidation(this.depositLimit);
        this.depositLimit.controls["limit"].setValue(this.defaultValue);
        this.depositLimit.controls["limit"].setValidators(CustomValidators.validateDepositAmount(this.depositLimitAvailable,this.period));

        this.currentLimit = this.depositLimitAvailable[this.period].value?this.depositLimitAvailable[this.period].value:0;
        this.remainingLimit = this.depositLimitAvailable[this.period].remaining?this.depositLimitAvailable[this.period].remaining:0;

        if (this.depositLimitAvailable[this.period] && this.depositLimitAvailable[this.period].pending > 0 && this.depositLimitAvailable[this.period].remainingTime > 0) {
            this.pendingTime = new Date().getTime() + Number(this.depositLimitAvailable[this.period].remainingTime) * 60000;
            this.pendingAmount = this.depositLimitAvailable[this.period].pending ? this.depositLimitAvailable[this.period].pending : 0;
            this.pendingAmountPeriod = this.depositLimitAvailable[this.period].pending ? this.period : '';
            this.isDepositLimitTimer = true;
            this.confirmationRequired = this.depositLimitAvailable[this.period].hasPendingIncrease;
            this.hasPendingIncrease = true;
        }else if (this.depositLimitAvailable[this.period] && this.depositLimitAvailable[this.period].hasPendingIncrease) {
            this.pendingAmount = this.depositLimitAvailable[this.period].pending ? this.depositLimitAvailable[this.period].pending : 0;
            this.pendingAmountPeriod = this.depositLimitAvailable[this.period].pending ? this.period : '';
            this.confirmationRequired = true;
            this.hasPendingIncrease = true;
        }else{
            this.confirmationRequired = false;
            this.hasPendingIncrease = false;
        }
    }

    getDepositLimits(buttonId) {
        Promise.resolve(this.lottodayService.getDepositLimit())
            .then(depositLimit => {
                if (depositLimit) {
                    this.depositLimitAvailable = depositLimit["limits"]["deposit"];
                    this.onDepositDataChanged.emit(this.depositLimitAvailable);
                    this.changePeriod(this.period);
                }
                if (buttonId) {
                    this.utils.openModal("limitSetModal");
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Limit Set Successfully", "Set "+this.periodString+" deposit limit to "+this.depositLimit.controls["limit"].value+"-disable");
                }

            });
    }
    approveIncreaseLimitOpenModal() {
        $('.confirm-set-limit').removeClass('hide');
        $('.set-limit-updated').addClass('hide');
        this.utils.openModal("limitSetModal");
    }

    approveIncreaseLimit(buttonId,isConfirmed) {
        let errorDiv = "#serverErrorDepositLimitApprove";
        $(errorDiv).addClass('hide');
        let data = {
            "limitTypes": this.period.toUpperCase(),
            "isConfirmed": isConfirmed
        }
        this.utils.disableNewButton(buttonId);
        Promise.resolve(this.lottodayService.approveDepositLimit(data))
            .then(depositData => {
                if (depositData && depositData["success"]["status"] == "SUCCESS") {
                    this.depositLimitAvailable = depositData["limits"];
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Approved", "APPROVE-disable");
                    this.getDepositLimits("");
                    $('.confirm-set-limit').addClass('hide');
                    $('.set-limit-updated').removeClass('hide');
                    this.utils.closeModal("limitSetModal");

                } else {
                    if (depositData && depositData["success"]["status"] != "SUCCESS" && depositData["success"]["errorDescription"]) {
                        this.serverError = depositData["success"]["errorDescription"];
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

    setDepositLimit(buttonId): void {

        let errorDiv = "#serverErrorDepositLimit";
        if (this.depositLimit.valid) {
            this.utils.disableNewButton(buttonId);
            let depositLimitData = {
                'type': 'deposit',
                'error': ''
            }
            depositLimitData[this.period] = this.depositLimit.controls["limit"].value;

            Promise.resolve(this.lottodayService.setLimits(depositLimitData))
                .then(setLimitResp => {
                    if (setLimitResp && setLimitResp["success"]) {
                        this.getDepositLimits(buttonId);
                        this.mixPanelEventCheck('depositLimitSucess', depositLimitData);
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Set "+this.periodString+" deposit limit to "+this.depositLimit.controls["limit"].value, "Set "+this.periodString+" deposit limit to "+this.depositLimit.controls["limit"].value+"-disable");
                    } else {
                        this.serverError = "Something Went wrong. Please try again Later";
                        depositLimitData.error = this.serverError;
                        this.mixPanelEventCheck('depositLimitFail', depositLimitData)

                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Set "+this.periodString+" deposit limit to "+this.depositLimit.controls["limit"].value);
                    }
                });
        } else {
            this.utils.validateAllFormFields(this.depositLimit);
            //this.utils.enableNewButton(buttonId,"","","SET LIMIT");
        }
    }
    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile', type, gameName));
    }

    increaseLimit(){
      this.utils.setInputWidthResize();
      let limitValue = Number(this.depositLimit.controls["limit"].value) + 1;
      this.depositLimit.controls["limit"].setValue(limitValue);
    }

    decreaseLimit(){
      let limitValue = Number(this.depositLimit.controls["limit"].value) - 1;
      if(limitValue < 0){
        limitValue = 0;
      }
      this.depositLimit.controls["limit"].setValue(limitValue);
    }
}
