import { useMessages } from './use-messages'
import * as O from 'fp-ts/Option'
import { AddMessageError, ChannelId, Message, MessageId } from '@nvoy/base'
import { useAddMessage } from './use-add-message'
import { Observable } from 'rxjs'
import { Either } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as RD from '@devexperts/remote-data-ts'
import * as RDO from '../utils/remote-data-option'
import { useSetLastRead } from './use-set-last-read'

export const useChat = (
  channelId: O.Option<ChannelId>
): RDO.RemoteDataOption<
  never,
  {
    messages: Message[]
    addMessage: (text: string) => Observable<Either<AddMessageError, MessageId>>
    onFocus: () => void
  }
> => {
  const messages = useMessages(channelId)
  const addMessage = useAddMessage(channelId)

  const onFocus = useSetLastRead(O.toUndefined(channelId))

  return pipe(
    channelId,
    RD.success,
    RDO.chain(() =>
      pipe(
        messages,
        RDO.fromRemoteData,
        RDO.map((x) => ({ messages: x, addMessage, onFocus }))
      )
    )
  )
}
