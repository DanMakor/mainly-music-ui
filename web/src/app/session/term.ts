import { Session } from './session';
import { Registration } from './registration';

export interface Term {
    _id: string;
    registrations: Registration[];
    sessions: Session[];
    year: number;
    termNumber: 1 | 2 | 3 | 4;
}

export type TermForCreation = Pick<Term, "year" | "termNumber">;