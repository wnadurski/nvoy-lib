import { FirestoreDataConverter } from 'firebase/firestore'
import { deserializePathComponent } from './no-sql/path'

export const idEntityConverter = <
  T extends { id: unknown }
>(): FirestoreDataConverter<T> => ({
  toFirestore: ({ id, ...rest }: T) => ({
    ...rest,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return { id: deserializePathComponent(snapshot.id), ...data } as T
  },
})
