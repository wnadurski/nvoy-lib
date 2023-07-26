export const tap =
  <V>(f: (value: V) => void) =>
  (v: V): V => {
    f(v)
    return v
  }

export const debugLog = <V>(text?: string) =>
  tap<V>((x) => (text ? console.log(text, x) : console.log(x)))
