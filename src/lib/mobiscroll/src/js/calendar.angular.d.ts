import { ElementRef, NgZone, NgControl, EventEmitter, OnInit, MbscInputService, MbscOptionsService } from './frameworks/angular';
import { Calendar, MbscCalendarOptions } from './presets/calendar';
export { MbscCalendarOptions };
import { MbscCalBase } from './classes/calbase.angular';
export declare class MbscCalendar extends MbscCalBase implements OnInit {
    optionService: MbscOptionsService;
    _instance: Calendar;
    controls: Array<'time' | 'date' | 'calendar'>;
    firstSelectDay: number;
    selectType: 'day' | 'week';
    select: 'single' | 'multiple' | number;
    setOnDayTap: boolean;
    onSetDate: EventEmitter<{
        date: Date;
        control?: 'calendar' | 'date' | 'time';
        inst: any;
    }>;
    inlineOptions(): MbscCalendarOptions;
    inlineEvents(): MbscCalendarOptions;
    options: MbscCalendarOptions;
    private isMulti;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    setNewValue(v: any): void;
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscCalendarComponent extends MbscCalendar {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    placeholder: string;
    error: boolean;
    errorMessage: string;
    options: MbscCalendarOptions;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
