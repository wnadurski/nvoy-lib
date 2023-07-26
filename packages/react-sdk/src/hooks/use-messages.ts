import { useMemo } from 'react'
import * as O from 'fp-ts/Option'
import * as A from '@nvoy/base/Action'
import { useObservableReducer } from '../utils/use-observable'
import { useRun } from '../containers/NvoyProvider'
import {
  ChannelId,
  Message,
  MessageChange,
  MessageIdEq,
  messagesChanges$,
  MessageTimestampOrd,
} from '@nvoy/base'
import { pipe } from 'fp-ts/function'
import { isEmpty, sort, uniq } from 'fp-ts/Array'
import * as rx from 'rxjs'
import { Observable } from 'rxjs'
import * as RD from '@devexperts/remote-data-ts'
import { RemoteData } from '@devexperts/remote-data-ts'

type Event = MessageChange | { type: 'empty' }
export type MessagesState = RemoteData<never, Message[]>

const emptyEvent: Event = { type: 'empty' as const }

const messagesReducer = (
  state: MessagesState,
  change: Event
): MessagesState => {
  switch (change.type) {
    case 'empty':
      return RD.success([])
    case 'added':
      return pipe(
        state,
        RD.getOrElse(() => [] as Message[]),
        (messages) => [...messages, change.message],
        uniq(MessageIdEq),
        sort(MessageTimestampOrd),
        RD.success
      )
    case 'modified':
      return pipe(
        state,
        RD.getOrElse(() => [] as Message[]),
        (messages) =>
          messages.map((m) =>
            m.id !== change.message.id ? m : change.message
          ),
        RD.success
      )
    case 'removed':
      // We don't remove messages for now
      return pipe(
        state,
        RD.getOrElse(() => [] as Message[]),
        RD.success
      )
  }
  return state
}

export const useMessages = (channelId: O.Option<ChannelId>): MessagesState => {
  const run = useRun()
  const events$: Observable<Event> = useMemo(() => {
    return pipe(
      channelId,
      A.fromOption,
      A.chain(messagesChanges$),
      A.filterMap(O.fromEither),
      A.map((x) => (isEmpty(x) ? [emptyEvent] : x)),
      run,
      rx.mergeAll()
    )
  }, [
    run,
    pipe(
      channelId,
      O.getOrElseW(() => undefined)
    ),
  ])

  return useObservableReducer(events$, messagesReducer, RD.pending)
}
