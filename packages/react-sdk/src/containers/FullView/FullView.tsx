import { Conversations, ConversationsContextType } from '../Conversations'
import { useConversations } from '../../hooks/use-conversations'
import { useChat } from '../../hooks/use-chat'
import { useState } from 'react'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from '@nvoy/base/Action'
import * as AE from '@nvoy/base/ActionEither'
import { addMessage, ChannelId, UnexpectedError, UserId } from '@nvoy/base'
import { ChatView, In, Out } from '../../components/ChatView/ChatView'
import { useRun, useUser } from '../NvoyProvider'
import { constant, pipe } from 'fp-ts/function'
import * as RDU from '../../utils/remote-data-utils'
import * as RD from '@devexperts/remote-data-ts'
import { Arr } from '../../utils/fp-ts-imports'
import { ConversationTopBar } from '../ConversationTopBar'
import {
  FullViewInterface,
  FullViewState,
} from '../../components/FullViewInterface/FullViewInterface'
import { FullViewContextProvider } from './FullViewContext'
import { useRemoteDataLog } from '../../utils/useRemoteDataLog'

export type PickOrCreateConversation = {
  _tag: 'PickOrCreateConversation'
  id?: ChannelId
  userId: UserId
  displayName?: string
}

export const pickOrCreateConversation = (
  args: Omit<PickOrCreateConversation, '_tag'>
): PickOrCreateConversation => ({ ...args, _tag: 'PickOrCreateConversation' })

export type PickConversation = {
  _tag: 'PickConversation'
  id: ChannelId
}

export const pickConversation = (
  args: Omit<PickConversation, '_tag'>
): PickConversation => ({ ...args, _tag: 'PickConversation' })

export type StartAtConversation = PickConversation | PickOrCreateConversation

export interface FullViewProps {
  startAtConversation?: StartAtConversation
  getUserDetails: ConversationsContextType['getUserDetails']
}

export const FullView = ({
  getUserDetails,
  startAtConversation,
}: FullViewProps) => {
  const [activeChannelId, setActiveChannelId] = useState<O.Option<ChannelId>>(
    pipe(
      startAtConversation,
      O.fromNullable,
      O.chain((x) => O.fromNullable(x.id))
    )
  )
  const conversations = useConversations()
  const chat = useChat(activeChannelId)
  const user = useUser()
  const run = useRun()

  useRemoteDataLog('Conversation in full view', conversations)

  const activeConversation = pipe(
    conversations,
    RD.map(
      Arr.findFirst(
        (c) =>
          c.id ===
          pipe(
            activeChannelId,
            O.getOrElse(() => '')
          )
      )
    )
  )

  const props = pipe(
    RDU.Do,
    RDU.apS('chat', chat),
    RDU.apS('conversations', conversations),
    RDU.apS('activeConversation', activeConversation),
    RDU.fold3W(
      constant({
        state: FullViewState.loading as const,
      }),
      constant({
        state: FullViewState.error as const,
      }),
      ({ chat, conversations, activeConversation }) =>
        pipe(
          O.Do,
          O.apS('chat', chat),
          O.apS('activeConversation', activeConversation),
          O.foldW(
            constant({
              state: FullViewState.empty as const,
              conversationsCount: conversations.length,
            }),
            ({ chat, activeConversation }) => ({
              state: FullViewState.display as const,
              topBar: pipe(activeConversation, (activeConversation) => (
                <ConversationTopBar
                  conversation={RD.success(activeConversation)}
                  getUserDetails={getUserDetails}
                />
              )),
              chat: (
                <ChatView
                  key={`chat-view-${activeConversation.id}`}
                  onFocus={chat.onFocus}
                  messages={chat.messages.map((m) => ({
                    ...m,
                    direction: m.sender === user?.id ? Out : In,
                  }))}
                  onSendMessage={(message) => {
                    return pipe(
                      activeChannelId,
                      AE.fromOption(
                        () => new UnexpectedError('Active channel is empty')
                      ),
                      AE.chain(addMessage(message)),
                      (x) => x,
                      A.map(
                        E.fold(constant({ ok: false }), constant({ ok: true }))
                      ),
                      run
                    )
                  }}
                />
              ),
            })
          )
        )
    )
  )

  return (
    <FullViewContextProvider
      getUserDetails={getUserDetails}
      onClickConversation={(id) => setActiveChannelId(O.some(id))}
      activeChannelId={activeChannelId}
      activeConversation={pipe(activeConversation, RD.toOption, O.flatten)}
    >
      <FullViewInterface
        conversations={({ size }) => (
          <Conversations size={size} conversations={conversations} />
        )}
        {...props}
      />
    </FullViewContextProvider>
  )
}
