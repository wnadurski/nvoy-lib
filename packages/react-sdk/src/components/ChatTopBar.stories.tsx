import { ChatTopBar } from './ChatTopBar'
import { ComponentMeta } from '@storybook/react'
import { O } from '../utils/fp-ts-imports'

export default {
  title: 'Components/ChatTopBar',
  component: ChatTopBar,
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof ChatTopBar>

export const Default = () => {
  return (
    <ChatTopBar
      avatarSrc={'https://i.pravatar.cc/150?u=jonbovi@pravatar.com'}
      displayName={'Jon Bovi'}
      recipients={[
        {
          displayName: O.some('Jon Bovi'),
          avatarSrc: O.some('https://i.pravatar.cc/150?u=jonbovi@pravatar.com'),
        },
      ]}
    />
  )
}
