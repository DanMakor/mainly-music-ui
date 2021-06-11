import { Drink } from './drink/drink';
import { drinkType } from './drink/drink-input/drink-type';

export function birthdayIsBetweenSessions(date: Date, sessionDate: Date, lastSessionDate: Date): boolean {
    if (!date) {
        return false;
    }
    const zeroedDate = new Date(date.valueOf());
    zeroedDate.setFullYear(0);
    const zeroedLastSessionDate = addDays(lastSessionDate, 1)
    zeroedLastSessionDate.setHours(0, 0, 0, 0);
    zeroedLastSessionDate.setFullYear(0)
    const maxedSessionDate = new Date(sessionDate.valueOf());
    maxedSessionDate.setHours(24, 0, 0, 0);
    maxedSessionDate.setFullYear(0);
    return zeroedDate > zeroedLastSessionDate && zeroedDate < maxedSessionDate;
}

export function addDays(date: Date, days: number): Date {
    var date = new Date(date.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function datesAreEqual(dateOne: Date, dateTwo: Date) {
    return dateOne.getDate() === dateTwo.getDate() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getFullYear() === dateTwo.getFullYear();
}

export function getDisplayNameForDrink(drink: Drink): string {
    if (!drink) {
        return 'No Drink';
    }

    let displayName = '';
    displayName += drink.strength ? drink.strength + ' Strength ' : ' ';

    if (drink.type === drinkType.hotChoc) {
        displayName += 'Hot Chocolate '
    } else if (drink.type === drinkType.water) {
        displayName += (drink.name === 'Cold' ? 'Cold ' : 'Hot ') + 'Water ';
    } else {
        displayName += drink.name + ' '; 
    }

    if (drink.type === drinkType.tea || drink.milk !== "Full Cream" && !!drink.milk) {
        displayName += 'with ' + drink.milk;
    }

    if (drink.notes && drink.notes.trim()) {
        displayName += ' ' + drink.notes;
    }

    return displayName;
}

export function getOrderBasedOnDrinks(drinkOne: { drink: Drink }, drinkTwo: { drink: Drink }) {
    return getDrinkOrderValue(drinkTwo.drink) - getDrinkOrderValue(drinkOne.drink)
}

function getDrinkOrderValue(drink: Drink) {
    let drinkValue = 1;

    if (drink === null) {
        return drinkValue;
    }

    if (drink.type === drinkType.hotChoc) {
        drinkValue = 7;
    } else if (drink.name.includes("Cappuccino")) {
        drinkValue = 6;
    } else if (drink.name.includes("Flat White")) {
        drinkValue = 5;
    } else if (drink.type === drinkType.coffee) {
        drinkValue = 4;
    } else if (drink.type === drinkType.tea) {
        drinkValue = 3;
    } else if (drink.type === drinkType.water) {
        drinkValue = 2;
    }
    
    return drinkValue;
}

export function nullableDateCompare(a: Date, b: Date): number {
    if (!a) {
        return 1; 
    } else if (!b) {
        return -1;
    } else {
        return b.getTime() - a.getTime();
    }
}