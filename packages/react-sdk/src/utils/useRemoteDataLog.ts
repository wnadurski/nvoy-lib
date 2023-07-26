import { isFailure, isSuccess, RemoteData } from '@devexperts/remote-data-ts'
import { useEffect } from 'react'
import { logError, logInfo } from './log'

export const useRemoteDataLog = <E, T>(
  info: string,
  data: RemoteData<E, T>
): void => {
  useEffect(() => {
    if (isFailure(data)) {
      logError(info, 'error', data.error)
    } else if (isSuccess(data)) {
      logInfo(info, 'success', data.value)
    }
  }, [data])
}
