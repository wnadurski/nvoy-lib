import styled from 'styled-components'
import { spacing } from '../../theme/spacing'
import { fontCss } from '../Typography'

export const ConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.spacing8};

  padding: ${spacing.spacing12};

  ${fontCss};

  overflow-y: auto;
  max-height: 100%;

  &.small {
    padding: ${spacing.spacing4};
  }
`
