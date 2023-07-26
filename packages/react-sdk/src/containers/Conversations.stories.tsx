import { ComponentMeta } from '@storybook/react'
import { Conversations, ConversationsContextProvider } from './Conversations'
import { NvoyProvider } from './NvoyProvider'
import styled from 'styled-components'
import { HookToChildren } from '../utils/HookToChildren'
import { useConversations } from '../hooks/use-conversations'

export default {
  title: 'Containers/Conversations',
  component: Conversations,
} as ComponentMeta<typeof Conversations>

const Container = styled.div`
  max-width: 500px;
`

const userIdToInfo = {
  user1: {
    displayName: 'Test User',
    avatarSrc: 'https://i.pravatar.cc/150?u=jonbovi@pravatar.com',
  },

  user2: {
    displayName: 'Test User',
    avatarSrc: 'https://i.pravatar.cc/150?u=legolas@pravatar.com',
  },
}

export const Default = () => {
  return (
    <NvoyProvider apiKey={'NAKeWeZ7'}>
      <HookToChildren hook={() => useConversations()}>
        {(conversations) => (
          <Container>
            <ConversationsContextProvider
              value={{
                getUserDetails: (x) => Promise.resolve(userIdToInfo[x]),
                onClickConversation: () => console.log('click'),
              }}
            >
              <Conversations conversations={conversations} />
            </ConversationsContextProvider>
          </Container>
        )}
      </HookToChildren>
    </NvoyProvider>
  )
}
