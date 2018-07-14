import { FormArray, FormControl, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { AppLottodayService } from '../app-lottoday.service';
import { Utility } from '../utils/utility';

export class CustomValidators {
  static CHAZ = '\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29';
  static JAAZ = '\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B';
  static ACCENTEDLETTERS = 'A-zÀ-ÖØ-öø-ÿ';
  static numbers = '0-9';
  static letters = CustomValidators.ACCENTEDLETTERS + CustomValidators.CHAZ + CustomValidators.JAAZ;
  static nameRegex = new RegExp("^([" + CustomValidators.letters + "\\s\-])*$");
  static address = CustomValidators.letters + CustomValidators.numbers;
  static alphaNum = new RegExp("^([" + CustomValidators.address + "\\s\-])*$");
  static addressRegex = new RegExp("^([" + CustomValidators.address + "#,'\\s\-])*$");
  static dobRegex = new RegExp("^([" + CustomValidators.numbers + "\\/])*$");
  static passwordConfirming(c: AbstractControl): { invalid: boolean } {
    let message;

    if (!c.get('password').value) {
      c.get('password').setErrors({ 'message': 'This field is required' });
      message = { 'message': 'This field is required' };
    }
   if (!c.get('confirmPassword').value) {
     c.get('confirmPassword').setErrors({ 'message': 'This field is required' });
     message = { 'message': 'This field is required' };
   }else if (c.get('confirmPassword').value && c.get('password').value && c.get('password').value !== c.get('confirmPassword').value) {
     c.get('confirmPassword').setErrors({ 'message': 'Password Doesn\'t Match' });
     message = { 'message': 'Password Doesn\'t Match' };
   }else{
     c.get('confirmPassword').setErrors(null);
     message = {};
   }
    return message;
  };

  static dobValidator(c: FormControl): ValidationErrors {
    const dob = c.value;
    let message;
    let dobDate = new Date(dob);
    let currentDate = new Date();
    if (!dob) {
      message = { 'message': 'This field is required' };
    } else if (!CustomValidators.dobRegex.test(dob)) {
      message = { 'message': 'Invalid date' };
    }

    return message;
  };

  static verifyWireTransfer(c: AbstractControl): { invalid: boolean } {
    let message;
    let formtype = c.get('formtype').value
    if (!formtype) {
      c.get('accountNumber').setErrors({ 'message': 'Something Went Wrong. Please repload the page' });
      message = { 'message': 'Something Went Wrong. Please repload the page' };
      c.get('comments').setErrors({ 'message': 'Something Went Wrong. Please repload the page' });
      message = { 'message': 'Something Went Wrong. Please repload the page' };
      c.get('iban').setErrors({ 'message': 'Something Went Wrong. Please repload the page' });
      message = { 'message': 'Something Went Wrong. Please repload the page' };
    } else {
      if (formtype == "SEPA") {
        //
        if (!c.get('iban').value) {
          c.get('iban').setErrors({ 'message': 'This field is required' });
          message = { 'message': 'This field is required' };
        }
      } else if (formtype == "SWIFT") {
        if (!c.get('accountNumber').value) {
          c.get('accountNumber').setErrors({ 'message': 'This field is required' });
          message = { 'message': 'This field is required' };
        }
        if (!c.get('comments').value) {
          c.get('comments').setErrors({ 'message': 'This field is required' });
          message = { 'message': 'This field is required' };
        }
      }
    }

    return message;
  };


  static validateDepositAmount(depositLimitAvailable,period) {
    return function (control: FormControl) {
      const limit = control.value;
      let message;
      var regEx = /^[0-9]+$/;

      const daily = Number(depositLimitAvailable && depositLimitAvailable['limits'] && depositLimitAvailable['limits']['daily']?depositLimitAvailable['limits']['daily'].value:0);
      const weekly = Number(depositLimitAvailable && depositLimitAvailable['limits'] && depositLimitAvailable['limits']['weekly']?depositLimitAvailable['limits']['weekly'].value:0);
      const monthly = Number(depositLimitAvailable && depositLimitAvailable['limits'] && depositLimitAvailable['limits']['monthly']?depositLimitAvailable['limits']['monthly'].value:0);

      if (!limit) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(limit)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else {
        switch (period) {
          case 'daily':
            if (weekly > 0 && limit > weekly) {
              control.setErrors({ 'message': 'Daily limit cant be greater than Weekly Limit' });
              message = { 'message': 'Daily limit cant be greater than Weekly Limit' };
            } else if (monthly > 0 && limit > monthly) {
              control.setErrors({ 'message': 'Daily limit cant be greater than Monthly Limit' });
              message = { 'message': 'Daily limit cant be greater than Monthly Limit' };
            }
            break;
          case 'weekly':
            if (daily > 0 && daily > limit) {
              control.setErrors({ 'message': 'Weekly limit cant be lesser than Daily Limit' });
              message = { 'message': 'Weekly limit cant be lesser than Daily Limit' };
            } else if (monthly > 0 && limit > monthly) {
              control.setErrors({ 'message': 'Weekly limit cant be greater than Monthly Limit' });
              message = { 'message': 'Weekly limit cant be greater than Monthly Limit' };
            }
            break;
          case 'monthly':
            if (daily > 0 && daily > limit) {
              control.setErrors({ 'message': 'Monthly limit cant be lesser than Daily Limit' });
              message = { 'message': 'Monthly limit cant be lesser than Daily Limit' };
            } else if (weekly > 0 && weekly > limit) {
              control.setErrors({ 'message': 'Monthly limit cant be lesser than Weekly Limit' });
              message = { 'message': 'Monthly limit cant be lesser than Weekly Limit' };
            }
            break;
        }
      }

      return message;
    };
  };

  static validateLossWagerLimits(limitsAvailable,period) {
    return function (control: FormControl) {
      const limit = control.value;
      let message;
      var regEx = /^[0-9]+$/;

      const daily = Number(limitsAvailable && limitsAvailable['limits'] && limitsAvailable['limits']['daily']?limitsAvailable['limits']['daily'].value:0);
      const weekly = Number(limitsAvailable && limitsAvailable['limits'] && limitsAvailable['limits']['weekly']?limitsAvailable['limits']['weekly'].value:0);
      const monthly = Number(limitsAvailable && limitsAvailable['limits'] && limitsAvailable['limits']['monthly']?limitsAvailable['limits']['monthly'].value:0);

      if (!limit) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(limit)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else {
        switch (period) {
          case 'daily':
            if (weekly > 0 && limit > weekly) {
              control.setErrors({ 'message': 'Daily limit cant be greater than Weekly Limit' });
              message = { 'message': 'Daily limit cant be greater than Weekly Limit' };
            } else if (monthly > 0 && limit > monthly) {
              control.setErrors({ 'message': 'Daily limit cant be greater than Monthly Limit' });
              message = { 'message': 'Daily limit cant be greater than Monthly Limit' };
            }
            break;
          case 'weekly':
            if (daily > 0 && daily > limit) {
              control.setErrors({ 'message': 'Weekly limit cant be lesser than Daily Limit' });
              message = { 'message': 'Weekly limit cant be lesser than Daily Limit' };
            } else if (monthly > 0 && limit > monthly) {
              control.setErrors({ 'message': 'Weekly limit cant be greater than Monthly Limit' });
              message = { 'message': 'Weekly limit cant be greater than Monthly Limit' };
            }
            break;
          case 'monthly':
            if (daily > 0 && daily > limit) {
              control.setErrors({ 'message': 'Monthly limit cant be lesser than Daily Limit' });
              message = { 'message': 'Monthly limit cant be lesser than Daily Limit' };
            } else if (weekly > 0 && weekly > limit) {
              control.setErrors({ 'message': 'Monthly limit cant be lesser than Weekly Limit' });
              message = { 'message': 'Monthly limit cant be lesser than Weekly Limit' };
            }
            break;
        }
      }

      return message;
    };
  };

  // static validateDepositAmount(c: AbstractControl): { invalid: string } {
  //   let message;
  //   const period = c.get('type').value;
  //   const daily = Number(c.get('daily').value);
  //   const weekly = Number(c.get('weekly').value);
  //   const monthly = Number(c.get('monthly').value);
  //   switch (period) {
  //     case 'daily':
  //       c.get('weekly').setErrors(null);
  //       c.get('monthly').setErrors(null);
  //       if (!c.get('daily').value){
  //         c.get('daily').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('daily').value == "" || isNaN(daily) || daily < 0) {
  //         c.get('daily').setErrors({ 'message': 'This field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (weekly > 0 && daily > weekly) {
  //         c.get('daily').setErrors({ 'message': 'Daily limit cant be greater than Weekly Limit' });
  //         message = { 'message': 'Daily limit cant be greater than Weekly Limit' };
  //       } else if (monthly > 0 && daily > monthly) {
  //         c.get('daily').setErrors({ 'message': 'Daily limit cant be greater than Monthly Limit' });
  //         message = { 'message': 'Daily limit cant be greater than Monthly Limit' };
  //       }
  //       break;
  //     case 'weekly':
  //       c.get('monthly').setErrors(null);
  //       c.get('daily').setErrors(null);
  //       if (!c.get('weekly').value){
  //         c.get('weekly').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('weekly').value == "" || isNaN(weekly) || weekly < 0) {
  //         c.get('weekly').setErrors({ 'message': 'This field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (daily > 0 && daily > weekly) {
  //         c.get('weekly').setErrors({ 'message': 'Weekly limit cant be lesser than Daily Limit' });
  //         message = { 'message': 'Weekly limit cant be lesser than Daily Limit' };
  //       } else if (monthly > 0 && weekly > monthly) {
  //         c.get('weekly').setErrors({ 'message': 'Weekly limit cant be greater than Monthly Limit' });
  //         message = { 'message': 'Weekly limit cant be greater than Monthly Limit' };
  //       }
  //       break;
  //     case 'monthly':
  //       c.get('daily').setErrors(null);
  //       c.get('weekly').setErrors(null);
  //       if (!c.get('monthly').value){
  //         c.get('monthly').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('monthly').value == "" || isNaN(monthly) || monthly < 0) {
  //         c.get('monthly').setErrors({ 'message': 'his field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (daily > 0 && daily > monthly) {
  //         c.get('monthly').setErrors({ 'message': 'Monthly limit cant be lesser than Daily Limit' });
  //         message = { 'message': 'Monthly limit cant be lesser than Daily Limit' };
  //       } else if (weekly > 0 && weekly > monthly) {
  //         c.get('monthly').setErrors({ 'message': 'Monthly limit cant be lesser than Weekly Limit' });
  //         message = { 'message': 'Monthly limit cant be lesser than Weekly Limit' };
  //       }
  //       break;
  //   }
  //   return message;
  // };

  // static validateLossAmount(c: AbstractControl): { invalid: string } {
  //   let message;
  //   const period = c.get('type').value;
  //   const daily = Number(c.get('daily').value);
  //   const weekly = Number(c.get('weekly').value);
  //   const monthly = Number(c.get('monthly').value);
  //   switch (period) {
  //     case 'daily':
  //       c.get('weekly').setErrors(null);
  //       c.get('monthly').setErrors(null);
  //       if (!c.get('daily').value){
  //         c.get('daily').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('daily').value == "" || isNaN(daily) || daily < 0) {
  //         c.get('daily').setErrors({ 'message': 'This field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (weekly > 0 && daily > weekly) {
  //         c.get('daily').setErrors({ 'message': 'Daily limit cant be greater than Weekly Limit' });
  //         message = { 'message': 'Daily limit cant be greater than Weekly Limit' };
  //       } else if (monthly > 0 && daily > monthly) {
  //         c.get('daily').setErrors({ 'message': 'Daily limit cant be greater than Monthly Limit' });
  //         message = { 'message': 'Daily limit cant be greater than Monthly Limit' };
  //       }
  //       break;
  //     case 'weekly':
  //       c.get('monthly').setErrors(null);
  //       c.get('daily').setErrors(null);
  //       if (!c.get('weekly').value){
  //         c.get('weekly').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('weekly').value == "" || isNaN(weekly) || weekly < 0) {
  //         c.get('weekly').setErrors({ 'message': 'This field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (daily > 0 && daily > weekly) {
  //         c.get('weekly').setErrors({ 'message': 'Weekly limit cant be lesser than Daily Limit' });
  //         message = { 'message': 'Weekly limit cant be lesser than Daily Limit' };
  //       } else if (monthly > 0 && weekly > monthly) {
  //         c.get('weekly').setErrors({ 'message': 'Weekly limit cant be greater than Monthly Limit' });
  //         message = { 'message': 'Weekly limit cant be greater than Monthly Limit' };
  //       }
  //       break;
  //     case 'monthly':
  //       c.get('daily').setErrors(null);
  //       c.get('weekly').setErrors(null);
  //       if (!c.get('monthly').value){
  //         c.get('monthly').setErrors({ 'message': 'This field is required' });
  //         message = { 'message': 'This field is required' };
  //       }else if (c.get('monthly').value == "" || isNaN(monthly) || monthly < 0) {
  //         c.get('monthly').setErrors({ 'message': 'his field can contain only Numbers' });
  //         message = { 'message': 'This field is required' };
  //       } else if (daily > 0 && daily > monthly) {
  //         c.get('monthly').setErrors({ 'message': 'Monthly limit cant be lesser than Daily Limit' });
  //         message = { 'message': 'Monthly limit cant be lesser than Daily Limit' };
  //       } else if (weekly > 0 && weekly > monthly) {
  //         c.get('monthly').setErrors({ 'message': 'Monthly limit cant be lesser than Weekly Limit' });
  //         message = { 'message': 'Monthly limit cant be lesser than Weekly Limit' };
  //       }
  //       break;
  //   }
  //   return message;
  // };

  static startEndDateCheck(c: AbstractControl): { invalid: boolean } {
    let message;
    const startDate = c.get('startDate').value;
    const endDate = c.get('endDate').value;
    if (!startDate) {
      c.get('startDate').setErrors({ 'invalid': true });
      message = { 'message': 'This field is required' };
    }
    if (!endDate) {
      c.get('endDate').setErrors({ 'invalid': true });
      message = { 'message': 'This field is required' };
    }

    if (startDate && endDate && Date.parse(endDate) < Date.parse(startDate)) {
      c.get('endDate').setErrors({ 'message': 'End Date Cannot be smaller than Start Date' });
      message = { 'message': 'End Date Cannot be smaller than Start Date' };
    }
    return message;
  };

  static validName(minChar, maxChar) {
    return function (control: FormControl) {
      const name = control.value;
      let message;
      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && name.length < minChar) {
        message = { 'message': 'This field must be minimum of ' + minChar + ' letters' };
      } else if (name && name.length > maxChar) {
        message = { 'message': 'This field cannot be more then ' + maxChar + ' letters' };
      } else if (!CustomValidators.nameRegex.test(name)) {
        message = { 'message': 'This field should contain characters only' };
      } else {
        message = null;
      }

      return message;
    };
  };

  static validAlphaNumeric(minChar,maxChar) {
    return function (control: FormControl) {
      const name = control.value;
      let message;
      var regEx = /^[a-z0-9]+$/i

      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(name)) {
        message = { 'message': 'Invalid input' };
      }
      else if (name && name.length < minChar) {
        message = { 'message': 'This field must be minimum of ' + minChar + ' letters' };
      }else if (name && maxChar && name.length > maxChar) {
        message = { 'message': 'This field cannot exceed ' + maxChar + ' letters' };
      } else {
        message = null;
      }

      return message;
    };
  };
  //getater dan this month and yr
  static reqMinMaxNum(minNum, maxChar) {
    return function (control: FormControl) {
      const value = control.value;
      let message;
      var regEx = /^[0-9]*$/;
      if (!value) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(value)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else if (value.length < minNum) {
        message = { 'message': 'This field must be minimum of ' + minNum + ' letters' };
      } else if (value.length > maxChar) {
        message = { 'message': 'This field cannot be more then ' + maxChar + ' letters' };
      } else {
        message = null;
      }

      return message;
    };
  };

  static validateRealityCheckValue() {
    return function (control: FormControl) {
      const value = control.value;
      let message;
      var regEx = /^[0-9]+$/;
      if (!value) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(value)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else if (value > 60) {
        message = { 'message': 'This field value should be less than or equal to 60 Minutes' };
      } else {
        message = null;
      }

      return message;
    };
  };

  static validateNumericValue() {
    return function (control: FormControl) {
      const value = control.value;
      let message;
      var regEx = /^[0-9]+$/;
      if (!value) {
        message = { 'message': 'This field is required' };
      } else if (!regEx.test(value)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else {
        message = null;
      }

      return message;
    };
  };

  static hourMonthVaidator(control: AbstractControl): { invalid: string } {
        const hour = control.get("hours").value;
        const min = control.get("minutes").value;

        var regEx = /^[0-9]\d*$/;
        let message;
        if((hour==null || hour == undefined || hour == "") && (min == null || min == undefined || min == "")){
          message = { 'message': 'This field is required' };
          control.get("hours").setErrors({ 'message': 'This field is required' });
          control.get("minutes").setErrors({ 'message': 'This field is required' });
        }else if((hour==null || hour == undefined || hour == "") && (min != null || min != undefined || min != "")){
          message = {};
          control.get("hours").setErrors(null);
          control.get("minutes").setErrors(null);
          if(min < 0 || min > 59){
            message = { 'message': 'Invalid Minutes' };
            control.get("minutes").setErrors({ 'message': 'Minutes cannot be more than 59' });
          }
        }else if((min == null || min == undefined || min == "") && (hour!=null || hour != undefined || hour != "")){
          message = {};
          control.get("minutes").setErrors(null);
        }else if(min < 0 || min > 59){
          message = { 'message': 'Invalid Minutes' };
          control.get("minutes").setErrors({ 'message': 'Minutes cannot be more than 60' });
        }

        if(hour && !regEx.test(hour)){
          message = { 'message': 'Invalid Hour' };
          control.get("hours").setErrors({ 'message': 'Invalid Hour' });
        }
        if(min && !regEx.test(min)){
          message = { 'message': 'Invalid Minutes' };
          control.get("minutes").setErrors({ 'message': 'Invalid Minutes' });
        }

        return message;
  }


  static expCardData() {
    return function (control: FormControl) {
      const expMonth = control.get("expMonth").value;
      const expYear = control.get("expYear").value;

      var regEx = /^[0-9]*$/;
      let date = new Date();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let message;


      // var regEx = /^[0-9]*$/;

      // if (!name) {
      //   message = { 'message': 'This field is required' };
      // } else if (name && !regEx.test(name)) {
      //   message = { 'message': 'This field can contain only Numbers' };
      // } else if (name && name.length < minChar) {
      //   message = { 'message': 'This field must be minimum of ' + minChar + ' letters' };
      // } else {
      //   message = null;
      // }


      if (!expMonth) {
        message = { 'message': 'This field is required' };
        control.get("expMonth").setErrors({ 'message': 'This field is required' });
      }else if(!regEx.test(expMonth)){
        message = { 'message': 'card exp ... month invalid' };
        control.get("expMonth").setErrors({ 'message': 'Invalid Month' });
      } else if (expMonth < 1 || expMonth > 12) {
        message = { 'message': 'card exp ... month invalid' };
        control.get("expMonth").setErrors({ 'message': 'Invalid Month' });
      } else if (!expYear) {
        message = { 'message': 'This field is required' };
        control.get("expYear").setErrors({ 'message': 'This field is required' });
      }else if(!regEx.test(expYear)){
        message = { 'message': 'card exp ... month invalid' };
        control.get("expYear").setErrors({ 'message': 'Invalid Year' });
      }else if (expYear && expYear.length < 4) {
        message = { 'message': 'This field must be minimum of 4 numbers' };
        control.get("expYear").setErrors({ 'message': 'Minimum of 4 numbers' })
      }  else if (expYear < year) {
        message = { 'message': 'card exp ... year invalid' };
        control.get("expYear").setErrors({ 'message': 'Invalid Year' })
      } else if (expYear == year) {
        if (expMonth < month) {
          message = { 'message': 'card exp ... month invalid' };
          control.get("expMonth").setErrors({ 'message': 'Invalid Month' })
        } else if (expMonth > 12) {
          message = { 'message': 'card exp ... month invalid' };
          control.get("expMonth").setErrors({ 'message': 'Invalid Month' });
        } else {
          control.get("expMonth").setErrors(null);
          control.get("expYear").setErrors(null);

        }
      } else if (expYear > year) {

        control.get("expMonth").setErrors(null);
        control.get("expYear").setErrors(null);
      }
      return message;
    }
  }

  static validNumbers(minChar) {
    return function (control: FormControl) {
      const name = control.value;
      let message;
      var regEx = /^[0-9]*$/;

      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && !regEx.test(name)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else if (name && name.length < minChar) {
        message = { 'message': 'This field must be minimum of ' + minChar + ' letters' };
      } else {
        message = null;
      }

      return message;
    };
  };

  static minValueNumber(minValue,maxValue,fieldName) {
    return function (control: FormControl) {
      let name = control.value;
      let message;
      var regEx = /^[0-9]*(\.\d{0,2})?/;
      minValue = Number(minValue);
      maxValue = Number(maxValue);
      name  = Number(name);
      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && !regEx.test(name)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else if (name && minValue && name < minValue) {
        message = { 'message': fieldName+' cannot be less than '+minValue };
      } else if (name && maxValue && name > maxValue) {
        message = { 'message': fieldName+' cannot be greater than '+maxValue };
      }else {
        message = null;
      }

      return message;
    };
  };

  static exactNumberMatch(value) {
    return function (control: FormControl) {
      const name = control.value;
      let message;
      var regEx = /^[0-9]*$/;
      value = Number(value);
      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && !regEx.test(name)) {
        message = { 'message': 'This field can contain only Numbers' };
      } else if (name && value && name.length != value) {
        message = { 'message': 'Should contain '+value+' numbers' };
      }else {
        message = null;
      }

      return message;
    };
  };

  static maxLength(value) {
    return function (control: FormControl) {
      const name = control.value;
      let message;
      value = Number(value);
      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && value && name.length > value) {
        message = { 'message': 'Maximum of '+value+' characters allowed' };
      }else {
        message = null;
      }

      return message;
    };
  };

  static addressValidator(c: FormControl): ValidationErrors {
    const address = c.value;
    var mindigit = 2;
    let maxdigit = 200;
    let message;
    if (!address) {
      message = { 'message': 'This field is required' };
    }
    else if (address && address.length < mindigit) {
      message = { 'message': 'Too short address' };
    }else if (address && address.length > maxdigit) {
      message = { 'message': 'Too Long address' };
    } else if (!CustomValidators.addressRegex.test(address)) {
      message = { 'message': 'This field should contain characters only' };
    } else {
      message = null;
    }

    return message;
  };

  static creditCardValidator(utils: Utility) {
    return function (control: FormControl) {
      const ccNumber = control.get("cardNumber").value.split('-').join('');
      const newCard = control.get("cardId").value;
      var regEx = /^[0-9]*$/;
      var mindigit = 2;
      let message;


      if (newCard == 0) {
        if (!ccNumber) {
          control.get('cardNumber').setErrors({ 'message': 'This field is required' });
          message = { 'message': 'This field is required' };
        } else if (ccNumber && !regEx.test(ccNumber)) {
          control.get('cardNumber').setErrors({ 'message': 'This field can contain only Numbers' });
          message = { 'message': 'This field can contain only Numbers' };
        } else if (ccNumber && !utils.creditCardValidation(ccNumber)) {
          control.get('cardNumber').setErrors({ 'message': 'Please enter a valid card number' });
          message = { 'message': 'Please enter a valid card number' };
        } else {
          message = null;
        }
      } else {
        message = null;
      }


      return message;
    };
  };

  static phoneNumberValidator(c: FormControl): ValidationErrors {
    const phone = c.value;
    var regEx = /^[0-9]*$/;
    var mindigit = 5;
    var maxdigit = 10;
    let message;
    if (!phone) {
      message = { 'message': 'This field is required' };
    } else if (phone && !regEx.test(phone)) {
      message = { 'message': 'Phone Number can contain only Numbers' };
    } else if (phone && phone.length < mindigit) {
      message = { 'message': 'Phone Number should be minimum of ' + mindigit + ' numbers' };
    } else if (phone && phone.length > maxdigit) {
      message = { 'message': 'Phone Number cannot be more then ' + maxdigit + ' numbers' };
    }else {
      message = null;
    }

    return message;
  };

  static validateUniqueness(fieldToValidate, lottodayService: AppLottodayService, validateUnique) {
    return function (control: FormControl) {
      const name = control.value;
      var regEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      let regEx_nickname = /^[\w&.-]+$/;
      let message;
      if (!name) {
        message = { 'message': 'This field is required' };
      } else if (name && fieldToValidate == "txtEmail" && !regEx.test(name)) {
        message = { 'message': 'Email is not Valid' };
      } else if (name && fieldToValidate == "txtNickname" && name.length < 5 && !regEx.test(name)) {
        message = { 'message': 'This field must contain minimum of 5 letters' };
      } else if (validateUnique) {
        let validateValues = {
          [fieldToValidate]: name
        }
        Promise.resolve(lottodayService.validateUniqueness(validateValues))
          .then(uniqueData => {
            if (uniqueData && uniqueData["response"] == "1") {
              message = null;
              control.setErrors(null);
            } else {
              message = { 'message': fieldToValidate == "txtEmail" ? 'Email already Registered' : 'Nickname already Available' };
              control.setErrors(message);
            }
          });

      }

      return message;
    };
  };

  static validEmail(c: FormControl): ValidationErrors {
    const email = c.value;
    var regEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let message;
    if (!email) {
      message = { 'message': 'This field is required' };
    } else if (email && !regEx.test(email)) {
      message = { 'message': 'Email is not Valid' };
    } else {
      message = null;
    }

    return message;
  }

  static required(c: FormControl): ValidationErrors {
    const value = c.value;
    let message;
    if (!value || value.length<=0) {
      message = { 'message': 'This field is required' };
    } else {
      message = null;
    }

    return message;
  }


  static reqMin(minNum) {
    return function (control: FormControl) {
      const value = control.value;
      let message;
      if (!value) {
        message = { 'message': 'This field is required' };
      } else if (value.length < minNum) {
        message = { 'message': 'This field must be minimum of ' + minNum + ' letters' };
        control.setErrors(message);
      }
      else {
        message = null;
      }

      return message;
    };
  };
}
