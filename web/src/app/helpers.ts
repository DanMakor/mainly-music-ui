import { Drink } from './drink/drink';
import { drinkType } from './drink/drink-input/drink-type';

export function birthdayIsBetweenSessions(date: Date, sessionDate: Date, lastSessionDate: Date): boolean {
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

export function getDisplayNameForDrink(drink: Drink): string {
    let displayName = '';
    displayName += drink.strength ? drink.strength + ' Strength ' : ' ';

    if (drink.type === drinkType.hotChoc) {
        displayName += 'Hot Chocolate '
    } else if (drink.type === drinkType.water) {
        displayName += (drink.name === 'Cold' ? 'Cold ' : 'Hot ') + 'Water ';
    } else {
        displayName += drink.name + ' '; 
    }

    if (drink.milk === "Soy" || drink.milk === "No Milk") {
        displayName += 'with ' + drink.milk
    }

    return displayName;
}