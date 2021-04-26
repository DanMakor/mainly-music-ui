import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { Drink } from '../drink/drink';
import { personType } from './person-type';

export interface PersonForDisplay {
    _id: string,
    firstName: string,
    lastName: string,
    icon: [IconPrefix, IconName],
    isCheckedIn: boolean,
    hasBowl: boolean,
    hasBirthdayInSession: boolean,
    isCertificateSession: boolean,
    type: personType,
    familyId: string,
    drink?: Drink
}

export interface StaffMemberForDisplay {
    _id: string,
    firstName: string,
    lastName: string,
    isCheckedIn: boolean,
    drink?: string
    type: personType,
}