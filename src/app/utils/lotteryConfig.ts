import { mobiscroll } from '../../lib/mobiscroll/js/mobiscroll.custom-4.1.0.min';

mobiscroll.settings = {
    theme: 'ios'
};
mobiscroll.apiKey = '283e5237-a7f1-4a95-ae2f-9951cd81f5c3';
export const lotteryConfig = {

    1 : {
        "lotteryId": 1,
        "gameTypes": "standardplay",
        "nameConstant": "EuroMillions"
    },2: {
        "lotteryId": 2,
        "gameTypes": "standardplay",
        "nameConstant": "EuroJackpot"
    },3: {
        "lotteryId": 3,
        "gameTypes": "standardplay,groupplay",
        "nameConstant": "PowerBall"
    },4: {
        "lotteryId": 4,
        "gameTypes": "standardplay,groupplay",
        "nameConstant": "MegaMillions"
    },5: {
        "lotteryId": 5,
        "gameTypes": "standardplay,groupplay",
        "nameConstant": "SuperEnaLotto"
    },6: {
        "lotteryId": 6,
        "gameTypes": "standardplay",
        "nameConstant": "LaPrimitiva"
    },7: {
        "lotteryId": 7,
        "gameTypes": "standardplay",
        "nameConstant": "ElGordo"
    }, 8:{
        "lotteryId": 8,
        "gameTypes": "standardplay",
        "nameConstant": "CaliforniaSuperLotto"
    },9: {
        "lotteryId": 9,
        "gameTypes": "standardplay",
        "nameConstant": "NewYorkLotto"
    },10: {
        "lotteryId": 10,
        "gameTypes": "standardplay",
        "nameConstant": "FloridaLotto"
    },11: {
        "lotteryId": 11,
        "gameTypes": "standardplay",
        "nameConstant": "Lotto649"
    },12: {
        "lotteryId": 12,
        "gameTypes": "standardplay",
        "nameConstant": "MegaSena"
    },13: {
        "lotteryId": 13,
        "gameTypes": "standardplay",
        "nameConstant": "OzLotto"
    },14: {
        "lotteryId": 14,
        "gameTypes": "standardplay",
        "nameConstant": "PowerballAustralia"
    },15: {
        "lotteryId": 15,
        "gameTypes": "standardplay",
        "nameConstant": "UKLotto"
    }, 16:{
        "lotteryId": 16,
        "gameTypes": "standardplay",
        "nameConstant": "FrenchLotto"
    },17: {
        "lotteryId": 17,
        "gameTypes": "standardplay",
        "nameConstant": "HotLotto"
    },18: {
        "lotteryId": 18,
        "gameTypes": "standardplay",
        "nameConstant": "IrishLotto"
    },/* {
        "lotteryId": 19,
        "gameTypes": "standardplay",
        "nameConstant": "HoosierLotto"
    },*/20: {
        "lotteryId": 20,
        "gameTypes": "standardplay",
        "nameConstant": "UKThunderBall"
    }, 21:{
        "lotteryId": 21,
        "gameTypes": "standardplay",
        "nameConstant": "EuroMillionsUK"
    },
};

export const selfExclusionList = [

  { days: 180, period: '6 Months' },
  { days: 270, period: '9 Months' },
  { days: 1*365, period: '1 year' },
  { days: 2*365, period: '2 years' },
  { days: 5*365, period: '5 years' }
];

export const availablePaymentMethods =["CREDITCARD","PAYPAL","NETELLER","SKRILL","TRUSTLY","ZIMPLER"];
export const availablePaymentMethodsMap ={
  "CREDITCARD":[{"methodName":"VISA","dispalyName":"Visa"},
                {"methodName":"MASTERCARD","dispalyName":"Mastercard"}],
  "PAYPAL":[{"methodName":"PAYPAL","dispalyName":"Paypal"}],
  "NETELLER":[{"methodName":"NETELLER","dispalyName":"Neteller"}],
  "SKRILL":[{"methodName":"SKRILL","dispalyName":"Skrill"}],
  "TRUSTLY":[{"methodName":"TRUSTLY","dispalyName":"Trustly"}],
  "ZIMPLER":[{"methodName":"ZIMPLER","dispalyName":"Zimpler"}]
};

export const availableWithdrawMethods =["CREDITCARD","NETELLER","WIRE_TRANSFER","TRUSTLY"];
export const availableWithdrawMethodsMap ={
  "CREDITCARD":[{"methodName":"VISA","dispalyName":"Visa"},
                {"methodName":"MASTERCARD","dispalyName":"Mastercard"}],
  "NETELLER":[{"methodName":"NETELLER","dispalyName":"Neteller"}],
  "WIRE_TRANSFER":[{"methodName":"WIRE_TRANSFER","dispalyName":"Wire Transfer"}],
  "TRUSTLY":[{"methodName":"TRUSTLY","dispalyName":"Trustly"}]
};

export const transactionTypeForALL = ["LOTTO_WIN",
                                      "LOTTO_BUYIN",
                                      "LOTTO_BUYIN_CANCEL",
                                      "LOTTO_LOWERING_BET",
                                      "REAL_CASH_DEPOSIT",
                                      "REAL_CASH_WITHDRAW",
                                      "PLAYER_SUBSCRIPTION",
                                      "REAL_CASH_ADDITION_BY_CS",
                                      "REAL_CASH_REMOVAL_BY_CS",
                                      "NEGATIVE_BALANCE_ADDITION_FOR_WIN_REVERSE",
                                      "REAL_CASH_ADJUSTMENT_FOR_WIN_REVERSE_CAPTURE",
                                      "POSITIVE_ADJUSTMENT",
                                      "NEGATIVE_ADJUSTMENT",
                                      "NEGATIVE_BALANCE_ADDITION_FOR_FRAUD",
                                      "REAL_CASH_ADJUSTMENT_FOR_FRAUD_CAPTURE_BY_CS"];


  export const transactionTypeConfs = [{ key: "ALL",value:"ALL"},
{key:"LOTTO_WIN",value:"Win"},
{key:"LOTTO_BUYIN",value:"Purchase"},
{key:"LOTTO_BUYIN_CANCEL",value:"Purchase cancelled"},
/*{key:"LOTTO_LEAVE_TABLE",value:"LOTTO_LEAVE_TABLE"},*/
{key:"LOTTO_LOWERING_BET",value:"Refund"},
{key:"REAL_CASH_DEPOSIT",value:"Deposit"},
{key:"REAL_CASH_WITHDRAW",value:"Withdrawal"},
{key:"PLAYER_SUBSCRIPTION",value:"Subscription"}];

export const dateMobiScroll = {
        theme: 'ios',
        display: 'bottom',
        width: 200
    }
export const mobiTimePicker = {
  theme: 'material',
  timeFormat: 'HH:ii'
}

// export const transactionTypeConfs = [
//   "LOTTO_BUYIN",
//   "REAL_CASH_DEPOSIT"];
