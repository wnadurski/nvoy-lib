import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react'
import { pipe } from 'fp-ts/function'
import { Arr, O, RA, Tuple } from './fp-ts-imports'

export type MinWidthParams<Values extends string> = ReadonlyArray<
  readonly [minWidth: number, value: Values]
>
// [[300, "small"], [600, "medium"]]

export const _findValue =
  <Values extends string>(params: MinWidthParams<Values>) =>
  (currentWidth: number): Values | undefined =>
    pipe(
      currentWidth,
      O.fromNullable,
      O.chain((width) =>
        pipe(
          params,
          Arr.findLast(([minWidth]) => width >= minWidth),
          (x) => x
        )
      ),
      O.map(Tuple.snd),
      O.toUndefined
    )

export const useElementMinWidth =
  <Element extends HTMLElement>() =>
  <Values extends string>(
    params: MinWidthParams<Values>
  ): [ref: MutableRefObject<Element | null>, value: Values | undefined] => {
    const elementRef = useRef<Element | null>(null)
    const [value, setValue] = useState<Values | undefined>(undefined)

    useLayoutEffect(() => {
      const setValueFromWidth = (width: number) =>
        pipe(width, _findValue(params), setValue)

      if (elementRef.current) {
        const width = elementRef.current?.getBoundingClientRect().width ?? -1

        setValueFromWidth(width)

        const observer = new ResizeObserver((entries) => {
          entries.forEach((e) => {
            setValueFromWidth(e.target.getBoundingClientRect().width)
          })
        })

        observer.observe(elementRef.current)

        return () => observer.disconnect()
      }

      return undefined
    }, pipe(params, RA.flatten))

    return [elementRef, value]
  }
