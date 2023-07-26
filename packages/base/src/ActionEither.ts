import * as A from './Action'
import { Action, Params } from './Action'
import * as ROE from './fp-ts-rxjs/ReaderObservableEither'
import { ReaderObservableEither } from './fp-ts-rxjs/ReaderObservableEither'
import { Applicative2 } from 'fp-ts/Applicative'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { flow } from 'fp-ts/lib/function'

export type ActionEither<E, A> = ReaderObservableEither<Params, E, A>

export const URI = 'ActionEither'
export declare type URI = typeof URI
declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: ActionEither<E, A>
  }
}

export const chain: <E, A, B>(
  f: (a: A) => ActionEither<E, B>
) => (ma: ActionEither<E, A>) => ActionEither<E, B> = ROE.chain
export const chainFirst: <E, A, B>(
  f: (a: A) => ActionEither<E, B>
) => (ma: ActionEither<E, A>) => ActionEither<E, A> = ROE.chainFirst
export const chainW: <E2, A, B>(
  f: (a: A) => ActionEither<E2, B>
) => <E1>(ma: ActionEither<E1, A>) => ActionEither<E2 | E1, B> = ROE.chainW
export const map = ROE.map
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <A>(fa: ActionEither<E, A>) => ActionEither<G, A> = ROE.mapLeft

// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: ActionEither<never, {}> = ROE.Do
export const bind: <K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ActionEither<E, B>
) => (
  fa: ActionEither<E, A>
) => ActionEither<E, { [P in K | keyof A]: P extends keyof A ? A[P] : B }> =
  ROE.bind

export const bindTo: <K extends string, E, A>(
  name: K
) => (fa: ActionEither<E, A>) => ActionEither<E, { [P in K]: A }> = ROE.bindTo

export const of: Applicative2<URI>['of'] = ROE.of
export const fromEither: <E, A>(ma: Either<E, A>) => ActionEither<E, A> =
  ROE.fromEither

export const left: <E = never, A = never>(e: E) => ActionEither<E, A> = ROE.left
export const right: <E = never, A = never>(a: A) => ActionEither<E, A> =
  ROE.right

export const fromOption: <E>(
  onNone: () => E
) => <A>(ma: Option<A>) => ActionEither<E, A> = ROE.fromOption

export const chainActionK: <A, B>(
  f: (a: A) => Action<B>
) => <E>(first: ActionEither<E, A>) => ActionEither<E, B> = (f) => (ma) =>
  pipe(ma, chain(flow(f, A.map(E.right))))

export const ask: <E>() => ActionEither<E, Params> = ROE.ask

export const apFirst: <E, B>(
  fb: ActionEither<E, B>
) => <A>(fa: ActionEither<E, A>) => ActionEither<E, A> = ROE.apFirst

export const apS: <E, N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: ActionEither<E, B>
) => (
  fa: ActionEither<E, A>
) => ActionEither<
  E,
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
> = (name, fb) => (fa) =>
  pipe(
    fa,
    ROE.bind(name, () => fb)
  )

export const fromAction = <A>(fa: Action<A>): ActionEither<never, A> =>
  pipe(fa, A.map(E.right))
