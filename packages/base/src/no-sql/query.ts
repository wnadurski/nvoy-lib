import { Action, asks } from '../Action'
import {
  collection,
  FirestoreDataConverter,
  query as queryFirebase,
  Query as QueryFb,
} from 'firebase/firestore'
import { organizationPath } from '../organizations/path'
import { QueryConstraint } from '@firebase/firestore'
import { idEntityConverter } from '../converters'
import { CollectionPath, serializePathComponent } from './path'
import { iso, Newtype } from 'newtype-ts'

export type Query<T = unknown> = Newtype<
  { readonly Query: unique symbol },
  QueryFb<T>
>

export const isoQuery = <T>() => iso<Query<T>>()

export const query = <T extends { id: string }>(
  path: CollectionPath,
  queryConstraints: QueryConstraint[] = [],
  converter: FirestoreDataConverter<T> = idEntityConverter<T>()
): Action<Query<T>> =>
  asks(({ organization, db }) => {
    const col = collection(
      db,
      ...organizationPath(organization),
      ...path.map(serializePathComponent)
    ).withConverter(converter)
    const q = queryFirebase(col, ...queryConstraints)
    return isoQuery<T>().wrap(q)
  })
