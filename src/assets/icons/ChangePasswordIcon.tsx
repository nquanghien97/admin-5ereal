interface ChangePasswordIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string
}

function ChangePasswordIcon({ width = 24, height = 24, title, ...rest }: ChangePasswordIconProps) {
  return (
    <svg {...rest} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="20" height="12" x="2" y="6" rx="2"></rect>
      <path d="M12 12h.01"></path>
      <path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
  )
}

export default ChangePasswordIcon