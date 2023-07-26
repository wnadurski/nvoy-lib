import { Either } from 'fp-ts/Either'
import { Observable } from 'rxjs'
import { Action } from './Action'
import { InitializationError } from './errors'
import { initializeApp } from 'firebase/app'
import { getFirebaseConfig } from './get-firebase-config'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { pipe } from 'fp-ts/function'
import { getOrganization } from './organizations/get-organization'
import * as TE from 'fp-ts/TaskEither'
import { getAuth } from 'firebase/auth'
import { sequenceS } from 'fp-ts/Apply'

export type Runner = <A>(m: Action<A>) => Observable<A>

export type Engine = {
  run: Runner
}
export const createEngine = (
  apiKey: string
): Promise<Either<InitializationError, Engine>> => {
  // Initialize Firebase
  const app = initializeApp(getFirebaseConfig())
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const analytics = getAnalytics(app)
  const db = getFirestore(app)
  const auth = getAuth(app)
  return pipe(
    {
      organization: getOrganization(db, apiKey),
      db: TE.of(db),
      auth: TE.of(auth),
    },
    sequenceS(TE.ApplyPar),
    TE.map((params): Engine => {
      return {
        run: (action) => action(params),
      }
    })
  )()
}
