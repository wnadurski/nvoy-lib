import { Conversation } from './types'
import { User } from '../users'
import { pipe } from 'fp-ts/function'
import { toEntries } from 'fp-ts/Record'
import { Arr } from '../utils/fp-ts-imports'

export const isUnread = (user?: User) => (conversation: Conversation) => {
  if (!user) {
    return false
  }

  const userLastRead = conversation.lastRead?.[user.id] ?? new Date(1)

  return pipe(
    conversation.lastSent ?? {},
    toEntries,
    Arr.filter(([id]) => id !== user.id),
    Arr.some(([, date]) => date > userLastRead)
  )
}
