import { Observable } from 'rxjs'
import { onAuthStateChanged } from 'firebase/auth'
import { User } from './types'
import * as A from '../Action'
import { Action } from '../Action'
import { getLocalUserId } from './global-user-id'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { getOrCreate } from './get-or-create'

export const currentUser$: Action<O.Option<User>> = (env) => {
  const { auth } = env
  return new Observable((subscriber) => {
    onAuthStateChanged(auth, (user) => {
      pipe(
        user?.uid,
        O.fromNullable,
        O.chain(getLocalUserId),
        O.map((id) => ({ id })),
        O.map((user) => pipe(user, getOrCreate, A.map(O.fromEither))),
        O.fold(
          () => {
            subscriber.next(O.none)
          },
          (action) => {
            action(env).subscribe((x) => {
              subscriber.next(x)
            })
          }
        )
      )
    })
  })
}
