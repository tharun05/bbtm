import { Component, OnInit } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';
import { mixpanelService } from '../services/mixpanel.service';

import * as $ from 'jquery';
import { concat } from 'rxjs/observable/concat';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-preference-centre',
  templateUrl: './app-preference-centre.component.html',
  styleUrls: ['./app-preference-centre.component.scss']
})
export class AppPreferenceCentreComponent implements OnInit {
  initalPref;
  serverError;
  constructor(private lottodayService:AppLottodayService,
    private utils:Utility,
    private mixpaneldataService:mixpanelService
  ) { }

  ngOnInit() {
    this.showPreferences("","");
  }
  updatePreference(selectedPref){
    // console.log(selectedPref)
    // console.log($("#"+selectedPref).parent().addClass("load-check"))
    // // console.log(("input[type=checkbox]").attr('disabled', true))
    // //dontMissAnything-true,emailOnly-false,smsOnly-false
    $("#"+selectedPref).parent().addClass("load-check");
    $("input[type=checkbox]").attr('disabled', true);
    $('#unsubscribeAll').prop("checked", false);
    if(selectedPref === "unsubscribeAll"){
      $('#emailOnly').prop('checked')?$('#emailOnly').prop("checked", false):'';
      $('#smsOnly').prop('checked')?$('#smsOnly').prop("checked", false):'';
      $('#unsubscribeAll').prop("checked", true);
    }
    let data = {
      "emailSubscribed":($('#emailOnly:checked').length > 0?true:false),
      "mobileSubscribed":($('#smsOnly:checked').length > 0?true:false)
    }


    this.lottodayService.updateSubscriptionPreferenes(data)
    .then(prefResposne=>{
        if(prefResposne["status"] == "SUCCESS"){
          this.showPreferences("SUCCESS",selectedPref);
        }else{
          this.showPreferences("FAILIURE",selectedPref);
        }
    },SystemError => {
      this.showPreferences("FAILIURE",selectedPref);
    })
    .catch(error => {});
  }
  showPreferences(status,selectedCheckbox){
    this.lottodayService.getSubscriptionPreferenes()
    .then(prefResposne=>{
      if(prefResposne){
        $('#smsOnly').attr('checked',prefResposne["mobileSubscribed"]);
        $('#emailOnly').attr('checked',prefResposne["emailSubscribed"]);
      }
      // $('#dontMissAnything').attr('checked',(prefResposne["emailSubscribed"] && prefResposne["mobileSubscribed"]));

      // $('#unsubscribeAll').attr('checked',(!prefResposne["emailSubscribed"] && !prefResposne["mobileSubscribed"]));
      if(selectedCheckbox){
        $("#"+selectedCheckbox).parent().removeClass("load-check");
        $("input[type=checkbox]").attr('disabled', false);//checkbox button disabling all. need to get the checkbox button in ths page
        $("input[type=checkbox]:checked").attr('disabled', false);
      }
      status != "" && status != "SUCCESS"? this.utils.showError("errorMessagePrefCentre"):"";
    },SystemError => {
      if(selectedCheckbox){
        $("#"+selectedCheckbox).parent().removeClass("load-check");
        $("input[type=checkbox]").attr('disabled', false);
      }
    })
    .catch(error=>{});

  }
  smsonly(){
    $('#smsOnly:checked').length > 0? this.mixPanelEventCheck('smsOnlyChecked','CHECKED'):this.mixPanelEventCheck('smsOnlyUnChecked','UNCHECKED');
  }
  emailonly(){
    $('#emailOnly:checked').length > 0 ? this.mixPanelEventCheck('emailOnlyChecked','CHECKED'):this.mixPanelEventCheck('emailOnlyUnChecked','UNCHECKED');
  }
  mixPanelEventCheck(type,gameName):void{
    gameName=gameName?gameName:"";
    Promise.resolve(this.mixpaneldataService.userLoggedIn('myprofile',type,gameName));
  }
}
