import { Lazy, pipe } from 'fp-ts/function'
import {
  NonErrorDeferredValue,
  notPresent,
  present,
} from './non-error-deferred-value'
import * as NEDV from './non-error-deferred-value'
import { none, Option, some } from 'fp-ts/Option'
import * as T from 'fp-ts/Task'

export type DeferredValue<T, E = unknown> =
  | NonErrorDeferredValue<T>
  | { tag: 'Error'; error: E }

export const map =
  <E, A, B>(f: (a: A) => B) =>
  (deferred: DeferredValue<A, E>): DeferredValue<B, E> => {
    switch (deferred.tag) {
      case 'Error':
        return deferred
      default:
        return NEDV.map(f)(deferred)
    }
  }

export const getOrElse =
  <T>(onEmpty: Lazy<T>) =>
  <E = unknown>(
    deferred: NonErrorDeferredValue<T> | DeferredValue<T, E>
  ): T => {
    switch (deferred.tag) {
      case 'Present':
        return deferred.value
      default:
        return onEmpty()
    }
  }

export const getOrElseW =
  <U>(onEmpty: Lazy<U>) =>
  <T, E = unknown>(
    deferred: NonErrorDeferredValue<T> | DeferredValue<T, E>
  ): T | U => {
    switch (deferred.tag) {
      case 'Present':
        return deferred.value
      default:
        return onEmpty()
    }
  }

export const toOption = <T, E = unknown>(
  deferred: NonErrorDeferredValue<T> | DeferredValue<T, E>
): Option<T> => {
  switch (deferred.tag) {
    case 'Present':
      return some(deferred.value)
    default:
      return none
  }
}

export const chainTask =
  <A, B, E = unknown>(f: (value: A) => T.Task<B>) =>
  (fa: DeferredValue<A, E>): T.Task<B> => {
    switch (fa.tag) {
      case 'Present':
        return f(fa.value)
      default:
        return T.never
    }
  }

export const chain =
  <A, B, E = unknown>(f: (value: A) => DeferredValue<B, E>) =>
  (fa: DeferredValue<A, E>): DeferredValue<B, E> => {
    switch (fa.tag) {
      case 'Present':
        return f(fa.value)
      default:
        return fa
    }
  }

export const of: <T>(v: T) => DeferredValue<T, never> = (v) => present(v)

// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: DeferredValue<{}, never> = present({})

export const apS: <N extends string, A, B, E = unknown>(
  name: Exclude<N, keyof A>,
  fb: DeferredValue<B, E>
) => (fa: DeferredValue<A, E>) => DeferredValue<
  {
    readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
  },
  E
> = (name, fb) => (fa) =>
  pipe(
    fa,
    chain((a) =>
      pipe(
        fb,
        map((b) => ({ ...a, [name]: b } as any))
      )
    )
  )

export const dropError = <T>(
  fa: DeferredValue<T, any>
): NonErrorDeferredValue<T> => {
  switch (fa.tag) {
    case 'Present':
      return fa
    default:
      return notPresent
  }
}
