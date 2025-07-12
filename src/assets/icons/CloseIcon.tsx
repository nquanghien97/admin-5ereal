interface CloseIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export default function CloseIcon(props: CloseIconProps) {
  const {
    color,
    ...rest
  } = props;
  return (
    <svg {...rest} color={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}