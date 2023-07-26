import { Organization } from './types'

export const organizationPath = (organization: Organization) =>
  ['organizations', organization.id] as const
