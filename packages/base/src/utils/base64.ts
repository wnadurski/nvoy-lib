import base64 from 'base-64'

export const toBase64 = (s: string) => base64.encode(s)
export const fromBase64 = (b: string) => base64.decode(b)
