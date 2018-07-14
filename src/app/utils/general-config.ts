export const CCconfig = {
  blocks: {
    uatp:          [4, 5, 6],
    amex:          [4, 6, 5],
    diners:        [4, 6, 4],
    discover:      [4, 4, 4, 4],
    mastercard:    [4, 4, 4, 4],
    dankort:       [4, 4, 4, 4],
    instapayment:  [4, 4, 4, 4],
    jcb:           [4, 4, 4, 4],
    maestro:       [4, 4, 4, 4],
    visa:          [4, 4, 4, 4],
    mir:           [4, 4, 4, 4],
    general:       [4, 4, 4, 4],
    unionPay:      [4, 4, 4, 4],
    generalStrict: [4, 4, 4, 7]
  },

  re: {
    // starts with 1; 15 digits, not starts with 1800 (jcb card)
    // uatp: /^(?!1800)1\d{0,14}/,
    //
    // // starts with 34/37; 15 digits
    // amex: /^3[47]\d{0,13}/,
    //
    // // starts with 6011/65/644-649; 16 digits
    // discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
    //
    // // starts with 300-305/309 or 36/38/39; 14 digits
    // diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

    // starts with 51-55/2221–2720; 16 digits
    mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,

    // starts with 5019/4175/4571; 16 digits
    // dankort: /^(5019|4175|4571)\d{0,12}/,
    //
    // // starts with 637-639; 16 digits
    // instapayment: /^63[7-9]\d{0,13}/,
    //
    // // starts with 2131/1800/35; 16 digits
    // jcb: /^(?:2131|1800|35\d{0,2})\d{0,12}/,
    //
    // // starts with 50/56-58/6304/67; 16 digits
    // maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    //
    // // starts with 22; 16 digits
    // mir: /^220[0-4]\d{0,12}/,

    // starts with 4; 16 digits
    visa: /^4\d{0,15}/,

    // starts with 62; 16 digits
    //unionPay: /^62\d{0,14}/
  },
  minMaxlines:{
    // starts with 1; 15 digits, not starts with 1800 (jcb card)
     uatp: /\d{4,14}/,
    //
    // // starts with 34/37; 15 digits
     amex: /\d{4,15}/,
    //
    // // starts with 6011/65/644-649; 16 digits
     discover: /\d{4,16}/,
    //
    // // starts with 300-305/309 or 36/38/39; 14 digits
     diners: /\d{4,14}/,

    // starts with 51-55/2221–2720; 16 digits
    mastercard: /\d{4,16}/,

    // starts with 5019/4175/4571; 16 digits
     dankort: /\d{4,16}/,
    //
    // // starts with 637-639; 16 digits
     instapayment: /\d{4,16}/,
    //
    // // starts with 2131/1800/35; 16 digits
     jcb: /\d{4,16}/,
    //
    // // starts with 50/56-58/6304/67; 16 digits
     maestro: /\d{4,16}/,
    //
    // // starts with 22; 16 digits
     mir: /\d{4,16}/,

    // starts with 4; 16 digits
    visa: /\d{4,16}/,

    // starts with 62; 16 digits
    unionPay: /\d{4,16}/
  },
  maxdigits:{
    // starts with 1; 15 digits, not starts with 1800 (jcb card)
     uatp: 15,
    //
    // // starts with 34/37; 15 digits
     amex: 15,
    //
    // // starts with 6011/65/644-649; 16 digits
     discover: 16,
    //
    // // starts with 300-305/309 or 36/38/39; 14 digits
     diners: 14,

    // starts with 51-55/2221–2720; 16 digits
    mastercard: 16,

    // starts with 5019/4175/4571; 16 digits
     dankort: 16,
    //
    // // starts with 637-639; 16 digits
     instapayment: 16,
    //
    // // starts with 2131/1800/35; 16 digits
     jcb: 16,
    //
    // // starts with 50/56-58/6304/67; 16 digits
     maestro: 16,
    //
    // // starts with 22; 16 digits
     mir: 16,

    // starts with 4; 16 digits
    visa: 16,

    // starts with 62; 16 digits
    unionPay: 16
  }
}


export const faqConfig = [
  {"category":"general","count":[1,2,3,4,5,6,7]},
  {"category":"winnings","count":[1,2,3,4,5,6,7]},
  {"category":"subscriptions","count":[1,2,3,4,5,6,7]},
  {"category":"account","count":[1,2,3,4,5,6]},
  {"category":"jackpots","count":[1,2,3,4,5,6,7,8]},
  {"category":"scratchcards","count":[1,2,3,4,5,6]},
  {"category":"syndicates","count":[1,2,3,4]},
  {"category":"security","count":[1,2,3]},
  {"category":"games","count":[1,2,3,4]},
  {"category":"communications","count":[1,2,3]},
  {"category":"mobile","count":[1,2,3]},
  {"category":"withdrawing","count":[1,2,3,4,5]},
  {"category":"addfunds","count":[1,2,3,4]},
  {"category":"responsiblegambling","count":[1,2,3,4,5,6,7,8,9,10,11,12]},
  {"category":"promotions","count":[1,2,3]},
  {"category":"kyc","count":[1,2,3,4,5,6,7,8,9,10]}];

export const availableWithdrawCountries = {
  SWIFT:["AD","AE","AF","AG","AI","AL","AM","AN","AO","AQ","AR","AS","AU","AW","AX","AZ","BA","BB","BD","BF","BH","BI","BJ","BM","BN","BO","BR","BS","BT","BW","BY","BZ","CA","CC","CD","CF","CG","CI","CK","CL","CM","CN","CO","CR","CU","CV","CX","DJ","DM","DO","DZ","EC","EG","ER","ET","FJ","FK","FM","FO","GA","GD","GE","GH","GL","GM","GN","GQ","GS","GT","GU","GW","GY","HK","HN","HT","ID","IL","IN","IO","IQ","IR","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LK","LR","LS","LY","MA","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MR","MS","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PN","PR","PS","PW","PY","QA","RS","RU","RW","SA","SB","SC","SD","SG","SH","SJ","SL","SN","SO","SR","ST","SV","SY","SZ","TC","TD","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","ZA","ZM","ZW"],
  SEPA:["AT","BE","BG","BL","CH","CY","CZ","DE","DK","EE","ES","FI","FR","GB","GF","GG","GI","GP","GR","HR","HU","IE","IM","IS","IT","JE","LI","LT","LU","LV","MC","MF","MQ","MT","NL","NO","PL","PM","PT","RE","RO","SE","SI","SK","SM","YT"]
}
