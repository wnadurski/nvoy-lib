import {
  signInWithCustomToken,
  signOut as signOutFirebase,
} from 'firebase/auth'
import { Either, left, right } from 'fp-ts/Either'
import { UnexpectedError } from '../errors'
import { ActionEither } from '../ActionEither'
import { fromAsync } from '../Action'

export class SignInError extends Error {
  constructor() {
    super('Invalid auth token')
  }
}

export const signInUser: (token: string) => ActionEither<SignInError, void> = (
  token: string
) =>
  fromAsync(async ({ auth }): Promise<Either<SignInError, void>> => {
    try {
      await signInWithCustomToken(auth, token)
      return right(undefined)
    } catch (e) {
      return left(new SignInError())
    }
  })

export const signOutUser: ActionEither<UnexpectedError, void> = fromAsync(
  async ({ auth }) => {
    try {
      await signOutFirebase(auth)
      return right(undefined)
    } catch (e) {
      return left(new UnexpectedError('Could not sign out the user'))
    }
  }
)
