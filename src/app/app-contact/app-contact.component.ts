import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { error } from 'selenium-webdriver';
import { EmitterService } from '../services/emitter.service';
import { UserDetailsService } from '../services/user-details.service';
import { mixpanelService } from '../services/mixpanel.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

import 'selectric';


@Component({
	selector: 'app-contact',
	templateUrl: './app-contact.component.html',
	styleUrls: ['./app-contact.component.scss'],
	  encapsulation: ViewEncapsulation.None

})
export class AppContactComponent implements OnInit {
	userDetail;
	success:boolean = false;
	contactReason;

	contactForm = this.formBuilder.group({
		'firstName': ['', [CustomValidators.required]],
		'lastName': ['', [CustomValidators.required]],
		'email': ['', [CustomValidators.validateUniqueness("txtEmail",this.lottodayService,"")]],
		'enquiry': ['', [CustomValidators.required]],
		'description': ['', [CustomValidators.required]]
	});

	constructor(private lottodayService: AppLottodayService,
		private emitterService: EmitterService,
		private utils: Utility,
		private userService: UserDetailsService,
		private formBuilder: FormBuilder,
		private mixpaneldataService:mixpanelService
	) {
		emitterService.userDataSource$.subscribe(
			userDataSource => {
				if (userDataSource == "User Data Updated") {
					this.userDetail = this.userService.getuserProfileDetails();
					this.updateFormFields();
				}
			}
		);
	}

	ngOnInit() {
		this.userDetail = this.userService.getuserProfileDetails();
		this.updateFormFields();
		var self = this;
		setTimeout(function(){
			$("#enquiry").selectric({
				disableOnMobile: false,
				nativeOnMobile: false,
				onChange:function(){
					self.contactForm.controls["enquiry"].setValue($("#enquiry").val());
				}
			});
		},1);
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

	updateFormFields(): void {
		if (this.userDetail) {
			this.contactForm.controls["firstName"].setValue(this.userDetail["firstName"]);
			this.contactForm.controls["lastName"].setValue(this.userDetail["lastName"]);
			this.contactForm.controls["email"].setValue(this.userDetail["email"]);
		}
	}

	contact(buttonId): void {
		this.success = false;
		if (this.contactForm.valid) {
			this.utils.disableNewButton(buttonId);

			let contactDetails = {
				// 'to': 'contact@bingo69.com',
				'to': 'support@bingo69.com',
				'subject': this.contactForm.controls["enquiry"].value,
				'body': this.contactForm.controls["description"].value,
				'fromEmail': this.contactForm.controls["email"].value,
				'fromName': this.contactForm.controls["firstName"].value + " " + this.contactForm.controls["lastName"].value
			}
			this.contactReason = this.contactForm.controls["enquiry"].value;
			Promise.resolve(this.lottodayService.doContact(contactDetails))
			.then(contactData => {
				//this.contactReason = this.contactForm.controls["enquiry"].value;
				if(contactData){
					this.utils.enableNewButton(buttonId,"SUCCESS","Success","SEND-disable");
					this.reset();
					this.updateFormFields();
					this.success = true;
				}else{
					this.utils.enableNewButton(buttonId,"FAILED","Please try again","SEND");
				}
			})

		}

	}

	reset(): void {

		// this.contactForm.controls["description"].setValue("")
		this.utils.resetFormFields(this.contactForm);

		this.utils.removeAllFormFieldsvalidation(this.contactForm);
	}
	mixPanelEventCheck(type,gameName):void{
		Promise.resolve(this.mixpaneldataService.userLoggedIn('contact',type,''))
	  }
}
