import { MbscDataControlOptions } from '../frameworks/angular';
import { CalBase, MbscCalbaseOptions } from './calbase';

export type MbscDataCalbaseOptions = MbscDataControlOptions & MbscCalbaseOptions;

export interface MbscEventcalendarOptions extends MbscDataCalbaseOptions {
    // Settings
    data?: Array<{ start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string, allDay?: boolean }>;
    eventBubble?: boolean;
    showEventCount?: boolean;
    view?: {
        calendar?: { type?: 'week' | 'month', size?: number, popover?: boolean },
        eventList?: { type?: 'day' | 'week' | 'month' | 'year', size?: number }
    };
    // Localization
    allDayText?: string;
    noEventsText?: string;
}

export class Eventcalendar extends CalBase {
    settings: MbscEventcalendarOptions;

    constructor(element: any, settings: MbscEventcalendarOptions);

    navigate(d: Date, anim?: boolean, pop?: boolean): void;

    addEvent(events: Array<{ start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string }> | { start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string }): Array<number | string>;
    removeEvent(eids: Array<string | number>): void;
    getEvents(d: Date): Array<{ start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string }>;
    setEvents(events: Array<{ start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string }> | { start?: Date, end?: Date, d?: Date | string | number, text?: string, color?: string }): Array<number | string>;
}