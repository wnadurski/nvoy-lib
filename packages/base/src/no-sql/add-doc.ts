import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { fromAsync } from '../Action'
import { addDoc as addDocFirestore, collection } from 'firebase/firestore'
import { organizationPath } from '../organizations/path'
import { left, right } from 'fp-ts/Either'
import { CollectionPath, serializePathComponent } from './path'

export const addDoc: <Id = string, T = any>(
  path: CollectionPath,
  doc: T
) => ActionEither<UnexpectedError, Id> = (path, doc) =>
  fromAsync(async ({ organization, db }) => {
    try {
      const col = collection(
        db,
        ...organizationPath(organization),
        ...path.map(serializePathComponent)
      )
      const docRef = await addDocFirestore(col, doc)
      return right(docRef.id as any)
    } catch (e) {
      return left(
        new UnexpectedError(`When adding doc to ${path.toString()}, ${doc}`, e)
      )
    }
  })
