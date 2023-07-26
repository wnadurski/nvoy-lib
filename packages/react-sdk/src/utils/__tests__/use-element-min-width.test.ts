import { _findValue } from '../use-element-min-width'

describe('_findValue', () => {
  const tests = [
    [900, 'large'],
    [700, 'medium'],
    [500, 'small'],
    [300, undefined],
  ] as const

  const cornerCases = [
    [800, 'large'],
    [600, 'medium'],
    [400, 'small'],
  ] as const

  it.each([...tests, ...cornerCases])(
    'works',
    (currentWidth, expectedValue) => {
      const result = _findValue([
        [400, 'small'],
        [600, 'medium'],
        [800, 'large'],
      ])(currentWidth)

      expect(result).toBe(expectedValue)
    }
  )
})
