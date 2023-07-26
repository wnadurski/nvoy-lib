import styled from 'styled-components'
import { fontCss } from './Typography'
import { colors } from '../theme/colors'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from '../utils/intl/use-translation'
import { messages } from '../messages'
import { spacing } from '../theme/spacing'

const Container = styled.section`
  ${fontCss};
  margin: 0;
  max-width: unset;
  padding: ${spacing.spacing4} 0;

  display: flex;

  &.out {
    justify-content: flex-end;
  }
`

const Bubble = styled.p`
  margin: 0;
  display: inline-block;
  padding: 12px 16px;
  border-radius: 20px;
  max-width: 80%;
  word-break: break-all;

  &.in {
    background-color: ${colors.incomingMessageBackground};
  }

  &.out {
    color: ${colors.outgoingMessageColor};
    background-color: ${colors.outgoingMessageBackground};
  }
`

export interface MessageProps {
  children: ReactNode
  sender: string
  direction: 'in' | 'out'
  className?: string
}

export const Message = ({
  children,
  sender,
  direction,
  className,
}: MessageProps) => {
  const t = useTranslation()

  return (
    <Container
      className={clsx(direction, className)}
      aria-label={t(messages['message.container.label'], {
        displayName: sender,
      })}
    >
      <Bubble className={clsx(direction)}>{children}</Bubble>
    </Container>
  )
}
