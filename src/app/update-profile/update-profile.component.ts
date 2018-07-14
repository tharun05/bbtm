import { Component, OnInit, AfterViewInit, state } from '@angular/core';

import { AppLottodayService } from '../app-lottoday.service'
import { EmitterService } from '../services/emitter.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserDetailsService } from '../services/user-details.service';
import { Utility } from '../utils/utility';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit, AfterViewInit {
  countries;
  serverError;
  areaCode: number;
  areaCountryCode: string;
  isGenderAvailable: boolean = true;
  isDOBavailable: boolean = true;
  userDeatil;
  minimumDate: Date;
  stateCheck = false;
  stateList;
  isRealUser;
  utils;
  myAccountForm = this.formBuilder.group({
    'firstName': ['', [CustomValidators.validName(2, 30)]],
    'lastName': ['', [CustomValidators.validName(2, 30)]],
    'address1': ['', [CustomValidators.addressValidator]],
    'city': ['', [CustomValidators.validName(2, 50)]],
    'zip': ['', [CustomValidators.validAlphaNumeric(2,9)]],
    'country': ['', [CustomValidators.required]],
    'phone': ['', [CustomValidators.phoneNumberValidator]]
  });
  constructor(private lottodayService: AppLottodayService,
    private emitterService: EmitterService,
    private utility: Utility,
    private userService: UserDetailsService,
    private formBuilder: FormBuilder) {
      this.utils = this.utility;
    emitterService.userDataSource$.subscribe(
      userDataSource => {
        if (userDataSource == "User Data Updated") {
          this.userDeatil = this.userService.getuserProfileDetails();
          this.isRealUser = this.userDeatil && this.userDeatil.userStatus == "real" ? true : false;
          this.checkForDobAndGender();
          this.updateFormFields();
        }
      }
    );
  }

  ngOnInit() {
    let countryList = this.utils.getCountryList();
    if (!countryList) {
      Promise.resolve(this.lottodayService.getCountries())
        .then(regData => {
          if (regData && regData["countrylist"]) {
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
    if(this.utils.isUserLoggedIn()){
      Promise.resolve(this.lottodayService.getProfileData())
        .then(profileDetails => {
          if (profileDetails) {
            this.userService.setuserProfileDetails(profileDetails);
            this.userDeatil = this.userService.getuserProfileDetails();
            this.isRealUser = this.userDeatil && this.userDeatil.userStatus == "real" ? true : false;
            this.checkForDobAndGender();
            this.updateFormFields();
            this.minimumDate = new Date();
            this.minimumDate.setFullYear(this.minimumDate.getFullYear() - 18);
          }
          //userProfileDetails
        });
    }



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
  getCartItemsCount(){
    return this.utils.getCartItemsCount();
  }

  checkForDobAndGender() {
    if (this.userDeatil && !this.userDeatil.birthDate) {
      let dobControl = new FormControl('', [CustomValidators.required]);
      this.myAccountForm.addControl('dob', dobControl);
      this.isDOBavailable = false;
    }
    if (this.userDeatil && !this.userDeatil.gender) {
      let genderControl = new FormControl('M', [CustomValidators.required]);
      this.myAccountForm.addControl('gender', genderControl);
      this.isGenderAvailable = false;
    }
  }

  updateFormFields(): void {
    if (this.userDeatil) {
      this.myAccountForm.controls["firstName"].setValue(this.userDeatil["firstName"]);
      this.myAccountForm.controls["lastName"].setValue(this.userDeatil["lastName"]);
      this.myAccountForm.controls["address1"].setValue(this.userDeatil["address1"]);
      this.myAccountForm.controls["city"].setValue(this.userDeatil["city"]);
      this.myAccountForm.controls["zip"].setValue(this.userDeatil["zip"]);

      var self = this;
      if (this.countries) {
        let userCountry = this.countries.filter(function (country) {
          return country.iso == self.userDeatil["country"];
        })[0];
        if (userCountry) {
          this.myAccountForm.controls["country"].setValue(userCountry.iso);
          this.stateDetails(this.userDeatil["state"])
        } else {
          // this.myAccountForm.controls["country"].setValue("");
          Promise.resolve(this.utils.currentGeo())
            .then(res => {
              this.myAccountForm.controls["country"].setValue(res ? res.model.region.country : "");
              this.stateDetails(this.userDeatil["state"])
            })
        }
      }



      this.myAccountForm.controls["phone"].setValue(this.userDeatil["phone"]);
      // this.stateDetails(this.userDeatil["state"])
      // this.myAccountForm.controls["state"].setValue(this.userDeatil["state"]);
      //this.utils.validateAllFormFields(this.myAccountForm);
      this.utils.setPhoneNumberDropdown("phoneNumberFlag", this.userDeatil["cellPhoneCountryAreaCode"], [],'');
      //$("#phoneNumberFlag").intlTelInput("setCountry", );
    }
  }

  ngAfterViewInit() {

  }
  stateDetails(stateName): void {
    this.utils.stateDetails(stateName, this.myAccountForm)
      .then(stateDetails => {
        if(stateDetails){
          this.stateList = stateDetails["stateDetails"];
          this.stateCheck = stateDetails["stateCheck"];
          if (this.myAccountForm.controls['state']) {
            this.myAccountForm.controls['state'].setValidators(CustomValidators.required);
          }
        }else{
          this.stateList = [];
          this.stateCheck = false;
          if (this.myAccountForm.controls['state']) {
            this.myAccountForm.controls['state'].setValue("-NA-");
          }
        }

      })
    }
    // // if (stateName) {
    // //   console.log(stateName)
    // //   let stateControl = new FormControl('', [CustomValidators.required]);
    // //   this.myAccountForm.addControl('state', stateControl);
    // //   this.myAccountForm.controls["state"].setValue(stateName);
    // //   this.stateCheck = true;
    //
    // // } else {
    //
    // // console.log(this.myAccountForm.controls["country"].value)
    // let conteryDetails = {
    //   countryCode: this.myAccountForm.controls["country"].value
    // }
    // Promise.resolve(this.lottodayService.getStates(conteryDetails))
    //   .then(data => {
    //
    //     if (data["stateDetails"].length != 0) {
    //       this.stateList = data["stateDetails"];
    //
    //       let stateControl = new FormControl('', [CustomValidators.required]);
    //       this.myAccountForm.addControl('state', stateControl);
    //       let filteredState = this.stateList.filter(function(state){
    //         return state.stateCode == stateName;
    //       })[0];
    //       if(filteredState){
    //       this.myAccountForm.controls["state"].setValue(filteredState.stateCode);
    //       }
    //       this.stateCheck = true;
    //     } else {
    //       if(this.myAccountForm.controls['state']){
    //         this.myAccountForm.removeControl('state');
    //       }
    //       this.stateCheck = false;
    //     }
    //   })
    // // }
  // }
  saveDetails(buttonId): void {
    this.utils.disableNewButton(buttonId);
    let errorDiv = "#serverErrorUpdateProfile"
    if (this.myAccountForm.valid) {
      let data = this.utils.formControlToParams(this.myAccountForm, {});
      if (this.myAccountForm.controls["dob"]) {
        let DOB = new Date(this.myAccountForm.controls["dob"].value)
        data['bDay'] = DOB.getDate();
        data['bMonth'] = DOB.getMonth() + 1;
        data['bYear'] = DOB.getFullYear();
      } else {
        data['bDay'] = this.userDeatil["bDay"];
        data['bMonth'] = this.userDeatil["bMonth"];
        data['bYear'] = this.userDeatil["bYear"];
        data['birthDate'] = this.userDeatil["birthDate"];
      }

      if (this.myAccountForm.controls["gender"]) {
        data['gender'] = this.myAccountForm.controls["gender"].value;
      } else {
        data['gender'] = this.userDeatil["gender"];
      }

      if (this.myAccountForm.controls["state"]) {
        data['state'] = this.myAccountForm.controls["state"].value;
      } else {
        data['state'] = "-NA-";
      }
      Promise.resolve(this.lottodayService.doProfileUpdate(data))
        .then(updateResp => {
          if (updateResp && updateResp["success"] && updateResp["success"]["status"] === "SUCCESS") {
            Promise.resolve(this.lottodayService.getProfileData())
              .then(profileDetails => {
                if (profileDetails) {
                  this.userService.setuserProfileDetails(profileDetails);
                }
                //userProfileDetails
              });
            this.utils.enableNewButton(buttonId, "SUCCESS", "Profile Updated Successfully", "Save Changes");
          } else {
            //handle error
            var self = this;
            if (updateResp && updateResp["errors"] && updateResp["errors"]["code"] === 13) {
              this.utils.showError(errorDiv);
              this.serverError = updateResp["errors"]["message"]
            } else if (updateResp && updateResp["errors"]) {
              _.each(updateResp["errors"], function (value, key) {
                self.myAccountForm.controls[key] ? self.myAccountForm.controls[key].setErrors({ 'message': value }) : '';
              });
              this.utils.showError(errorDiv);
              this.serverError = "Please fill in All the Details Below"
            }else{
              this.utils.showError(errorDiv);
              this.serverError = "Something went wrong"
            }

            this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Save Changes");
          }

        },
        SystemError => {
          //this.utils.enableButton(buttonId);
          this.utils.enableNewButton(buttonId, "FAILED", "Please Try Again", "Save Changes");
        });
    } else {
      this.utils.validateAllFormFields(this.myAccountForm);
      //this.utils.enableButton(buttonId);
      this.utils.enableNewButton(buttonId, "", "", "Save Changes");
    }
  }

}
