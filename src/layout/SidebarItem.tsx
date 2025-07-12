import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  title: string;
  path: string;
}

function SidebarItem(props: SidebarItemProps) {
  const location = useLocation();
  const { title, path } = props;
  const activePath = location.pathname === path ? 'default' : 'primary'
  return (
    <div className="w-[140px] ">
      <Link to={path}>
        <Button
          color={activePath}
          className="!text-white !py-6 text-sm drop-shadow-[1px_2px_rgba(0,0,0,0.4)] w-full !bg-[#84571B] hover:!bg-[#c58229] duration-300"
        >
          {title}
        </Button>
      </Link>
    </div>
  )
}

export default SidebarItem;