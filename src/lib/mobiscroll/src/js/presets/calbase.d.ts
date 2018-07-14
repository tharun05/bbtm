import { DatetimeBase, MbscDatetimeOptions } from './datetimebase';

export interface MbscCalbaseOptions extends MbscDatetimeOptions {
    // Settings
    calendarHeight?: number;
    calendarWidth?: number;
    calendarScroll?: 'horizontal' | 'vertical';
    counter?: boolean;
    defaultValue?: Date | Array<Date>;
    labels?: Array<{ start?: Date, end?: Date, d?: string | Date, text?: string, color?: string, background?: string, cssClass?: string }>;
    events?: Array<{ start?: Date, end?: Date, d?: string | Date, text?: string, color?: string, background?: string, cssClass?: string }>;
    marked?: Array<Date | number | string | { d: Date | number | string, color?: string, background?: string, cssClass?: string }>;
    colors?: Array<{ d: Date | number | string, background?: string, cssClass?: string }>;
    months?: number | 'auto';
    outerMonthChange?: boolean;
    showOuterDays?: boolean;
    tabs?: boolean;
    weekCounter?: 'year' | 'month';
    weekDays?: 'full' | 'short' | 'min';
    weeks?: number;
    yearChange?: boolean;

    // localization
    dateText?: string;
    dayNamesMin?: Array<string>;
    firstDay?: number;
    timeText?: string;

    // Events
    onTabChange?(event: { tab: 'calendar' | 'date' | 'time' }, inst: any): void;
    onDayChange?(event: { date: Date, marked?: any, selected?: 'start' | 'end', target: HTMLElement }, inst: any): void;
    onMonthChange?(event: { year: number, month: number }, inst: any): void;
    onMonthLoading?(event: { year: number, month: number }, inst: any): void;
    onMonthLoaded?(event: { year: number, month: number }, inst: any): void;
    onPageChange?(event: { firstDay: Date, lastDay?: Date }, inst: any): void;
    onPageLoading?(event: { firstDay: Date, lastDay?: Date }, inst: any): void;
    onPageLoaded?(event: { firstDay: Date, lastDay?: Date }, inst: any): void;
}

export class CalBase extends DatetimeBase {
    settings: MbscCalbaseOptions;

    constructor(element: any, settings: MbscCalbaseOptions);

    refresh(): void;
    redraw(): void;
    navigate(d: Date, anim?: boolean): void;
    changeTab(tab: 'calendar' | 'date' | 'time'): void;
}