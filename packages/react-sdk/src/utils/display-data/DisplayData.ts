import { O } from '../fp-ts-imports'
import { Monoid } from 'fp-ts/Monoid'
import { pipe } from 'fp-ts/function'

export interface DisplayData {
  displayName: O.Option<string>
  avatarSrc: O.Option<string>
}

export const emptyDisplayData: DisplayData = {
  displayName: O.none,
  avatarSrc: O.none,
}

export const DisplayDataOrMonoid: Monoid<DisplayData> = {
  empty: emptyDisplayData,
  concat: (a, b) => ({
    displayName: pipe(
      a.displayName,
      O.alt(() => b.displayName)
    ),
    avatarSrc: pipe(
      a.avatarSrc,
      O.alt(() => b.avatarSrc)
    ),
  }),
}
