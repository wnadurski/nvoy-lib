import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Record'

export const rawSpacing = {
  spacing2: 2,
  spacing4: 4,
  spacing8: 8,
  spacing12: 12,
  spacing16: 16,
  spacing24: 24,
}

const toVariableName = (spacing: string) => `${spacing}-spacing`
const toValue = (spacing: number) => `${spacing}px`

export const spacing = pipe(
  rawSpacing,
  R.mapWithIndex(
    (key, spacing) =>
      `var(--${toVariableName(key)}, ${toValue(spacing)})` as const
  )
)
