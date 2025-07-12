interface AssignUserIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

function AssignUserIcon(props: AssignUserIconProps) {
  const {
    width = 16,
    height = 16,
    ...rest
  } = props;
  return (
    <svg {...rest} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>

  );
}

export default AssignUserIcon;