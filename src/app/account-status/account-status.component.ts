import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { selfExclusionList } from '../utils/lotteryConfig';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { AppLottodayService } from '../app-lottoday.service'
import { Utility } from '../utils/utility'
import { EmitterService } from '../services/emitter.service'
import { Router } from '@angular/router'
import { mixpanelService } from '../services/mixpanel.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AccountStatusComponent implements OnInit {

	pausePeriods;
	period;
	periodSelect;
	selectedPeriod;
  serverError;
  formSubmitted:boolean = false;
  isPassword:boolean = true;
  suspendAccountForm = this.formBuilder.group({
		'expire': ['', [CustomValidators.required]],
		'reason': ['Self Exclusion',[CustomValidators.required]],
		'confpassword': ['',[CustomValidators.required]],
	});
	constructor(private formBuilder:FormBuilder,
				private lottodayService:AppLottodayService,
        private utils:Utility,
        private emitterService:EmitterService,
        private router:Router,
        private mixpaneldataService:mixpanelService
) {
        }

	ngOnInit() {
		this.pausePeriods = selfExclusionList;
		this.period='0';
		this.periodSelect = this.pausePeriods[0].days
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
	suspendAccount(buttonId){
		this.period == 1 ? this.selectedPeriod = this.periodSelect : this.selectedPeriod = this.period
    if(this.selectedPeriod > 0){
      let errorDiv = "#serverError-suspendAccount";
      $(errorDiv).addClass("hide");
      this.suspendAccountForm.controls["expire"].setValue(this.selectedPeriod);
      this.utils.openModal("suspendAccountModal");
    }
	}
  confirmSuspendAccount(buttonId){
    let errorDiv = "#serverError-suspendAccount";
		/*$(errorDiv).addClass("hide");
		this.utils.disableButton(buttonId);*/
		this.utils.disableNewButton(buttonId);
		this.formSubmitted = true;
		if (this.suspendAccountForm.valid) {
      let data= this.utils.formControlToParams(this.suspendAccountForm,{});
      data.password = this.suspendAccountForm.controls["confpassword"].value;
      delete data.confpassword;
      
      Promise.resolve(this.lottodayService.suspendAccount(data))
			.then(susAccountData => {
        if(susAccountData && susAccountData["success"]){
          this.formSubmitted = false;
         this.utils.enableNewButton(buttonId,"SUCCESS","Success","SUBMIT");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("cartList");
          this.emitterService.broadcastLoginStatus();
          this.router.navigate(['/']);
          this.eventMix(data)
      this.utils.closeModal("suspendAccountModal");
          
        }else{
          this.serverError = susAccountData["errors"]["password"];
  				this.utils.showError(errorDiv);
  				this.utils.enableNewButton(buttonId,"FAILED","Failed","SUBMIT");
  				this.formSubmitted = false;
        }
        //do Logout
			},SystemError => {
        this.serverError = "Something went wrong. Please try again later.";
				this.utils.showError(errorDiv);
				this.utils.enableNewButton(buttonId,"FAILED","Failed","SUBMIT");
				this.formSubmitted = false;
			});

    }
  }
  eventMix(data){
    this.mixPanelEventCheck('accountstauts',data)
  }
  mixPanelEventCheck(type,gameName):void{
    Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile',type,gameName));
  }
}
