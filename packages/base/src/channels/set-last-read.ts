import { UserId } from '../users'
import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { pipe } from 'fp-ts/function'
import { updateDoc } from '../no-sql/update-doc'
import { ChannelId } from './types'
import { relChannelPath } from './path'
import { serverTimestamp } from 'firebase/firestore'

export const setLastRead: (
  userId: UserId,
  channelId: ChannelId
) => ActionEither<UnexpectedError, void> = (userId, channelId) =>
  pipe(
    updateDoc(relChannelPath(channelId), {
      [`lastRead.${userId}`]: serverTimestamp(),
    })
  )
