import { ChatViewMessageForm } from './ChatViewMessageForm'
import styled from 'styled-components'
import { ReactNode, useEffect, useRef } from 'react'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { Message } from '../Message'
import { Observable } from 'rxjs'
import { useComponent } from '../../containers/Components/ComponentsProvider'

export const messagesContainerClassName = 'nvoy-chatview__messages-container'

const MessagesStyled = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 100%;

  display: flex;
  flex-direction: column;

  & > * {
    width: 100%;
  }

  & > *:first-child {
    margin-top: auto;
  }
`

export const In = 'in' as const
export const Out = 'out' as const

export interface ChatViewMessage {
  id: string
  message: ReactNode
  sender: string
  direction: 'in' | 'out'
}

export interface ChatViewProps {
  onSendMessage: (message: string) => Observable<{ ok: boolean }>
  messages: ChatViewMessage[]
  onFocus?: () => void
}

const isScrolledToBottom = (element: HTMLDivElement | null) => {
  return pipe(
    element,
    O.fromNullable,
    O.map((e) => {
      return Math.ceil(e.clientHeight + e.scrollTop) >= e.scrollHeight
    })
  )
}

const ChatViewMessages = ({ messages }: { messages: ChatViewMessage[] }) => {
  const messagesRef = useRef<HTMLDivElement>(null)
  const previousIsScrolledToBottom = useRef<O.Option<boolean>>(O.none)

  useEffect(() => {
    pipe(
      previousIsScrolledToBottom.current,
      O.getOrElse(() => true),
      (previous) => {
        if (previous && messagesRef?.current) {
          messagesRef.current.scrollTop =
            messagesRef.current.scrollHeight -
            messagesRef.current.clientHeight +
            1
        }
      }
    )

    previousIsScrolledToBottom.current = isScrolledToBottom(messagesRef.current)
  }, [messages.length])

  useEffect(() => {
    const onScroll = () => {
      previousIsScrolledToBottom.current = isScrolledToBottom(
        messagesRef.current
      )
    }
    messagesRef.current?.addEventListener('scroll', onScroll)

    return () => {
      messagesRef.current?.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <MessagesStyled ref={messagesRef} className={messagesContainerClassName}>
      {messages.map((m) => (
        <Message key={m.id} sender={m.sender} direction={m.direction}>
          {m.message}
        </Message>
      ))}
    </MessagesStyled>
  )
}

export const ChatView = ({
  onSendMessage,
  messages,
  onFocus,
}: ChatViewProps) => {
  const ChatViewContainerComponent = useComponent('ChatViewContainer')

  return (
    <ChatViewContainerComponent>
      <ChatViewMessages messages={messages} />
      <ChatViewMessageForm onSubmit={onSendMessage} onFocus={onFocus} />
    </ChatViewContainerComponent>
  )
}
