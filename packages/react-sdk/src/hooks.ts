import { useCallback, useMemo } from 'react'
import {
  addMessage,
  AddMessageError,
  ChannelId,
  getConversationByMembers,
  GetConversationByMembersError,
  Message,
  MessageChange,
  MessageId,
  MessageIdEq,
  MessageTimestampOrd,
  Runner,
  UserId,
} from '@nvoy/base'
import * as AE from '@nvoy/base/ActionEither'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'
import { identity, pipe } from 'fp-ts/function'
import { useObservable, useObservableReducer } from './utils/use-observable'
import { sort, uniq } from 'fp-ts/Array'
import { EMPTY, Observable } from 'rxjs'
import { useEngine } from './hooks/use-engine'
import { fold3 } from '@devexperts/remote-data-ts'

type UseChannelIdReturn = {
  channelId?: string
  loading: boolean
  error?: GetConversationByMembersError
}

export const useChannelId = (
  run: Runner | undefined,
  userIds: UserId[]
): UseChannelIdReturn => {
  const result = useObservable(
    run?.(
      pipe(
        getConversationByMembers(userIds),
        AE.map((c) => c.id)
      )
    ),
    [run, ...userIds]
  )

  const value = pipe(
    result,
    fold3(
      () => null,
      () => null,
      identity
    )
  )

  return useMemo(
    () =>
      pipe(
        value,
        E.fromNullable('waiting' as const),
        E.flattenW,
        E.matchW(
          (l): UseChannelIdReturn => {
            if (l === 'waiting') {
              return {
                channelId: undefined,
                error: undefined,
                loading: true,
              }
            } else {
              return {
                channelId: undefined,
                loading: false,
                error: l,
              }
            }
          },
          (r): UseChannelIdReturn => ({
            channelId: r,
            error: undefined,
            loading: false,
          })
        )
      ),
    [value]
  )
}

export const useMessages = (
  run: Runner | undefined,
  channelId: ChannelId | undefined
) => {
  const changes$ = useMemo(() => {
    if (!channelId) {
      return EMPTY
    }
    return EMPTY
  }, [run, channelId])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useObservableReducer(changes$, messagesReducer, [])
}

const messagesReducer = (messages: Message[], change: MessageChange) => {
  switch (change.type) {
    case 'added':
      return pipe(
        [...messages, change.message],
        uniq(MessageIdEq),
        sort(MessageTimestampOrd)
      )
    case 'modified':
      return messages.map((m) =>
        m.id !== change.message.id ? m : change.message
      )
    case 'removed':
      // We don't remove messages for now
      return messages
  }
}

export const useAddMessage = (
  run: Runner | undefined,
  channelId: ChannelId | undefined
): ((text: string) => Observable<Either<AddMessageError, MessageId>>) => {
  return useCallback(
    (text: string) => {
      if (!channelId) {
        return EMPTY
      }

      return run?.(pipe(channelId, addMessage(text))) ?? EMPTY
    },
    [run, channelId]
  )
}

export const useChannel = (apiKey: string, members: UserId[]) => {
  const { run } = useEngine(apiKey)
  const { channelId, error: channelError } = useChannelId(run, members)
  const messages = useMessages(run, channelId)
  const addMessage = useAddMessage(run, channelId)

  if (channelError) {
    return { error: channelError }
  }

  if (!run || !channelId) {
    return { loading: true as const }
  }
  return {
    loading: false as const,
    messages,
    addMessage,
  }
}
