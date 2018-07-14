import { EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService } from './frameworks/angular';
import { DateTime } from './presets/datetime';
import { MbscDatetimeOptions } from './presets/datetimebase';
import { MbscDatetimeBase } from './classes/datetimebase.angular';
export { MbscDatetimeOptions };
export declare class MbscDateBase extends MbscDatetimeBase {
    optionService: MbscOptionsService;
    _instance: DateTime;
    options: MbscDatetimeOptions;
    protected preset: string;
    value: Date;
    onChangeEmitter: EventEmitter<Date>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    setNewValue(v: any): void;
    ngAfterViewInit(): void;
}
export declare class MbscDate extends MbscDateBase {
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
}
export declare class MbscDateComponent extends MbscDate {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscDatetimeOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscTime extends MbscDateBase {
    value: Date;
    onChangeEmitter: EventEmitter<Date>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
}
export declare class MbscTimeComponent extends MbscTime {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscDatetimeOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscDatetime extends MbscDateBase {
    value: Date;
    onChangeEmitter: EventEmitter<Date>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
}
export declare class MbscDatetimeComponent extends MbscDatetime {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscDatetimeOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
