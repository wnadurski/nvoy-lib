import { UnexpectedError } from '../errors'

export class NotLoggedIn extends Error {
  constructor(action: string) {
    super(`Login required to do '${action}'`)
  }
}

export type AddMessageError = UnexpectedError | NotLoggedIn
