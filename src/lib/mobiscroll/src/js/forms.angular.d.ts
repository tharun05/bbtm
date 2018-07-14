import { MbscBase, MbscControlBase, NgZone, ControlValueAccessor, NgControl, ElementRef, EventEmitter, QueryList, OnInit, Observable, MbscInputService, MbscOptionsService } from './frameworks/angular';
import { Form } from './classes/forms';
import { Input as FormInput } from './classes/input';
import { TextArea } from './classes/textarea';
import { Select } from './classes/select';
import { Button } from './classes/button';
import { CheckBox } from './classes/checkbox';
import { Switch } from './classes/switch';
import { Stepper } from './classes/stepper';
import { Progress } from './classes/progress';
import { Radio } from './classes/radio';
import { SegmentedItem } from './classes/segmented';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';
import { MbscFormOptions } from './classes/forms';
export { MbscFormOptions };
export declare class MbscForm extends MbscBase implements OnInit {
    private _formService;
    private optionsObj;
    _instance: Form;
    options: MbscFormOptions;
    rootElem: ElementRef;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscFormBase extends MbscBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    color: string;
    options: MbscFormOptions;
    disabled: boolean;
    name: string;
    _initElem: ElementRef;
    constructor(hostElem: ElementRef, _formService: MbscOptionsService);
    ngOnInit(): void;
}
export declare class MbscFormValueBase extends MbscFormBase implements ControlValueAccessor {
    protected _control: NgControl;
    protected _noOverride: boolean;
    protected _value: any;
    innerValue: any;
    onChange: any;
    onTouch: any;
    value: any;
    error: boolean;
    errorMessage: string;
    valueChangeEmitter: EventEmitter<string>;
    constructor(hostElem: ElementRef, _formService: MbscOptionsService, _control: NgControl, _noOverride: boolean);
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    writeValue(v: any): void;
}
export declare class MbscInputBase extends MbscFormValueBase {
    icon: string;
    iconAlign: string;
    type: string;
    passwordToggle: boolean;
    iconShow: string;
    iconHide: string;
    placeholder: string;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _control: NgControl, noOverride: boolean);
}
export declare class MbscInput extends MbscInputBase {
    protected _inputService: MbscInputService;
    _instance: FormInput;
    controlNg: boolean;
    dropdown: boolean;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _inputService: MbscInputService, _control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscTextarea extends MbscInputBase {
    protected _inputService: MbscInputService;
    _instance: TextArea;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _inputService: MbscInputService, _control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscDropdown extends MbscFormValueBase {
    protected _inputService: MbscInputService;
    _instance: Select;
    label: string;
    icon: string;
    iconAlign: string;
    value: any;
    constructor(hostElem: ElementRef, formService: MbscOptionsService, _inputService: MbscInputService, control: NgControl);
    ngAfterViewInit(): void;
    writeValue(v: any): void;
}
export declare class MbscButton extends MbscFormBase {
    _instance: Button;
    _flat: boolean;
    _block: boolean;
    _outline: boolean;
    readonly cssClasses: any;
    classes: string;
    type: string;
    icon: string;
    flat: any;
    block: any;
    outline: any;
    constructor(hostElem: ElementRef, formService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscCheckbox extends MbscFormValueBase {
    _instance: CheckBox;
    color: string;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, formService: MbscOptionsService, control: NgControl);
    ngAfterViewInit(): void;
}
export declare class MbscSwitch extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Switch;
    options: MbscFormOptions;
    disabled: boolean;
    name: string;
    color: string;
    value: boolean;
    onChangeEmitter: EventEmitter<boolean>;
    _initElem: ElementRef;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: boolean): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscStepper extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Stepper;
    options: MbscFormOptions;
    value: number;
    name: string;
    min: number;
    max: number;
    step: number;
    val: string;
    disabled: boolean;
    color: string;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<number>;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscProgress extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Progress;
    options: MbscFormOptions;
    value: number;
    max: number;
    icon: string;
    iconAlign: string;
    val: string;
    disabled: boolean;
    stepLabels: Array<number>;
    color: string;
    readonly colorClass: any;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscRadioService {
    private _name;
    name: string;
    private _multiSelect;
    multiSelect: boolean;
    private _valueSubject;
    onValueChanged(): Observable<any>;
    changeValue(v: any): void;
    private _color;
    color: string;
}
export declare class MbscRadioGroupBase extends MbscFormValueBase {
    protected _radioService: MbscRadioService;
    name: string;
    value: any;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
    writeValue(v: any): void;
}
export declare class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl);
}
export declare class MbscRadio extends MbscFormBase {
    private _radioService;
    _instance: Radio;
    readonly checked: boolean;
    name: string;
    modelValue: any;
    color: string;
    value: any;
    readonly colorClass: any;
    clicked(e: any): void;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscSegmentedGroup extends MbscRadioGroupBase {
    select: string;
    readonly multiSelect: boolean;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
}
export declare class MbscSegmented extends MbscFormBase {
    private _radioService;
    _instance: SegmentedItem;
    readonly isChecked: boolean;
    name: string;
    modelValue: any;
    multiSelect: boolean;
    icon: string;
    value: any;
    checked: any;
    checkedChange: EventEmitter<any>;
    clicked(e: any): void;
    readonly cssClass: string;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscSlider extends MbscControlBase {
    private _formService;
    _instance: Slider;
    _lastValue: any;
    _dummy: Array<number>;
    readonly isMulti: boolean;
    readonly dummyArray: Array<number>;
    protected _inheritedOptions: any;
    _needsTimeout: boolean;
    options: MbscFormOptions;
    name: string;
    tooltip: boolean;
    highlight: boolean;
    live: boolean;
    valueTemplate: string;
    icon: string;
    val: string;
    max: number;
    min: number;
    step: number;
    disabled: boolean;
    stepLabels: Array<number>;
    value: any;
    color: string;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<any>;
    inputElements: QueryList<ElementRef>;
    constructor(hostElement: ElementRef, _formService: MbscOptionsService, zone: NgZone, control: NgControl);
    reInitialize(): void;
    setNewValue(v: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscRating extends MbscControlBase implements OnInit {
    protected formService: MbscOptionsService;
    _inheritedOptions: any;
    _instance: Rating;
    options: MbscFormOptions;
    name: string;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    empty: string;
    filled: string;
    val: 'left' | 'right';
    template: string;
    value: number;
    onChangeEmitter: EventEmitter<number>;
    color: string;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
