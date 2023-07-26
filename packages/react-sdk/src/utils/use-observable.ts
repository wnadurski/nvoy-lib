import { debounceTime, EMPTY, map, Observable, scan } from 'rxjs'
import { useEffect, useState } from 'react'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'
import {
  failure,
  fold3,
  initial,
  RemoteData,
  success,
} from '@devexperts/remote-data-ts'
import { identity, pipe } from 'fp-ts/function'

const toThrowable = <Err, T>(o: Observable<Either<Err, T>>): Observable<T> =>
  o.pipe(
    map(
      E.getOrElse((e) => {
        throw e
      })
    )
  )

export const useObservableEither = <E, T>(
  o: Observable<Either<E, T>> = EMPTY,
  deps: unknown[] = [o],
  debounce = 0
): RemoteData<E, T> => {
  return useObservable(o.pipe(toThrowable), deps, debounce)
}

export const useObservable = <T, E = unknown>(
  o: Observable<T> = EMPTY,
  deps: unknown[] = [o],
  debounce = 0
): RemoteData<E, T> => {
  const [state, setState] = useState<RemoteData<E, T>>(initial)

  useEffect(() => {
    const subscription = o.pipe(debounceTime(debounce)).subscribe({
      next: (value) => setState(success(value)),
      error: (error) => setState(failure(error)),
    })

    return () => subscription.unsubscribe()
  }, [...deps])

  return state
}

export const useObservableReducer = <Action, State>(
  actions$: Observable<Action> | undefined,
  reducer: (state: State, action: Action) => State,
  initialState: State,
  deps: unknown[] = [actions$, reducer]
) => {
  const result = useObservable(
    actions$?.pipe(scan(reducer, initialState)),
    deps
  )
  return pipe(
    result,
    fold3(
      () => initialState,
      () => initialState,
      identity
    )
  )
}
