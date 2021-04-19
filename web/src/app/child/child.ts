import { personType } from '../person/person-type';

export interface Child {
    _id: string;
    familyId: string;
    dateOfBirth: Date;
    hasBowl: boolean;
    firstName: string;
    lastName: string;
    type: personType;
    allowPhotographs: boolean;
}

export type ChildForCreation = Pick<Child, "dateOfBirth" | "firstName" | "lastName">;
