import { useIntl } from './IntlProvider'

export const useTranslation = () => {
  return useIntl().formatMessage
}

export const useRelativeTime = () => useIntl().formatRelativeTime
