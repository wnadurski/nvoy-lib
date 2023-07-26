import { FormEventHandler, useState } from 'react'
import { useEngine } from '../hooks/use-engine'
import {
  addMessage,
  createConversation,
  currentUser$,
  EntityDoesNotExist,
  getOrCreate,
  getUserById,
  signInUser,
  signOutUser,
} from '@nvoy/base'
import { pipe } from 'fp-ts/function'
import { map, mapLeft } from 'fp-ts/Either'
import { useObservable } from '../utils/use-observable'
import { buffered } from '../utils/buffered'
import { AE, O, RD } from '../utils/fp-ts-imports'
import { useCurrentUser } from '../hooks/use-current-user'

export default {
  title: 'Utilities',
}

const tokens = {
  user1:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY3MTQ2NjA4NiwiZXhwIjoxNjcxNDY5Njg2LCJpc3MiOiJvcmdhbml6YXRpb24tdG9rZW4tc2lnbmVyQGNvb2wtY2hhdC1kOGRlZi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6Im9yZ2FuaXphdGlvbi10b2tlbi1zaWduZXJAY29vbC1jaGF0LWQ4ZGVmLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiYzNWaWRYTmxjZz09LlFsVjJjR1pVVlU1RFQwRnVlbEZDVERKbFVXYz0uZFhObGNqRT0iLCJjbGFpbXMiOnsidXNlcklkIjoidXNlcjEiLCJvcmdhbml6YXRpb25JZCI6IkJVdnBmVFVOQ09BbnpRQkwyZVFnIn19.KfMb2W93uqVDl87lYA2eRUu5ivY5v4LjzNBdh9lEWVguZzPgQQbKINXfGmefUXSHsCpZv6_IZTXFyPsPBxLfl7c6HgGPJsKpm5Y8zl-iQlwsgLjT5SA-_C6lI85PYFwumOHR65dqNsW7_g9Bwu5c1JlfKbj_uuzpZQxMoZNHO7TqG-Tx9l9dDz8UURD-HgdrArWoompcIM-g7N8wPzR-1JpAIbXqlrp-EHQbCuc8Qoa5NeUmdYuNsGmxHa478c0toeQGo4NPFUd369eWLtnTQKoW54xIxFzPdAH9WCRgWqNJDP-pVAOfN5tUELb31X1CgrdDrLsfCc4KUMZrz9gu5w',
  user2:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY3MTQ2NjA2NywiZXhwIjoxNjcxNDY5NjY3LCJpc3MiOiJvcmdhbml6YXRpb24tdG9rZW4tc2lnbmVyQGNvb2wtY2hhdC1kOGRlZi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6Im9yZ2FuaXphdGlvbi10b2tlbi1zaWduZXJAY29vbC1jaGF0LWQ4ZGVmLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiYzNWaWRYTmxjZz09LlFsVjJjR1pVVlU1RFQwRnVlbEZDVERKbFVXYz0uZFhObGNqST0iLCJjbGFpbXMiOnsidXNlcklkIjoidXNlcjIiLCJvcmdhbml6YXRpb25JZCI6IkJVdnBmVFVOQ09BbnpRQkwyZVFnIn19.T_jrFk9zwCKk5pVDbcxAkp6OHosE1jlVQzH4QAWNMirqr5bJaqR22BIkJbFjiLDCd0AbpgGQN4mAF4EmXyG5FLsjp8nQBL-njtqPPl4epuHos4BwhkLbNkjsVZr6TdN3Kt3j-ksUoik4v-ShOpNHqRrF9PmV7NPJl3fnsg9Q4OOjN_9VMv3z41TXCHpQ1u8aIKp9QNJmRMIXyhMwdXNqR0HyOGdLSCZbSU_hkastx2xVrLa4hefvj_Zx1I376mqAvyYY-e9_clf9YeleAH-mD_4CMO_92-t-v1MrHTj3b8kbkX5hu-UVuNO4UbZt-3Xga-d5Wi2KrX3qdi9khT6-lg',
}

export const Auth = () => {
  const [token, setToken] = useState('')
  const { run } = useEngine('NAKeWeZ7')
  const user = useCurrentUser(run)

  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <input value={token} onChange={(e) => setToken(e.target.value)} />
      <button onClick={() => run?.(signInUser(token)).subscribe()}>
        Log in with token
      </button>
      <div>
        <button onClick={() => run?.(signInUser(tokens.user1)).subscribe()}>
          Log in as user1
        </button>
      </div>
      <div>
        <button onClick={() => run?.(signInUser(tokens.user2)).subscribe()}>
          Log in as user2
        </button>
      </div>
      <div>
        <button onClick={() => run?.(signOutUser).subscribe()}>Log out</button>
      </div>
    </div>
  )
}

export const Users = () => {
  const [user, setUser] = useState({})
  const { run } = useEngine('NAKeWeZ7')

  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault()
        const user = {
          id: e.target.elements.id.value,
          displayName: e.target.elements.name.value,
        }

        if (e.target.elements.action.value === 'getOrCreate') {
          run?.(getOrCreate(user)).subscribe((x) =>
            pipe(
              x,
              map(setUser),
              mapLeft((e) => {
                console.error(e)
                setUser({ e: e.toString() })
              })
            )
          )
        } else {
          run?.(getUserById(user.id)).subscribe((x) =>
            pipe(
              x,
              mapLeft((e) => {
                if (e instanceof EntityDoesNotExist) {
                  setUser({ error: 'No user' })
                } else {
                  setUser({ error: e.toString() })
                }
              }),
              map((x) => setUser(x))
            )
          )
        }
      }}
    >
      <p>{JSON.stringify(user)}</p>
      <div>
        <input name={'id'} placeholder={'user id'} />
      </div>
      <div>
        <input name={'name'} placeholder={'display name'} />
      </div>
      <div>
        <div>
          <input name={'action'} type={'radio'} value={'getOrCreate'} />{' '}
          getOrCreate
        </div>
        <div>
          <input name={'action'} type={'radio'} value={'get'} /> get
        </div>
      </div>
      <div>
        <button type={'submit'}>Get or create</button>
      </div>
    </form>
  )
}

export const StartConversation = () => {
  const { run } = useEngine('NAKeWeZ7')
  const user = useObservable(run?.(currentUser$), [run])
  const handleSubmit: FormEventHandler = (e: any) => {
    e.preventDefault()

    if (!RD.isSuccess(user) || O.isNone(user.value)) {
      return
    }
    const userId = e.target.elements.userId.value

    const data = {
      displayName: e.target.elements.displayName.value,
      avatarSrc: e.target.elements.avatarSrc.value,
    }

    const action = pipe(
      createConversation({
        members: [userId, user.value.value.id],
        displayName: data.displayName === '' ? undefined : data.displayName,
        avatarSrc: data.avatarSrc === '' ? undefined : data.avatarSrc,
      }),
      AE.chain((id) => addMessage('Witam')(id))
    )

    console.log(data, userId, user.value.value.id)

    run?.(action).subscribe((x) => console.log(x))
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input placeholder={'user id'} name={'userId'} />
      </div>
      <div>
        <input placeholder={'Conversation display Name'} name={'displayName'} />
      </div>
      <div>
        <input placeholder={'Conversation avatar src'} name={'avatarSrc'} />
      </div>
      <div>
        <button type={'submit'}>Create</button>
      </div>
    </form>
  )
}

const db = {
  user1: 'User 1',
  user2: 'User 2',
  user3: 'User 3',
  user4: 'User 4',
  user5: 'User 5',
  user6: 'User 6',
}

const bufferedRequest = buffered((args: string[]) => {
  console.log('Requested', args)
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(undefined), 1000)
  }).then(() => {
    const entires = Object.fromEntries(
      Object.entries(db).filter(([key]) => args.includes(key))
    )
    console.log('responding', entires)
    return entires
  })
  return promise
})

export const Buffered = () => {
  const [value, setValue] = useState('')
  return (
    <div>
      <div>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div
        onClick={() => {
          value
            .split(',')
            .forEach((userid) =>
              bufferedRequest(userid).then((value) =>
                console.log('Value came', userid, value)
              )
            )
        }}
      >
        <button>Click me</button>
      </div>
    </div>
  )
}
