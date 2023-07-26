import { Avatar } from './Avatar'
import { P } from './Typography'
import styled from 'styled-components'
import { spacing } from '../theme/spacing'
import { colors } from '../theme/colors'
import { DisplayData } from '../utils/display-data/DisplayData'

const Container = styled.div`
  width: 100%;
  padding: ${spacing.spacing16};

  .person {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${spacing.spacing16};
  }

  hr {
    margin-top: ${spacing.spacing16};
    margin-left: ${spacing.spacing8};
    margin-right: ${spacing.spacing8};

    border-color: ${colors.chatTopBarSeparator};
    border-bottom: none;
    border-right: none;
    border-left: none;
  }
`

export interface ChatTopBarProps {
  avatarSrc?: string
  displayName: string
  recipients: DisplayData[]
}

export const ChatTopBar = ({ avatarSrc, displayName }: ChatTopBarProps) => {
  return (
    <Container>
      <div className={'person'}>
        <Avatar name={displayName} src={avatarSrc} />
        <P>
          <strong>{displayName}</strong>
        </P>
      </div>
      <hr />
    </Container>
  )
}
