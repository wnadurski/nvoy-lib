import { User } from './types'
import { pipe } from 'fp-ts/function'
import { getUserById } from './get-user'
import { EntityDoesNotExist, UnexpectedError } from '../errors'
import { createUser, updateUser } from './create-user'
import * as AE from '../ActionEither'
import * as A from '../Action'
import { isLeft } from 'fp-ts/Either'

export const getOrCreate = (
  user: User
): AE.ActionEither<UnexpectedError, User> =>
  pipe(
    getUserById(user.id),
    A.chain((x) => {
      if (isLeft(x) && x.left instanceof EntityDoesNotExist) {
        return createUser(user)
      }
      return updateUser(user)
    }),
    AE.chain(() => getUserById(user.id)),
    AE.mapLeft((x) => {
      if (x instanceof EntityDoesNotExist) {
        return new UnexpectedError(
          `creating user with id '${user.id}' in getOrCreate`
        )
      }
      return x
    })
  )
