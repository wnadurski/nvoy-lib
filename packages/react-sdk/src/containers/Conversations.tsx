import { ConversationsList } from '../components/ConversationsList/ConversationsList'
import { createContext, useContext } from 'react'
import { ChannelId, Conversation, isUnread, User, UserId } from '@nvoy/base'
import { useTask } from '../utils/use-task'
import * as T from 'fp-ts/Task'
import { Task } from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/function'
import { filter, last, map } from 'fp-ts/Array'
import { sequenceS } from 'fp-ts/Apply'
import { fromEntries, toEntries } from 'fp-ts/Record'
import { useUser } from './NvoyProvider'
import { useMessages } from '../hooks/use-messages'
import * as RD from '@devexperts/remote-data-ts'
import { fold3, RemoteData } from '@devexperts/remote-data-ts'
import * as RDU from '../utils/remote-data-utils'
import * as RDO from '../utils/remote-data-option'
import { range } from 'fp-ts/NonEmptyArray'
import { useComponent } from './Components/ComponentsProvider'
import { snd } from 'fp-ts/lib/Tuple'
import {
  DisplayData,
  DisplayDataOrMonoid,
  emptyDisplayData,
} from '../utils/display-data/DisplayData'
import { Arr } from '../utils/fp-ts-imports'

export interface UserInfo {
  displayName: string
  avatarSrc?: string
}

export interface ConversationsContextType {
  getUserDetails: (id: UserId) => Promise<UserInfo | undefined>
  onClickConversation: (id: ChannelId) => void
  activeChannelId?: ChannelId
}

const Context = createContext<ConversationsContextType>({
  getUserDetails: () => Promise.resolve(undefined),
  onClickConversation: () => undefined,
})

export const ConversationsContextProvider = Context.Provider

export interface ConversationsProps {
  conversations: RemoteData<unknown, Conversation[]>
  className?: string
  size?: 'small' | 'large'
}

export const Conversations = ({
  conversations,
  className,
  size,
}: ConversationsProps) => {
  return (
    <ConversationsList className={className}>
      {pipe(
        conversations,
        RD.fold3(
          () =>
            range(0, 2).map((i) => (
              <ConversationItem size={size} key={i} conversation={RD.pending} />
            )),
          () =>
            range(0, 3).map((i) => (
              <ConversationItem size={size} key={i} conversation={RD.pending} />
            )),
          map((x) => (
            <ConversationItem
              size={size}
              key={x.id}
              conversation={RD.success(x)}
            />
          ))
        )
      )}
    </ConversationsList>
  )
}

const getConversationDisplayData = (
  currentUser: User | undefined,
  getUserDetails: ConversationsContextType['getUserDetails'],
  conversation: RemoteData<unknown, Conversation<unknown>>
): Task<{
  conversation: DisplayData
  recipients: DisplayData[]
  conversationOrFirstRecipient: DisplayData
}> =>
  pipe(
    conversation,
    RDU.chainTask(
      flow(
        (conversation) => ({
          conversation: T.of({
            displayName: O.fromNullable(conversation.displayName),
            avatarSrc: O.fromNullable(conversation.avatarSrc),
          }),
          recipients: pipe(
            conversation.members,
            map((id) => [id, () => getUserDetails(id)] as const),
            fromEntries,
            sequenceS(T.ApplyPar),
            T.map((membersInfo) =>
              pipe(
                membersInfo,
                toEntries,
                filter(([id]) => id !== currentUser?.id),
                Arr.map(snd),
                Arr.map(O.fromNullable),
                Arr.map(
                  O.map((x) => ({
                    displayName: O.some(x.displayName),
                    avatarSrc: O.fromNullable(x.avatarSrc),
                  }))
                ),
                Arr.map(O.getOrElse(() => emptyDisplayData))
              )
            )
          ),
        }),
        sequenceS(T.ApplyPar),
        T.map(({ conversation, recipients }) => ({
          conversation,
          recipients,
          conversationOrFirstRecipient: DisplayDataOrMonoid.concat(
            conversation,
            pipe(
              recipients,
              Arr.head,
              O.getOrElse(() => emptyDisplayData)
            )
          ),
        }))
      )
    )
  )

export const useConversationDisplayData = (
  conversation: RemoteData<unknown, Conversation<unknown>>,
  getUserDetails: ConversationsContextType['getUserDetails']
) => {
  const currentUser = useUser()
  const { data } = useTask(
    getConversationDisplayData(currentUser, getUserDetails, conversation),
    [RDU.getOrElseW(() => ({ id: undefined }))(conversation).id]
  )

  return data
}

export interface ConversationItemProps {
  conversation: RemoteData<unknown, Conversation>
  className?: string
  size?: 'small' | 'large'
}

export const ConversationItem = ({
  conversation,
  size = 'large',
}: ConversationItemProps) => {
  const ConversationRowComponent = useComponent(
    size === 'large' ? 'ConversationRow' : 'ConversationRowSmall'
  )
  const user = useUser()
  const { getUserDetails, onClickConversation, activeChannelId } =
    useContext(Context)

  const displayData = useConversationDisplayData(conversation, getUserDetails)

  const lastMessage = pipe(
    conversation,
    RD.map((conversation) => conversation.id),
    RD.toOption,
    useMessages,
    RD.map(last)
  )

  return (
    <ConversationRowComponent
      unread={pipe(
        conversation,
        RD.map(isUnread(user)),
        RD.getOrElse(() => false)
      )}
      active={pipe(
        conversation,
        fold3(
          () => false,
          () => false,
          (conversation) => conversation.id === activeChannelId
        )
      )}
      onClick={() =>
        pipe(
          conversation,
          RD.map((conversation) => onClickConversation(conversation.id))
        )
      }
      avatarSrc={pipe(
        displayData,
        RD.map((x) => x.conversationOrFirstRecipient.avatarSrc)
      )}
      displayName={pipe(
        displayData,
        RD.map((x) => x.conversationOrFirstRecipient.displayName)
      )}
      lastMessage={pipe(
        lastMessage,
        RDO.map((m) => ({ content: m.message, timestamp: m.timestamp }))
      )}
    />
  )
}
