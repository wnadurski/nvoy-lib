import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import {
  collection,
  Firestore,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { idEntityConverter } from '../converters'
import * as E from 'fp-ts/Either'
import { InvalidApiKey } from '../errors'
import { Organization } from './types'
import { fromFunction } from '../utils/task'

export const getOrganization: (
  db: Firestore,
  apiKey: string
) => TaskEither<InvalidApiKey | Error, Organization> = (db, apiKey) =>
  pipe(
    query(
      collection(db, 'organizations').withConverter(
        idEntityConverter<Organization>()
      ),
      where('apiKey', '==', apiKey),
      limit(1)
    ),
    fromFunction(getDocs),
    (f) => TE.tryCatch(f, E.toError),
    TE.chainEitherKW((snapshot) => {
      if (snapshot.empty) {
        return E.left(new InvalidApiKey())
      } else {
        return E.right(snapshot.docs[0].data())
      }
    })
  )
