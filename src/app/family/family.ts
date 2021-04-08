import { Child, ChildForCreation } from '../child/child';
import { Guardian, GuardianForCreation } from '../guardian/guardian';

export interface Family {
    _id: string;
    guardians: Guardian[],
    children: Child[]
}

export interface FamilyForCreation {
    guardians: GuardianForCreation[];
    children: ChildForCreation[];
}