import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss']
})
export class BonusComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewChecked(){
        $('.device-header').addClass('hide');
        $('.device-header-nav').addClass('hide');
    }
    ngOnDestroy(){
        $('.device-header').removeClass('hide');
        $('.device-header-nav').removeClass('hide');
    }

}
