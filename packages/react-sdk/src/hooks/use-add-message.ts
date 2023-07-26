import { Observable } from 'rxjs'
import { Either } from 'fp-ts/Either'
import { useCallback } from 'react'
import { pipe } from 'fp-ts/function'
import { useRun } from '../containers/NvoyProvider'
import * as O from 'fp-ts/Option'
import * as A from '@nvoy/base/Action'
import { addMessage, AddMessageError, ChannelId, MessageId } from '@nvoy/base'

export const useAddMessage = (
  channelId: O.Option<ChannelId>
): ((text: string) => Observable<Either<AddMessageError, MessageId>>) => {
  const run = useRun()
  return useCallback(
    (text: string) => {
      return pipe(channelId, A.fromOption, A.chain(addMessage(text)), run)
    },
    [run, channelId]
  )
}
