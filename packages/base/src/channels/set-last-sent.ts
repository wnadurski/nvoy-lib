import { UserId } from '../users'
import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { pipe } from 'fp-ts/function'
import { updateDoc } from '../no-sql/update-doc'
import { ChannelId } from './types'
import { relChannelPath } from './path'
import { Timestamp } from 'firebase/firestore'

export const setLastSent: (
  userId: UserId,
  channelId: ChannelId,
  lastSentDateTime: Date
) => ActionEither<UnexpectedError, void> = (userId, channelId, timestamp) =>
  pipe(timestamp, Timestamp.fromDate, (timestamp) =>
    updateDoc(relChannelPath(channelId), {
      lastMessageTimestamp: timestamp,
      [`lastSent.${userId}`]: timestamp,
    })
  )
