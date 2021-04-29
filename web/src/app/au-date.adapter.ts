import { enAU as locale } from 'date-fns/locale';
import { DateAdapter } from "@angular/material/core";
import { addDays, addMonths, addYears, format, getDate, getDaysInMonth, getMonth, getYear, parse, setDay, setMonth, toDate } from "date-fns";

const WEEK_STARTS_ON = 0; // 0 sunday, 1 monday...

export const AU_DATE_FORMAT = {
    parse: {
        dateInput: 'dd/MM/yyyy',
    },
    display: {
        dateInput: 'dd/MM/yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
    },
};

function range(start: number, end: number): number[] {
    let arr: number[] = [];
    for (let i = start; i <= end; i++) {
        arr.push(i);
    }

    return arr;
}

export class AuDateAdapter extends DateAdapter<Date> {

    addCalendarDays(date: Date, days: number): Date {
        return addDays(date, days);
    }

    addCalendarMonths(date: Date, months: number): Date {
        return addMonths(date, months);
    }

    addCalendarYears(date: Date, years: number): Date {
        return addYears(date, years);
    }

    clone(date: Date): Date {
        return toDate(date);
    }

    createDate(year: number, month: number, date: number): Date {
        return new Date(year, month, date);
    }

    format(date: Date, displayFormat: any): string {
        return format(date, displayFormat, {
            locale
        });
    }

    getDate(date: Date): number {
        return getDate(date);
    }

    getDateNames(): string[] {
        return range(1, 31).map(day => String(day));
    }

    getDayOfWeek(date: Date): number {
        return parseInt(format(date, 'i'), 10);
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        const map = {
            long: 'EEEE',
            short: 'E..EEE',
            narrow: 'EEEEE'
        };

        let formatStr = map[style];
        let date = new Date();

        return range(0, 6).map(month => format(setDay(date, month), formatStr, {
            locale
        }));
    }

    getFirstDayOfWeek(): number {
        return WEEK_STARTS_ON;
    }

    getMonth(date: Date): number {
        return getMonth(date);
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        const map = {
            long: 'LLLL',
            short: 'LLL',
            narrow: 'LLLLL'
        };

        let formatStr = map[style];
        let date = new Date();

        return range(0, 11).map(month => format(setMonth(date, month), formatStr, {
            locale
        }));
    }

    getNumDaysInMonth(date: Date): number {
        return getDaysInMonth(date);
    }

    getYear(date: Date): number {
        return getYear(date);
    }

    getYearName(date: Date): string {
        return format(date, 'yyyy', {
            locale
        });
    }

    invalid(): Date {
        return new Date(NaN);
    }

    isDateInstance(obj: any): boolean {
        return obj instanceof Date;
    }

    isValid(date: Date): boolean {
        return date instanceof Date && !isNaN(date.getTime());
    }

    parse(value: any, parseFormat: any): Date | null {
        return parse(value, parseFormat, new Date(), {
            locale,
        });
    }

    toIso8601(date: Date): string {
        return date.toISOString();
    }

    today(): Date {
        return new Date();
    }
}