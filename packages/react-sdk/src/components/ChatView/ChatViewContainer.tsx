import styled from 'styled-components'

export const chatViewClassName = 'nvoy-chatview'
export const ChatViewContainer = styled.div.attrs({
  className: chatViewClassName,
})`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
`
