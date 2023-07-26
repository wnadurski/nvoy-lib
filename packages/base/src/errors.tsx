export const INVALID_API_KEY = 'INVALID_API_KEY' as const
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR' as const

export class InvalidApiKey extends Error {
  constructor() {
    super(`Invalid API key`)
  }
}

export type InitializationError = InvalidApiKey

export class UnexpectedError extends Error {
  constructor(
    public where: string,
    public internalError?: unknown,
    context?: string
  ) {
    super(
      `Unexpected error in ${where}${
        internalError ? `. Internal error: '${internalError}'` : ''
      }. ${context}`
    )
  }
}

export class EntityDoesNotExist extends Error {
  constructor(public details: string) {
    super(`Entity: '${details}' does not exist`)
  }
}
