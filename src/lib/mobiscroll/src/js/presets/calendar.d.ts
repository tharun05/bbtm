import { CalBase, MbscCalbaseOptions } from './calbase';

export interface MbscCalendarOptions extends MbscCalbaseOptions {
    // Settings
    controls?: 'time' | 'date' | 'calendar';
    firstSelectDay?: number;
    selectType?: 'day' | 'week';
    select?: 'single' | 'multiple' | number;
    setOnDayTap?: boolean;

    // Events
    onSetDate?(event: { date: Date, control?: 'calendar' | 'date' | 'time' }, inst: any): void;
}

export class Calendar extends CalBase {
    constructor(element: any, settings: MbscCalendarOptions);
    getVal(temp?: boolean): Date | Array<Date>;
    setVal(value: Date | Array<Date>, fill?: boolean, change?: boolean, temp?: boolean): void;
}
