import { User, UserId } from './types'
import { Action } from '../Action'
import { relUserPath } from './path'
import { Either } from 'fp-ts/Either'
import { EntityDoesNotExist, UnexpectedError } from '../errors'
import { getDoc } from '../no-sql/get-doc'

export const getUserById = (
  id: UserId
): Action<Either<UnexpectedError | EntityDoesNotExist, User>> =>
  getDoc(relUserPath(id))
