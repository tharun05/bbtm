import { Component, OnInit, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { TranslateService } from '@ngx-translate/core';
import { RealityCheckService } from '../services/reality-check.service';
import { mixpanelService } from '../services/mixpanel.service';
import { SocketService } from '../services/socket.service';


import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-login-form',
  templateUrl: './app-login-form.component.html',
  styleUrls: ['./app-login-form.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppLoginFormComponent implements OnInit {

	passwordField:boolean = true;
	@Input() isLoginComplete;
	@Input() callingFrom;
	@Output() isLoginCompleteNotify  = new EventEmitter<string>();
	serverError:string = "";

	constructor(private lottodayService:AppLottodayService,
  				private utils:Utility,
  				private router:Router,
  				private formBuilder:FormBuilder,
        private translateService:TranslateService,
				private realityCheckService:RealityCheckService,
				private mixpaneldataService:mixpanelService,
        private socketService:SocketService
			) { }

	ngOnInit() {
    //this.translateService.get("");
	}
  	loginForm = this.formBuilder.group({
		'txtEmail': ['', [CustomValidators.required]],
		'txtPassword': ['', [CustomValidators.required]]
	});

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
	/*shouldShowErrors(controlFormNField): boolean {
		let control;
		control = this.loginForm.controls[controlFormNField];

		return control &&
		control.errors &&
		(control.dirty || control.touched);
	}

	getErrorMessage(controlFormNField): string{
		let formControl;
		formControl = this.loginForm.controls[controlFormNField];
		return formControl.errors.message;
	}*/

  openForgotPassword(){
    if(document.body.clientWidth <= 992){
      this.mobileRouting('right','/forgotten-password');
    }else{
      this.closeModal()
    }
  }
  closeModal(){
    this.utils.closeModal("loginModal");
    this.router.navigate(["/forgotten-password"], {queryParamsHandling: 'preserve' });
    this.utils.hideMenu("header");
  }

  mobileRouting(side,route):void{
    $('body').toggleClass('navOpen-'+side);
    side == 'right' ? $('.modal-body').toggleClass('modalOpenRight') : $('.modal-body').toggleClass('modalOpenLeft');
    this.utils.closeModal("loginModal");
    this.router.navigate([route], {queryParamsHandling: 'preserve' });
  }

	login(buttonId):void {
		let errorDiv = "#serverError-"+this.callingFrom
		$(errorDiv).addClass("hide");
		if (this.loginForm.valid) {
			//this.utils.disableButton(buttonId);
      this.utils.disableNewButton(buttonId);
			let credentials = {
			  'txtEmail':this.loginForm.controls["txtEmail"].value,
			  'txtPassword':this.loginForm.controls["txtPassword"].value
			}
			Promise.resolve(this.lottodayService.doLogin(credentials))
			.then(loginData => {
				if(loginData && loginData["success"] === "true"){
					let socketInfo = loginData["user"]
					this.socketService.setSocketURL(socketInfo['riverplayUrl']);
					this.socketService.setSocketId(socketInfo['rvpSessionId']);
					this.socketService.setPartnerId(socketInfo["partnerId"]);
					this.socketService.connectToSocket("authCode");
					this.isLoginCompleteNotify.emit(buttonId+"|"+errorDiv);
          if(loginData["sessionLimit"] > 0){
            this.realityCheckService.setSessionVariable("session",{sessionLimit:loginData["sessionLimit"],availableSessionLimit:loginData["sessionLimit"]*60});
            this.realityCheckService.startLoginSession();
					}
					this.mixPanelEventCheck('login',credentials.txtEmail)
				}else{
					if(loginData && loginData["errors"]){
						if(loginData["errors"]["txtEmail"]){
							this.serverError = loginData["errors"]["txtEmail"];
							console.log(this.serverError)
					this.mixPanelEventCheck('loginerror',this.serverError)
						}else if(loginData["errors"]["remoteError"]){
							this.serverError = loginData["errors"]["remoteError"];
							console.log(this.serverError)

					this.mixPanelEventCheck('loginerror',this.serverError)
						}else if(loginData["errors"]["accountLocked"]){
              let errorMessage = loginData["errors"]["accountLocked"].split(":")[0];
							this.serverError = errorMessage + new Date(loginData["errors"]["accountLocked"].substr(loginData["errors"]["accountLocked"].indexOf(":")));
							console.log(this.serverError)

					this.mixPanelEventCheck('loginerror',this.serverError)
						}else{
							this.serverError = "Something went wrong. Please Try again Later";
							console.log(this.serverError)

					this.mixPanelEventCheck('loginerror',this.serverError)
						}

						$(errorDiv).removeClass("hide");
					}else{
            this.serverError = "Something went wrong. Please Try again Later"
            $(errorDiv).removeClass("hide");
          }
					//this.utils.enableButton(buttonId);
          this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","Login");
				}
			},
			SystemError => {
				this.serverError = SystemError;

				$(errorDiv).removeClass("hide");
        this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","Login");
				//this.utils.enableButton(buttonId);
				//console.log(SystemError);
			});
		}


	}

	mixPanelEventCheck(type,data):void{
		let gameType='';
		Promise.resolve(this.mixpaneldataService.loginform(type,gameType,data))
	}
}
