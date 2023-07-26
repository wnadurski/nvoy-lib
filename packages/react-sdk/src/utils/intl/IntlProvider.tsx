import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createIntl, createIntlCache } from 'react-intl'

const cache = createIntlCache()
const defaultConfig = {
  defaultLocale: 'en-US',
  locale: 'en-US',
}
const defaultIntl = createIntl(defaultConfig, cache)

const Context = createContext(defaultIntl)

export interface IntlConfig {
  locale?: string
  messages?: Record<string, string>
}

export interface IntlProviderProps extends IntlConfig {
  children: ReactNode
}

const getIntl = ({ locale, messages }: IntlConfig) => {
  if (locale !== defaultConfig.locale || messages) {
    return createIntl(
      {
        locale: locale ?? defaultConfig.locale,
        defaultLocale: defaultConfig.defaultLocale,
        messages,
      },
      cache
    )
  }

  return defaultIntl
}

export const IntlProvider = ({
  locale,
  messages,
  children,
}: IntlProviderProps) => {
  const [intl, setIntl] = useState(getIntl({ locale, messages }))

  useEffect(() => {
    setIntl(getIntl({ locale, messages }))
  }, [locale, messages])

  return <Context.Provider value={intl}>{children}</Context.Provider>
}

export const useIntl = () => useContext(Context)
