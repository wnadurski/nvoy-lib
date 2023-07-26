import { expectTypeOf } from 'expect-type'
import { Conversation, ConversationFromCodec } from './types'

it('should be the same type', () => {
  expectTypeOf<ConversationFromCodec>().toEqualTypeOf<Conversation>()
})

export {}
