import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { fromAsync } from '../Action'
import { doc, setDoc as setDocFirestore } from 'firebase/firestore'
import { organizationPath } from '../organizations/path'
import { left, right } from 'fp-ts/Either'
import { DocPath, serializePathComponent } from './path'

export const setDoc: <T = unknown>(
  path: DocPath,
  newDoc: T,
  options?: {
    merge?: boolean
  }
) => ActionEither<UnexpectedError, void> = (path, newDoc, options) =>
  fromAsync(async ({ organization, db }) => {
    try {
      const d = doc(
        db,
        ...organizationPath(organization),
        ...path.map(serializePathComponent)
      )
      await setDocFirestore(d, newDoc, options as any)
      return right(undefined)
    } catch (e) {
      return left(
        new UnexpectedError(
          `setting doc to '${path.toString()}': '${JSON.stringify(newDoc)}'`,
          e
        )
      )
    }
  })
