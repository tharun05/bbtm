import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validator';
import { Utility } from '../utils/utility';
import { AppLottodayService } from '../app-lottoday.service'
import { RealityCheckService } from '../services/reality-check.service';
import { EmitterService } from '../services/emitter.service';
import { mixpanelService } from '../services/mixpanel.service';

@Component({
  selector: 'app-gaming-reality-check',
  templateUrl: './app-gaming-reality-check.component.html',
  styleUrls: ['./app-gaming-reality-check.component.scss']
})
export class AppGamingRealityCheckComponent implements OnInit {
  @Input() realityDetailsAvailable;
  @Output() onRealityDataChanged: EventEmitter<any> = new EventEmitter<any>();
  availableLimit;
  pendingLimit;
  pendingTime;
  pendingLimitHour;
  pendingLimitMinute;
  availableLimitHour;
  availableLimitMinute;
  defaultValue = 0;
  realityCheckForm = this.formBuilder.group({
      'limit': [this.defaultValue]
  },{validator:CustomValidators.validateRealityCheckValue});
  constructor(private formBuilder:FormBuilder,
    private utils:Utility,
    private lottodayService:AppLottodayService,
    private realityCheckService:RealityCheckService,
    private emitterService:EmitterService,
    private mixpaneldataService:mixpanelService
  ) {

  }

  ngOnInit() {
    this.availableLimit = this.realityDetailsAvailable["limits"];
    this.pendingLimit = this.realityDetailsAvailable["pendingLimits"];
    this.setPendingLimitTime();
  }

  openModal(modalId){
    this.utils.openModal(modalId);
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

  setPendingLimitTime(){
    this.utils.removeAllFormFieldsvalidation(this.realityCheckForm);
    this.realityCheckForm.controls["limit"].setValue(this.defaultValue);
    this.realityCheckForm.controls["limit"].setValidators(CustomValidators.validateRealityCheckValue());

    if(this.availableLimit && this.availableLimit["overall"] && this.availableLimit["overall"]["value"] && this.availableLimit["overall"]["value"] > 0){
      this.availableLimitHour  = Math.floor(this.availableLimit["overall"]["value"] / 60);
      this.availableLimitMinute = this.availableLimit["overall"]["value"] % 60;
    }
    if(this.pendingLimit && this.pendingLimit["overall"] && this.pendingLimit["overall"]["remainingTime"] && this.pendingLimit["overall"]["remainingTime"] > 0){
      this.pendingLimitHour  = Math.floor(this.pendingLimit["overall"]["value"] / 60);
      this.pendingLimitMinute = this.pendingLimit["overall"]["value"] % 60;
      this.pendingTime = new Date().getTime() + Number(this.pendingLimit["overall"]["remainingTime"])*60000 + 60000;
    }
  }

  getSessionLimit(buttonId){
    Promise.resolve(this.lottodayService.getRealitySessionLimit())
    .then( sessionLimitData =>{
      if(sessionLimitData){
        this.availableLimit = sessionLimitData["limits"];
        this.pendingLimit = sessionLimitData["pendingLimits"];
        this.onRealityDataChanged.emit(sessionLimitData);
        this.setPendingLimitTime();
      }
      if(buttonId){
        this.utils.enableNewButton(buttonId,"SUCCESS","Successfully Set Limits","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes-disable");
      }
    });
  }

  deleteReality(buttonId){
    this.utils.disableNewButton(buttonId);
    let data ={
      "type":"reality-session"
    }
    Promise.resolve(this.lottodayService.deleteLimits(data))
    .then(deleteResp => {
      if(deleteResp && deleteResp["success"] == true){
        this.getSessionLimit("");
        this.utils.closeModal('sessionLimitDeleteModal');
        this.utils.enableNewButton(buttonId, "SUCCESS", "Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes", "Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes-disable");
      }else{
        this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
      }

    },
    SystemError => {
      this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
    });
  }


  cancelReality(buttonId){
    this.utils.disableNewButton(buttonId);
    let data ={
      "type":"session"
    }
    Promise.resolve(this.lottodayService.cancelLimits(data))
    .then(cancelResp => {
      if(cancelResp && cancelResp["success"] == true){
        this.getSessionLimit(buttonId);
        this.utils.closeModal('sessionLimitCancelModal');
      }else{
        this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
      }

    },
    SystemError => {
      this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
    });
  }


  setReality(buttonId){
    this.utils.disableNewButton(buttonId);
    if (this.realityCheckForm.valid) {
      // let data=this.utils.formControlToParams(this.realityCheckForm,{});
      // data["overall"]=Number(data["hours"])*60 + Number(data["minutes"]);
      let data = {
          'type': 'reality-session',
          'overall': this.realityCheckForm.controls["limit"].value,
          'error': ''
      }
      Promise.resolve(this.lottodayService.setLimits(data))
      .then(setResp => {
        if(setResp && setResp["success"] == true){
          this.getSessionLimit(buttonId);
          this.mixPanelEventCheck('realityCheckSucess','SUCCESS');
          this.utils.enableNewButton(buttonId, "SUCCESS", "Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes", "Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes-disable");
        }else{
          this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
          this.mixPanelEventCheck('realityCheckFail','FAILED');
        }
      },
      SystemError => {
        this.utils.enableNewButton(buttonId,"FAILED","Failed","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
      });
    } else {
      this.utils.validateAllFormFields(this.realityCheckForm);
      this.utils.enableNewButton(buttonId,"","Save Settings","Set reality check to "+this.realityCheckForm.controls["limit"].value+" minutes");
    }
  }

  mixPanelEventCheck(type,gameName):void{
    Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile',type,gameName));
  }

  increaseLimit(){
    let limitValue = Number(this.realityCheckForm.controls["limit"].value) + 1;
    if(limitValue > 60){
      limitValue = 60;
    }
    this.realityCheckForm.controls["limit"].setValue(limitValue);
  }

  decreaseLimit(){
    let limitValue = Number(this.realityCheckForm.controls["limit"].value) - 1;
    if(limitValue < 0){
      limitValue = 0;
    }
    this.realityCheckForm.controls["limit"].setValue(limitValue);
  }
}
