import { ConversationRowProps } from './props'
import clsx from 'clsx'
import { useConversationRowData } from './use-conversation-row-data'
import { pipe } from 'fp-ts/lib/function'
import styled from 'styled-components'
import { RD } from '../../utils/fp-ts-imports'
import { Avatar, AvatarSkeleton } from '../Avatar'
import { Badge } from '../Badge'

const Container = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  width: max-content;

  transition: transform 0.08s ease-in;

  &.active {
    transform: scale(1.15);
  }
`

export const ConversationRowSmall = ({
  displayName,
  avatarSrc,
  lastMessage,
  active,
  onClick,
  unread,
}: ConversationRowProps) => {
  const { avatarData } = useConversationRowData({
    lastMessage,
    avatarSrc,
    displayName,
  })

  return (
    <Container
      className={clsx({ active, clickable: !!onClick })}
      onClick={onClick}
    >
      {pipe(
        avatarData,
        RD.fold3(
          () => <AvatarSkeleton />,
          () => <Avatar name={'Unknown'} />,
          ({ avatar, avatarName }) =>
            pipe(<Avatar name={avatarName} src={avatar} />, (element) =>
              unread ? (
                <Badge withBorder overlap={'circular'}>
                  {element}
                </Badge>
              ) : (
                element
              )
            )
        )
      )}
    </Container>
  )
}
