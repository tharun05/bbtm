import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {AppLottodayService} from '../app-lottoday.service';
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {Utility} from '../utils/utility';
import {UserDetailsService} from '../services/user-details.service';
import {EmitterService} from '../services/emitter.service';
import {Location} from '@angular/common';
import { Router } from '@angular/router'

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
    selector: 'app-confirm-identity',
    templateUrl: './confirm-identity.component.html',
    styleUrls: ['./confirm-identity.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class ConfirmIdentityComponent implements OnInit {
    @Input() idVerified;
    @Input() addressVerified;
    proofList = {
        'identity': {'file': null, 'url': '/ajax/account/Documents/upload?file=nationalid&accountId='},
        'address': {'file': null, 'url': '/ajax/account/Documents/upload?file=utilitybill&accountId='}
    }
    confirmForm = this.formBuilder.group({
        'confirm': ['false', [CustomValidators.required]]
    });
    step1;
    step2;
    step3;
    errorMessage;
    userDetails;
    confirmIdentity: boolean = false;
    constructor(private lottodayService: AppLottodayService,
        private formBuilder: FormBuilder,
        private utils: Utility,
        private router:Router,
        private userService: UserDetailsService,
        private emitterService: EmitterService,
        private location: Location) {
        emitterService.userDataSource$.subscribe(
            userDataSource => {
                if (userDataSource == "User Data Updated") {
                    this.userDetails = this.userService.getuserProfileDetails();
                }
            }
        );
    }

    ngOnInit() {
        this.confirmIdentity = true;
        this.step1 = "new";
        $("#step3Success").addClass('hide');
        this.userDetails = this.userService.getuserProfileDetails();
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

    startKyc() {
        $('.kyc-mobile').addClass('hide');
        $('.confirm-identity').addClass('show');
        this.utils.scrollToPosition($('.confirm-identity'));
    }

    showStep(stepNumber) {
        if (this["step" + stepNumber] == "completed" || this["step" + stepNumber] == "new") {
            $(".insideStep").removeClass("show").addClass("hide");
            $("#step" + stepNumber).removeClass("hide");
            $(".confirm-identiy-header").removeClass("active");
            $("#step" + stepNumber + "Header").addClass("active");
            this.utils.scrollToPosition($("#step" + stepNumber + "Header"))
        }
    }
    uploadProof(event, type, buttonId) {
        //identity
        $("#step1Error").addClass("hide");
        $("#step2Error").addClass("hide");
        $("#step3Error").addClass("hide");
        $("#step1Error").removeClass("show").addClass("hide");
        $("#step2Error").removeClass("show").addClass("hide");
        let idProof = this.proofList[type];
        idProof['file'] = event.target.files[0];
        idProof['url'] = this.proofList[type]['url'];
        if (event.target.files[0].size >= 2097152) {
            this.errorMessage = "File size should be less than 2 MB";
            if (type == "identity") {
                $("#step1Error").removeClass("hide").addClass("show");
            } else if (type == "address") {
                $("#step2Error").removeClass("hide").addClass("show");
            }
            this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again Later", type == "identity" ? "Upload your Photo ID" : "Upload proof of residence");
            $("#" + buttonId + " input").prop("disabled", false);
            $("#" + buttonId).removeClass("disabled");
        } else {
            $("#" + buttonId).addClass("disabled");
            $("#" + buttonId + " input").prop("disabled", true);
            this.utils.disableNewButton(buttonId);
            this.lottodayService.uploadFileToSession(idProof)
                .then(uploadResponse => {

                    if (uploadResponse && uploadResponse["status"] == "success") {
                        if (type == "identity") {
                            this.step1 = "completed";
                            this.step2 = "new";
                            $("#step1").removeClass("show").addClass("hide");
                            $("#step2").removeClass("hide").addClass("show");
                            $("#step1Header").removeClass("active").addClass("completed-step");
                            $("#step2Header").addClass("active");
                            $("#step1UploadedFile").text(idProof.file.name);
                            this.utils.scrollToPosition($("#step2Header"))
                        } else if (type == "address") {
                            this.step2 = "completed";
                            this.step3 = "new";
                            $("#step2").removeClass("show").addClass("hide");
                            $("#step3").removeClass("hide").addClass("show");
                            $("#step2Header").removeClass("active").addClass("completed-step");
                            $("#step3Header").addClass("active");
                            $("#step2UploadedFile").text(idProof.file.name);
                            this.utils.scrollToPosition($("#step2Header"))
                        }
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Success", type == "identity" ? "Upload your Photo ID" : "Upload proof of residence");
                        $("#" + buttonId + " input").prop("disabled", false);
                        $("#" + buttonId).removeClass("disabled");
                    } else if (uploadResponse && uploadResponse["status"] == "error") {
                        this.errorMessage = uploadResponse["message"]
                        if (type == "identity") {
                            $("#step1Error").removeClass("hide").addClass("show");
                        } else if (type == "address") {
                            $("#step2Error").removeClass("hide").addClass("show");
                        }
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again Later", type == "identity" ? "Upload your Photo ID" : "Upload proof of residence");
                        $("#" + buttonId + " input").prop("disabled", false);
                        $("#" + buttonId).removeClass("disabled");
                    } else {
                        this.errorMessage = "Something went wrong. Please try again later";
                        if (type == "identity") {
                            $("#step1Error").removeClass("hide").addClass("show");
                        } else if (type == "address") {
                            $("#step2Error").removeClass("hide").addClass("show");
                        }
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again Later", type == "identity" ? "Upload your Photo ID" : "Upload proof of residence");
                        $("#" + buttonId + " input").prop("disabled", false);
                        $("#" + buttonId).removeClass("disabled");
                    }
                })
        }

    }
    submitIdentiy(buttonId) {
        let errorDiv = "#step3Error";
        $(errorDiv).addClass("hide");
        $("#step3Success").addClass('hide');
        if (this.confirmForm.valid) {
            this.utils.disableNewButton(buttonId)
            this.lottodayService.submitUploadedFiles()
                .then(uploadResponse => {
                    if (uploadResponse && uploadResponse["status"] == "success") {
                        $("#step3Success").removeClass('hide');
                        this.utils.enableNewButton(buttonId, "SUCCESS", "Suceessfully Uploaded", "SUBMIT-disable");
                        //this.utils.enableNewButton(buttonId, "SUCCESS", "Suceessfully Uploaded", "SUBMIT");
                        this.emitterService.broadcastdocUploadedEvent("DocUploadComplete");
                        this.utils.disableButton(buttonId);
                        this.router.navigate(['myaccount']);
                        
                    } else {
                        this.utils.showError(errorDiv);
                        this.errorMessage = uploadResponse && uploadResponse["message"] ? uploadResponse["message"] : "Something went wrong. Please try agian";
                        this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again Later", "SUBMIT");
                    }

                })
        }

    }

    goBack(){
        this.location.back();
    }

}
