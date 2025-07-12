interface PlusIconProps {
  color?: string;
  width?: number;
  height?: number;
}
function PlusIcon(props: PlusIconProps) {
  const { color, width = 24, height = 24 } = props;
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon" fill={color} width={width} height={height}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
  );
}

export default PlusIcon;