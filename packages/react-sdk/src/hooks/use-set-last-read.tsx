import { useRun, useUser } from '../containers/NvoyProvider'
import { ChannelId, setLastRead } from '@nvoy/base'
import { useCallback } from 'react'
import { pipe } from 'fp-ts/function'

export const useSetLastRead = (channelId: ChannelId | undefined) => {
  const run = useRun()
  const user = useUser()

  return useCallback(() => {
    if (!user || !channelId) {
      return
    }
    pipe(setLastRead(user.id, channelId), run).subscribe()
  }, [channelId, user?.id])
}
