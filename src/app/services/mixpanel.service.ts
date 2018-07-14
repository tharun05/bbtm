import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserDetailsService } from '../services/user-details.service';
import { Utility } from "../utils/utility";
import { EmitterService } from '../services/emitter.service';
declare const mixpanel: any;

@Injectable()
export class mixpanelService {

  upcomingDrawsgameCard = 'UPCOMING_DRAWS_';
  upcomingDrawSeeAll = 'SEE_ALL_LOTTO_GAMES';
  allDrawsgameCard = 'ALL_LOTTERIES_DRAWS_';

  MyResultsPlay = 'MY_RESULTS_PLAY_';
  MyResultsMoreInfo = 'MY_RESULTS_MORE_INFO_';

  latestResultsPlay = 'LATEST_RESULTS_PLAY_';
  latestResultsMoreInfo = 'LATEST_RESULTS_MORE_INFO_';
  latestResultsSeeAllPastResults = 'SEE_ALL_PAST_RESULTS';

  userLoggedInPlay = "FEATURED_GAMES_PLAY_";
  userLoggedIn5lines = "FEATURED_GAMES_5LINES_";
  userLoggedIn10lines = "FEATURED_GAMES_10LINES_";

  footerpopularlotto = "POPULAR_LOTTERIES_";
  footerinfotools = "INFO_&_TOOLS_";
  footerabout = "ABOUT_";
  footerhelp = "HELP_";

  home = "HOME";
  login = "LOGIN_CLICKED";
  loginsucess = "LOGIN_SUCCESS";
  loginerror = "LOGIN_ERROR_";

  logout = "LOGOUT";
  registration = "REGISTRATION";
  fp = "FORGOTTEN_PASSWORD"
  OFA = "OPEN_FREE_ACCOUNT";

  cart = "CART"
  myaccount = "MY_ACCOUNT"
  mytransactions = "MY_TRANSACTIONS"
  myresults = "MY_LOTTO_RESULTS"
  cashier = "CASHIER"
  bethistory = "BET_HISTORY"
  QD = "QUICK_DEPOSIT";
  syndicate = "SYNDICATES_PLAY_";
  syndicateP = "SYNDICATE_ADD_";
  syndicateM = "SYNDICATE_SUB_";


  lottogames = "LOTTO_GAMES";
  headerMobiR = "RESULTS";
  headerMobiCS = "CUSTOMER_SERVICE";
  headerMobiAL = "ABOUT_BINGO69";

  userloggedIn = "_LOGGED_IN_USER";
  userloggedOff = "_LOGGED_OFF_USER";
  quickpicks = "QUICKPICKS_";
  cyo = "CREATE_YOUR_OWN_";

  filter = "FILTER RESULTS";
  contactus = "CONTACTUS_SUBMITTED";

  Randomnumbers = "RANDOM_NUMBERS_WITH_QUICKPICK_";
  shownumbers = "SHOW_NUMBERS_";
  Chooseown = "CHOOSE_MY_OWN_NUMBERS_";
  oneDraw = "1_DRAW_ONLY_";
  Multidraw = "MULTI_DRAW_";
  Subscribe = "SUBSCRIBE_";

  addToCart = "ADD_TO_CART_"

  editcart = "CART_ITEM_EDIT_";
  delcart = "CART_ITEM_DELETED_";

  findgames = "CART_FIND_GAMES_";
  paySecure = "CART_PAYNOW_CLICKED";
  OFAcart = "CART_OPEN_FREE_ACCOUNT";
  logincart = "CART_" + this.login;

  cartfail = "ORDER_FAILED_"
  cartsuccess = "ORDER_SUCCESS_"
  depositfail = "DEPOSIT_FAILED";
  depositsuccess = "DEPOSIT_SUCCESS_";
  retry = "RETRY_ORDER_CLICKED_"

  myAccountProfile = "MYACCOUNT_CLICKED";
  changePassword = 'CHANGE_PASSWORD';

  smsOnlyChecked = "PREFERENCE_SMS_CHECKED";
  emailOnlyChecked = "PREFERENCE_EMAIL_CHECKED";
  smsOnlyUnChecked = "PREFERENCE_SMS_UNCHECKED";
  emailOnlyUnChecked = "PREFERENCE_EMAIL_UNCHECKED";

  depositdaily = "DEPOSIT_LIMIT_DAILY";
  depositweekly = "DEPOSIT_LIMIT_WEEKLY";
  depositmonthly = "DEPOSIT_LIMIT_MONTHLY";

  depositLimitSucess = "SET_LIMIT_SUCCESS";
  depositLimitFail = "SET_LIMIT_FAILED";
  realityCheckSucess = "REALITY_CHECK_SUCCESS";
  realityCheckFail = "REALITY_CHECK_FAIL";
  accountstautsregistered = "ACCOUNT_STATUS";

  userData = {};
  userShortData = {};
  userDetailedData = {};
  userDataUpdatedSubs;

  constructor(private emitterService: EmitterService,
    private userService: UserDetailsService,
    private utils: Utility) {
    mixpanel.init(environment.mixpanel);
    this.userDataUpdatedSubs = emitterService.userDataSource$.subscribe(
      userDataSource => {
        if (userDataSource == "User Data Updated") {
          // var data = this.userService.getuserProfileDetails();
          this.updatedata();
        }
      }
    )

  }
  updatedata() {
    this.userData = {}
    this.userShortData = {};
    var data = this.userService.getuserProfileDetails();
    if (data) {
      this.userData = {
        $first_name: data.firstName,
        $last_Name: data.lastName,
        $email: data.email,
        $phone: data.phone,
        $Nickname: data.nickname,
        $Currency: data.currency,
        "Street Address": data.address1,
        "Zip/Post Code": data.zip,
        "Date of Birth": data.birthDate,
        "User Preffered Country": data.country,
        "User Preffered State": data.state,
        "User Preffered City": data.city,
        "Male/Female": data.gender,
        "Subscribed Promotional Notifications": data.emailAndMobileSubscribed,
        "Last Login Time": new Date().toISOString(),
        "Affiliate Id": localStorage.getItem("affId") ? localStorage.getItem("affId") : null
      }
      this.userShortData = {
        "$email": data.email,
        "$name": data.firstName + " " + data.lastName,
      }
    }
  }
  userLoggedIn(comp, type, gameType): any {
    this.updatedata()
    if (this.utils.isUserLoggedIn()) {
      switch (comp) {
        case "feturedlogic":
          this.feturedlogic(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "headercomp":
          this.mobileMenuLeftRight(type, this.userloggedIn, this.userShortData);
          break;
        case "loginform":
          this.loginform(type, this.userloggedIn, this.userShortData);
          break;
        case "upcomingDraws":
          this.upcomingDraws(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "allDraws":
          this.allDraws(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "latestResults":
          this.latestResults(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "allResults":
          this.myResults(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "headerdropdown":
          this.headerdropdown(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "mytransaction":
          this.mytransaction(type, this.userloggedIn, this.userShortData);
          break;
        case "syndicate":
          this.syndicatePage(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "contact":
          this.contact(type, this.userloggedIn, this.userShortData);
          break;
        case "standardticket":
          this.standardticket(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "cart":
          this.cartpage(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "cashier":
          this.cashierpage(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "profile":
          this.profilepage(type, gameType, this.userData);
          break;
        case "myprofile":
          this.myprofilepage(type, gameType, this.userloggedIn, this.userData);
          break;
      }
    }
    else {
    this.updatedata()
      switch (comp) {
        case "feturedlogic":
          this.feturedlogic(type, gameType, this.userloggedOff, '');
          break;
        case "headercomp":
          this.mobileMenuLeftRight(type, this.userloggedOff, '');
          break;
        case "loginform":
          this.loginform(type, this.userloggedOff, '');

          break;
        case "upcomingDraws":
          this.upcomingDraws(type, gameType, this.userloggedOff, '');
          break;
        case "allDraws":
          this.allDraws(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "latestResults":
          this.latestResults(type, gameType, this.userloggedOff, '');
          break;
        case "allResults":
          this.myResults(type, gameType, this.userloggedIn, this.userShortData);
          break;
        case "headerdropdown":
          this.headerdropdown(type, gameType, this.userloggedOff, '');
          break;
        case "mytransaction":
          this.mytransaction(type, this.userloggedOff, '');
          break;
        case "syndicate":
          this.syndicatePage(type, gameType, this.userloggedOff, '');
          break;
        case "contact":
          this.contact(type, this.userloggedOff, '');
          break;
        case "standardticket":
          this.standardticket(type, gameType, this.userloggedOff, '');
          break;
        case "cart":
          this.cartpage(type, gameType, this.userloggedOff, '');
          break;
        case "cashier":
          this.cashierpage(type, gameType, this.userloggedOff, '');
          break;
        case "profile":
          this.profilepage(type, gameType, '');
          break;
        case "myprofile":
          this.myprofilepage(type, gameType, this.userloggedOff, this.userData);
          break;

      }
    }
  }

  feturedlogic(type, gameType, userstatus, userData): any {
    if (type == "play") {
      userData
      mixpanel.track(this.userLoggedInPlay + gameType.toUpperCase() + userstatus, userData);
    }
    else if (type == "5lines") {
      mixpanel.track(this.userLoggedIn5lines + gameType.toUpperCase() + userstatus, userData);
    }
    else if (type == "10lines") {
      mixpanel.track(this.userLoggedIn10lines + gameType.toUpperCase() + userstatus, userData);
    }
  }

  upcomingDraws(type, gameName, userstatus, userData): any {

    if (type == "gameCard") {
      mixpanel.track(this.upcomingDrawsgameCard + gameName.toUpperCase() + userstatus, userData);
    }
    else
      mixpanel.track(this.upcomingDrawSeeAll + userstatus, userData);

  }

  allDraws(type, gameName, userstatus, userData): any {

    if (type == "gameCard") {
      mixpanel.track(this.allDrawsgameCard + gameName.toUpperCase() + userstatus, userData);
    }
    else
      mixpanel.track(this.upcomingDrawSeeAll + userstatus, userData);

  }

  latestResults(type, gameType, userstatus, userData): any {
    if (type == "play") {
      mixpanel.track(this.latestResultsPlay + gameType.toUpperCase() + userstatus, userData);
    }
    else if (type == "moreInfo") {
      mixpanel.track(this.latestResultsMoreInfo + gameType.toUpperCase() + userstatus, userData);
    }
    else if (type == "see All Past Results") {
      mixpanel.track(this.latestResultsSeeAllPastResults + userstatus, userData);
    }
  }

  myResults(type, gameType, userstatus, userData): any {
    if (type == "play") {
      mixpanel.track(this.MyResultsPlay + gameType.toUpperCase(), userData);
    }
    else if (type == "details") {
      mixpanel.track(this.MyResultsMoreInfo + gameType.toUpperCase(), userData);
    }
  }

  footer(type, gameType): any {
    switch (type) {
      case "Popular Lotteries":
        mixpanel.track(this.footerpopularlotto + gameType.toUpperCase());
        break;
      case "INFO & TOOLS":
        mixpanel.track(this.footerinfotools + gameType.toUpperCase());
        break;
      case "ABOUT":
        mixpanel.track(this.footerabout + gameType.toUpperCase());
        break;
      case "Help":
        mixpanel.track(this.footerhelp + gameType.toUpperCase());
        break;
    }
  }

  mobileMenuLeftRight(type, userstatus, userData): any {
    switch (type) {
      case "OPEN FREE ACCOUNT":
        mixpanel.track(this.OFA, userData);
        break;
      case "Quick Deposit":
        mixpanel.track(this.QD, userData);
        break;
      case "Home":
        mixpanel.track(this.home + userstatus, userData);
        break;
      case "Lotto Games":
        mixpanel.track(this.lottogames + userstatus, userData);
        break;
      case "Syndicates":
        mixpanel.track(this.syndicate + userstatus, userData);
        break;
      case "Results":
        mixpanel.track(this.headerMobiR + userstatus, userData);
        break;
      case "Customer Service":
        mixpanel.track(this.headerMobiCS + userstatus, userData);
        break;
      case "About Bingo69":
        mixpanel.track(this.headerMobiAL + userstatus, userData);
        break;
      case "cart":
        mixpanel.track(this.cart + userstatus, userData);
        break;
      case "myresults":
        mixpanel.track(this.myresults, userData);
        break;
      case "myaccount":
        mixpanel.track(this.myaccount + userstatus, userData);
        break;
      case "bethistory":
        mixpanel.track(this.bethistory + "_CLICKED", userData);
        break;
      case "mytransaction":
        mixpanel.track(this.mytransactions + "_CLICKED", userData);
        break;
      case "cashier":
        mixpanel.track(this.cashier + "_CLICKED", userData);
        break;
      case "logout":
        mixpanel.track(this.logout, userData);
        break;
      case "login":
        mixpanel.track(this.login, userData);
        // mixpanel.identify(userData.email);
        // mixpanel.people.set(userData);
        break;
      case "registration":
        mixpanel.track(this.registration, userData);
        break;
    }
  }

  loginform(type, userstatus, data): any {
    if (type != "loginerror") {
      data = {
        $email: data
      }
    } else

      this.userData = {
        $first_name: data.firstName,
        $last_Name: data.lastName,
        $email: data.email,
        $phone: data.phone,
        $Nickname: data.nickname,
        $Currency: data.currency,
        "Street Address": data.address,
        "City": data.city,
        "Zip/Post Code": data.zip,
        "Date of Birth": data.birthDate,
        "Male/Female": data.gender,
        "Receive Promotional Events": data.promoAvailable,
        "Last Login Time": new Date().toISOString(),
        "Affiliate Id": localStorage.getItem("affId") ? localStorage.getItem("affId") : null
      }
    switch (type) {
      case "login":
        mixpanel.track(this.loginsucess, data);
        mixpanel.identify(data.email);
        mixpanel.people.set(this.userData);
        break;
      case "loginerror":
        mixpanel.track(this.loginerror + data.toUpperCase());
        break;
      case "HAVING TROUBLE LOGGING IN":
        mixpanel.track(this.fp);
        break;
      case "ofa":
        mixpanel.track(this.OFA);
        break;
    }
  }

  headerdropdown(type, gameType, userstatus, userData): any {
    switch (type) {
      case "QUICKPICKS":
        mixpanel.track(this.quickpicks + gameType.toUpperCase() + userstatus, userData);
        break;
      case "CREATE YOUR OWN":
        mixpanel.track(this.cyo + gameType.toUpperCase() + userstatus, userData);
        break;
      case "VIEW ALL":
        mixpanel.track(this.lottogames + userstatus, userData);
        break;
    }
  }

  mytransaction(type, userstatus, userData): any {
    if (type == "filter") {
      mixpanel.track(this.filter, userData);
    }
  }

  syndicatePage(type, gameName, userstatus, userData): any {

    switch (type) {
      case "Syndicates":
        mixpanel.track(this.syndicate + gameName.toUpperCase() + userstatus, userData);
        break;
      case "Syndicatesub":
        mixpanel.track(this.syndicateM + gameName.toUpperCase() + userstatus, userData);
        break;
      case "Syndicateadd":
        mixpanel.track(this.syndicateP + gameName.toUpperCase() + userstatus, userData);
        break;
    }

  }

  contact(type, userstatus, userData): any {
    if (type == "contactus") {
      mixpanel.track(this.contactus + userstatus, userData);
    }
  }

  standardticket(type, gameName, userstatus, userData): any {
    switch (type) {
      case "Randomnumbers":
        mixpanel.track(this.Randomnumbers + gameName.toUpperCase() + userstatus, userData);
        break;
      case "shownumbers":
        mixpanel.track(this.shownumbers + gameName.toUpperCase() + userstatus, userData);
        break;
      case "Chooseown":
        mixpanel.track(this.Chooseown + gameName.toUpperCase() + userstatus, userData);
        break;
      case "oneDraw":
        mixpanel.track(this.oneDraw + gameName.toUpperCase() + userstatus, userData);
        break;
      case "Multidraw":
        mixpanel.track(this.Multidraw + gameName.toUpperCase() + userstatus, userData);
        break;
      case "Subscribe":
        mixpanel.track(this.Subscribe + gameName.toUpperCase() + userstatus, userData);
        break;
      case "addToCart":
        mixpanel.track(this.addToCart + gameName.toUpperCase() + userstatus, userData);
        break;
      case "draw_change_event":
        mixpanel.track(gameName.toUpperCase() + userstatus, userData);
        break;
    }

  }


  cartpage(type, gameName, userstatus, userData): any {
    switch (type) {
      case "editcart":
        mixpanel.track(this.editcart + gameName.toUpperCase() + userstatus, userData);
        break;
      case "delcart":
        mixpanel.track(this.delcart + gameName.toUpperCase() + userstatus, userData);
        break;
      case "findgames":
        mixpanel.track(this.findgames + userstatus, userData);
        break;
      case "ofa":
        mixpanel.track(this.OFAcart, userData);
        break;
      case "paySecure":
        mixpanel.track(this.paySecure, userData);
        break;
      case "Subscribe":
        mixpanel.track(this.Subscribe + userstatus, userData);
        break;
      case "addToCart":
        mixpanel.track(this.addToCart + userstatus, userData);
        break;
      case "login":
        mixpanel.track(this.logincart, userData);
        // mixpanel.identify(userData.email);
        // mixpanel.people.set(userData);
        break;
    }
  }

  cashierpage(type, gameName, userstatus, userData): any {
    if (type == "depositfail" || "cartfail") {
      userData.description = "FAILED: " + gameName;
    }
    switch (type) {
      case "depositfail":
        mixpanel.track(this.depositfail, userData);
        break;

      case "depositsuccess":
        mixpanel.track(this.depositsuccess + gameName.toUpperCase(), userData);
        break;
      case "transaction":
        mixpanel.track(gameName.toUpperCase(), userData);
        break;
      case "cartsuccess":
        mixpanel.track(this.cartsuccess + gameName.toUpperCase(), userData);
        break;
      case "cartfail":
        mixpanel.track(this.cartfail + gameName.toUpperCase(), userData);
        break;
      case "retry":
        mixpanel.track(this.retry, userData);
        break;
    }

  }
  registrationstepone(type, gameName, userData): any {
    userData = {
      $first_name: userData.firstName,
      $last_Name: userData.lastName,
      $email: userData.email,
      $phone: userData.phone,
      $Nickname: userData.nickname,
      $Currency: userData.currency,
      "User Preffered Country": userData.country,
      "User Preffered State": userData.state,
      "User Preffered City": userData.city,
      "Street Address": userData.address,
      "City": userData.city,
      "Zip/Post Code": userData.zip,
      "Date of Birth": userData.birthDate,
      "Male/Female": userData.gender,
      "Subscribed Promotional Notifications": userData.emailAndMobileSubscribed,
      "Last Login Time": new Date().toISOString(),
      "Affiliate Id": localStorage.getItem("affId") ? localStorage.getItem("affId") : null
    }
    switch (type) {
      case "signupstep1":
        mixpanel.track(gameName.toUpperCase(), userData);
        mixpanel.identify(userData.email);
        mixpanel.people.set(userData);
        userData = {};
        break;
      case "REGISTRATION_ERROR":
        userData.description = gameName.toUpperCase();
        mixpanel.track(type, userData);
        break;
    }
  }
  profilepage(type, gameName, userData): any {
    switch (type) {
      case "signupstepTwo":
        mixpanel.track(gameName.toUpperCase(), userData);
        mixpanel.identify(userData.email);
        mixpanel.people.set(userData);
        break;
      case "editprofile":
        mixpanel.track(gameName.toUpperCase(), userData);
        mixpanel.identify(userData.email);
        mixpanel.people.set(userData);
        break;
      // case "signupstep1":
      //   mixpanel.track(gameName.toUpperCase(), userData);
      //   mixpanel.identify(userData.email);
      //   mixpanel.people.set(userData);
      //   break;
      case "REGISTRATION_ERROR":
        userData.description = gameName.toUpperCase();
        mixpanel.track(type, userData);
        break;

    }

  }

  myprofilepage(type, gameName, userstatus, userData): any {

    switch (type) {
      case "myAccount":
        mixpanel.track(this.myAccountProfile + userstatus, userData);
        break;
      case "mytransactions":
        mixpanel.track(this.mytransactions + "_CLICKED", userData);
        break;
      case "bethistory":
        mixpanel.track(this.bethistory + "_CLICKED", userData);
        break;
      case "cashier":
        mixpanel.track(this.cashier + "_CLICKED", userData);
        break;
      case "changePassword":
        mixpanel.track(this.changePassword, userData);
        break;
      case "emailOnlyChecked":
      userData.Preffered_EMAIL = gameName;
        mixpanel.track(this.emailOnlyChecked, userData);
        break;
      case "emailOnlyUnChecked":
      userData.Preffered_EMAIL = gameName;
        mixpanel.track(this.emailOnlyUnChecked, userData);
        break;
      case "smsOnlyChecked":
      userData.Preffered_SMS = gameName;
        mixpanel.track(this.smsOnlyChecked, userData);
        break;
      case "smsOnlyUnChecked":
      userData.Preffered_SMS = gameName;
        mixpanel.track(this.smsOnlyUnChecked, userData);
        break;
      case "depositLimitSucess":
        userData.Daily = gameName.daily;
        userData.Monthly = gameName.monthly;
        userData.Weekly = gameName.weekly;
        mixpanel.track(this.depositLimitSucess, userData);
        break;
      case "depositLimitFail":
        userData.Daily = gameName.daily;
        userData.Monthly = gameName.monthly;
        userData.Weekly = gameName.weekly;
        userData.Error = gameName.error;
        mixpanel.track(this.depositLimitFail, userData);
        break;
      case "realityCheckSucess":
      userData.RealityCheck= gameName;
        mixpanel.track(this.realityCheckSucess, userData);
        break;
        case "realityCheckFail":
        mixpanel.track(this.realityCheckFail, userData);
        break;
      case "accountstauts":
      userData.Suspended_Account_Data = gameName.reason;
      userData.Suspended_Account_Data_Till = gameName.expire+ " days";
      
        mixpanel.track(this.accountstautsregistered, userData);
        break;
    }
  }

}