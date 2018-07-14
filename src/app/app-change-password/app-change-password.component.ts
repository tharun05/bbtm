import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { Utility } from '../utils/utility';
import { AppLottodayService } from '../app-lottoday.service'
import { mixpanelService } from '../services/mixpanel.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-change-password',
  templateUrl: './app-change-password.component.html',
  styleUrls: ['./app-change-password.component.scss'],
        encapsulation: ViewEncapsulation.None

})
export class AppChangePasswordComponent implements OnInit {
	changePasswordForm = this.formBuilder.group({
    'old': ['', [CustomValidators.required]],
    'passwords': this.formBuilder.group({
      'password': ['', [CustomValidators.reqMin(4)]],
      'confirmPassword': ['', [CustomValidators.reqMin(4)]],
    }, {validator: CustomValidators.passwordConfirming})
	});
	formSubmitted:boolean = false;
  changePasswordSuccess:boolean = false;
  serverError;
  isPwdOld:boolean = true;
  isPwdNew:boolean = true;
  isPwdNewconf:boolean = true;
	constructor(private lottodayService:AppLottodayService,
		private utils:Utility,
    private formBuilder:FormBuilder,
    private mixpaneldataService:mixpanelService
  ) {

    }

	ngOnInit() {
	}

  closeModal(modalId){
    this.utils.closeModal(modalId);
  }
  shouldShowErrors(fieldName,formName){
    return this.utils.shouldShowErrors(fieldName,formName)
  }
  getErrorMessage(fieldName,formName){
    return this.utils.getErrorMessage(fieldName,formName)
  }
  getButtonClass(formName,fieldName){
    return this.utils.getButtonClass(formName,fieldName)
  }
  isButtonDisabled(formName){
    return this.utils.isButtonDisabled(formName)
  }

	changePassword(buttonId): void{
    this.utils.disableNewButton(buttonId);
    //this.utils.disableButton(buttonId);
    let errorDiv = "#serverErrorChangePassword";
    $(errorDiv).addClass("hide");
	    this.formSubmitted = true;
	    if (this.changePasswordForm.valid) {
	      let data=this.utils.formControlToParams(this.changePasswordForm,{});
	      Promise.resolve(this.lottodayService.changePassword(data))
	      .then(regData => {
	        if(regData && regData["success"] && regData["success"]["status"] === "SUCCESS"){
            var self = this;
            this.changePasswordSuccess = true;
            this.utils.enableNewButton(buttonId,"SUCCESS","Success","Change Password");
            this.utils.removeAllFormFieldsvalidation(this.changePasswordForm);
		        this.utils.resetFormFields(this.changePasswordForm);
            // setTimeout(function(){
            //   $("#successTick").toggleClass("success-tick");
            //   $("#formFields").toggleClass("hide-form-fields");
            // },1)
            //
	          // setTimeout(function(){
            //   self.changePasswordSuccess = false;
            //   $("#successTick").toggleClass("success-tick");
            //   $("#formFields").toggleClass("hide-form-fields");
            // },3000)
	        }else if(regData && regData["errors"] && regData["errors"]["message"]){
            this.utils.showError(errorDiv);
            this.serverError = regData["errors"]["message"];
            this.utils.enableNewButton(buttonId,"FAILED","Failed","Change Password");
          }else{
            this.utils.showError(errorDiv);
            this.serverError = "Something Went Wrong. Please try again later";
            this.utils.enableNewButton(buttonId,"FAILED","Failed","Change Password");
	        }
          this.formSubmitted = false;
          //this.utils.enableButton(buttonId);
	      },
	      SystemError => {
          this.utils.showError(errorDiv);
          this.serverError = "Something Went Wrong. Please try again later"
          //this.utils.enableButton(buttonId);
          this.utils.enableNewButton(buttonId,"FAILED","Failed","Change Password");
          this.formSubmitted = false;
	      });
	    } else {
	      this.utils.validateAllFormFields(this.changePasswordForm);
	      //this.utils.enableButton(buttonId);
        this.utils.enableNewButton(buttonId,"","Change Password","Change Password");
	    }
  }
  mixPanelEventCheck(type,gameName):void{
    Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile',type,gameName));
  }
}
