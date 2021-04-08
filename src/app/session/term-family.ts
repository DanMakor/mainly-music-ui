import { Child } from '../child/child';
import { Guardian } from '../guardian/guardian';

export interface TermFamily {
    familyId: string;
    persons: (Child | Guardian)[];
    paid: boolean;
    notes?: string | undefined;
}