import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { AppLottodayService } from '../app-lottoday.service';
import { FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { EmitterService } from '../services/emitter.service';
import { Utility } from '../utils/utility';
import * as $ from 'jquery';
import { UserDetailsService } from '../services/user-details.service';
import { selfExclusionList } from '../utils/lotteryConfig';
window['$'] = window['jQuery'] = $;



@Component({
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
    @Input() callingFrom;
    countries;
    userDetails
    private verificationStep: string = 'step-1';
    private emailId: string;
    private phoneNumber: string;
    private firstName:string;
    private invalidOTP: string;

    private verificationForm = this.formBuilder.group({
        "emailchecked": [false],
        "phoneNumberChecked": [false]
    });
    private emailOtpverifyForm = this.formBuilder.group({
        'email_otp': ['', [CustomValidators.reqMin(4)]]
    });

    private phoneOtpVerifyForm = this.formBuilder.group({
          'phone_otp':['',[CustomValidators.reqMin(4)]]
    })
     
    
    private changeNumberForm = this.formBuilder.group({
        'phone': ['', [CustomValidators.phoneNumberValidator]],
        'areaCode': [''],
        'areaCountryCode': ['']

    });
    constructor(
        private router: Router,
        private utils: Utility,
        private userDetailsService: UserDetailsService,
        private lottodayService: AppLottodayService,
        private formBuilder: FormBuilder,
        private emitterService: EmitterService, ) {
        this.userDetails = emitterService.userDataSource$.subscribe(
            userDataSource => {
                if (userDataSource == "User Data Updated") {
                    this.userDetails = this.userDetailsService.getuserProfileDetails();
                    if (this.userDetails) {
                        this.emailId = this.userDetails.email;
                        this.phoneNumber = this.userDetails.phone;
                        this.firstName = this.userDetails.firstName;
                    }
                }
            }
        );
    }

    ngOnInit() {
        this.userDetails = this.userDetailsService.getuserProfileDetails();
         if(!this.userDetails){
             this.router.navigate([''])
         } 
        if (this.userDetails) {
            this.emailId = this.userDetails.email;
            this.phoneNumber = this.userDetails.phone;
            this.firstName = this.userDetails.firstName;
        }
    }

    ngAfterViewInit() {

        $('input:checkbox').change(function () {
            var checkBoxEmailCheck = $('input[id="emailsend"]:checked').length;
            var checkBoxSmsCheck = $('input[id="mobileverificationcode"]:checked').length;

            if (checkBoxEmailCheck > 0) {
                $(".select-mail").addClass("active");
                $(".select-sms").removeClass("active");
            } else {
                $(".select-mail").removeClass("active");
            }
            if (checkBoxSmsCheck > 0) {
                $(".select-mail").removeClass("active");
                $(".select-sms").addClass("active");
            } else {
                $(".select-sms").removeClass("active");
            }
        });
    }

    ngAfterViewChecked() {
        $('.device-header').addClass('hide');
        $('.device-header-nav').addClass('hide');
    }

    isAtleastOneSelected(tag: string): void {
        if (tag === 'emailchecked') {
            if (this.verificationForm.controls['phoneNumberChecked'].value) {
                this.verificationForm.controls['phoneNumberChecked'].setValue(false);
            }

        } else if (tag === 'phoneNumberChecked') {
            if (this.verificationForm.controls['emailchecked'].value) {
                this.verificationForm.controls['emailchecked'].setValue(false);
            }
        }
    }

    isButtonDisabled1(): boolean {
        if (this.verificationForm.controls['emailchecked'].value ||
            this.verificationForm.controls['phoneNumberChecked'].value) {
            return false;
        } else {
            return true;
        }
    }

    methodChoose(): void {
        let payloadRequest = {};
        if (this.verificationForm.controls['emailchecked'].value) {
            this.verificationStep = 'step-2';
            payloadRequest = {
                channel: 'email',
                email: this.emailId
            }

        } else if (this.verificationForm.controls['phoneNumberChecked'].value) {
            this.verificationStep = 'step-3';

            payloadRequest = {
                channel: 'sms',
                email: this.emailId
            }
        }
        this.sendOTPCode(payloadRequest);

    }

    isButtonDisabled(formName): boolean {
        return this.utils.isButtonDisabled(formName)
    }

    verifyOTP() {
        this.invalidOTP = '';
        let payloadRequest = {};
        if (this.verificationStep === 'step-2') {
            payloadRequest = {
                channel: 'email',
                email: this.emailId,
                verificationCode: this.emailOtpverifyForm.controls['email_otp'].value
            }
        }
        if (this.verificationStep === 'step-3') {
            payloadRequest = {
                channel: 'sms',
                email: this.emailId,
                verificationCode: this.phoneOtpVerifyForm.controls['phone_otp'].value
            }
        }
        // As to be removed Once after API restart working
        // temporary fix
        if (this.phoneOtpVerifyForm.controls['phone_otp'].value === '2121' 
        || this.emailOtpverifyForm.controls['email_otp'].value === '2121' ) {
            this.verificationStep = 'step-5';
            this.gotoHomePage();
        } else {
            this.verificationStep = 'step-6';
            return;
        }
        Promise.resolve(this.lottodayService.doVerifyOtp(payloadRequest))
            .then(resendData => {
                if (resendData && resendData["status"] === "SUCCESS") {
                    this.verificationStep = 'step-5';
                    this.gotoHomePage();
                } else if (resendData && resendData["invalidOpt"] === "invalid Otp") {
                    this.verificationStep = 'step-6';
                }
            });

    }

    resendOTP(): void {
        let payloadRequest = {};
        this.emailOtpverifyForm.controls['email_otp'].setValue('');
        this.phoneOtpVerifyForm.controls['phone_otp'].setValue('');
        if (this.verificationStep === 'step-2') {
           
            payloadRequest = {
                channel: 'email',
                email: this.emailId
            }
        }
        if (this.verificationStep === 'step-3') {
           
            payloadRequest = {
                channel: 'sms',
                email: this.emailId
            }
        }
        this.sendOTPCode(payloadRequest);
    }


    tryAgain() {
        this.resendOTP();
        if (this.persistStep === 'step-2' && !this.isMobileNumberchanged) {
            this.verificationStep = 'step-3';
        } else if (this.isMobileNumberchanged) {
            this.verificationStep = 'step-3'
        } else {
            if (this.verificationForm.controls['emailchecked'].value) {
                this.verificationStep = 'step-2';
            } else if (this.verificationForm.controls['phoneNumberChecked'].value) {
                this.verificationStep = 'step-3';
            } else {
                this.verificationStep = 'step-4';
            }
        }

        this.persistStep = '';

    }

    sendOTPCode(payloadRequest): void {
        if (payloadRequest) {
            Promise.resolve(this.lottodayService.resendEmailVerification(payloadRequest))
                .then(resendData => {
                    if (resendData && resendData["status"] === "SUCCESS") {
                        //Resend Success
                    } else if (resendData && resendData["emailNotFound"] === "Email Not Found") {
                        //email Not Found
                    }
                });
        }
    }

    private persistStep;
    private isMobileNumberchanged = false;
    changeMobileNumber() {

        //@this is required at one passed
        //@That is the response,we are persisting the previous step
        this.isMobileNumberchanged = true;
        if (this.persistStep === 'step-2') {
            this.persistStep = ''
        } else {
            this.persistStep = this.verificationStep;
        }

        this.verificationStep = 'step-4';
        let self = this;
        Promise.resolve(this.lottodayService.getProfileData())
            .then(profileDetails => {
                let data: any = profileDetails;
                self.emailId = data.email;
                self.phoneNumber = data.phone;
                this.changeNumberForm.controls['phone'].setValue(self.phoneNumber);
            });

        setTimeout(function () {
            self.utils.setPhoneNumberDropdown("phoneNumberFlag", 
            self.userDetails ? self.userDetails.cellPhoneCountryAreaCode : "", [], self.changeNumberForm);
        }, 1)
    }

    gotoHomePage() {
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 3000);

    }

    updateNumberAndResendCode() {
        if (this.changeNumberForm.valid) {
            let details = this.utils.formControlToParams(this.changeNumberForm, {});
            Promise.resolve(this.lottodayService.getProfileData())
                .then(profileDetails => {
                    if (profileDetails) {
                        let data = profileDetails;
                        data['phone'] = this.changeNumberForm.controls['phone'].value;
                        if (details['areaCode'] && details['areaCountryCode']) {
                            data['areaCode'] = details['areaCode'] ? details['areaCode'] : '';
                            data['countryAreaCode'] = details['areaCountryCode'] ? details['areaCountryCode'] : '';
                        }

                        this.userDetailsService.setuserProfileDetails(profileDetails);
                        Promise.resolve(this.lottodayService.doProfileUpdate(data))
                            .then(regData => {
                                if (regData) {
                                    this.verificationStep = 'step-3';
                                    this.resendOTP();
                                }
                            })
                    }
                });
        }
    }

    getButtonName() {
        if (this.verificationForm.controls['emailchecked'].value) {
            return 'Send me the email now';

        } else if (this.verificationForm.controls['phoneNumberChecked'].value) {
            return 'Send me the SMS now'
        } else {
            return "Please select verification option"
        }
    }

    ngOnDestroy() {
        $('.device-header').removeClass('hide');
        $('.device-header-nav').removeClass('hide');
    }
    goBackToHome() {
        this.router.navigate(['/']);
    }

    setFocusOut() {
        if(this.verificationStep === 'step-2'){
            let optcode= this.emailOtpverifyForm.controls["email_otp"].value;
            if (optcode && optcode.length>=3) {
                $('.btn-new').focus();      
            }
        }else if(this.verificationStep === 'step-3'){
            let optcode= this.phoneOtpVerifyForm.controls["phone_otp"].value;
            if (optcode && optcode.length>=3) {
                $('.btn-new').focus();      
            }
        }
      
    }
}
