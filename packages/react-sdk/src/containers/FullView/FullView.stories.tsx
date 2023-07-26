import { ComponentMeta } from '@storybook/react'
import { NvoyProvider } from '../NvoyProvider'
import styled from 'styled-components'
import {
  FullView,
  pickConversation,
  pickOrCreateConversation,
} from './FullView'
import { ComponentsProvider } from '../Components/ComponentsProvider'
import { DefaultComponents } from '../Components/default-components'
import { ChatTopBarProps } from '../../components/ChatTopBar'
import { pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'

export default {
  title: 'Containers/FullView',
  component: FullView,
  argTypes: {
    id: {
      table: { category: 'Start at conversation' },
      control: { type: 'text' },
    },
    userId: {
      table: { category: 'Start at conversation' },
      control: { type: 'text' },
    },
    displayName: {
      table: { category: 'Start at conversation' },
      control: { type: 'text' },
    },
    type: {
      table: { category: 'Start at conversation' },
      options: ['pick or create', 'pick'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof FullView>

const Container = styled.div`
  max-width: 1500px;
  height: 800px;
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

interface Args {
  id?: string
  type?: 'pick' | 'pick or create'
  userId?: string
  displayName?: string
}

export const Default = ({ id, type, userId, displayName }: Args) => (
  <NvoyProvider apiKey={'NAKeWeZ7'}>
    <Container>
      <FullView
        startAtConversation={
          !type
            ? undefined
            : type === 'pick'
            ? id
              ? pickConversation({ id })
              : undefined
            : userId
            ? pickOrCreateConversation({ id, userId, displayName })
            : undefined
        }
        getUserDetails={(x) => Promise.resolve(userIdToInfo[x])}
      />
    </Container>
  </NvoyProvider>
)
//
// Default.args = {
//   startAtConversationId: undefined,
// }

const ChatViewContainer = ({ children }: any) => {
  const Component = DefaultComponents.ChatViewContainer
  return <Component>{children}asd</Component>
}

export const WithOverridenChatViewContainer = () => (
  <NvoyProvider apiKey={'NAKeWeZ7'}>
    <ComponentsProvider value={{ ChatViewContainer }}>
      <Container>
        <FullView getUserDetails={(x) => Promise.resolve(userIdToInfo[x])} />
      </Container>
    </ComponentsProvider>
  </NvoyProvider>
)

const ChatTopBar = ({ recipients, ...props }: ChatTopBarProps) => {
  return (
    <DefaultComponents.ChatTopBar
      {...props}
      displayName={pipe(
        recipients[0].displayName,
        getOrElse(() => props.displayName)
      )}
      avatarSrc={pipe(
        recipients[0].avatarSrc,
        getOrElse(() => props.avatarSrc)
      )}
      recipients={recipients}
    />
  )
}

export const WithDisplayingRecipientInTopBar = () => (
  <NvoyProvider apiKey={'NAKeWeZ7'}>
    <ComponentsProvider value={{ ChatTopBar }}>
      <Container>
        <FullView getUserDetails={(x) => Promise.resolve(userIdToInfo[x])} />
      </Container>
    </ComponentsProvider>
  </NvoyProvider>
)
