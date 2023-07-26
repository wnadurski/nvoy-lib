import { t } from './fp-ts-imports'

const TimestampShape = t.type({ seconds: t.number })
type TimestampShapeT = t.TypeOf<typeof TimestampShape>

export const DateFromShape = new t.Type<Date, TimestampShapeT, TimestampShapeT>(
  'DateFromShape',
  (d): d is Date => d instanceof Date,
  (u) => t.success(new Date(u.seconds * 1000)),
  (u) => ({ seconds: Math.floor(u.valueOf() / 1000) })
)

export const DateFromFirebase = TimestampShape.pipe(DateFromShape)
