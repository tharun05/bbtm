import { ElementRef, NgControl, NgZone, MbscInputService, MbscScrollerBase } from '../frameworks/angular';
import { MbscDatetimeOptions } from '../presets/datetimebase';
export declare abstract class MbscDatetimeBase extends MbscScrollerBase {
    defaultValue: Date | Array<Date>;
    invalid: Array<string | {
        start: Date;
        end: Date;
        d?: string;
    } | Date>;
    max: Date;
    min: Date;
    steps: {
        hour?: number;
        minute?: number;
        second?: number;
        zeroBased?: boolean;
    };
    valid: Array<string | {
        start: Date;
        end: Date;
        d?: string;
    } | Date>;
    ampmText: string;
    amText: string;
    dateFormat: string;
    dateWheels: string;
    dayNames: Array<string>;
    dayNamesShort: Array<string>;
    dayText: string;
    hourText: string;
    minuteText: string;
    monthNames: Array<string>;
    monthNamesShort: Array<string>;
    monthSuffix: string;
    monthText: string;
    nowText: string;
    pmText: string;
    secText: string;
    timeFormat: string;
    timeWheels: string;
    yearSuffix: string;
    yearText: string;
    inlineOptions(): MbscDatetimeOptions;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService);
}
