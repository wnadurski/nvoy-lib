import * as E from 'fp-ts/Either'
import { UnexpectedError } from '../errors'
import { pipe } from 'fp-ts/function'
import { limit, onSnapshot, orderBy } from 'firebase/firestore'
import { Observable } from 'rxjs'
import { Message, MessageChange } from './types'
import { messageConverter } from './converter'
import { ChannelId } from '../channels/types'
import { relMessagesPath } from './path'
import { isoQuery, query } from '../no-sql/query'
import { ActionEither } from '../ActionEither'
import * as A from '../Action'

export const messagesChanges$: (
  channelId: ChannelId,
  limit?: number
) => ActionEither<UnexpectedError, MessageChange[]> = (
  channelId,
  messagesLimit = 50
) =>
  pipe(
    query(
      relMessagesPath(channelId),
      [orderBy('timestamp', 'desc'), limit(messagesLimit)],
      messageConverter
    ),
    A.map(isoQuery<Message>().unwrap),
    A.chain(
      A.fromObservableK(
        (q) =>
          new Observable<E.Either<UnexpectedError, MessageChange[]>>(
            (subscriber) => {
              return onSnapshot(
                q,
                (snapshot) => {
                  const changes: MessageChange[] = snapshot
                    .docChanges()
                    .map((x) => ({
                      type: x.type,
                      message: x.doc.data(),
                    }))

                  subscriber.next(E.right(changes))
                },
                () => {
                  subscriber.next(
                    E.left(
                      new UnexpectedError('on snapshot in messagesChanges$')
                    )
                  )
                  subscriber.complete()
                },
                () => subscriber.complete()
              )
            }
          )
      )
    )
  )
