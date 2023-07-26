import { User, UserDraft } from './types'
import { serverTimestamp } from 'firebase/firestore'
import { relUserPath } from './path'
import { UnexpectedError } from '../errors'
import { Action } from '../Action'
import { Either } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { setDoc } from '../no-sql/set-doc'

export const createUser: (
  user: User
) => Action<Either<UnexpectedError, void>> = (user: User) =>
  updateUserInternal(user, true)

export const updateUser = (user: UserDraft) => updateUserInternal(user, false)

const updateUserInternal: (
  user: UserDraft,
  create?: boolean
) => Action<Either<UnexpectedError, void>> = ({ id, ...user }, create) =>
  pipe(
    { ...user, ...(create ? { createdAt: serverTimestamp() } : {}) },
    (user) => setDoc(relUserPath(id), user, { merge: !create })
  )
