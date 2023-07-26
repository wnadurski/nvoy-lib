import { isSentMessage, MessageId } from './types'
import { pipe } from 'fp-ts/function'
import { serverTimestamp } from 'firebase/firestore'
import * as E from 'fp-ts/Either'
import { AddMessageError, NotLoggedIn } from './errors'
import { ChannelId } from '../channels/types'
import { relMessagesPath } from './path'
import * as AE from '../ActionEither'
import { ActionEither } from '../ActionEither'
import { currentUser$ } from '../users/current-user$'
import * as A from '../Action'
import { UserId } from '../users'
import { addDoc } from '../no-sql/add-doc'
import { setLastSent } from '../channels/set-last-sent'
import { getMessage } from './get-message'
import { EntityDoesNotExist, UnexpectedError } from '../errors'

const addMessageDoc = (message: string, channelId: ChannelId, sender: UserId) =>
  addDoc(relMessagesPath(channelId), {
    timestamp: serverTimestamp(),
    message,
    sender: sender,
  })

export const addMessage: (
  message: string
) => (channelId: ChannelId) => ActionEither<AddMessageError, MessageId> =
  (message) => (channelId) =>
    pipe(
      currentUser$,
      A.take(1),
      A.map(E.fromOption(() => new NotLoggedIn('addMessage'))),
      AE.bindTo('user'),
      AE.bind('messageId', ({ user }) =>
        addMessageDoc(message, channelId, user.id)
      ),
      AE.bind('lastMessageTimestamp', ({ messageId }) =>
        pipe(
          getMessage(channelId, messageId),
          AE.mapLeft((x) =>
            x instanceof EntityDoesNotExist
              ? new UnexpectedError(
                  'Retrieving recently created message.',
                  undefined,
                  `Message ${channelId}/${messageId} should exist at this point.`
                )
              : x
          ),
          AE.chain((message) =>
            isSentMessage(message)
              ? AE.right(message)
              : AE.left(
                  new UnexpectedError(
                    'Retrieving recently created message.',
                    undefined,
                    `Message ${channelId}/${messageId} should have timestamp.`
                  )
                )
          ),
          AE.map((x) => x.timestamp)
        )
      ),
      AE.chainFirst(({ user, lastMessageTimestamp }) =>
        setLastSent(user.id, channelId, lastMessageTimestamp)
      ),
      AE.map(({ messageId }) => messageId)
    )
