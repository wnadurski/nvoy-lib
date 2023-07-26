import { DocPath, serializePathComponent } from './path'
import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { fromAsync } from '../Action'
import { doc, updateDoc as updateDocFb } from 'firebase/firestore'
import { organizationPath } from '../organizations/path'
import { left, right } from 'fp-ts/Either'

export const updateDoc: <T>(
  path: DocPath,
  document: T
) => ActionEither<UnexpectedError, void> = (path, document) =>
  fromAsync(async ({ organization, db }) => {
    try {
      const d = doc(
        db,
        ...organizationPath(organization),
        ...path.map(serializePathComponent)
      )
      await updateDocFb(d, document)
      return right(undefined)
    } catch (e) {
      return left(
        new UnexpectedError(
          `updating doc '${path.toString()}' to: '${JSON.stringify(document)}'`,
          e
        )
      )
    }
  })
