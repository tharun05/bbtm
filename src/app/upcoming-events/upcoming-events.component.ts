import { Component, OnInit } from '@angular/core';
import { AppTimerComponent }  from '../app-timer/app-timer.component';

import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss']
})
export class UpcomingEventsComponent implements OnInit {
    time: any;
  constructor() {
 }

  ngOnInit() {
    this.time="2018-05-10T14:00:00Z";    
  }

    ngAfterViewInit(){
}

}
