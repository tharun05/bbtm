import { MbscScrollerBase, MbscDataControlMixin, ElementRef, NgZone, NgControl, EventEmitter, MbscInputService, MbscOptionsService } from './frameworks/angular';
import { Select, MbscSelectOptions } from './presets/select';
export { MbscSelectOptions };
export declare class MbscSelect extends MbscScrollerBase implements MbscDataControlMixin {
    optionService: MbscOptionsService;
    _instance: Select;
    counter: boolean;
    data: Array<{
        text?: string;
        value?: any;
        group?: string;
        html?: string;
        disabled?: boolean;
    }>;
    dataText: string;
    dataGroup: string;
    dataValue: string;
    group: boolean | {
        header?: boolean;
        groupedWheel?: boolean;
        clustered?: boolean;
    };
    groupLabel: string;
    inputClass: string;
    invalid: Array<any>;
    label: string;
    placeholder: string;
    showInput: boolean;
    inlineOptions(): MbscSelectOptions;
    options: MbscSelectOptions;
    target: any;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    refreshData(newData: any): void;
    ngAfterViewInit(): void;
    isMulti: boolean;
    previousData: Array<any>;
    noDataCheck: boolean;
    setNewValue(): void;
    cloneData(): void;
    ngOnInit(): void;
    ngDoCheck(): void;
}
export declare class MbscSelectComponent extends MbscSelect {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscSelectOptions;
    data: Array<{
        text?: string;
        value?: any;
        group?: string;
        html?: string;
        disabled?: boolean;
    }>;
    dropdown: boolean;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
