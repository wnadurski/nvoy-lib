import { Eq } from 'fp-ts/Eq'
import { Ord } from 'fp-ts/Ord'
import { UserId } from '../users'

export type MessageId = string
type BaseMessage = {
  id: MessageId
  message: string
  sender: UserId
}
type PendingMessage = BaseMessage & {
  timestamp: undefined
  status: 'sending'
}
type SentMessage = BaseMessage & {
  timestamp: Date
  status: 'sent'
}
export type Message = SentMessage | PendingMessage
export const MessageIdEq: Eq<Message> = {
  equals(a, b) {
    return a.id === b.id
  },
}

export const isSentMessage = (
  message: SentMessage | PendingMessage
): message is SentMessage => !!message.timestamp

export const MessageTimestampOrd: Ord<Message> = {
  ...MessageIdEq,
  compare: ({ timestamp: a }, { timestamp: b }) => {
    if (a === undefined && b === undefined) {
      return 0
    }
    if (a === undefined) {
      return 1
    }
    if (b === undefined) {
      return -1
    }
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  },
}
export type MessageChangeType = 'added' | 'removed' | 'modified'
export type MessageChange = { type: MessageChangeType; message: Message }
