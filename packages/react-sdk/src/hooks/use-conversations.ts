import { useRun } from '../containers/NvoyProvider'
import { useObservableEither } from '../utils/use-observable'
import {
  Conversation,
  currentUser$,
  getCurrentUserConversations$,
  isUnread,
  UnexpectedError,
  User,
} from '@nvoy/base'
import { RemoteData } from '@devexperts/remote-data-ts'
import { pipe } from 'fp-ts/function'
import { AE, Arr, O } from '../utils/fp-ts-imports'
import * as Ord from 'fp-ts/Ord'
import { Ord as BooleanOrd } from 'fp-ts/boolean'
import { Ord as DateOrd } from 'fp-ts/Date'

const ConversationOrdSemigroup = Ord.getSemigroup<Conversation>()

const ConversationLastMessageOrd: Ord.Ord<Conversation> = pipe(
  DateOrd,
  Ord.reverse,
  Ord.contramap((c: Conversation) => c.lastMessageTimestamp)
)

const ConversationUnreadOrd: (user?: User) => Ord.Ord<Conversation> = (user) =>
  pipe(BooleanOrd, Ord.reverse, Ord.contramap(isUnread(user)))

const ConversationOrd = (user?: User) =>
  ConversationOrdSemigroup.concat(
    ConversationUnreadOrd(user),
    ConversationLastMessageOrd
  )

export const useConversations = <Metadata = unknown>(): RemoteData<
  UnexpectedError,
  Conversation<Metadata>[]
> => {
  const run = useRun()

  return useObservableEither(
    pipe(
      getCurrentUserConversations$<Metadata>(),
      AE.bindTo('conversations'),
      AE.apS('user', AE.fromAction(currentUser$)),
      AE.map(({ conversations, user }) =>
        Arr.sort<Conversation>(ConversationOrd(O.toUndefined(user)))(
          conversations
        )
      ),
      run
    ),
    [run]
  )
}
