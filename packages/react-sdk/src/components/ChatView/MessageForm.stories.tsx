import { ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { IntlProvider } from 'react-intl'
import {
  ChatViewMessageForm as MessageFormC,
  MessageInput as MessageInputC,
  SendButton as SendButtonC,
} from './ChatViewMessageForm'
import { of } from 'rxjs'

export default {
  title: 'Components/TextInput',
  component: MessageFormC,
  subcomponents: { SendButton: SendButtonC, MessageInput: MessageInputC },
} as ComponentMeta<typeof MessageFormC>

const Container = styled.div`
  max-width: 500px;
`

export const Default = () => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Container>
      <MessageFormC
        onSubmit={() => {
          return of({ ok: true })
        }}
      />
    </Container>
  </IntlProvider>
)

export const SendButton = () => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Container>
      <SendButtonC />
    </Container>
  </IntlProvider>
)

export const MessageInput = () => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Container>
      <MessageInputC />
    </Container>
  </IntlProvider>
)
