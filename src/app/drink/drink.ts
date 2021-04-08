import { drinkType } from './drink-input/drink-type';

export interface Drink {
    type: drinkType
    name: string;
    strength: string;
    milk: string;
}