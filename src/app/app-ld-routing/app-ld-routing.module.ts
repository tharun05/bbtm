import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FooterComponent} from '../footer/footer.component';
import {AppHomeComponent} from '../app-home/app-home.component';
import {AppRegistrationComponent} from '../app-registration/app-registration.component';
import {AppLoginComponent} from '../app-login/app-login.component';
import {AppPaymentComponent} from '../app-payment/app-payment.component';
import {AppMyaccountComponent} from '../app-myaccount/app-myaccount.component';
import {AppComponent} from '../app.component';
import {AppTxnStatusComponent} from '../app-txn-status/app-txn-status.component';
import {MyTransactionsComponent} from '../my-transactions/my-transactions.component';
import {AppLoginPageComponent} from '../app-login-page/app-login-page.component';
import {AppAccountSectionComponent} from '../app-account-section/app-account-section.component';
import {AppReturnFrom3dComponent} from '../app-return-from-3d/app-return-from-3d.component';
import {AppBetHistoryComponent} from '../app-bet-history/app-bet-history.component';
import {AppCashierComponent} from '../app-cashier/app-cashier.component';
import {AppPageLoaderComponent} from '../app-page-loader/app-page-loader.component';
import {AppForgotpasswordComponent} from '../app-forgotpassword/app-forgotpassword.component';
import {AppFaqComponent} from '../app-faq/app-faq.component';
import {AppBingoGuideComponent} from '../app-bingo-guides/app-bingo-guide.component';
import {AppResponsibleGambling} from '../app-about-responsible gambling/app-about-gambling';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';
import {AppContactContainerComponent} from '../app-contact-container/app-contact-container.component';
import {TermsConditionsComponent} from '../terms-conditions/terms-conditions.component';
import {AboutBellaBingoComponent} from '../about-Bella-Bingo/about-bellaBingo.component';
import {PrivacyPolicyComponent} from '../privacy-policy/privacy-policy.component';
import {AppLoadingScreenComponent} from '../app-loading-screen/app-loading-screen.component';
import {AppCookiePolicyComponent} from '../app-cookie-policy/app-cookie-policy.component';
import {AppFooterShortComponent} from '../app-footer-short/app-footer-short.component';
import {CompleteProfilePageComponent} from '../complete-profile-page/complete-profile-page.component';
import {AppMaintenanceComponent} from '../app-maintenance/app-maintenance.component';
import {AppBlockedCountryComponent} from '../app-blocked-country/app-blocked-country.component';
import {AppSlotsComponent} from '../app-slots/app-slots.component';
import {GameWindowComponent} from '../game-window/game-window.component';
import {ScratchComponent} from '../scratch/scratch.component';
import {PromotionComponent} from '../promotion/promotion.component';
import {BingoComponent} from '../bingo/bingo.component';
import {VerificationComponent} from '../verification/verification.component';
import {BonusComponent} from '../bonus/bonus.component';
import {CustomerSupportComponent} from '../customer-support/customer-support.component';
import {ConfirmIdentityComponent} from '../confirm-identity/confirm-identity.component';
import {PromotionDetailsComponent} from '../promotion-details/promotion-details.component';
import {DepositModalComponent} from '../deposit-modal/deposit-modal.component';
import { WhatIsBingoComponent} from '../what-is-bingo/what-is-bingo.component';
import { WhatIs90BallBingoComponent} from '../what-is90-ball-bingo/what-is90-ball-bingo.component';
import { VariantBingoComponent} from '../variant-bingo/variant-bingo.component';
import { Bingo69TermsConditionsComponent} from '../bingo69-terms-conditions/bingo69-terms-conditions.component';
import { PrivacyStatementComponent } from '../privacy-statement/privacy-statement.component';
import{WhatbingoComponent} from '../whatbingo/whatbingo.component';
import {AppMiniSlotComponent} from '../app-minislots/app-minislot.component';
import { AppSamplePageComponent } from '../sample-folder/app-sample-page.component';
@NgModule({
    imports: [
        RouterModule.forRoot([{
            path: 'footer',
            component: FooterComponent
        },
        {
            path: '',
            component: AppHomeComponent
        },
        {
            path: 'register',
            component: AppRegistrationComponent
        },
        // {
        //     path: 'login',
        //     component: AppLoginPageComponent
        // },
        {
            path: 'complete-profile',
            component: CompleteProfilePageComponent
        },
        {
            path: 'casino',
            component: AppSlotsComponent
        },
        {
            path: 'payment/:type',
            component: AppPaymentComponent
        },
        {
            path: 'myaccount',
            component: AppMyaccountComponent,
            children: [
                {path: '', component: AppAccountSectionComponent},
                {path: 'transactions', component: MyTransactionsComponent},
                {path: 'bet-history', component: AppBetHistoryComponent},
                {path: 'cashier', component: AppCashierComponent}
            ]
        },
        {
            path: 'confirm-identity',
            component: ConfirmIdentityComponent
        },
       
        {
            path: 'txn-confirmation',
            component: AppTxnStatusComponent
        },
        {
            path: 'my-transactions',
            component: MyTransactionsComponent
        },

        {
            path: 'cashier/callback/:paymentType/:encodedData',
            component: AppReturnFrom3dComponent
        },
        {
            path: 'quickDeposit/callback/:paymentType/:encodedData',
            component: AppReturnFrom3dComponent
        },
        {
            path: 'page-loader',
            component: AppPageLoaderComponent
        },
        {
            path: 'forgotten-password',
            component: AppForgotpasswordComponent
        },
        {
            path: 'reset-password',
            component: ResetPasswordComponent
        },
        {
            path: 'contact-us/:activetab',
            component: CustomerSupportComponent,
            children: [
                {path: 'email', component: AppContactContainerComponent},
                {path: 'chat', component: AppBetHistoryComponent},
                {path: 'faq', component: AppFaqComponent}
            ]
        },
        {
            path: 'terms-conditions',
            component: TermsConditionsComponent
        },
        {
            path: 'about-Bingo',
            component: AboutBellaBingoComponent
        },
        {
            path: 'privacy-policy',
            component: PrivacyPolicyComponent
        },
        {
            path: 'loading-screen',
            component: AppLoadingScreenComponent
        },
        {
            path: 'cookie-policy',
            component: AppCookiePolicyComponent
        },
        {
            path: 'footer-short',
            component: AppFooterShortComponent
        }
            ,
        {
            path: 'maintenance',
            component: AppMaintenanceComponent
        },
        {
            path: 'blocked-country',
            component: AppBlockedCountryComponent
        },
        {
            path: 'gamePlay',
            component: GameWindowComponent
        },
        {
            path: 'promotion',
            component: PromotionComponent
        },
        {
            path: 'bingo',
            component: BingoComponent
        },
        {
            path: 'scratch',
            component: ScratchComponent
        },
        {
            path: 'verification',
            component: VerificationComponent
        },
        {
            path: 'bonus',
            component: BonusComponent
        },
        {
            path:"app-faq",
            component: AppFaqComponent
        },
        {
            path:'about-responsible-gambling',
            component:AppResponsibleGambling
        },
        {
            path:'app-bingo-guides',
            component:AppBingoGuideComponent
        },
        {
            path: 'promotionsContent/:index',
            component: PromotionDetailsComponent
        },
        {
            path:'what-75-bingo',
            component: WhatIsBingoComponent
        },
        {
            path:'what-90-bingo',
            component: WhatIs90BallBingoComponent
        },
        {
            path:'variant-bingo',
            component: VariantBingoComponent
        },
        {
            path:'bingo69-terms-conditions',
            component: Bingo69TermsConditionsComponent
        },
        {
            path:'privacy-statement',
            component: PrivacyStatementComponent
        },
		{
            path:'what-bingo',
            component:WhatbingoComponent
        },
        {
            path: 'what-is-bingo',
            component: WhatIsBingoComponent
        },
        {
            path:'mini-slot-games',
            component:AppMiniSlotComponent
        },
        {
            path:'sample-page',
            component:AppSamplePageComponent
        }
        ], {useHash: false})
    ],
    exports: [RouterModule]
})
export class AppLdRoutingModule {}
