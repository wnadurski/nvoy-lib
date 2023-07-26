import { Lazy } from 'fp-ts/function'

export type NonErrorDeferredValue<T> =
  | { tag: 'NotPresent' }
  | { tag: 'Present'; value: T }

export const present = <T>(value: T): NonErrorDeferredValue<T> => ({
  tag: 'Present',
  value,
})
export const notPresent: NonErrorDeferredValue<never> = { tag: 'NotPresent' }

export const map =
  <A, B>(f: (a: A) => B) =>
  (deferred: NonErrorDeferredValue<A>): NonErrorDeferredValue<B> => {
    switch (deferred.tag) {
      case 'NotPresent':
        return deferred
      case 'Present':
        return { ...deferred, value: f(deferred.value) }
    }
  }

export const isPresent = <T>(
  v: NonErrorDeferredValue<T>
): v is { tag: 'Present'; value: T } => v.tag === 'Present'

export const fold =
  <V, T>(onNotPresent: Lazy<T>, onPresent: (value: V) => T) =>
  (nedv: NonErrorDeferredValue<V>) =>
    isPresent(nedv) ? onPresent(nedv.value) : onNotPresent()
