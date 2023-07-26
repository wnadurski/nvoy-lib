interface Props {
  className?: string
}

function SpinnerSvg({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 32 32"
    >
      <path
        d="M16 0a16 16 0 000 32 16 16 0 000-32m0 4a12 12 0 010 24 12 12 0 010-24"
        opacity="0.25"
      />
      <path d="M16 0a16 16 0 0116 16h-4A12 12 0 0016 4z">
        <animateTransform
          attributeName="transform"
          dur="0.8s"
          from="0 16 16"
          repeatCount="indefinite"
          to="360 16 16"
          type="rotate"
        />
      </path>
    </svg>
  )
}

export default SpinnerSvg
