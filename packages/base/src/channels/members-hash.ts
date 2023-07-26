import { iso, Newtype } from 'newtype-ts'
import { UserId } from '../users'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { sort, uniq } from 'fp-ts/Array'
import { UserIdEq, UserIdOrd } from '../users/types'

export type MembersHash = Newtype<
  { readonly MembersHash: unique symbol },
  string
>

const isoMembersHash = iso<MembersHash>()

export const createMembersHash = (
  members: UserId[]
): E.Either<Error, MembersHash> =>
  pipe(
    members,
    uniq(UserIdEq),
    (a) =>
      a.length < 2
        ? E.left(new Error('Must have at least 2 members'))
        : E.right(a),
    E.map(sort(UserIdOrd)),
    E.chain((x) => {
      try {
        return E.right(x.map(encodeURIComponent))
      } catch (e) {
        return E.left(new Error(`Could not encode ids: '${x.toString()}'`))
      }
    }),
    E.map((ids) => ids.join('/')),
    E.map(isoMembersHash.wrap)
  )
