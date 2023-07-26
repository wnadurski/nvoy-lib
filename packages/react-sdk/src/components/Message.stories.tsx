import { ComponentMeta } from '@storybook/react'
import { Message } from './Message'

export default {
  title: 'Components/Message',
  component: Message,
} as ComponentMeta<typeof Message>

export const Incoming = () => (
  <Message sender={'John'} direction={'in'}>
    Hello there
  </Message>
)

export const Outgoing = () => (
  <Message sender={'John'} direction={'out'}>
    Hello there
  </Message>
)
