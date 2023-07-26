import { ReactElement } from 'react'
import styled from 'styled-components'
import { P } from './Typography'
import { spacing } from '../theme/spacing'

export const ViewStateTitle = styled(P)``
export const ViewStateHint = styled(P)``

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  ${ViewStateTitle} {
    font-size: large;
    font-weight: bold;
    margin-bottom: ${spacing.spacing16};
  }
`

interface Props {
  image: ReactElement
  title: ReactElement
  hint: ReactElement
}

export const ViewState = ({ image, title, hint }: Props) => (
  <Container>
    {image}
    {title}
    {hint}
  </Container>
)
