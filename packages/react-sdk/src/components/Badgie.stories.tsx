import { ComponentMeta } from '@storybook/react'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

export default {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {},
} as ComponentMeta<typeof Badge>

export const Default = () => (
  <div style={{ display: 'flex', gap: '12px' }}>
    <Badge content={'2'} overlap={'circular'}>
      <Avatar name={'asd'} />
    </Badge>{' '}
    <Badge withBorder content={'2'} overlap={'circular'}>
      <Avatar name={'asd'} />
    </Badge>
    <Badge overlap={'circular'}>
      <Avatar name={'asd'} />
    </Badge>
    <Badge overlap={'circular'} withBorder>
      <Avatar name={'asd'} />
    </Badge>
    <Badge content={'99+'} overlap={'circular'}>
      <Avatar name={'asd'} />
    </Badge>
    <Badge>
      <div style={{ width: '42px', height: '42px', backgroundColor: 'gray' }} />
    </Badge>
    <Badge content={'99+'}>
      <div style={{ width: '42px', height: '42px', backgroundColor: 'gray' }} />
    </Badge>
  </div>
)
