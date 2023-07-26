import { useEffect, useState } from 'react'
import { Task } from 'fp-ts/Task'
import * as RD from '@devexperts/remote-data-ts'
import { RemoteData } from '@devexperts/remote-data-ts'

export const useTask = <T, E = unknown>(
  getter: Task<T>,
  deps: unknown[] = [getter]
): { data: RemoteData<E, T> } => {
  const [state, setState] = useState<RemoteData<E, T>>(RD.initial)

  useEffect(() => {
    let cancelled = false

    getter()
      .then((value) => !cancelled && setState(RD.success(value)))
      .catch((error) => !cancelled && setState(RD.failure(error)))

    return () => {
      cancelled = true
    }
  }, [...deps])

  return { data: state }
}
