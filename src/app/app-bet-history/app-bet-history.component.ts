import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {AppLottodayService} from '../app-lottoday.service';
import {Utility} from '../utils/utility';
import {UserDetailsService} from '../services/user-details.service'
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../validators/custom-validator';
import {DatePipe} from '@angular/common';
import {currency_codes} from '../utils/currency-code';
import {transactionTypeConfs, transactionTypeForALL, dateMobiScroll} from '../utils/lotteryConfig';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
    selector: 'app-app-bet-history',
    templateUrl: './app-bet-history.component.html',
    styleUrls: ['./app-bet-history.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppBetHistoryComponent implements OnInit {
    betHistory: any;
    userId: any;
    minimumDate = new Date();
    request: any = {
        interval: {
            end: new Date(),
        },
        order: true,
        size: 10,
        index: 0
    }
    totalBalance;
    cashBalance;
    bonusBalance;
    txnTypes;
    mobiDatePicker;
    activeFilter;
    curencyCodes = currency_codes;
    betHistoryDeatils = this.formBuilder.group({
        'startDate': ['', [CustomValidators.required]],
        'endDate': ['', [CustomValidators.required]],
        'items': ['ALL', [CustomValidators.required]]
    }, {validator: CustomValidators.startEndDateCheck});

    constructor(private lottodayService: AppLottodayService,
        private utils: Utility,
        private formBuilder: FormBuilder,
        private userDetails: UserDetailsService,
        public datePipe: DatePipe) {
        userDetails.balanceUpdated$.subscribe(
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
        this.activeFilter='thirtyday';
        this.mobiDatePicker = dateMobiScroll;
        this.totalBalance = this.userDetails.getUserBalance();
        this.cashBalance = this.userDetails.getCashBalance();
        this.bonusBalance = this.userDetails.getBonusBalance();

        this.request = {
            interval: {
                end: new Date(),
            },
            size: 10,
            index: 0,
            type: "betHistory"
        }

        let startDate = new Date;
        startDate.setMonth(startDate.getMonth() - 1);


        this.request.interval.start = startDate;

        this.betHistoryDeatils.controls["startDate"].setValue(startDate);
        this.betHistoryDeatils.controls["endDate"].setValue(new Date());
        this.betHistoryDeatils.controls["items"].setValue("10");
        this.getTranscationDetials(this.request, "");
    }
    showGroupDateRow(betHistory, index): boolean {
        let showGroup = true;

        if (index > 0 && this.datePipe.transform((betHistory[index].transactionTime) * 1000, 'dd MMMM y') == this.datePipe.transform((betHistory[index - 1].transactionTime) * 1000, 'dd MMMM y')) {
            showGroup = false;
        }
        return showGroup;
    }

    getTranscationDetials(getData, buttonId): void {
        this.betHistory = undefined;
        this.request = {
            index: getData.index ? getData.index : 0,
            size: getData.size ? getData.size : 10,
            order: true,
            interval: getData.interval,
            type: "casino",
            productId:["CASINO","BINGO"]
        }
        Promise.resolve(this.lottodayService.getUserBetHistory(this.request))
            .then(data => {
                if (buttonId) {
                    this.utils.enableNewButton(buttonId, "SUCCESS", "Success", "FILTER RESULTS");
                }
                data ? this.betHistory = data : [];
            });
    }

    applyFilter(buttonId, more): void {
        if (buttonId) this.utils.disableNewButton(buttonId);
        let size = Number(this.betHistoryDeatils.controls["items"].value);
        this.request = {
            interval: {
                start: new Date(this.betHistoryDeatils.controls["startDate"].value),
                end: new Date(this.betHistoryDeatils.controls["endDate"].value),
            },
            size: this.betHistoryDeatils.controls["items"].value,
            index: more == 'more' ? size + this.request.index : (more == 'less' && this.request.index > 0 && this.request.index - size > 0 ? this.request.index - size : 0)
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

    getActiveFilter(toBeActiveFilter) {
        this.activeFilter = toBeActiveFilter;

    }
}

