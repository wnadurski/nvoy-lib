import { RemoteDataOption } from '../../utils/remote-data-option'

export interface ConversationRowProps {
  unread?: boolean
  active?: boolean
  onClick?: () => void
  className?: string
  displayName: RemoteDataOption<unknown, string>
  avatarSrc: RemoteDataOption<unknown, string>
  lastMessage: RemoteDataOption<
    unknown,
    {
      content: string
      timestamp?: Date
    }
  >
}
