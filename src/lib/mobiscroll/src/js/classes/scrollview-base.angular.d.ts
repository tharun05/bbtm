import { MbscBase, EventEmitter, ElementRef, NgZone, Observable, AfterViewInit, OnDestroy } from '../frameworks/angular';
import { MbscScrollViewOptions } from './scrollview';
export declare class MbscNotifyItemService {
    private _instanceSubject;
    private _addRemoveSubject;
    notifyInstanceReady(instance: any): void;
    notifyAddRemove(item: any): void;
    onInstanceReady(): Observable<any>;
    onAddRemove(): Observable<any>;
}
export declare class MbscScrollItemBase implements AfterViewInit, OnDestroy {
    notifyItemService: MbscNotifyItemService;
    _elem: ElementRef;
    id: string;
    _instance: any;
    readonly nativeElement: any;
    constructor(notifyItemService: MbscNotifyItemService, _elem: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscScrollViewBase extends MbscBase {
    zone: NgZone;
    notifyItemService: MbscNotifyItemService;
    context: string | HTMLElement;
    itemWidth: number;
    layout: 'liquid' | 'fixed';
    snap: boolean;
    threshold: number;
    paging: boolean;
    onItemTap: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onMarkupReady: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onAnimationStart: EventEmitter<{
        inst: any;
    }>;
    onAnimationEnd: EventEmitter<{
        inst: any;
    }>;
    onMove: EventEmitter<{
        inst: any;
    }>;
    onGestureStart: EventEmitter<{
        inst: any;
    }>;
    onGestureEnd: EventEmitter<{
        inst: any;
    }>;
    inlineOptions(): MbscScrollViewOptions;
    inlineEvents(): MbscScrollViewOptions;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService);
}
