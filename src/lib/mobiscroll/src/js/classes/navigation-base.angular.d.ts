import { EventEmitter, ElementRef, QueryList, NgZone } from '../frameworks/angular';
import { NavigationBase, MbscNavBaseOptions } from './navigation-base';
import { MbscScrollViewBase, MbscScrollItemBase, MbscNotifyItemService } from './scrollview-base.angular';
export declare class MbscNavItemBase extends MbscScrollItemBase {
    private _selected;
    private _disabled;
    icon: string;
    disabled: boolean;
    selected: boolean;
    selectedChange: EventEmitter<boolean>;
    constructor(notifyItemService: MbscNotifyItemService, elem: ElementRef);
    toggle(): void;
}
export declare class MbscNavigationBase extends MbscScrollViewBase {
    _instance: NavigationBase;
    select: 'single' | 'multiple' | 'off';
    display: 'top' | 'bottom' | 'inline';
    inlineOptions(): MbscNavBaseOptions;
    options: MbscNavBaseOptions;
    items: QueryList<MbscNavItemBase>;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService);
    tapHandler(event: any, inst: any): void;
    private _getItem(nativeEl);
}
