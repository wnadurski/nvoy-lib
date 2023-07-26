import { Organization } from '../organizations/types'
import { organizationPath } from '../organizations/path'
import { UserId } from './types'
import { DocPath } from '../no-sql/path'

export const usersPath = (organization: Organization) =>
  [...organizationPath(organization), 'users'] as const

export const userPath = (organization: Organization) => (id: UserId) =>
  [...usersPath(organization), id] as const

export const relUserPath = (id: UserId): DocPath => ['users', id]
