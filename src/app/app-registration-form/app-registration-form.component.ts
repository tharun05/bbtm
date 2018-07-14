import {Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import {Router, ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {PasswordStrengthBarComponent} from '../password-strength-bar/password-strength-bar.component'
import {EmitterService} from '../services/emitter.service';
import * as _ from 'underscore';
import {mixpanelService} from '../services/mixpanel.service';
import {dateMobiScroll} from '../utils/lotteryConfig';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

import 'intl-tel-input';

@Component({
    selector: 'app-registration-form',
    templateUrl: './app-registration-form.component.html',
    styleUrls: ['./app-registration-form.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppRegistrationFormComponent implements OnInit, AfterViewInit {
    @Input() regAndLogin;
    @Output() regAndLoginComplete = new EventEmitter<string>();
    countries;
    minimumDate: Date;
    stateList;
    stateCheck: boolean = false;
    isPassword: boolean = true;
    isConfirmPassword: boolean = true;
    areaCode: number;
    areaCountryCode: string;
    token: string;
    step1Complete: boolean = false;
    bDay: string;
    bMonth: string;
    bYear: string;
    address: string;
    state: string;
    quickSave: boolean = true;
    availableCurrency: any;
    emailVerificationSent: boolean;
    otpVerified: boolean = false;
    formSubmitted: boolean;
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    serverError;
    otpErrorMessage;
    mobiScrollSetting;
    registrationForm = this.formBuilder.group({
        'firstName': ['', [CustomValidators.validName(2, 30)]],
        'lastName': ['', [CustomValidators.validName(2, 30)]],
        'email': ['', [CustomValidators.validateUniqueness("txtEmail", this.lottodayService, true)]],
        'nickname': ['', [CustomValidators.validateUniqueness("txtNickname", this.lottodayService, true)]],
        'dob': ['', [CustomValidators.required]],
        'currency': ['', [CustomValidators.required]],
        'phone': ['', [CustomValidators.phoneNumberValidator]],
        'termsNcondition': ['', [CustomValidators.required]],
        'emailAndMobileSubscribed': [''],
        'passwords': this.formBuilder.group({
            'password': ['',CustomValidators.reqMin(4)]
        })
    });

    profileUpdateForm = this.formBuilder.group({
        'address1': ['', [CustomValidators.addressValidator]],
        'city': ['', [CustomValidators.validName(2, 50)]],
        'zip': ['', [CustomValidators.validAlphaNumeric(2, 9)]],
        'country': ['', [CustomValidators.required]],
        'gender': ['M', [CustomValidators.required]],
        // 'otp1': ['', [CustomValidators.required]],
        // 'otp2': ['', [CustomValidators.required]],
        // 'otp3': ['', [CustomValidators.required]],
        // 'otp4': ['', [CustomValidators.required]],
        // 'otp5': ['', [CustomValidators.required]]
    });
    profileName;
    callingFrom;
    isCheckoutPage;

    constructor(private lottodayService: AppLottodayService,
        private activatedRoute: ActivatedRoute,
        private utils: Utility,
        private router: Router,
        private formBuilder: FormBuilder,
        private emitterService: EmitterService,
        private mixpaneldataService: mixpanelService
    ) {}

    ngOnInit() {
        this.mobiScrollSetting = dateMobiScroll;
        this.activatedRoute.queryParamMap.subscribe(queryParams => {
            this.isCheckoutPage = queryParams.get("checkout");
        });
        if (this.utils.isUserLoggedIn() && this.router.url.includes("register")) {
            this.callingFrom = "Registration";
            Promise.resolve(this.lottodayService.checkUserProfile())
                .then(profileData => {
                    if (profileData && profileData["userProfileCompleted"]) {
                        this.router.navigate(["/"]);
                    } else {
                        this.doInitialSteps(true);
                    }
                });
        } else {
            this.callingFrom = "Other Than Registration";
            this.doInitialSteps(false);
        }
        this.minimumDate = new Date();
        this.minimumDate.setFullYear(this.minimumDate.getFullYear() - 18);
        this.mobiScrollSetting["max"] = this.minimumDate;
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

    goBackToCheckout() {
        this.router.navigate(['/checkout']);
    }

    doInitialSteps(isFirstStepComplete) {
        this.step1Complete = isFirstStepComplete;
        Promise.resolve(this.utils.currentGeo())
            .then(res => {
                this.utils.setPhoneNumberDropdown("phoneNumberFlag", res ? res.model.region.country : "", [],'');
                this.profileUpdateForm.controls["country"].setValue(res ? res.model.region.country : "");
                this.stateDetails(this.profileUpdateForm["state"])
            })


        Promise.resolve(this.lottodayService.getEnabledCuurencies())
            .then(regData => {
                if (regData && regData["currency"]) {
                    this.availableCurrency = regData["currency"];
                    this.registrationForm.controls["currency"].setValue(regData["defaultCurrency"]);
                } else {

                }
            });

        let countryList = this.utils.getCountryList();
        if (!countryList) {
            Promise.resolve(this.lottodayService.getCountries())
                .then(regData => {
                    if (regData && regData["countrylist"]) {
                        this.countries = regData["countrylist"];
                        this.utils.setCountryDetails(regData["countrylist"]);
                    } else {
                    }
                });
        } else {
            this.countries = countryList;
        }

        this.minimumDate = new Date();
        this.minimumDate.setFullYear(this.minimumDate.getFullYear() - 18);
    }

    ngAfterViewInit() {
        this.formSubmitted = false
    }

    updateProfileComplete(data): void {
        this.regAndLoginComplete.emit(data);
    }

    register(buttonId): void {
        let errorDiv = "#serverError-Registration";
        $(errorDiv).addClass("hide");
        if (this.registrationForm.valid) {
            this.utils.disableNewButton(buttonId);
            let data = this.utils.formControlToParams(this.registrationForm, {});

            delete data['termsNcondition'];
            let fc = this.registrationForm
            let DOB = new Date(fc.controls["dob"].value);
            data['confirmPassword'] = data['password'];
            data['bDay'] = DOB.getDate();
            data['bMonth'] = DOB.getMonth() + 1;
            data['bYear'] = DOB.getFullYear();
            data['birthDate'] = data['bYear'] + '-' + data['bMonth'] + '-' + data['bDay'];
            data['emailAndMobileSubscribed'] = this.registrationForm.controls["emailAndMobileSubscribed"].value ? "true" : "false";
            data['areaCode'] = $("#phoneNumberFlag").intlTelInput("getSelectedCountryData").dialCode;
            data['areaCountryCode'] = $("#phoneNumberFlag").intlTelInput("getSelectedCountryData").iso2.toUpperCase();
            data['affiliateId'] = localStorage.getItem("affId") ? localStorage.getItem("affId") : "2288_0_test1";
            Promise.resolve(this.lottodayService.doRegistration(data))
                .then(regData => {
                    if (regData && regData["success"] === "true") {
                        if (regData["verificationSatus"]["status"] === "SUCCESS") {

                            this.emailVerificationSent = true;
                        }
                        let logincredentials = {
                            'txtEmail': this.registrationForm.controls["email"].value,
                            'txtPassword': this.registrationForm.controls["passwords"].get('password').value
                        }
                        Promise.resolve(this.lottodayService.doLogin(logincredentials))
                            .then(data => {
                                if (data) this.regAndLoginComplete.emit(buttonId + "|" + errorDiv);
                            })
                        this.profileName = this.registrationForm.controls["firstName"].value;
                        this.step1Complete = true;

                        localStorage.removeItem("affId");
                        this.mixPanelEventCheck('signupstep1', 'REGISTRATION_STEP1_SUCCESS', data);

                    } else if (regData && regData["errors"]) {
                        for (var key in regData["errors"]) {
                            switch (key) {
                                case 'firstName':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["firstName"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'lastName':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["lastName"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'nickname':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["nickname"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'password':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.get("passwords").get(key).setErrors({'message': this.serverError})
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'email':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["email"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'dob':
                                case 'areaCode':
                                case 'internationalPhone':
                                case 'phone':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["phone"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'currency':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["currency"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                case 'bonusCode':
                                    this.serverError = this.setServerError(key, regData["errors"][key]);
                                    this.registrationForm.controls["bonusCode"].setErrors({'message': this.serverError});
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    break;
                                default:
                                    this.serverError = regData["errors"][key]["lblWarning"]
                                    this.mixPanelEventCheck('REGISTRATION_ERROR', this.serverError, '');
                                    //this.registrationForm.controls["firstName"].setErrors({'message':regData["errors"][key]["lblWarning"]});
                                    break;
                            }
                        }
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Open Free Account-disable");//this.utils.enableButton(buttonId);
                    } else {
                        this.serverError = "Something went wrong. Please try again!!"
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Open Free Account");//this.utils.enableButton(buttonId);
                    }
                },
                    SystemError => {
                        this.serverError = "Something went wrong. Please try again later.";
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Open Free Account");//this.utils.enableButton(buttonId);
                    });
        } else {
            this.utils.validateAllFormFields(this.registrationForm);
        }
    }

    setServerError(key, errorMessage) {
        if (errorMessage.includes("(Anonymous function)")) {
            return "Invalid " + key;
        } else {
            return errorMessage;
        }

    }

    register2(buttonId): void {
        let errorDiv = "#serverError-Registration";
        $(errorDiv).addClass("hide");
        if (this.profileUpdateForm.valid) {
            this.utils.disableNewButton(buttonId);
            let data = this.utils.formControlToParams(this.profileUpdateForm, {});
            if (this.profileUpdateForm.controls["state"]) {
                data['state'] = this.profileUpdateForm.controls["state"].value;
            } else {
                data['state'] = "-NA-";
            }
            let fc = this.profileUpdateForm
            let DOB = new Date(fc.controls["dob"].value)
            data['bDay'] = DOB.getDate();
            data['bMonth'] = DOB.getMonth() + 1;
            data['bYear'] = DOB.getFullYear();
            data['birthDate'] = data['bYear'] + '-' + data['bMonth'] + '-' + data['bDay'];
            Promise.resolve(this.lottodayService.doProfileUpdate(data))
                .then(regData => {
                    if (regData && regData["success"]["status"] === "SUCCESS") {
                        this.regAndLoginComplete.emit(buttonId + "|" + errorDiv);
                    } else if (regData && regData["errors"]) {
                        this.serverError = regData["errors"][0]["message"];
                        this.formSubmitted = false;
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Submit");//this.utils.enableButton(buttonId);
                    } else {
                        this.serverError = "Something went wrong"
                        this.formSubmitted = false;
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Submit");//this.utils.enableButton(buttonId);
                    }
                },
                    SystemError => {
                        this.serverError = "Something went wrong. Please try again later.";
                        this.formSubmitted = false;
                        this.utils.showError(errorDiv);
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Submit");//this.utils.enableButton(buttonId);
                    });
        } else {
            this.utils.validateAllFormFields(this.profileUpdateForm);
        }
    }
    checkError(): void {
        if ($('#otpFields').hasClass('shake-otp')) {
            $('#otpFields').toggleClass('shake-otp');
            $('#otpError').toggleClass('hide');
        }
    }

    stateDetails(stateName): void {
        this.utils.stateDetails(stateName, this.profileUpdateForm)
            .then(stateDetails => {
                if (stateDetails) {
                    this.stateList = stateDetails["stateDetails"];
                    this.stateCheck = stateDetails["stateCheck"];
                    if (this.profileUpdateForm.controls['state']) {
                        this.profileUpdateForm.controls['state'].setValidators(CustomValidators.required);
                    }
                } else {
                    this.stateList = [];
                    this.stateCheck = false;
                    if (this.profileUpdateForm.controls['state']) {
                        this.profileUpdateForm.controls['state'].setValue("-NA-");
                    }
                }
            })
        // let conteryDetails = {
        //   countryCode: this.profileUpdateForm.controls["country"].value
        // }
        // Promise.resolve(this.lottodayService.getStates(conteryDetails))
        // .then(data => {
        //
        //   if (data["stateDetails"].length != 0) {
        //     this.stateList = data["stateDetails"];
        //
        //     let stateControl = new FormControl('', [CustomValidators.required]);
        //     this.profileUpdateForm.addControl('state', stateControl);
        //     let filteredState = this.stateList.filter(function(state){
        //       return state.stateCode == stateName;
        //     })[0];
        //     if(filteredState){
        //       this.profileUpdateForm.controls["state"].setValue(filteredState.stateCode);
        //     }
        //     this.stateCheck = true;
        //   } else {
        //     if(this.profileUpdateForm.controls['state']){
        //       this.profileUpdateForm.removeControl('state');
        //     }
        //     this.stateCheck = false;
        //     // let stateControl = new FormControl("-NA-");
        //     // this.profileUpdateForm.addControl('state', stateControl);
        //   }
        // })
        // }
    }

    keytab(event): boolean {
        if (event.keyCode >= 48 && event.keyCode <= 57) {
            return true;
        } else {
            return false;
        }
    }

    focusNext(elementId): void {

        let nextElement = $("#" + elementId)[0].nextElementSibling
        if ($("#" + elementId)[0].value) {
            if (this.otp1 && this.otp2 && this.otp3 && this.otp4 && this.otp5) {
                this.formSubmitted = true;
                $('#otpFields').toggleClass('hide');
                $('#otpSpinner').toggleClass('hide');
                let otp = {
                    verificationCode: this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5,
                    channel: "email",
                    email: this.registrationForm.controls["email"].value
                };
                if (otp.verificationCode == "11111") {
                    $('#otpSpinner').toggleClass('hide');
                    this.otpVerified = true;
                    this.formSubmitted = false;
                } else {
                    setTimeout(() => {
                        $("#otpFields").find("input").val("");
                        this.otp1 = this.otp2 = this.otp3 = this.otp4 = this.otp5 = undefined;
                        $('#otpSpinner').toggleClass('hide');
                        $('#otpFields').toggleClass('hide').toggleClass('shake-otp');
                        $('#otpError').toggleClass('hide');
                    }, 1000)
                }
                /*Promise.resolve(this.doOtpVerification(otp))
                .then(verificationData => {
                console.log(verificationData);
                if((verificationData["status"] == null && verificationData["chanelVerificationStatus"] == null) || verificationData["status"] == "FAILURE"){
                $("#otpFields").find("input").val("");
                this.otp1 = this.otp2 = this.otp3 = this.otp4 = this.otp5 = undefined;
                $('#otpSpinner').toggleClass('hide');
                $('#otpFields').toggleClass('hide').toggleClass('shake-otp');
                $('#otpError').toggleClass('hide');
                this.otpErrorMessage = verificationData["errorDescription"].toLowerCase().replace('channel','Email');
                //$("#otpFields").find("input[type=text], textarea").val("");
                //$('#otpSpinner').toggleClass('hide');
                //$('#otpFields').toggleClass('hide');
                console.log(verificationData);
              }else{
              $('#otpSpinner').toggleClass('hide');
              this.otpVerified = true;
              this.formSubmitted = false;
            }
        
        
        
          });*/
            } else if (this.otp1 || this.otp2 || this.otp3 || this.otp4 || this.otp5) {
                if (nextElement && !nextElement.value) {
                    nextElement.focus();
                } else {
                    switch (undefined) {
                        case this.otp1:
                            $("#otpFields input:nth-child(1)").focus();
                            break;
                        case this.otp2:
                            $("#otpFields input:nth-child(2)").focus();
                            break;
                        case this.otp3:
                            $("#otpFields input:nth-child(3)").focus();
                            break;
                        case this.otp4:
                            $("#otpFields input:nth-child(4)").focus();
                            break;
                        case this.otp5:
                            $("#otpFields input:nth-child(5)").focus();
                            break;
                        default:
                            $("#otpFields input:nth-child(1)").focus();
                            break;
                    }
                }
            }
        }

    }

    resendEmailVerification(): void {
        Promise.resolve(this.lottodayService.resendEmailVerification({"email": this.registrationForm.controls["email"].value}))
            .then(resendData => {
                if (resendData && resendData["status"] === "SUCCESS") {
                    //Resend Success
                } else if (resendData && resendData["emailNotFound"] === "Email Not Found") {
                    //email Not Found
                }
            });
    }

    doOtpVerification(otp): Promise<String> {
        return this.lottodayService.doVerifyOtp(otp);

    }

    mixPanelEventCheck(type, gameName, data): void {
        gameName = gameName ? gameName : '';

        data = data ? data : '';
        Promise.resolve(this.mixpaneldataService.registrationstepone(type, gameName, data));
    }
}


