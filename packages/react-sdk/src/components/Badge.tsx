import { ReactNode } from 'react'
import styled from 'styled-components'
import { P } from './Typography'
import { colors } from '../theme/colors'
import clsx from 'clsx'

const Container = styled.div`
  position: relative;
  display: inline-flex;
`
const InternalBadge = styled(P).attrs({ as: 'div' })`
  --offset: 3px;
  --top-pos: var(--offset);
  --right-pos: var(--offset);
  --size: 10px;
  position: absolute;
  transform: scale(1) translate(50%, -50%);
  transform-origin: 100% 0%;
  top: var(--offset);
  right: var(--offset);

  box-sizing: content-box;
  width: var(--size);
  height: var(--size);
  border-radius: 18px;
  display: inline-block;
  background-color: ${colors.badgeDefaultColor};
  padding: 2px;
  //box-sizing: border-box;

  &.circular {
    --offset: 14%;
  }

  &.withContent {
    min-width: var(--size);
    width: auto;
    padding: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  color: white;
  font-size: 0.7em;

  &.withBorder {
    border: 2px solid white;
  }
`

export interface BadgeProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  content?: ReactNode
  overlap?: 'circular' | 'rectangular'
  withBorder?: boolean
}

export const Badge = ({
  children,
  className,
  containerClassName,
  content,
  overlap = 'rectangular',
  withBorder,
}: BadgeProps) => {
  return (
    <Container className={containerClassName}>
      {children}
      <InternalBadge
        className={clsx(
          className,
          { withContent: !!content, withBorder },
          overlap
        )}
      >
        {content}
      </InternalBadge>
    </Container>
  )
}
