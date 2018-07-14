import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import {UserDetailsService} from '../services/user-details.service'
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {DatePipe} from '@angular/common';
import {transactionTypeConfs, transactionTypeForALL, dateMobiScroll} from '../utils/lotteryConfig';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import * as _ from 'underscore';
import {mixpanelService} from '../services/mixpanel.service';


@Component({
    selector: 'app-my-transactions',
    templateUrl: './my-transactions.component.html',
    styleUrls: ['./my-transactions.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class MyTransactionsComponent implements OnInit {
    transactions: any;
    userId: any;
    minimumDate = new Date();
    request: any = {
        interval: {
            end: new Date(),
        },
        size: 10,
        index: 0
    }
    totalBalance;
    cashBalance;
    bonusBalance;
    txnTypes;
    userDetails;
    mobiDatePicker;
    activeFilter;
    txnDetails = this.formBuilder.group({
        'startDate': ['', [CustomValidators.required]],
        'endDate': ['', [CustomValidators.required]],
        'items': ['ALL', [CustomValidators.required]]
    }, {validator: CustomValidators.startEndDateCheck});

    constructor(private lottodayService: AppLottodayService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetailsService: UserDetailsService,
        private mixpaneldataService: mixpanelService,
        public datePipe: DatePipe) {
        this.userDetails = userDetailsService
        this.userDetails.balanceUpdated$.subscribe(
            message => {
                this.totalBalance = this.userDetails.getUserBalance();
                this.cashBalance = this.userDetails.getCashBalance();
                this.bonusBalance = this.userDetails.getBonusBalance();
            });
    }
    closeModal(modalId) {
        this.utils.closeModal(modalId);
    }
    shouldShowErrors(fieldName, formName) {
        return this.utils.shouldShowErrors(fieldName, formName)
    }
    getErrorMessage(fieldName, formName) {
        return this.utils.getErrorMessage(fieldName, formName)
    }
    getButtonClass(formName, fieldName) {
        return this.utils.getButtonClass(formName, fieldName)
    }
    isButtonDisabled(formName) {
        return this.utils.isButtonDisabled(formName)
    }


    ngOnInit() {
        this.activeFilter = 'thirtyday';
        this.txnTypes = transactionTypeConfs;
        this.mobiDatePicker = dateMobiScroll;
        this.totalBalance = this.userDetails.getUserBalance();
        this.cashBalance = this.userDetails.getCashBalance();
        this.bonusBalance = this.userDetails.getBonusBalance();

        this.request = {
            interval: {
                end: new Date(),
            },
            size: 10,
            index: 0
        }

        let startDate = new Date;
        startDate.setMonth(startDate.getMonth() - 1);

        this.request.interval.start = startDate;

        this.txnDetails.controls["startDate"].setValue(startDate);
        this.txnDetails.controls["endDate"].setValue(new Date());
        this.txnDetails.controls["items"].setValue(["ALL"]);

        /*this.userId = this.utils.getLottodayDetails("user_id");// userDetails.getuserProfileDetails().userId;
        if(this.userId){
        this.getTranscationDetials(this.userId);
      }*/

        this.getTranscationDetials(this.request, "");
        //this.minimumDate = new Date();


    }
    showGroupDateRow(transactions, index): boolean {
        let showGroup = true;

        if (index > 0 && this.datePipe.transform(transactions[index].time, 'dd MMMM y') == this.datePipe.transform(transactions[index - 1].time, 'dd MMMM y')) {
            showGroup = false;
        }
        return showGroup;
    }

    getTranscationDetials(getData, buttonId): void {
        this.transactions = undefined;
        if (this.txnDetails.controls["items"].value.length == 0) {
            this.txnDetails.controls["items"].setValue(["ALL"]);
        }
        this.request = {
            index: getData.index ? getData.index : 0,
            size: getData.size ? getData.size : 10,
            order: true,
            transactionTypes: this.txnDetails.controls["items"].value.includes('ALL') ? transactionTypeForALL : this.txnDetails.controls["items"].value,
            interval: getData.interval
        }
        Promise.resolve(this.lottodayService.getUserTransactionsHistory(this.request))
            .then(data => {
                if (buttonId) {
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Success", "FILTER RESULTS");
                }
                data ? this.transactions = data : [];
            });
    }

    applyFilter(buttonId, more): void {
        if (buttonId) {
            this.utils.disableNewButton(buttonId);
        }
        //$("#"+buttonId).addClass("btn-progress").prop("disabled", true);
        this.request = {
            interval: {
                start: new Date(this.txnDetails.controls["startDate"].value),
                end: new Date(this.txnDetails.controls["endDate"].value),
            },
            size: 10,
            index: more == 'more' ? this.request.size + this.request.index : (more == 'less' && this.request.index > 0 && this.request.index - this.request.size > 0 ? this.request.index - this.request.size : 0)
        }
        this.getTranscationDetials(this.request, buttonId);
    }

    toggleAccordion(): void {
        var accordionRow = $("#mobAcc");
        var accordionHeader = accordionRow.find('.accordionHeadline');
        var accordionConent = accordionRow.find('.accordionText');

        if (!accordionConent.hasClass('activeAccordionText')) {
            $('.accordionHeadline').removeClass('flipButton');
            accordionHeader.addClass('flipButton');
            $('.accordionText').removeClass('activeAccordionText');
            accordionConent.addClass('activeAccordionText');
        } else if (accordionConent.hasClass('activeAccordionText')) {
            accordionHeader.removeClass('flipButton');
            accordionConent.removeClass('activeAccordionText');
        }
    }
    getOptionDisabled(txnType) {

        if (txnType != "ALL" && this.txnDetails.controls["items"].value.includes("ALL")) {
            return true;
        } else if (txnType == "ALL" && (this.txnDetails.controls["items"].value.includes("ALL") || this.txnDetails.controls["items"].value.length == 0)) {
            return false;
        } else if (txnType == "ALL" && (!this.txnDetails.controls["items"].value.includes("ALL") || this.txnDetails.controls["items"].value.length > 0)) {
            return true;
        } else {
            return false;
        }
    }

    // selecetdValues(){
    //   if(this.txnDetails.controls["items"].value.includes("ALL") && this.txnDetails.controls["items"].value.length == this.txnTypes.length){
    //     this.txnDetails.controls["items"].setValue(this.txnTypes);
    //   }else if(!this.txnDetails.controls["items"].value.includes("ALL") && this.txnDetails.controls["items"].value.length == this.txnTypes.length -1 ){
    //     this.txnDetails.controls["items"].setValue(this.txnTypes);
    //   }
    // }

    mixPanelEventCheck(type): void {
        Promise.resolve(this.mixpaneldataService.userLoggedIn('mytransaction', type, ''));
    }

    getActiveFilter(toBeActiveFilter) {
        this.activeFilter = toBeActiveFilter;

    }
}
