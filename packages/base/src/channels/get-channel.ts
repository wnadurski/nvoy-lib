import {
  Channel,
  ChannelId,
  ChannelType,
  Conversation,
  ConversationCodec,
  membersHashField,
} from './types'
import * as A from '../Action'
import { EntityDoesNotExist, UnexpectedError } from '../errors'
import { pipe } from 'fp-ts/function'
import { orderBy, where } from 'firebase/firestore'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { UserId } from '../users'
import { createMembersHash } from './members-hash'
import { relChannelPath, relChannelsPath } from './path'
import { ActionEither } from '../ActionEither'
import { query } from '../no-sql/query'
import { currentUser$ } from '../users/current-user$'
import { getDoc } from '../no-sql/get-doc'
import { getDocs } from '../no-sql/get-docs'
import { AE, Arr } from '../utils/fp-ts-imports'
import { onSnapshot } from '../no-sql/on-snapshot'

type GetChannelError = UnexpectedError | EntityDoesNotExist

export const getChannelById = (
  id: ChannelId
): ActionEither<GetChannelError, Channel> => getDoc<Channel>(relChannelPath(id))

export class ChannelIsNotConversation extends Error {
  constructor(public id: ChannelId, public type: typeof ChannelType) {
    super(`Channel with id '${id}' is not a conversation (it's '${type}')`)
  }
}

export type GetConversationError = GetChannelError | ChannelIsNotConversation

export const getConversationById = (
  id: ChannelId
): ActionEither<GetConversationError, Channel> =>
  pipe(
    getChannelById(id),
    AE.chain((x) =>
      x.type === ChannelType.Conversation
        ? AE.right(x)
        : AE.left(new ChannelIsNotConversation(id, x.type))
    )
  )

export class TooManyConversationsError extends Error {
  constructor(members: string[]) {
    super(`Found more than 1 conversation with members '${members.toString()}'`)
  }
}

export type GetConversationByMembersError =
  | TooManyConversationsError
  | EntityDoesNotExist
  | UnexpectedError

export const getConversationByMembers = (
  members: UserId[]
): ActionEither<GetConversationByMembersError, Channel> =>
  pipe(
    members,
    createMembersHash,
    E.mapLeft(
      (e) => new UnexpectedError('when searching for channel with members', e)
    ),
    AE.fromEither,
    AE.chainActionK((hash) =>
      query<Channel>(relChannelsPath, [
        where(membersHashField, '==', hash),
        where('type', '==', ChannelType.Conversation),
      ])
    ),
    AE.chainW(getDocs),
    AE.chainW((channels) => {
      if (channels.length == 0) {
        return AE.left(
          new EntityDoesNotExist(
            `conversation with members '${members.toString()}'`
          )
        )
      } else if (channels.length > 1) {
        return AE.left(new TooManyConversationsError(members))
      }

      return AE.right(channels[0])
    })
  )

export const getConversationsForMember: (
  member: UserId
) => ActionEither<UnexpectedError, Conversation[]> = (member) =>
  pipe(
    query<Conversation>(relChannelsPath, [
      where('members', 'array-contains', member),
      where('type', '==', ChannelType.Conversation),
    ]),
    A.chain(getDocs)
  )

const currentUserConversations$: ActionEither<UnexpectedError, Conversation[]> =
  pipe(
    currentUser$,
    A.chain(
      O.match(
        () => AE.of([]),
        (user) =>
          pipe(
            query<Conversation>(relChannelsPath, [
              where('members', 'array-contains', user.id),
              where('type', '==', ChannelType.Conversation),
              orderBy('lastMessageTimestamp', 'desc'),
            ]),
            A.chain(onSnapshot({ allowPendingWrites: false })),
            AE.map((conversations) =>
              pipe(conversations, Arr.map(ConversationCodec.decode), Arr.rights)
            )
          )
      )
    )
  )

export const getCurrentUserConversations$ = <
  Metadata = unknown
>(): ActionEither<UnexpectedError, Conversation<Metadata>[]> =>
  currentUserConversations$ as ActionEither<
    UnexpectedError,
    Conversation<Metadata>[]
  >
