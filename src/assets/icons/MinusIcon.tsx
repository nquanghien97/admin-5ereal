interface MinusIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export default function MinusIcon(props: MinusIconProps) {
  const { width = 24, height = 24, title,  ...rest } = props;
  return (
    <svg {...rest} data-v-15b35c9e="" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {title && <title>{title}</title>}
      <path d="M5 12h14"></path></svg>
  );
}