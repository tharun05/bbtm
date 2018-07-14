import { MbscBase, ElementRef, OnInit, MbscOptionsService } from './frameworks/angular';
import { Page, MbscPageOptions } from './classes/page';
export { MbscPageOptions };
export declare class MbscPage extends MbscBase implements OnInit {
    optionsService: MbscOptionsService;
    _instance: Page;
    options: MbscPageOptions;
    initElem: ElementRef;
    constructor(hostElement: ElementRef, optionsService: MbscOptionsService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscNote {
    initialElem: ElementRef;
    readonly classNames: string;
    color: string;
    constructor(initialElem: ElementRef);
}
export declare class MbscAvatar {
    draggable: boolean;
    src: string;
    alt: string;
}
