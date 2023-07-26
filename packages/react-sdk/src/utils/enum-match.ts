export const enumMatch =
  <Keys extends string, T>(matcher: Record<Keys, T>) =>
  (v: Keys): T =>
    matcher[v]
