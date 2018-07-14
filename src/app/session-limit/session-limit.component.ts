import {Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {Utility} from '../utils/utility';
import {AppLottodayService} from '../app-lottoday.service'
import {RealityCheckService} from '../services/reality-check.service';
import {EmitterService} from '../services/emitter.service';
import {mixpanelService} from '../services/mixpanel.service';

@Component({
    selector: 'app-session-limit',
    templateUrl: './session-limit.component.html',
    styleUrls: ['./session-limit.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class SessionLimitComponent implements OnInit {

    @Input() sessionLimitAvailable;
    @Output() onSessionDataChanged: EventEmitter<any> = new EventEmitter<any>();
    availableLimit;
    pendingLimit;
    availableLimitHour;
    availableLimitMinute;
    serverError;
    formSubmitted: boolean = false;
    defaultValue = 0;
    sessionLimitForm = this.formBuilder.group({
        'limit': [this.defaultValue]
    },{validator:CustomValidators.validateNumericValue});
    constructor(private formBuilder: FormBuilder,
        private utils: Utility,
        private lottodayService: AppLottodayService,
        private realityCheckService: RealityCheckService,
        private emitterService: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {

    }

    ngOnInit() {
        this.pendingLimit = false;
        this.availableLimit = false;
        this.getDataToShow();
    }
    openModal(modalId){
      this.utils.openModal(modalId);
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

    getDataToShow() {
        this.utils.removeAllFormFieldsvalidation(this.sessionLimitForm);
        this.sessionLimitForm.controls["limit"].setValue(this.defaultValue);
        this.sessionLimitForm.controls["limit"].setValidators(CustomValidators.validateNumericValue());
        this.pendingLimit = false;
        this.availableLimit = false;
        if (this.sessionLimitAvailable && this.sessionLimitAvailable["limits"] && this.sessionLimitAvailable["limits"]["overall"]) {
            this.availableLimit = true;
            this.availableLimitHour = this.sessionLimitAvailable["limits"]["overall"]["value"]?Number(Math.floor(this.sessionLimitAvailable["limits"]["overall"]["value"] / 60)):0;
            this.availableLimitMinute = this.sessionLimitAvailable["limits"]["overall"]["value"]?Number(this.sessionLimitAvailable["limits"]["overall"]["value"] % 60):0;
        }

        if (this.sessionLimitAvailable && this.sessionLimitAvailable["pendingLimits"]) {
            this.pendingLimit = true;
        }
    }

    getSessionLimits(buttonId) {
        Promise.resolve(this.lottodayService.getSessionLimit())
            .then(sessionLimit => {
                if (sessionLimit) {
                    this.sessionLimitAvailable = sessionLimit;
                    this.onSessionDataChanged.emit(sessionLimit);
                    this.updateOverallSessionLimit();
                    this.getDataToShow();
                }
                if (buttonId) {
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Limit Set Successfully", "Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes-disable");
                }
            });
    }

    setSessionLimit(buttonId): void {

        let errorDiv = "#serverErrorSessionLimit";
        if (this.sessionLimitForm.valid) {
            this.utils.disableNewButton(buttonId);
            let sessionLimitData = {
                'type': 'session',
                'overall': this.sessionLimitForm.controls["limit"].value,
                'error': ''
            }

            Promise.resolve(this.lottodayService.setLimits(sessionLimitData))
                .then(setLimitResp => {
                    if (setLimitResp && setLimitResp["success"]) {
                        this.getSessionLimits(buttonId);
                        this.mixPanelEventCheck('sessionLimitSucess', sessionLimitData);
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes", "Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes-disable");
                    } else {
                        this.serverError = "Something Went wrong. Please try again Later";
                        sessionLimitData.error = this.serverError;
                        this.mixPanelEventCheck('sessionLimitFail', sessionLimitData)

                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes");
                    }
                });
        } else {
            this.utils.validateAllFormFields(this.sessionLimitForm);
        }
    }

    deleteReality(buttonId){
      this.utils.disableNewButton(buttonId);
      let data ={
        "type":"session"
      }
      Promise.resolve(this.lottodayService.deleteLimits(data))
      .then(deleteResp => {
        if(deleteResp && deleteResp["success"] == true){
          this.getSessionLimits("");
          this.utils.closeModal('sessionLimitDeleteModal');
        }else{
          this.utils.enableNewButton(buttonId,"FAILED","Please try Again","Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes");
        }

      },
      SystemError => {
        this.utils.enableNewButton(buttonId,"FAILED","Failed","Set session limit to "+this.sessionLimitForm.controls["limit"].value+" minutes");
      });
    }

    updateOverallSessionLimit(){
      this.realityCheckService.updateSessionVariable(this.sessionLimitAvailable.limits && this.sessionLimitAvailable.limits.overall.value ? this.sessionLimitAvailable.limits.overall.value : 0);
    }

    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile', type, gameName));
    }

    increaseLimit(){
      let limitValue = Number(this.sessionLimitForm.controls["limit"].value) + 1;
      this.sessionLimitForm.controls["limit"].setValue(limitValue);
    }

    decreaseLimit(){
      let limitValue = Number(this.sessionLimitForm.controls["limit"].value) - 1;
      if(limitValue < 0){
        limitValue = 0;
      }
      this.sessionLimitForm.controls["limit"].setValue(limitValue);
    }
}
