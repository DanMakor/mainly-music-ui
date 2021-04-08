import { Drink } from '../drink/drink';
import { personType } from '../person/person-type';

export interface Guardian {
    _id: string;
    familyId: string;
    firstName: string;
    lastName: string;
    type: personType;
    drink: Drink;
}

export type GuardianForCreation = Pick<Guardian, "firstName" | "lastName">;