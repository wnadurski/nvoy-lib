import * as R from '@devexperts/remote-data-ts'
import { map as rMap, RemoteData, success } from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/Option'
import { map as oMap, none as oNone, Option, some } from 'fp-ts/Option'
import { flow, Lazy, pipe } from 'fp-ts/function'

export type RemoteDataOption<E, A> = RemoteData<E, Option<A>>

export const of: <A>(a: A) => RemoteDataOption<never, A> = (a) =>
  success(some(a))

export const none: RemoteDataOption<never, never> = success(oNone)

export const map: <E, A, B>(
  f: (a: A) => B
) => (fa: RemoteDataOption<E, A>) => RemoteDataOption<E, B> = flow(oMap, rMap)

export const chain: <E, A, B>(
  f: (a: A) => RemoteDataOption<E, B>
) => (fa: RemoteDataOption<E, A>) => RemoteDataOption<E, B> = (f) => (fa) =>
  pipe(
    fa,
    map(f),
    R.chain(
      O.fold(
        () => none,
        (x) => x
      )
    )
  )

export const fromRemoteData: <E, A>(
  fa: RemoteData<E, A>
) => RemoteDataOption<E, A> = (fa) =>
  pipe(
    fa,
    rMap((a) => some(a))
  )

export const fold: <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onNone: Lazy<B>,
  onError: (e: E) => B,
  onSome: (a: A) => B
) => (fa: RemoteDataOption<E, A>) => B = (
  onInitial,
  onPending,
  onNone,
  onError,
  onSome
) => R.fold(onInitial, onPending, onError, O.fold(onNone, onSome))

export const foldW: <E, A, B1, B2, B3, B4, B5>(
  onInitial: Lazy<B1>,
  onPending: Lazy<B2>,
  onNone: Lazy<B3>,
  onError: (e: E) => B4,
  onSome: (a: A) => B5
) => (fa: RemoteDataOption<E, A>) => B1 | B2 | B3 | B4 | B5 = fold as any

export const fold4: <E, A, B>(
  onPending: Lazy<B>,
  onNone: Lazy<B>,
  onError: (e: E) => B,
  onSome: (a: A) => B
) => (fa: RemoteDataOption<E, A>) => B = (onPending, onNone, onError, onSome) =>
  fold(onPending, onPending, onNone, onError, onSome)

export const fold4W: <E, A, B1, B2, B3, B4>(
  onPending: Lazy<B1>,
  onNone: Lazy<B2>,
  onError: (e: E) => B3,
  onSome: (a: A) => B4
) => (fa: RemoteDataOption<E, A>) => B1 | B2 | B3 | B4 = fold4 as any

export const toUndefined = <E, A>(fa: RemoteDataOption<E, A>): A | undefined =>
  pipe(fa, R.toOption, O.flatten, O.toUndefined)
