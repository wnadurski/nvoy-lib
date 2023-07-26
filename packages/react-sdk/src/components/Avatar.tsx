import styled, { css } from 'styled-components'
import clsx from 'clsx'
import { SafeImage } from './SafeImage'
import { IconUser } from '@tabler/icons'
import { colors } from '../theme/colors'
import { Skeleton } from './Skeleton'

const sizeCss = css`
  --size: 42px;

  width: var(--size);
  height: var(--size);
  min-width: var(--size);
  min-height: var(--size);
  border-radius: 50%;

  &.small {
    --size: 26px;
  }

  &.large {
    --size: 68px;
  }

  box-shadow: ${colors.avatarShadow} 0 0 6px;
`

const Image = styled(SafeImage)`
  object-fit: cover;
  ${sizeCss}
`

const StyledSkeleton = styled(Skeleton)`
  ${sizeCss}
`

const PlaceholderAvatar = styled.div.attrs({
  children: <IconUser />,
})`
  ${sizeCss};
  background: ${colors.avatarPlaceholderBackground};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: calc(var(--size) * 0.45);
    height: calc(var(--size) * 0.45);
    stroke: ${colors.white};
  }
`

export interface AvatarProps {
  src?: string
  name: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Avatar = ({
  src,
  name,
  size = 'medium',
  className,
}: AvatarProps) => (
  <Image
    placeholder={<PlaceholderAvatar className={clsx(size, className)} />}
    className={clsx(size, className)}
    src={src}
    alt={name}
  />
)

Avatar.classNameTag = 'nvoy__avatar'

export const AvatarSkeleton = ({
  size = 'medium',
  className,
}: Pick<AvatarProps, 'size' | 'className'>) => (
  <StyledSkeleton className={size} containerClassName={className} />
)
