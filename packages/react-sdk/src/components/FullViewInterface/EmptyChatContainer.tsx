import SvgNoConversations from './NoConversations'
import { ViewState, ViewStateHint, ViewStateTitle } from '../ViewState'
import { messages } from '../../messages'
import { useTranslation } from '../../utils/intl/use-translation'

interface Props {
  hasConversations: boolean
}

export const EmptyChatContainer = ({ hasConversations }: Props) => {
  const t = useTranslation()
  return (
    <ViewState
      image={<SvgNoConversations />}
      title={
        <ViewStateTitle>
          {hasConversations
            ? t(messages['fullView.chat.empty.pickConversation.title'])
            : t(messages['fullView.chat.empty.noConversations.title'])}
        </ViewStateTitle>
      }
      hint={
        <ViewStateHint>
          {hasConversations
            ? t(messages['fullView.chat.empty.pickConversation.hint'])
            : t(messages['fullView.chat.empty.noConversations.hint'])}
        </ViewStateHint>
      }
    />
  )
}
