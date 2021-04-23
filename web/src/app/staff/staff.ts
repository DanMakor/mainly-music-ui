import { Drink } from "../drink/drink";
import { personType } from "../person/person-type";

export interface Staff {
    _id: string;
    firstName: string;
    lastName: string;
    type: personType;
    drink: Drink;
}