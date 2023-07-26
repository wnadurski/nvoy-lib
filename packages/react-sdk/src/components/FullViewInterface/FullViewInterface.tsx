import styled from 'styled-components'
import { spacing } from '../../theme/spacing'
import { useElementMinWidth } from '../../utils/use-element-min-width'
import { ReactNode } from 'react'
import { Spinner } from '../Spinner'
import { ChatError } from './ChatError'
import { EmptyChatContainer } from './EmptyChatContainer'
import clsx from 'clsx'

const Container = styled.div`
  //contain: content;
  width: 100%;
  height: 100%;
  max-height: 90vh;

  display: grid;
  grid-template-columns: 1fr 2fr;
  &.emptyState {
    grid-template-columns: 0 1fr;
  }

  grid-template-rows: 1fr;
  grid-gap: ${spacing.spacing24};

  &.small {
    grid-template-columns: auto 1fr;
  }

  .conversations-container {
    max-height: inherit;
    min-width: 375px;
    max-width: 450px;
    flex: 1;
  }

  .conversations-container.small {
    min-width: auto;
    max-width: min-content;
  }

  .chat-container {
    flex: 1;
    width: 100%;
    max-height: calc(100% - 99px);
  }

  .right-column {
    max-height: inherit;
    min-width: 220px;
    flex: 2;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    grid-column: 2;
  }
`

export enum FullViewState {
  loading = 'loading',
  error = 'error',
  empty = 'empty',
  display = 'display',
}

type LoadingProps = {
  state: FullViewState.loading
}

type ErrorProps = {
  state: FullViewState.error
}

type EmptyProps = {
  state: FullViewState.empty
  conversationsCount: number
}

type DisplayProps = {
  state: FullViewState.display
  chat: ReactNode
  topBar: ReactNode
}

type CommonProps = {
  conversations: (params: { size: 'small' | 'large' }) => ReactNode
}

type Props = CommonProps &
  (LoadingProps | ErrorProps | EmptyProps | DisplayProps)

const matchProps = <T,>(
  props: LoadingProps | ErrorProps | EmptyProps | DisplayProps,
  matchers: {
    onLoading: (props: LoadingProps) => T
    onError: (props: ErrorProps) => T
    onEmpty: (props: EmptyProps) => T
    onDisplay: (props: DisplayProps) => T
  }
) => {
  if (props.state === FullViewState.loading) {
    return matchers.onLoading(props)
  }
  if (props.state === FullViewState.error) {
    return matchers.onError(props)
  }
  if (props.state === FullViewState.empty) {
    return matchers.onEmpty(props)
  }
  if (props.state === FullViewState.display) {
    return matchers.onDisplay(props)
  }
  return undefined
}

export const FullViewInterface = ({ conversations, ...props }: Props) => {
  const [elementRef, size] = useElementMinWidth<HTMLDivElement>()([
    [-1, 'small'],
    [720, 'large'],
  ])
  return (
    <Container
      ref={elementRef}
      className={clsx(size, {
        emptyState: props.state === 'empty' && props.conversationsCount === 0,
      })}
    >
      <div className={clsx('conversations-container', size)}>
        {conversations({ size: size ?? 'large' })}
      </div>
      <div className={'right-column'}>
        {matchProps(props, {
          onLoading: () => <Spinner size={'x-large'} />,
          onError: () => <ChatError />,
          onEmpty: ({ conversationsCount }) => (
            <EmptyChatContainer
              hasConversations={(conversationsCount ?? 0) > 0}
            />
          ),
          onDisplay: ({ topBar, chat }) => (
            <>
              {topBar}
              <div className={'chat-container'}>{chat}</div>
            </>
          ),
        })}
      </div>
    </Container>
  )
}
