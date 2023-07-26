import SpinnerSvg from './SpinnerSvg'
import styled from 'styled-components'
import clsx from 'clsx'
import { colors } from '../../theme/colors'

const Styled = styled(SpinnerSvg)`
  height: 28px;
  fill: ${colors.spinner};
  &.small {
    height: 16px;
  }

  &.large {
    height: 50px;
  }

  &.x-large {
    height: 80px;
  }
`

export interface Props {
  className?: string
  size?: 'small' | 'medium' | 'large' | 'x-large'
}

export const Spinner = ({ className, size = 'medium' }: Props) => (
  <Styled className={clsx(className, size)} />
)
