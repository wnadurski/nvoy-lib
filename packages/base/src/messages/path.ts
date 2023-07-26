import { Organization } from '../organizations/types'
import { ChannelId } from '../channels/types'
import { channelPath, relChannelPath } from '../channels/path'
import { MessageId } from './types'

export const messagesPath =
  (organization: Organization) => (channelId: ChannelId) =>
    [...channelPath(organization)(channelId), 'messages'] as const

export const relMessagesPath = (id: ChannelId) =>
  [...relChannelPath(id), 'messages'] as const

export const relMessagePath = (channelId: ChannelId, id: MessageId) =>
  [...relMessagesPath(channelId), id] as const
