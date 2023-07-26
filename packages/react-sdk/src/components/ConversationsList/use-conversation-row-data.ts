import {
  useRelativeTime,
  useTranslation,
} from '../../utils/intl/use-translation'
import { flow, pipe } from 'fp-ts/function'
import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/Option'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns'
import { messages } from '../../messages'
import * as RDU from '../../utils/remote-data-utils'
import { evolve } from 'fp-ts/struct'
import { ConversationRowProps } from './props'

export const useConversationRowData = ({
  lastMessage,
  avatarSrc,
  displayName,
}: Pick<ConversationRowProps, 'avatarSrc' | 'lastMessage' | 'displayName'>) => {
  const rt = useRelativeTime()
  const t = useTranslation()
  const displayTimeAgo = pipe(
    lastMessage,
    RD.map(
      flow(
        O.chain((x) => O.fromNullable(x.timestamp)),
        O.map((timestamp) => {
          const minutesDuration = differenceInMinutes(timestamp, new Date())
          return Math.abs(minutesDuration) >= 24 * 60
            ? rt(differenceInDays(timestamp, new Date()), 'days')
            : Math.abs(minutesDuration) >= 60
            ? rt(differenceInHours(timestamp, new Date()), 'hours')
            : Math.abs(minutesDuration) >= 3
            ? rt(minutesDuration, 'minutes')
            : t(messages['time.momentAgo'])
        }),
        O.getOrElse(() => '-')
      )
    )
  )

  const avatarData = pipe(
    RDU.Do,
    RDU.apS('avatar', avatarSrc),
    RDU.apS(
      'avatarName',
      pipe(
        displayName,
        RD.map((displayName) =>
          t(messages['conversations.avatar.alt'], {
            displayName: O.toUndefined(displayName),
          })
        )
      )
    ),
    RD.map((x) => x),
    RD.map(
      evolve({
        avatar: (x) => O.toUndefined(x),
        avatarName: (x) => x,
      })
    )
  )

  return { displayTimeAgo, avatarData }
}
