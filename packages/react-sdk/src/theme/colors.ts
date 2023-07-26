import * as R from 'fp-ts/Record'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import { css } from 'styled-components'

const black = '#3D3E40'
const gray = '#e4e6eb'
const darkGray = '#a6a7ab'
const blue = 'rgb(0, 132, 255)'
const white = '#ffffff'

export const rawColors = {
  gray,
  black,
  blue,
  white,
  text: black,
  incomingMessageBackground: gray,
  outgoingMessageBackground: blue,
  outgoingMessageColor: white,
  avatarPlaceholderStroke: white,
  avatarPlaceholderBackground: '#DADEE6',
  avatarShadow: 'rgba(218, 222, 230, 0.44)',

  textareaBorder: darkGray,
  textareaBorderFocus: blue,

  sendButton: blue,
  sendButtonHover: blue,
  sendButtonBackgroundHover: 'rgba(0,0,0,0.04)',
  sendButtonActive: 'rgb(71,167,255)',
  sendButtonBackgroundActive: 'rgba(0,0,0,0.02)',

  conversationBackground: '#f2f7ff',
  conversationHoverBackground: '#f7faff',
  conversationActiveBackground: '#deebff',
  conversationActiveHoverBackground: '#e6f0ff',

  spinner: 'rgb(71,167,255)',

  chatTopBarSeparator: 'rgba(61,62,64,0.07)',
  badgeDefaultColor: 'rgb(25, 118, 210)',
}

const toVariableName = (color: string) => `${color}-color`

export const colors = pipe(
  rawColors,
  R.mapWithIndex(
    (key, color) => `var(--${toVariableName(key)}, ${color})` as const
  )
)

export const colorsCss = css`
  ${pipe(
    rawColors,
    Object.entries,
    A.map(([color, hex]) => `--${toVariableName(color)}: ${hex};`),
    (strings) => strings.join('\n')
  )}
`
