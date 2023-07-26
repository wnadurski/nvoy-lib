import { Task } from 'fp-ts/Task'

export const fromFunction =
  <A, B>(f: (a: A) => Promise<B>): ((a: A) => Task<B>) =>
  (a) =>
  () =>
    f(a)
