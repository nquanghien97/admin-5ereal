interface DefaultImageIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string
}

function DefaultImageIcon({ width = 24, height = 24, title, ...rest }: DefaultImageIconProps) {
  return (
    <svg data-v-15b35c9e="" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {title && <title>{title}</title>}
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
      <circle cx="9" cy="9" r="2"></circle>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
  )
}

export default DefaultImageIcon