import { ComponentMeta } from '@storybook/react'
import { ChatView } from './ChatView'
import { IntlProvider } from 'react-intl'
import styled from 'styled-components'
import { useState } from 'react'
import { of } from 'rxjs'

export default {
  title: 'Components/ChatView',
  component: ChatView,
} as ComponentMeta<typeof ChatView>

const Container = styled.div`
  max-width: 500px;
  height: 400px;
`
let id = 100

export const Default = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      message: 'Hello! Nice to meet you',
      direction: 'in' as const,
      sender: 'Aragorn Ludwik',
    },
    {
      id: '2',
      message: 'How are you?❓🤔',
      direction: 'in' as const,
      sender: 'Aragorn Ludwik',
    },
    {
      id: '3',
      message: "I'm fine 🤯",
      direction: 'out' as const,
      sender: 'Legolas',
    },
    { id: '4', message: 'u?', direction: 'out' as const, sender: 'Legolas' },
    {
      id: '5',
      message: '👌',
      direction: 'in' as const,
      sender: 'Aragorn Ludwik',
    },
  ])
  return (
    <IntlProvider locale={'en'} defaultLocale={'en'}>
      <Container>
        <ChatView
          messages={messages}
          onSendMessage={(message) => {
            console.log(`Sending: ${message}`)
            setMessages((prev) => [
              ...prev,
              {
                id: (id++).toString(),
                message,
                direction: 'out' as const,
                sender: 'Legolas',
              },
            ])
            return of({ ok: true })
          }}
        />
      </Container>
    </IntlProvider>
  )
}
