export type CollectionPath =
  | readonly [string]
  | readonly [string, string, string]
  | readonly [string, string, string, string, string]
  | readonly [string, string, string, string, string, string, string]

export type DocPath =
  | readonly [string, string]
  | readonly [string, string, string, string]
  | readonly [string, string, string, string, string, string]

export const serializePathComponent = encodeURIComponent

export const deserializePathComponent = decodeURIComponent
