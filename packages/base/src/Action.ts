import * as RO from './fp-ts-rxjs/ReaderObservable'
import { ReaderObservable } from './fp-ts-rxjs/ReaderObservable'
import { Firestore } from 'firebase/firestore'
import { Auth } from 'firebase/auth'
import { Organization } from './organizations/types'
import { apply, pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'
import { fromFunction } from './utils/task'
import * as O from './fp-ts-rxjs/Observable'
import * as OP from 'fp-ts/Option'
import * as rx from 'rxjs/operators'
import { from, Observable, shareReplay } from 'rxjs'
import { Applicative1 } from 'fp-ts/Applicative'
import { MonadObservable1 } from './fp-ts-rxjs/MonadObservable'

export type Params = { organization: Organization; db: Firestore; auth: Auth }

export type Action<A> = ReaderObservable<Params, A>

export const URI = 'Action'

export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Action: Action<A>
  }
}

export const asks: <A = never>(f: (r: Params) => A) => Action<A> = RO.asks

export const fromAsync =
  <A>(f: (r: Params) => Promise<A>): Action<A> =>
  (r: Params) =>
    pipe(f, fromFunction, apply(r), O.fromTask)

export const fromAsyncSharedHot =
  <A>(f: (r: Params) => Promise<A>): Action<A> =>
  (r) =>
    from(f(r)).pipe(shareReplay())

export const toSharedHot: <A>(action: Action<A>) => Action<A> = (a) =>
  pipe(
    a,
    R.map((o) => {
      const shared = o.pipe(shareReplay())
      shared.subscribe()
      return shared
    })
  )

export const of: <A>(a: A) => Action<A> = RO.of
export const chain: <A, B>(
  f: (a: A) => Action<B>
) => (ma: Action<A>) => Action<B> = RO.chain

export const map: <A, B>(f: (a: A) => B) => (fa: Action<A>) => Action<B> =
  RO.map
export const flatten = RO.flatten

export const take: (count: number) => <A>(fa: Action<A>) => Action<A> = (
  count
) => R.map(rx.take(count))

export const filterMap: <A, B>(
  f: (a: A) => OP.Option<B>
) => (fa: Action<A>) => Action<B> = RO.filterMap

export const fromOption: <A>(o: OP.Option<A>) => Action<A> = RO.fromOption

export const startWith =
  <A>(a: A) =>
  <B>(actionB: Action<B>): Action<A | B> =>
  (params) =>
    actionB(params).pipe(rx.startWith(a))

export const Applicative: Applicative1<URI> =
  RO.Applicative as unknown as Applicative1<URI>

export const fromObservableK: <A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
) => (...a: A) => Action<B> = RO.fromObservableK

export const fromObservable: MonadObservable1<URI>['fromObservable'] =
  RO.fromObservable
