import { Organization } from '../organizations/types'
import { organizationPath } from '../organizations/path'
import { ChannelId } from './types'

export const channelsPath = (organization: Organization) =>
  [...organizationPath(organization), 'channels'] as const

export const channelPath = (organization: Organization) => (id: ChannelId) =>
  [...organizationPath(organization), 'channels', id] as const

export const relChannelsPath = ['channels'] as const
export const relChannelPath = (id: ChannelId) => ['channels', id] as const
