
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppLdRoutingModule } from './app-ld-routing/app-ld-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { AppHomeComponent } from './app-home/app-home.component';
import { AppRegistrationComponent } from './app-registration/app-registration.component';
import { AppLottodayService } from './app-lottoday.service';
import { EmitterService } from './services/emitter.service';
import 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MbscModule } from '../lib/mobiscroll/js/mobiscroll.custom-4.1.0.min';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';

import { AppLoginComponent } from './app-login/app-login.component';
import { AppIconSvgComponent } from './app-icon-svg/app-icon-svg.component';
import { AppFooterSvgComponent } from './app-footer-svg/app-footer-svg.component';
import { Utility } from './utils/utility';
import { AppTimerComponent } from './app-timer/app-timer.component';
import { BingoDataService } from './services/bingo-data.service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { AppPaymentComponent } from './app-payment/app-payment.component';
import { UserDetailsService } from './services/user-details.service';
import { AppTxnStatusComponent } from './app-txn-status/app-txn-status.component';
import { AppLoginFormComponent } from './app-login-form/app-login-form.component';
import { AppRegistrationFormComponent } from './app-registration-form/app-registration-form.component';
import { AppMyaccountComponent } from './app-myaccount/app-myaccount.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AppChangePasswordComponent } from './app-change-password/app-change-password.component';
import { AppResponsibleGamingComponent } from './app-responsible-gaming/app-responsible-gaming.component';
import { AccountStatusComponent } from './account-status/account-status.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { AppLoginPageComponent } from './app-login-page/app-login-page.component';
import { AppAccountSectionComponent } from './app-account-section/app-account-section.component';
import { AppDepositLimitComponent } from './app-deposit-limit/app-deposit-limit.component';
import { AppPreferenceCentreComponent } from './app-preference-centre/app-preference-centre.component';
import { AppDateSuffixPipe } from './app-date-suffix.pipe';
import { AppReturnFrom3dComponent } from './app-return-from-3d/app-return-from-3d.component';
import { PaymentService } from './services/payment.service';
import { AppGamingRealityCheckComponent } from './app-gaming-reality-check/app-gaming-reality-check.component';
import { AppPaymentContainerFieldsComponent } from './app-payment-container-fields/app-payment-container-fields.component';
import { AppBetHistoryComponent } from './app-bet-history/app-bet-history.component';
import { AppCashierComponent } from './app-cashier/app-cashier.component';
import { AppWithdrawFundsComponent } from './app-withdraw-funds/app-withdraw-funds.component';
import { AppPaymentMethodsComponent } from './app-payment-methods/app-payment-methods.component';
import { AppPageLoaderComponent } from './app-page-loader/app-page-loader.component';
import { RealityCheckService } from './services/reality-check.service';
import { AppForgotpasswordComponent } from './app-forgotpassword/app-forgotpassword.component';
import { AppFaqComponent } from './app-faq/app-faq.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppContactContainerComponent } from './app-contact-container/app-contact-container.component';
import { AppContactComponent } from './app-contact/app-contact.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AboutBellaBingoComponent } from './about-Bella-Bingo/about-bellaBingo.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { ConfirmIdentityComponent } from './confirm-identity/confirm-identity.component';
import { LogoutEmitService } from './services/logout-emit-service';
import { AppLoadingScreenComponent } from './app-loading-screen/app-loading-screen.component';
import { AppCookiePolicyComponent } from './app-cookie-policy/app-cookie-policy.component';
import { AppFooterShortComponent } from './app-footer-short/app-footer-short.component';
import { ModalService } from './services/modal.service';
import { ModalComponent } from './app-modal/app-modal.component';
import { CompleteProfilePageComponent } from './complete-profile-page/complete-profile-page.component';
import { AppHeaderMenuDropDown } from './app-header-menu-dropdown/app-header-menu-dropdown.component';
import { AppMaintenanceComponent } from './app-maintenance/app-maintenance.component';
import { AppBlockedCountryComponent } from './app-blocked-country/app-blocked-country.component';
import { AppCookieMsgComponent } from './app-cookie-msg/app-cookie-msg.component';
import { mixpanelService } from './services/mixpanel.service';
import { AppMathCeilPipe } from './app-math-ceil.pipe';
import { TimerDirective } from './app-timer/timer.directive';
import { TranslationService } from './services/translate.service';
import { FeaturedSlotsComponent } from './featured-slots/featured-slots.component';
import { AppSlotsComponent } from './app-slots/app-slots.component';
import { SlotsPipe } from './slots.pipe';
import { GameWindowComponent } from './game-window/game-window.component';
import { GameWindowService } from './game-window/gameWindow.service';
import { SlotsSearchPipe } from './slots.search.pipe';
import { FeaturedGamesComponent } from './featured-games/featured-games.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ScratchComponent } from './scratch/scratch.component';
import { PromotionComponent } from './promotion/promotion.component';
import { BingoComponent } from './bingo/bingo.component';
import { VerificationComponent } from './verification/verification.component';
import { BonusComponent } from './bonus/bonus.component';
import { BonusFieldComponent } from './bonus-field/bonus-field.component';
import { LossLimitComponent } from './loss-limit/loss-limit.component';
import { WagerLimitComponent } from './wager-limit/wager-limit.component';
import { SessionLimitComponent } from './session-limit/session-limit.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { SortPipe } from './sort.pipe';
import { AppOnlinePlayers } from './app-onlineplayers/app-onlineplayer.component';
import {AppResponsibleGambling} from './app-about-responsible gambling/app-about-gambling';
import {AppBingoGuideComponent} from './app-bingo-guides/app-bingo-guide.component';
import { SocketService } from './services/socket.service';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from './withdrawal-modal/withdrawal-modal.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import {BannerComponent} from './banner/banner.component';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';
import { WhatIsBingoComponent } from './what-is-bingo/what-is-bingo.component';
import { WhatIs90BallBingoComponent } from './what-is90-ball-bingo/what-is90-ball-bingo.component';
import { VariantBingoComponent } from './variant-bingo/variant-bingo.component';
import { Bingo69TermsConditionsComponent } from './bingo69-terms-conditions/bingo69-terms-conditions.component';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { WhatbingoComponent } from './whatbingo/whatbingo.component';
import { BingoGuideComponent } from './bingo-guide/bingo-guide.component';
import { AppMiniSlotComponent } from './app-minislots/app-minislot.component';
import { AppSamplePageComponent } from './sample-folder/app-sample-page.component';
import {GameWinHistoryService} from './services/game-win-history.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AppHomeComponent,
    AppRegistrationComponent,
    AppLoginComponent,
    AppIconSvgComponent,
    AppFooterSvgComponent,
    AppTimerComponent,
    PasswordStrengthBarComponent,
    AppPaymentComponent,
    AppTxnStatusComponent,
    AppLoginFormComponent,
    AppRegistrationFormComponent,
    AppMyaccountComponent,
    UpdateProfileComponent,
    AppChangePasswordComponent,
    AppResponsibleGamingComponent,
    AccountStatusComponent,
    MyTransactionsComponent,
    AppLoginPageComponent,
    AppAccountSectionComponent,
    AppDepositLimitComponent,
    AppPreferenceCentreComponent,
    AppDateSuffixPipe,
    AppReturnFrom3dComponent,
    AppGamingRealityCheckComponent,
    AppPaymentContainerFieldsComponent,
    AppBetHistoryComponent,
    AppCashierComponent,
    AppWithdrawFundsComponent,
    AppPaymentMethodsComponent,
    AppPageLoaderComponent,
    AppForgotpasswordComponent,
    AppFaqComponent,
    ResetPasswordComponent,
    AppContactContainerComponent,
    AppContactComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    AboutBellaBingoComponent,
    CompleteProfileComponent,
    ConfirmIdentityComponent,
    AppLoadingScreenComponent,
    AppCookiePolicyComponent,
    AppFooterShortComponent,
    ModalComponent,
    CompleteProfilePageComponent,
    AppHeaderMenuDropDown,
    AppMaintenanceComponent,
    AppBlockedCountryComponent,
    AppCookieMsgComponent,
    AppMathCeilPipe,
    BannerComponent,
    TimerDirective,
    SlotsPipe,
    AppSlotsComponent,
    FeaturedSlotsComponent,
   GameWindowComponent,
   SlotsSearchPipe,
   FeaturedGamesComponent,
   NewsletterComponent,
   UpcomingEventsComponent,
   TestimonialComponent,
   ScratchComponent,
   PromotionComponent,
   BingoComponent,
   VerificationComponent,
   BonusComponent,
   BonusFieldComponent,
   LossLimitComponent,
   WagerLimitComponent,
   SessionLimitComponent,
   CustomerSupportComponent,
   AppOnlinePlayers,
   AppResponsibleGambling,
   AppBingoGuideComponent,
   SortPipe,
   DepositModalComponent,
   WithdrawalModalComponent,
   BannerComponent,
   PromotionDetailsComponent,
   WhatIsBingoComponent,
   WhatIs90BallBingoComponent,
   VariantBingoComponent,
   Bingo69TermsConditionsComponent,
   PrivacyStatementComponent,
   WhatbingoComponent,
   BingoGuideComponent,
   AppMiniSlotComponent,
   AppSamplePageComponent
   ],
  entryComponents: [
      AppTimerComponent
  ],
  imports: [
    MbscModule,
    BrowserModule,
    AppLdRoutingModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    HttpModule,
    HttpClientModule,
    ScrollEventModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    ReactiveFormsModule
  ],
 providers: [AppLottodayService,
  Utility,
  EmitterService,
  UserDetailsService,
  DatePipe,
  PaymentService,
  RealityCheckService,
  LogoutEmitService,
  ModalService,
  AppSlotsComponent,
  SlotsPipe,
  GameWindowService,
  TranslationService,
  mixpanelService,
  SlotsSearchPipe,
  SocketService,
  SortPipe,
  BingoDataService,
  GameWinHistoryService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
