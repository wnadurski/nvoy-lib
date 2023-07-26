import { UserId } from '../users'
import {
  ChannelIsNotConversation,
  getChannelById,
  getConversationById,
  getConversationByMembers,
  TooManyConversationsError,
} from './get-channel'
import { pipe } from 'fp-ts/function'
import * as A from '../Action'
import * as E from 'fp-ts/Either'
import { isLeft } from 'fp-ts/Either'
import { EntityDoesNotExist, UnexpectedError } from '../errors'
import { relChannelPath, relChannelsPath } from './path'
import { sort, uniq } from 'fp-ts/Array'
import { UserIdEq, UserIdOrd } from '../users/types'
import { createMembersHash } from './members-hash'
import { Channel, ChannelId, ChannelType, membersHashField } from './types'
import * as AE from '../ActionEither'
import { ActionEither } from '../ActionEither'
import { addDoc } from '../no-sql/add-doc'
import { setDoc } from '../no-sql/set-doc'

export type CreateConversationParams<Metadata = unknown> = {
  displayName?: string | null
  members: UserId[]
  metadata?: Metadata | null
  avatarSrc?: string | null
  id?: ChannelId
}

export class ChannelAlreadyExists extends Error {
  constructor(public channelId: ChannelId) {
    super(`Channel with id '${channelId}' already exists.`)
  }
}

export type CreateConversationError = UnexpectedError | ChannelAlreadyExists

export const createConversation = <Metadata = unknown>({
  members,
  id,
  metadata = null,
  displayName = null,
  avatarSrc = null,
}: CreateConversationParams<Metadata>): ActionEither<
  CreateConversationError,
  ChannelId
> =>
  pipe(
    AE.Do,
    AE.bind('members', () =>
      pipe(members, uniq(UserIdEq), sort(UserIdOrd), AE.of)
    ),
    AE.bind('hash', ({ members }) => AE.fromEither(createMembersHash(members))),
    AE.mapLeft((e) => new UnexpectedError('creating members hash', e)),
    AE.chain(({ members, hash }) => {
      const newChannel = {
        displayName,
        metadata,
        avatarSrc,
        members: members,
        type: ChannelType.Conversation,
        [membersHashField]: hash,
      }

      if (id) {
        return pipe(
          AE.Do,
          AE.chain(() => getChannelById(id)),
          A.map(
            E.matchW(
              (err) =>
                err instanceof EntityDoesNotExist
                  ? E.right(undefined)
                  : E.left(err),
              () => E.left(new ChannelAlreadyExists(id))
            )
          ),
          AE.chain(() => setDoc(relChannelPath(id), newChannel)),
          AE.map(() => id)
        )
      } else {
        return addDoc(relChannelsPath, newChannel)
      }
    })
  )

export type GetOrCreateConversationError =
  | UnexpectedError
  | TooManyConversationsError
  | ChannelIsNotConversation

export const getOrCreateConversation = <Metadata = unknown>({
  members,
  id,
  ...rest
}: CreateConversationParams<Metadata>): ActionEither<
  GetOrCreateConversationError,
  Channel
> => {
  return pipe(
    id ? getConversationById(id) : getConversationByMembers(members),
    (x) => x,
    A.chain((x) => {
      if (isLeft(x) && x.left instanceof EntityDoesNotExist) {
        return pipe(
          createConversation({ id, members, ...rest }),
          AE.chainW(getChannelById)
        )
      }
      return A.of(x)
    }),
    AE.mapLeft((x) => {
      if (x instanceof EntityDoesNotExist) {
        return new UnexpectedError(
          'in getOrCreateConversation at this point entity should exist'
        )
      }
      if (x instanceof ChannelAlreadyExists) {
        return new UnexpectedError(
          'in getOrCreateConversation at this point we should have returned ChannelIsNotConversation or create a channel'
        )
      }
      return x
    })
  )
}
