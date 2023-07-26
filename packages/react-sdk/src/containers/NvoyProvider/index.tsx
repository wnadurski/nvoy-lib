import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useEngine } from '../../hooks/use-engine'
import { Runner, User } from '@nvoy/base'
import { EMPTY, Observable } from 'rxjs'
import { Messages } from '../../messages'
import { useCurrentUser } from '../../hooks/use-current-user'
import { IntlProvider } from '../../utils/intl/IntlProvider'

const defaultRun = () => EMPTY as Observable<any>

type ContextType = {
  run: Runner
  user?: User
}
const Context = createContext<ContextType>({ run: defaultRun })

interface Props {
  children: ReactNode
  apiKey: string
  locale?: string
  messages?: Messages
}

export const NvoyProvider = ({
  children,
  apiKey,
  locale = 'en-US',
  messages,
}: Props) => {
  const { run, error } = useEngine(apiKey)
  const user = useCurrentUser(run)

  useEffect(() => {
    if (error) {
      console.error(
        `Encountered error when trying to create NvoyProvider: '${error}'`
      )
    }
  }, [error])

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Context.Provider
        value={useMemo(
          () => ({ run: run ?? defaultRun, user: user ?? undefined }),
          [run, user]
        )}
      >
        {children}
      </Context.Provider>
    </IntlProvider>
  )
}

export const useRun = () => useContext(Context).run
export const useUser = () => useContext(Context).user
