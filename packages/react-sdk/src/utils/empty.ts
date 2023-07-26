import { EMPTY, Observable } from 'rxjs'

export const Empty = <T>(): Observable<T> => EMPTY
