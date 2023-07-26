import { ComponentMeta } from '@storybook/react'
import { Spinner } from './index'

export default {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large', 'x-large'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Spinner>

export const Default = ({ size }: any) => <Spinner size={size} />

Default.args = {
  size: 'medium',
}
