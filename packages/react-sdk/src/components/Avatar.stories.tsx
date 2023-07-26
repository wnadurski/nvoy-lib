import { ComponentMeta } from '@storybook/react'
import { Avatar } from './Avatar'

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Avatar>

export const Default = ({ size, name, src }: any) => (
  <Avatar src={src} name={name} size={size} />
)
Default.args = {
  size: 'medium',
  src: 'https://ui-avatars.com/api/?name=John+Doe',
  name: 'John Doe',
}
