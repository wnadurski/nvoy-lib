import { ComponentType, ReactNode } from 'react'
import { ConversationRowProps } from '../../components/ConversationsList/props'
import { ChatTopBarProps } from '../../components/ChatTopBar'

export interface Components {
  ConversationRow: ComponentType<ConversationRowProps>
  ConversationRowSmall: ComponentType<ConversationRowProps>
  ChatTopBar: ComponentType<ChatTopBarProps>
  ChatViewContainer: ComponentType<{ children: ReactNode }>
}
