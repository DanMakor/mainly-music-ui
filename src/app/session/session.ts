export interface Session {
    _id: string,
    termId: string,
    termNumber: number,
    date: Date,
    personIds: string[]
}

export type SessionForCreation = Pick<Session, "date">;