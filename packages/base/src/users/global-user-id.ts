import { UserId } from './types'
import { Option, some, none } from 'fp-ts/Option'
import { fromBase64 } from '../utils/base64'

export const getLocalUserId = (globalId: string): Option<UserId> => {
  try {
    const [, , user] = globalId.split('.').map(fromBase64)

    return some(user)
  } catch (e) {
    return none
  }
}
