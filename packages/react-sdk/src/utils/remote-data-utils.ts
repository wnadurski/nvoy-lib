import { Lazy, pipe } from 'fp-ts/function'
import * as RD from '@devexperts/remote-data-ts'
import { isSuccess, RemoteData } from '@devexperts/remote-data-ts'
import * as T from 'fp-ts/Task'
import { sequenceS as sequenceSApply } from 'fp-ts/Apply'
import { Option } from 'fp-ts/Option'
import { RemoteProgress } from '@devexperts/remote-data-ts/remote-data'

export const getOrElseW: <L, A>(
  f: Lazy<A>
) => <B>(ma: RemoteData<L, B>) => A | B = RD.getOrElse as never

// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: RemoteData<never, {}> = RD.success({})
export const apS: <N extends string, A, B, E>(
  name: Exclude<N, keyof A>,
  fb: RemoteData<E, B>
) => (fa: RemoteData<E, A>) => RemoteData<
  E,
  {
    readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
  }
> = (name, fb) => (fa) =>
  pipe(
    fa,
    RD.chain((a) =>
      pipe(
        fb,
        RD.map((b) => ({ ...a, [name]: b } as never))
      )
    )
  )

export const chainTask =
  <A, B, E = unknown>(f: (value: A) => T.Task<B>) =>
  (fa: RemoteData<E, A>): T.Task<B> => {
    if (isSuccess(fa)) {
      return f(fa.value)
    }
    return T.never
  }

export const sequenceS = sequenceSApply(RD.remoteData)

export const fold3W: <E, A, R1, R2, R3>(
  onNone: (progress: Option<RemoteProgress>) => R1,
  onFailure: (e: E) => R2,
  onSuccess: (a: A) => R3
) => (fa: RemoteData<E, A>) => R1 | R2 | R3 = RD.fold3 as any
