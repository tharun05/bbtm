import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { Router,ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { PasswordStrengthBarComponent } from '../password-strength-bar/password-strength-bar.component'
import { EmitterService } from '../services/emitter.service';
import * as _ from 'underscore';
import { UserDetailsService } from '../services/user-details.service';
import { dateMobiScroll } from '../utils/lotteryConfig';
import { mixpanelService } from '../services/mixpanel.service';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
encapsulation: ViewEncapsulation.None

})
export class CompleteProfileComponent implements OnInit {

  @Input() regAndLogin;
  @Input() profileName;
  @Input() initailisingComp;
  @Input() callingFrom;
	@Output() updateProfileComplete = new EventEmitter<string>();
	countries;
    minimumDate: Date;
	isPassword: boolean = true;
	areaCode: number;
	areaCountryCode: string;
	token: string;
	step1Complete: boolean = false;
	step2Complete: boolean = false;
	bDay: string;
	bMonth: string;
	bYear: string;
	address: string;
	state: string;
	quickSave:boolean =true;
	availableCurrency:any;
	emailVerificationSent: boolean;
	otpVerified: boolean = false;
  formSubmitted: boolean;
  isDOBavailable: boolean = true;
  isGenderAvailable: boolean = true;
  isMobileAvailable:boolean = true;
	otp1: string;
	otp2: string;
	otp3: string;
	otp4: string;
	otp5: string;
	serverError;
	otpErrorMessage;
  stateAvailable = false;
  userDetails;
  stateList;
  stateCheck;
  isRealUser;
  isCheckoutPage;
  ipCountry;
  mobiScrollSetting;
  redirectTo;
	profileUpdateForm = this.formBuilder.group({
		'address1': ['', [CustomValidators.addressValidator]],
		'city': ['', [CustomValidators.validName(2,50)]],
		'zip': ['', [CustomValidators.validAlphaNumeric(2,9)]],
		'country': ['', [CustomValidators.required]],
		'dob': ['', [CustomValidators.required]],
    'gender': ['M', [CustomValidators.required]],
    'firstName': ['', [CustomValidators.validName(2, 30)]],
    'lastName': ['', [CustomValidators.validName(2, 30)]],
    'phone': ['', [CustomValidators.phoneNumberValidator]]
		// 'otp1': ['', [CustomValidators.required]],
		// 'otp2': ['', [CustomValidators.required]],
		// 'otp3': ['', [CustomValidators.required]],
		// 'otp4': ['', [CustomValidators.required]],
		// 'otp5': ['', [CustomValidators.required]]
	});
  isProfileCompleted = undefined;
  userDataUpdatedSubs;
  constructor(private lottodayService:AppLottodayService,
  				private utils:Utility,
  				private router:Router,
          private activatedRoute:ActivatedRoute,
  				private formBuilder:FormBuilder,
  				private emitterService: EmitterService,
          private userDetailService:UserDetailsService,
          private mixpaneldataService:mixpanelService
        ) {
            this.userDataUpdatedSubs = emitterService.userDataSource$.subscribe(
              userDataSource => {
                if (userDataSource == "User Data Updated") {
                  this.userDetails = this.userDetailService.getuserProfileDetails();
                  this.checkForDobAndGender()
                  this.updateFormFields();
                }
              }
            );
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
          ngOnInit() {
            this.mobiScrollSetting = dateMobiScroll;
            this.activatedRoute.queryParamMap.subscribe(queryParams =>{
              this.isCheckoutPage = queryParams.get("checkout") || queryParams.get("deposit") || queryParams.get("buyTicket") || queryParams.get("cashier");
              queryParams.get("checkout") ? this.redirectTo = "/checkout"
                              : queryParams.get("deposit") ?  this.redirectTo = "/payment/deposit"
                                            : queryParams.get("buyTicket") ? this.redirectTo = "/payment/buyTicket"
                                                              : queryParams.get("cashier") ?  this.redirectTo = "/myaccount/cashier" : ''
            });
            let countryList = this.utils.getCountryList();
            if (!countryList) {
              Promise.resolve(this.lottodayService.getCountries())
                .then(regData => {
                  if (regData["countrylist"]) {
                    this.countries = regData["countrylist"];
                    this.utils.setCountryDetails(regData["countrylist"]);
                    this.checkForDobAndGender();
                    this.updateFormFields();
                  } else {
                  }
                });
            } else {
              this.countries = countryList;
            }
            Promise.resolve(this.lottodayService.checkUserProfile())
            .then(profileData => {
              if(profileData && profileData["userProfileCompleted"]){
                this.isProfileCompleted = true;
              }else{
                this.isProfileCompleted = false;
              }
            });
            if(this.utils.isUserLoggedIn()){
              Promise.resolve(this.lottodayService.getProfileData())
              .then(profileDetails => {
                if (profileDetails) {
                  this.userDetailService.setuserProfileDetails(profileDetails);
                  this.userDetails = this.userDetailService.getuserProfileDetails();
                  this.isRealUser = this.userDetails && this.userDetails.userStatus == "real" ? true : false;
                  this.checkForDobAndGender();
                  this.updateFormFields();
                  this.minimumDate = new Date();
                  this.minimumDate.setFullYear(this.minimumDate.getFullYear() - 18);
                  this.mobiScrollSetting["max"] =  this.minimumDate;
                }
                //userProfileDetails
              });
            }
        		this.minimumDate = new Date();
        		this.minimumDate.setFullYear(this.minimumDate.getFullYear()-18);
            this.mobiScrollSetting["max"] =  this.minimumDate;

        	}
          setCountyAndStateBasedOnIp(){
            Promise.resolve(this.utils.currentGeo())
            .then(res=>{
              if(!this.profileUpdateForm.controls["country"].value)
                this.profileUpdateForm.controls["country"].setValue(res.model.region.country);
              this.stateDetails(this.profileUpdateForm["state"])
              this.ipCountry = res.model.region.country;
            })
          }
          checkForDobAndGender() {
            if (this.userDetails && !this.userDetails.birthDate) {
              this.isDOBavailable = false;
            }
            if (this.userDetails && !this.userDetails.gender) {
              this.isGenderAvailable = false;
            }
            if(this.userDetails && !this.userDetails.cellPhone){
              this.isMobileAvailable = false;
              let self = this;
              setTimeout(function(){
                if(self.ipCountry){
                  self.utils.setPhoneNumberDropdown("phoneNumberFlag",self.ipCountry, [],'');
                }else{
                  Promise.resolve(self.utils.currentGeo())
                  .then(res=>{
                    self.utils.setPhoneNumberDropdown("phoneNumberFlag",res ? res.model.region.country : "", [],'');
                  })
                }

              },1);
            }else if(this.userDetails) {
              let self = this;
              setTimeout(function(){
                self.utils.setPhoneNumberDropdown("phoneNumberFlag", self.userDetails["cellPhoneCountryAreaCode"], [],'');
              },1);
            }
          }


          isReadOnlyAttribute(){
            if(this.isProfileCompleted == false || this.isRealUser == false){
              return false;
            }else{
              return true;
            }
            // if(this.isProfileCompleted == true && this.isRealUser == true){
            //   return true;
            // }else if(this.isProfileCompleted == false && this.isRealUser == true){
            //   return false;
            // }else if(this.isRealUser == false){
            //   return false;
            // }else{
            //   return true;
            // }
          }


          updateFormFields(): void {
            if (this.userDetails) {
              this.isRealUser = this.userDetails && this.userDetails.userStatus == "real" ? true : false;
              this.profileName = this.userDetails["firstName"];
              this.profileUpdateForm.controls["firstName"].setValue(this.userDetails["firstName"]);
              this.profileUpdateForm.controls["lastName"].setValue(this.userDetails["lastName"]);
              if(this.userDetails['birthDate']) this.profileUpdateForm.controls['dob'].setValue(this.userDetails['birthDate']);
              if(this.userDetails["gender"]) this.profileUpdateForm.controls["gender"].setValue(this.userDetails["gender"]);
              if(this.userDetails["address1"]) this.profileUpdateForm.controls["address1"].setValue(this.userDetails["address1"]);
              if(this.userDetails["city"]) this.profileUpdateForm.controls["city"].setValue(this.userDetails["city"]);
              if(this.userDetails["zip"]) this.profileUpdateForm.controls["zip"].setValue(this.userDetails["zip"]);
              if(this.userDetails["phone"])  this.profileUpdateForm.controls["phone"].setValue(this.userDetails["phone"]);
              if(this.userDetails["cellPhoneCountryAreaCode"]) this.utils.setPhoneNumberDropdown("phoneNumberFlag", this.userDetails["cellPhoneCountryAreaCode"], [],'');
              var self= this;

              // if(this.countries){
              //   let userCountry = this.countries.filter(function(country){
              //     return country.iso == self.userDetails["country"];
              //   })[0];
              //   if(userCountry){
              //     this.profileUpdateForm.controls["country"].setValue(userCountry.iso);
              //     this.stateDetails(this.userDetails["state"])
              //   }else{
              //     this.setCountyAndStateBasedOnIp();
              //   }
              // }

              if (this.countries) {
                let userCountry = this.countries.filter(function (country) {
                  return country.iso == self.userDetails["country"];
                })[0];
                if (userCountry) {
                  this.profileUpdateForm.controls["country"].setValue(userCountry.iso);
                  this.stateDetails(this.userDetails["state"])
                } else {
                  // this.profileUpdateForm.controls["country"].setValue("");
                  Promise.resolve(this.utils.currentGeo())
                    .then(res => {
                      this.profileUpdateForm.controls["country"].setValue(res.model.region.country);
                      this.stateDetails(this.userDetails["state"])
                    })
                }
              }
              //this.profileUpdateForm.controls["country"].setValue(this.userDetails["country"]);
            }
          }

          stateDetails(stateName): void {
            this.utils.stateDetails(stateName,this.profileUpdateForm)
            .then(stateDetails=>{
              this.stateList = stateDetails["stateDetails"];
              this.stateCheck = stateDetails["stateCheck"];
              if(this.profileUpdateForm.controls['state']){
                this.profileUpdateForm.controls['state'].setValidators(CustomValidators.required);
              }
            })
          }
  register2(buttonId,type):void{
		let errorDiv = "#serverError-Registration";
		$(errorDiv).addClass("hide");
    buttonId = buttonId.replace("undefined","");
		if (this.profileUpdateForm.valid) {
      this.utils.disableNewButton(buttonId);
			let data=this.utils.formControlToParams(this.profileUpdateForm,{});
      if (this.profileUpdateForm.controls["state"]) {
        data['state'] = this.profileUpdateForm.controls["state"].value;
      } else {
        data['state'] = "-NA-";
      }
			let fc = this.profileUpdateForm
			let DOB  = new Date(fc.controls["dob"].value)
			data['bDay'] = DOB.getDate();
			data['bMonth'] = DOB.getMonth()+1;
			data['bYear'] = DOB.getFullYear();
      data['birthDate'] = data['bYear']+'-'+data['bMonth']+'-'+data['bDay'];
			Promise.resolve(this.lottodayService.doProfileUpdate(data))
			.then(regData => {
				if(regData["success"]["status"] === "SUCCESS"){
                                    
          Promise.resolve(this.lottodayService.getProfileData())
            .then(profileDetails => {
              if (profileDetails) {
                this.userDetailService.setuserProfileDetails(profileDetails);
                type? type == 'signupstepTwo' ?this.mixPanelEventCheck('signupstepTwo','REGISTRATION_STEP2_SUCCESS'):this.mixPanelEventCheck('editprofile','EDIT_PROFILE_SUCCESS'):'';
       
              }
              //userProfileDetails
            });

            /** redirect code to verification */
            this.router.navigate(['verification']);
            
          this.utils.enableNewButton(buttonId,"SUCCESS","SUCCESS","Submit");//this.utils.enableButton(buttonId);
//          this.updateProfileComplete.emit(buttonId+"|"+errorDiv);
          // this.utils.closeModal("profileCompleteModal");
          //
          // this.emitterService.broadcastProfileCompletedSource("SUCCESS");




					// let logincredentials = {
					//   'txtEmail':this.registrationForm.controls["email"].value,
					//   'txtPassword':this.registrationForm.controls["passwords"].get('password').value
					// }
					// Promise.resolve(this.lottodayService.doLogin(logincredentials))
					// .then(data=>{
          //   this.formSubmitted = false;
					// 	this.regAndLoginComplete.emit(buttonId+"|"+errorDiv);
          // })
       
				}else if(regData["errors"]){
					this.serverError = regData["errors"][0]["message"];
          this.formSubmitted = false;
					this.utils.showError(errorDiv);
          this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","Submit");
          //this.utils.enableButton(buttonId);
         this.mixPanelEventCheck('REGISTRATION_ERROR',this.serverError)        
				}
			},
			SystemError => {
        this.serverError = "Something went wrong. Please try again later.";
        this.formSubmitted = false;
				this.utils.showError(errorDiv);
				this.utils.enableNewButton(buttonId,"FAILED","Please Try Again","Submit");//this.utils.enableButton(buttonId);
			});
		} else {
			this.utils.validateAllFormFields(this.profileUpdateForm);
		}
	}

  goBackToCheckout(){
    this.router.navigate([this.redirectTo],{queryParamsHandling: 'merge'});
  }

//  ngOnDestroy(){
//    this.userDataUpdatedSubs.unsubscribe();
//  }
  mixPanelEventCheck(type,gameName):void{
    gameName = gameName? gameName: '';
    Promise.resolve(this.mixpaneldataService.userLoggedIn('profile',type,gameName));
  }
}
