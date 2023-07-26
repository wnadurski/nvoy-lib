import { ComponentMeta } from '@storybook/react'
import styled from 'styled-components'
import { ConversationsList } from './ConversationsList'
import { subDays, subHours, subMinutes } from 'date-fns'
import { IntlProvider } from '../../utils/intl/IntlProvider'
import { useState } from 'react'
import * as RDO from '../../utils/remote-data-option'
import { pending } from '@devexperts/remote-data-ts'
import { ConversationRow } from './ConversationRow'
import { ConversationRowSmall } from './ConversationRowSmall'

export default {
  title: 'Components/ConversationsList',
  component: ConversationsList,
  subcomponents: { ConversationRow },
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof ConversationsList>

const Container = styled.div`
  max-width: 500px;
`

export const Default = ({ size }: any) => {
  const [active, setActive] = useState<number | undefined>()

  const Component = size === 'large' ? ConversationRow : ConversationRowSmall

  return (
    <IntlProvider>
      <Container>
        <ConversationsList>
          <Component
            active={active === 0}
            onClick={() => setActive(0)}
            avatarSrc={RDO.of(
              'https://i.pravatar.cc/150?u=jonbovi@pravatar.com'
            )}
            displayName={RDO.of('Jon Bovi')}
            lastMessage={RDO.of({
              content: "Hey 😊 When can we meet? I'd like to eat some ramen.",
              timestamp: subDays(new Date(), 3),
            })}
          />
          <Component
            active={active === 1}
            onClick={() => setActive(1)}
            avatarSrc={RDO.none}
            displayName={RDO.of('Smeagol Gollum')}
            lastMessage={RDO.of({
              content: '😊😊😊😊😊',
              timestamp: subMinutes(new Date(), 2),
            })}
          />
          <Component
            active={active === 2}
            onClick={() => setActive(2)}
            avatarSrc={RDO.of(
              'https://i.pravatar.cc/150?u=legolas@pravatar.com'
            )}
            displayName={RDO.of('Legolas Aragorn')}
            lastMessage={RDO.of({
              content: 'This post was awesome!',
              timestamp: subHours(new Date(), 12),
            })}
          />
          <Component
            active={active === 2}
            onClick={() => setActive(2)}
            avatarSrc={pending}
            displayName={pending}
            lastMessage={pending}
          />
          <Component
            active={active === 2}
            onClick={() => setActive(2)}
            avatarSrc={RDO.none}
            displayName={RDO.none}
            lastMessage={RDO.none}
          />
        </ConversationsList>
      </Container>
    </IntlProvider>
  )
}

Default.args = {
  size: 'large',
}
