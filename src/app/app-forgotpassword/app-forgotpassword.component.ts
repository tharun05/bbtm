import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { Router } from '@angular/router';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './app-forgotpassword.component.html',
  styleUrls: ['./app-forgotpassword.component.scss']
})
export class AppForgotpasswordComponent implements OnInit {
  forgotPasswordForm = this.formBuilder.group({
    'email': ['', [CustomValidators.validateUniqueness("txtEmail",this.lottodayService,false)]],
  });
  serverError;
  emailId;
  emailSent:boolean = false;
  constructor(private lottodayService:AppLottodayService,
      private router:Router,
      private formBuilder:FormBuilder,
      private utils:Utility) {
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

  moveToLogin(){
    this.router.navigate(['/login'], {queryParamsHandling: 'preserve' })
  }


  forgotPassword(buttonId){
		let errorDiv = "#serverErrorForgotPassword";
    this.emailSent = false;
		$(errorDiv).addClass("hide");
		if (this.forgotPasswordForm.valid) {
      this.utils.disableNewButton(buttonId);
			let emailDetails = this.utils.formControlToParams(this.forgotPasswordForm,{});
			Promise.resolve(this.lottodayService.forgotPassword(emailDetails))
			.then(forgotPasswordResp => {
				if(forgotPasswordResp && forgotPasswordResp["success"]){
          this.utils.enableNewButton(buttonId,"SUCCESS","SUCCESS","RESET PASSWORD");
          this.emailSent = true;
          this.emailId= forgotPasswordResp["success"]["emailId"];
				}else{
          if(forgotPasswordResp && forgotPasswordResp["error"]){
            this.serverError = forgotPasswordResp["error"];
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
      this.utils.validateAllFormFields(this.forgotPasswordForm);
    }
  }
  openModal(modalId): void {
    this.utils.openModal(modalId);
  }



}
