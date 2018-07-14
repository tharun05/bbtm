/*import { Component, OnInit } from '@angular/core';*/
import { Component,ViewEncapsulation, ElementRef, OnInit, OnDestroy,Input, OnChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { EmitterService } from '../services/emitter.service';

@Component({
  selector: 'app-timer',
  templateUrl: './app-timer.component.html',
  styleUrls: ['./app-timer.component.scss']

})

export class AppTimerComponent implements OnInit,OnDestroy,OnChanges {

    private future: Date;
    private futureString: string;
    private diff: number;
    private $counter: Observable<number>;
    private subscription: Subscription;
    timeTicker: any;
    highlightTimer: boolean = false;
    @Input() isBannerTimer:boolean;
    @Input() isDepositLimitTimer:any;
    @Input() timedetails: any;
    @Input() hourGlassIcon:boolean;
    @Input() showText: boolean = true;
    @Input() bingoRoomsIndex: any;

   /* constructor(elm: ElementRef) {
        this.futureString = elm.nativeElement.getAttribute('timedetails');
    }*/

    constructor(private emitterService:EmitterService) {}

    dhms(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;

        if (days == 0 && hours == 0 && minutes == 0 && seconds == 0){

          switch(this.isDepositLimitTimer){
              case "bingoRooms":
                  this.emitterService.broadcastUpdateUpcomingBingoRooms("");
                  break;
              case "depositLimit":
                  this.emitterService.broadcastDepositLimitTimerCompleted("TimerCompleted");
                  break;
              case "lossLimit":
                  this.emitterService.broadcastLossLimitTimerCompleted("TimerCompleted");
                  break;
              case "wagerLimit":
                  this.emitterService.broadcastWagerLimitTimerCompleted("TimerCompleted");
                  break;
          }
          this.subscription.unsubscribe();
        } else if (days == 0 && hours == 0 && minutes == 0 && seconds <= 60 && this.isDepositLimitTimer=="bingoRooms") {
          this.emitterService.broadcastBingoRoomsHighlightTimer(this.bingoRoomsIndex);
        }

        return [
            ('0' + days).slice(-2) ,
            ('0' + hours).slice(-2),
            ('0' + minutes).slice(-2),
            ('0' + seconds).slice(-2)
        ]
    }

    startTimer() {
        this.future = new Date(this.timedetails);
        this.$counter = Observable.interval(1000).startWith(0).map((x) => {
            this.diff = Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
            return x;
        });
        // added setTimeout to fix the detectionChange error in console, needs to check and remove it if it works for higher versions of angular
        this.subscription = this.$counter.subscribe((x) => setTimeout(() => this.timeTicker = this.dhms(this.diff), 0));
    }

    ngOnInit() {
        this.startTimer();
    }

    ngOnChanges(changes) {
        if(this.isDepositLimitTimer != "bingoRooms" && changes && changes.timedetails && changes.timedetails.currentValue && !changes.timedetails.firstChange){
            this.timedetails = changes.timedetails.currentValue;
            this.startTimer();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
