import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { Utility } from '../utils/utility';
import { AppLottodayService } from '../app-lottoday.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordDetails:any = {};
  serverError;
  newPasswordType:boolean = true;
  confirmPasswordType:boolean = true;
  resetSuccess:boolean = false;
  resetPasswordForm = this.formBuilder.group({
    'passwords': this.formBuilder.group({
       'password': [''],
       'confirmPassword': [''],
     }, {validator: CustomValidators.passwordConfirming}),
     'token': ['', [CustomValidators.required]]
   });
  constructor(private utils:Utility,
    private activatedRoute:ActivatedRoute,
    private formBuilder:FormBuilder,
    private lottodayService:AppLottodayService,
    private router:Router) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(queryParams =>{
			var paramKeys = queryParams.keys;
			var self = this;
			paramKeys.forEach(function(key,value){
				self.resetPasswordDetails[key]=queryParams.get(key);
			});
      this.resetPasswordForm.controls["token"].setValue(this.resetPasswordDetails.token);
		});
  }

  shouldShowErrors(fieldName,formName){
       return this.utils.shouldShowErrors(fieldName,formName)
  }

  isButtonDisabled(formName){
        return this.utils.isButtonDisabled(formName)
  }

  getErrorMessage(fieldName,formName){
       return this.utils.getErrorMessage(fieldName,formName)
  }
  resetPassword(buttonId){
		let errorDiv = "#serverErrorResetpassword"
		$(errorDiv).addClass("hide");
		if (this.resetPasswordForm.valid) {
      this.utils.disableNewButton(buttonId);
			let pwdDetails = this.utils.formControlToParams(this.resetPasswordForm,{});
			Promise.resolve(this.lottodayService.resetPassword(pwdDetails))
			.then(resetPasswordResp => {
				if(resetPasswordResp && resetPasswordResp["success"]){
          this.utils.enableNewButton(buttonId,"SUCCESS","SUCCESS","RESET PASSWORD");
          this.resetSuccess = true;
				}else{
          if(resetPasswordResp && resetPasswordResp["errors"]){
            this.serverError = resetPasswordResp["errors"][0].message;
          }else{
            this.serverError = "Something went wrong. Please try again later."
          }
          $(errorDiv).removeClass("hide");
          this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","RESET PASSWORD");

				}
			},
			SystemError => {
				this.serverError = SystemError;

				$(errorDiv).removeClass("hide");
        this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","RESET PASSWORD");
				//this.utils.enableButton(buttonId);
				//console.log(SystemError);
			});
		}else{
      this.utils.validateAllFormFields(this.resetPasswordForm);
    }
	}

}
