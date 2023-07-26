import { ViewState, ViewStateHint, ViewStateTitle } from '../ViewState'
import { messages } from '../../messages'
import { useTranslation } from '../../utils/intl/use-translation'
import SvgConversationsFailure from './ConversationsFailure'

export const ChatError = () => {
  const t = useTranslation()
  return (
    <ViewState
      image={<SvgConversationsFailure />}
      title={
        <ViewStateTitle>
          {t(messages['fullView.chat.error.title'])}
        </ViewStateTitle>
      }
      hint={
        <ViewStateHint>{t(messages['fullView.chat.error.hint'])}</ViewStateHint>
      }
    />
  )
}
