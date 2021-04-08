import { HttpErrorResponse } from '@angular/common/http';
import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function catchAndContinue<T>(): 
    OperatorFunction<T, { isError: boolean, value?: T, error?: HttpErrorResponse }> {
    return pipe(
        map(value => ({ value, isError: false })),
        catchError(error => of({ error, isError: true }))
    )
}