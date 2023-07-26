import { useEffect, useState } from 'react'
import { createEngine, Engine, InvalidApiKey } from '@nvoy/base'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

export const useEngine = (apiKey: string) => {
  const [e, setEngine] = useState<Engine | undefined>()
  const [error, setError] = useState<InvalidApiKey | undefined>()
  useEffect(() => {
    createEngine(apiKey).then((r) =>
      pipe(
        r,
        E.map((eng) => setEngine(eng)),
        E.mapLeft((err) => setError(err))
      )
    )
  }, [apiKey])

  return { run: e?.run, error }
}
