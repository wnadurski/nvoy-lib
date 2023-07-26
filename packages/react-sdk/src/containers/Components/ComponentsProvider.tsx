import { createContext, ReactNode, useContext, useMemo } from 'react'
import { DefaultComponents } from './default-components'
import { Components } from './types'

const ComponentsContext = createContext<Components>(DefaultComponents)

export interface ComponentsProviderProps {
  value?: Partial<Components>
  children: ReactNode
}

export const ComponentsProvider = ({
  value = {},
  children,
}: ComponentsProviderProps) => {
  const higherContext = useContext(ComponentsContext)

  const mergedContext = useMemo(
    () => ({ ...DefaultComponents, ...higherContext, ...value }),
    [value, higherContext]
  )

  return (
    <ComponentsContext.Provider value={mergedContext}>
      {children}
    </ComponentsContext.Provider>
  )
}

export const useComponent = <Name extends keyof Components>(
  name: Name
): Components[Name] => useContext(ComponentsContext)[name]
