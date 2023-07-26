import { isoQuery, Query } from './query'
import { ActionEither } from '../ActionEither'
import { UnexpectedError } from '../errors'
import { fromAsync } from '../Action'
import { left, right } from 'fp-ts/Either'
import { getDocs as getDocsFb } from 'firebase/firestore'

export const getDocs = <T>(
  query: Query<T>
): ActionEither<UnexpectedError, T[]> =>
  fromAsync(async () => {
    try {
      const q = isoQuery<T>().unwrap(query)
      const snapshot = await getDocsFb(q)

      return right(snapshot.docs.map((x) => x.data() as unknown as T))
    } catch (e) {
      return left(new UnexpectedError(`querying failed'`, e))
    }
  })
