import {
  ConversationsContextType,
  useConversationDisplayData,
} from './Conversations'
import { RemoteData } from '@devexperts/remote-data-ts'
import { Conversation } from '@nvoy/base'
import { pipe } from 'fp-ts/function'
import { O, RD, RDU } from '../utils/fp-ts-imports'
import { useComponent } from './Components/ComponentsProvider'

export interface ConversationTopBarProps {
  conversation: RemoteData<unknown, Conversation>
  getUserDetails: ConversationsContextType['getUserDetails']
}

export const ConversationTopBar = ({
  conversation,
  getUserDetails,
}: ConversationTopBarProps) => {
  const displayData = useConversationDisplayData(conversation, getUserDetails)
  const Component = useComponent('ChatTopBar')

  return pipe(
    displayData,
    RD.map(({ recipients, conversationOrFirstRecipient }) => ({
      recipients,
      ...conversationOrFirstRecipient,
    })),
    RD.map(({ displayName, avatarSrc, recipients }) =>
      pipe(
        displayName,
        O.map((displayName) => (
          <Component
            recipients={recipients}
            displayName={displayName}
            avatarSrc={pipe(avatarSrc, O.toUndefined)}
          />
        )),
        O.getOrElseW(() => null)
      )
    ),
    RDU.getOrElseW(() => null)
  )
}
