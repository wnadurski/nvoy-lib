import styled from 'styled-components'
import { spacing } from '../../theme/spacing'
import { colors } from '../../theme/colors'
import { ConversationRowProps } from './props'
import { useConversationRowData } from './use-conversation-row-data'
import clsx from 'clsx'
import { flow, pipe } from 'fp-ts/function'
import * as RD from '@devexperts/remote-data-ts'
import * as RDU from '../../utils/remote-data-utils'
import * as O from 'fp-ts/Option'
import { Skeleton } from '../Skeleton'
import { P } from '../Typography'
import { Avatar, AvatarSkeleton } from '../Avatar'
import { Badge } from '../Badge'

const DisplayName = styled(P)`
  margin-top: var(--text-border-spacing);
  grid-area: name;
`
const RowStyled = styled.button`
  border: none;
  text-align: left;
  --text-border-spacing: ${spacing.spacing4};
  background-color: ${colors.conversationBackground};
  padding: ${spacing.spacing12};
  border-radius: 8px;

  display: grid;
  grid-template:
    'avatar name    time' auto
    'avatar message message' auto / auto 1fr auto;

  grid-gap: ${spacing.spacing4};

  transition: background-color 0.1s ease-in-out, transform 0.1s ease-in-out,
    box-shadow 0.1s ease-in-out;

  &.clickable {
    cursor: pointer;
  }

  &.clickable:hover {
    background-color: ${colors.conversationHoverBackground};
  }

  &.active {
    background-color: ${colors.conversationActiveBackground};
    transform: translate(10px, 2px);
    box-shadow: rgba(0, 0, 0, 0.11) -2px -2px 6px,
      rgba(0, 0, 0, 0.05) -1px -1px 2px;
  }

  &.active:hover {
    background-color: ${colors.conversationActiveHoverBackground};
  }

  &.unread {
    font-weight: 500;
  }
  &.unread ${DisplayName} strong {
    font-weight: bold;
  }
`
const AvatarContainer = styled.div`
  grid-area: avatar;
  margin-right: ${spacing.spacing8};
`

const StyledAvatarSkeleton = styled(AvatarSkeleton)`
  grid-area: avatar;
  margin-right: ${spacing.spacing8};
`
const LastMessage = styled(P)`
  grid-area: message;
  margin-bottom: var(--text-border-spacing);
  margin-right: 20px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.5;
`
const LastMessageDate = styled(P)`
  grid-area: time;
  margin-top: var(--text-border-spacing);
  margin-right: var(--text-border-spacing);
  opacity: 0.5;
`
export const ConversationRow = ({
  displayName,
  avatarSrc,
  lastMessage,
  active,
  onClick,
  unread,
}: ConversationRowProps) => {
  const { avatarData, displayTimeAgo } = useConversationRowData({
    lastMessage,
    avatarSrc,
    displayName,
  })

  return (
    <RowStyled
      className={clsx({ active, clickable: !!onClick, unread })}
      onClick={onClick}
    >
      {pipe(
        avatarData,
        RD.map(({ avatarName, avatar }) => (
          <Avatar size={'large'} src={avatar} name={avatarName} />
        )),
        RD.map((element) =>
          unread ? (
            <Badge withBorder overlap={'circular'}>
              {element}
            </Badge>
          ) : (
            element
          )
        ),
        RD.map((element) => <AvatarContainer>{element}</AvatarContainer>),
        RDU.getOrElseW(() => <StyledAvatarSkeleton size={'large'} />)
      )}

      <DisplayName>
        <strong>
          {pipe(
            displayName,
            RDU.getOrElseW(() => O.some(<Skeleton width={160} />)),
            O.getOrElseW(() => '-')
          )}
        </strong>
      </DisplayName>
      <LastMessageDate>
        {pipe(
          displayTimeAgo,
          RDU.getOrElseW(() => <Skeleton width={75} />)
        )}
      </LastMessageDate>
      <LastMessage>
        {pipe(
          lastMessage,
          RD.map(
            flow(
              O.map((x) => x.content),
              O.getOrElse(() => '-')
            )
          ),
          RDU.getOrElseW(() => <Skeleton width={200} />)
        )}
      </LastMessage>
    </RowStyled>
  )
}
