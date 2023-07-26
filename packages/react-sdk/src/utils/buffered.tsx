import {
  bufferTime,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs'
import { isNotNil } from './is-not-nil'

// interface ThrottleConfig {
//   leading: boolean
//   trailing: boolean
// }
//
// const defaultConfig = { leading: true, trailing: false }

// type BufferThrottle = <T>(
//   timeMs: number,
//   config?: ThrottleConfig
// ) => OperatorFunction<T, T[]>
// const bufferThrottle: BufferThrottle =
//   (timeMs, config = defaultConfig) =>
//   (source) =>
//     new Observable((observer) =>
//       source
//         .pipe(buffer(source.pipe(throttleTime(timeMs, undefined, config))))
//         .subscribe({
//           next(x) {
//             observer.next(x)
//           },
//           error(err) {
//             observer.error(err)
//           },
//           complete() {
//             observer.complete()
//           },
//         })
//     )

const requestValueForArgument = 'request value for argument' as const
const valuesCame = 'values came' as const

export const buffered = <Arg extends string | number, Result>(
  f: (args: Arg[]) => Promise<{ [key in Arg]?: Result }>,
  timeMs = 500
): ((arg: Arg) => Promise<Result>) => {
  type State = { [key in Arg]?: Result }
  type Action =
    | { type: 'start' }
    | { type: typeof requestValueForArgument; payload: Arg }
    | { type: typeof valuesCame; payload: State }

  const initialState = {} as State
  const reducer = (state: State, action: Action): State => {
    if (action.type === 'start') {
      return initialState
    }
    if (action.type === valuesCame) {
      return { ...state, ...action.payload }
    }

    return state
  }

  const actions = new Subject<Action>()
  const store = actions.pipe(
    startWith({ type: 'start' }),
    scan(reducer, initialState),
    distinctUntilChanged(),
    shareReplay(1)
  )

  actions
    .pipe(
      filter(
        (
          action
        ): action is { type: typeof requestValueForArgument; payload: Arg } =>
          action.type === requestValueForArgument
      ),
      map((action) => action.payload),
      bufferTime(timeMs),
      withLatestFrom(store),
      map(([args, store]) => args.filter((arg) => !store[arg])),
      filter((args) => args.length > 0),
      switchMap((args) => from(f(args))),
      map((payload) => ({ type: valuesCame, payload } as Action))
    )
    .subscribe(actions)

  return (arg: Arg) => {
    actions.next({ type: requestValueForArgument, payload: arg })

    return firstValueFrom(
      store.pipe(
        map((state) => {
          return state[arg] as Result | undefined
        }),
        filter(isNotNil)
      )
    )
  }
}
