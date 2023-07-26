import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  'conversations.avatar.alt': {
    id: 'conversations.avatar.alt',
    defaultMessage: '{displayName} avatar',
  },
  'message.container.label': {
    id: 'message.container.label',
    defaultMessage: 'Message sent by {displayName}',
  },
  'time.momentAgo': {
    id: 'time.momentAgo',
    defaultMessage: 'Just now',
  },
  'fullView.chat.empty.pickConversation.title': {
    id: 'fullView.chat.empty.pickConversation.title',
    defaultMessage: 'No conversation picked',
  },
  'fullView.chat.empty.pickConversation.hint': {
    id: 'fullView.chat.empty.pickConversation.hint',
    defaultMessage: 'Pick a conversation',
  },
  'fullView.chat.empty.noConversations.title': {
    id: 'fullView.chat.empty.noConversations.title',
    defaultMessage: 'No conversation found',
  },
  'fullView.chat.empty.noConversations.hint': {
    id: 'fullView.chat.empty.noConversations.hint',
    defaultMessage: 'Start a conversation to view messages',
  },
  'fullView.chat.error.title': {
    id: 'fullView.chat.error.title',
    defaultMessage: 'There was an error',
  },
  'fullView.chat.error.hint': {
    id: 'fullView.chat.error.hint',
    defaultMessage: 'Try again later.',
  },
})

export type Messages = Record<keyof typeof messages, string>
