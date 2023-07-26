import { UserId } from '../users'
import { t } from '../utils/fp-ts-imports'
import { DateFromFirebase } from '../utils/timestamp-codec'

export type ChannelId = string

export const ChannelType = {
  Conversation: 'conversation',
} as const

export const membersHashField = 'membersHash'

export type Conversation<Metadata = unknown> = {
  id: ChannelId
  type: typeof ChannelType.Conversation
  members: UserId[]
  displayName?: string | null
  avatarSrc?: string | null
  metadata?: Metadata
  lastMessageTimestamp?: Date
  lastRead?: Record<UserId, Date>
  lastSent?: Record<UserId, Date>
}

export type Channel<Metadata = unknown> = Conversation<Metadata>

export const ConversationCodec = t.intersection([
  t.type({
    id: t.string,
    type: t.literal(ChannelType.Conversation),
    members: t.array(t.string),
  }),
  t.partial({
    displayName: t.union([t.string, t.null]),
    avatarSrc: t.union([t.string, t.null]),
    metadata: t.unknown,
    lastMessageTimestamp: DateFromFirebase,
    lastRead: t.record(t.string, DateFromFirebase),
    lastSent: t.record(t.string, DateFromFirebase),
  }),
])

export type ConversationFromCodec = t.TypeOf<typeof ConversationCodec>
