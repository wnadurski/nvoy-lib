import { ActionEither } from '../ActionEither'
import { EntityDoesNotExist, UnexpectedError } from '../errors'
import { fromAsync } from '../Action'
import {
  doc,
  FirestoreDataConverter,
  getDoc as getDocFb,
} from 'firebase/firestore'
import { organizationPath } from '../organizations/path'
import { idEntityConverter } from '../converters'
import * as E from 'fp-ts/Either'
import { DocPath, serializePathComponent } from './path'

export const getDoc = <T extends { id: unknown }>(
  path: DocPath,
  converter: FirestoreDataConverter<T> = idEntityConverter<T>()
): ActionEither<UnexpectedError | EntityDoesNotExist, T> =>
  fromAsync(async ({ organization, db }) => {
    try {
      const d = doc(
        db,
        ...organizationPath(organization),
        ...path.map(serializePathComponent)
      ).withConverter(converter)
      const snapshot = await getDocFb(d)

      if (snapshot.exists()) {
        return E.right(snapshot.data())
      }
      return E.left(
        new EntityDoesNotExist(`Document '${path.join('/')}' doesn't exist`)
      )
    } catch (e) {
      return E.left(new UnexpectedError(`querying '${path.toString()}'`, e))
    }
  })
