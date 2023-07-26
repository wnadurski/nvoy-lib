import styled, { css } from 'styled-components'
import { colors } from '../theme/colors'

export const fontCss = css`
  font-size: 1rem;
  font-family: Roboto, sans-serif;
  color: ${colors.text};
  letter-spacing: 0;

  & strong {
    font-weight: 400;
  }
`

export const P = styled.p`
  margin: 0;
  ${fontCss}
`
