import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {AppLottodayService} from '../app-lottoday.service';
import {RealityCheckService} from '../services/reality-check.service';
import {Observable, Subscription} from 'rxjs/Rx';
import {Utility} from '../utils/utility';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
    selector: 'app-responsible-gaming',
    templateUrl: './app-responsible-gaming.component.html',
    styleUrls: ['./app-responsible-gaming.component.scss']
})
export class AppResponsibleGamingComponent implements OnInit,OnDestroy {
    depositlimit;
    losslimit;
    wagerlimit;
    realityDetails;
    sessionlimits;
    activeTab;
    activeModal;
    private $counter: Observable<number>;
    private subscription: Subscription;
    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        var ww = document.body.clientWidth;
        if (ww <= 767) {
            this.activeTab = "none";
        } else {
            this.activeTab = "accountTab";
        }
    }
    constructor(private lottodayService: AppLottodayService,
        private utility: Utility,
        private realityCheckService: RealityCheckService) {}

    ngOnInit() {
        if (document.body.clientWidth <= 767) {
            this.activeTab = 'none';
        } else {
            this.activeTab = 'accountTab';
        }

        Promise.resolve(this.lottodayService.getResponsibleGamingData())
            .then(responsibleGamingData => {
                if (responsibleGamingData) {
                    this.depositlimit = responsibleGamingData[0]["limits"]["deposit"];
                    this.realityDetails = responsibleGamingData[1];
                    this.losslimit = responsibleGamingData[2];
                    this.wagerlimit = responsibleGamingData[3];
                    this.sessionlimits = responsibleGamingData[4];
                    this.realityCheckService.updateSessionVariable(this.sessionlimits.limits && this.sessionlimits.limits.overall.value ? this.sessionlimits.limits.overall.value : 0);
                }
            });

            this.$counter = Observable.timer(0,60000);
            this.subscription = this.$counter.subscribe((x) => this.getTimerValue(x));

//        this.depositlimit = '';
//        this.realityDetails = '';
    }

    getActiveTab(toBeActive) {
        this.activeTab = toBeActive;
    }

    openPageOrModal(makeActive, modalId) {
        if (document.body.clientWidth > 767) {
            this.getActiveTab(makeActive);
        } else {
            this.openModal(modalId);
        }
    }

    openModal(modalId): void {
        this.activeModal = modalId;
        this.utility.openModal(modalId);
    }

    closeModal(modalId) {
        this.utility.closeModal(modalId);
    }

    onDepositDataChangedHandler(data) {
        this.depositlimit = data;
    }

    onRealityDataChangedHandler(data) {
        this.realityDetails = data;
    }

    onSessionDataChangedHandler(data) {
        this.sessionlimits = data;
    }

    onLossDataChangedHandler(data) {
        this.losslimit = data;
    }

    onWagerDataChangedHandler(data) {
        this.wagerlimit = data;
    }

    getTimerValue(t) {
        if(t){
            for (let period of ["daily","weekly","monthly"]){
                if(this.depositlimit[period] && this.depositlimit[period].remainingTime > 0){
                    this.depositlimit[period].remainingTime -= 1;
                }

                if(this.losslimit["pendingLimits"] && this.losslimit["pendingLimits"][period] && this.losslimit["pendingLimits"][period].remainingTime > 0){
                    this.losslimit["pendingLimits"][period].remainingTime -= 1;
                }

                if(this.wagerlimit["pendingLimits"] && this.wagerlimit["pendingLimits"][period] && this.wagerlimit["pendingLimits"][period].remainingTime > 0){
                    this.wagerlimit["pendingLimits"][period].remainingTime -= 1;
                }
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
