import { ChannelId } from '../channels/types'
import { Message, MessageId } from './types'
import { getDoc } from '../no-sql/get-doc'
import { relMessagePath } from './path'
import { messageConverter } from './converter'

export const getMessage = (channelId: ChannelId, messageId: MessageId) =>
  getDoc<Message>(relMessagePath(channelId, messageId), messageConverter)
