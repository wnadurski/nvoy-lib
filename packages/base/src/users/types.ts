import { Eq } from 'fp-ts/Eq'
import * as S from 'fp-ts/string'
import { Ord } from 'fp-ts/Ord'

export type UserId = string

export const UserIdEq: Eq<UserId> = S.Eq
export const UserIdOrd: Ord<UserId> = S.Ord

export type User = {
  id: UserId
  // displayName?: string
  // avatarSrc?: string
}

export type UserDraft = Pick<User, 'id'> & Partial<Omit<User, 'id'>>
