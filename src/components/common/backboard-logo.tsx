function BackboardLogo({
  size = 36,
  color = "currentColor",
}: {
  size?: number | string | undefined
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="90" height="90" rx="15" stroke={color} strokeWidth="10" />
      <rect x="35" y="45" width="30" height="30" rx="17" stroke={color} strokeWidth="10" />
    </svg>
  )
}

export default BackboardLogo
