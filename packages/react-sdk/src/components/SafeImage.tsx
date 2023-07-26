import { useState } from 'react'

export interface SafeImageProps {
  src?: string
  placeholder?: JSX.Element
  className?: string
  alt?: string
}
export const SafeImage = ({
  src,
  placeholder,
  className,
  alt,
}: SafeImageProps) => {
  const [error, setError] = useState(false)

  if (!src || error) {
    return placeholder ?? <div className={className} />
  }

  return (
    <img
      alt={alt}
      src={src}
      onError={() => setError(true)}
      className={className}
    />
  )
}
