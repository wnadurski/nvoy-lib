import { isoQuery, Query } from './query'
import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'
import { Observable } from 'rxjs'
import { pipe } from 'fp-ts/function'
import { onSnapshot as onSnapshotFb } from 'firebase/firestore'
import { A } from '../utils/fp-ts-imports'

export const onSnapshot =
  (options?: { allowPendingWrites?: boolean }) =>
  <T>(query: Query<T>): ActionEither<UnexpectedError, T[]> =>
    pipe(
      new Observable<Either<UnexpectedError, T[]>>((subscriber) => {
        return onSnapshotFb(
          isoQuery<T>().unwrap(query),
          (snapshot) => {
            const value = E.right(snapshot.docs.map((x) => x.data()))

            if (
              snapshot.metadata.hasPendingWrites &&
              (options?.allowPendingWrites ?? true)
            ) {
              subscriber.next(value)
            } else if (!snapshot.metadata.hasPendingWrites) {
              subscriber.next(value)
            }
          },
          (e) => {
            subscriber.next(E.left(new UnexpectedError('onSnapshot', e)))
            subscriber.complete()
          },
          () => subscriber.complete()
        )
      }),
      A.fromObservable
    )
