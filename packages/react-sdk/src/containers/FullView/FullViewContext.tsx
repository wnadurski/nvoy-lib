import { createContext, ReactNode, useContext } from 'react'
import * as O from 'fp-ts/Option'
import { ConversationsContextProvider, UserInfo } from '../Conversations'
import { ChannelId, Conversation, UserId } from '@nvoy/base'

export interface FullViewContext {
  activeConversation?: Conversation<unknown>
}

const FullViewContext = createContext<FullViewContext>({})

export interface FullViewContextProviderProps {
  children: ReactNode
  activeConversation: O.Option<Conversation>
  activeChannelId: O.Option<ChannelId>
  getUserDetails: (id: UserId) => Promise<UserInfo | undefined>
  onClickConversation: (id: ChannelId) => void
}

export const FullViewContextProvider = ({
  children,
  getUserDetails,
  onClickConversation,
  activeConversation,
  activeChannelId,
}: FullViewContextProviderProps) => {
  return (
    <ConversationsContextProvider
      value={{
        getUserDetails,
        onClickConversation,
        activeChannelId: O.toUndefined(activeChannelId),
      }}
    >
      <FullViewContext.Provider
        value={{ activeConversation: O.toUndefined(activeConversation) }}
      >
        {children}
      </FullViewContext.Provider>
    </ConversationsContextProvider>
  )
}

export const useFullViewContext = () => useContext(FullViewContext)
