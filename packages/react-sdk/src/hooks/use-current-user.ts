import { currentUser$, Runner, User } from '@nvoy/base'
import { useObservable } from '../utils/use-observable'
import { toNullable } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { fold3 } from '@devexperts/remote-data-ts'

export const useCurrentUser = (run: Runner | undefined): User | null => {
  const result = useObservable(run?.(currentUser$), [run])

  return pipe(
    result,
    fold3(
      () => null,
      () => null,
      toNullable
    )
  )
}
