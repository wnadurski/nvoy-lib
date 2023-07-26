import styled from 'styled-components'
import { KeyboardEventHandler, useRef, useState } from 'react'
import { fontCss } from '../Typography'
import { spacing } from '../../theme/spacing'
import { colors } from '../../theme/colors'
import { IconSend } from '@tabler/icons'
import clsx from 'clsx'
import { firstValueFrom, Observable } from 'rxjs'

const Input = styled.textarea`
  resize: none;
  width: 100%;
  height: 35px;
  box-sizing: border-box;
  padding: ${spacing.spacing8};
  border-color: ${colors.textareaBorder};
  border-radius: 8px;

  outline-color: ${colors.textareaBorderFocus};

  ${fontCss};
  font-size: 0.8rem;
`

export interface TextInputProps {
  name?: string
  onFocus?: () => void
}

export const MessageInput = ({ name, onFocus }: TextInputProps) => {
  const textArea = useRef<HTMLTextAreaElement | null>(null)
  const submitOnEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      textArea.current?.form?.requestSubmit()

      event.preventDefault() // Prevents the addition of a new line in the text field (not needed in a lot of cases)
    }
  }

  return (
    <Input
      autoFocus
      name={name}
      ref={textArea}
      onFocus={onFocus}
      onKeyDown={submitOnEnter}
    />
  )
}

const StyledIcon = styled(IconSend)`
  stroke: ${colors.sendButton};
`

const Button = styled.button`
  margin: 0;
  padding: ${spacing.spacing8};
  border: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  outline-color: ${colors.textareaBorderFocus};

  &:hover,
  &:focus {
    background-color: ${colors.sendButtonBackgroundHover};

    ${StyledIcon} {
      stroke: ${colors.sendButtonHover};
    }
  }

  &:active {
    background-color: ${colors.sendButtonBackgroundActive};

    ${StyledIcon} {
      stroke: ${colors.sendButtonActive};
    }
  }
`

export interface SendButtonProps {
  disabled?: boolean
}

export const SendButton = ({ disabled }: SendButtonProps) => {
  return (
    <Button type={'submit'} disabled={disabled} className={clsx({ disabled })}>
      <StyledIcon />
    </Button>
  )
}

const MessageFormContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.spacing8};
`

export interface MessageFormProps {
  onSubmit?: (message: string) => Observable<{ ok: boolean }>
  className?: string
  onFocus?: () => void
}

export const messageFormClassName = 'nvoy-message-form'

export const ChatViewMessageForm = ({
  onSubmit,
  className,
  onFocus,
}: MessageFormProps) => {
  const [isSending, setIsSending] = useState(false)
  return (
    <MessageFormContainer
      className={clsx(messageFormClassName, className)}
      onSubmit={async (e) => {
        e.preventDefault()
        if (isSending) {
          return
        }
        if (!onSubmit) {
          return
        }

        const message = (e.target['message'].value ?? '').trim()
        if (!message) {
          return
        }

        setIsSending(true)
        const { ok } = await firstValueFrom(onSubmit(message))

        if (ok) {
          e.target['message'].value = ''
        }
        setIsSending(false)
      }}
    >
      <MessageInput name={'message'} onFocus={onFocus} />
      <SendButton disabled={isSending} />
    </MessageFormContainer>
  )
}
