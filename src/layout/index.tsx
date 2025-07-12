import { Button } from "antd"
import { MenuSidebar } from "../config/MenuSidebar"
import { Outlet, useNavigate } from "react-router-dom"
import SidebarItem from "./SidebarItem"
import { useUserStore } from "../zustand/user.store";
import Cookies from "js-cookie";

function Layout() {
  const { me, setMe } = useUserStore();
  const navigate = useNavigate();

  const logOut = () => {
    Cookies.remove('token');
    navigate('/login');
    setMe(null);
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-[#84571B] z-[100]">
        <div className="relative top-0 h-full">
          <div className="flex items-center justify-end h-full gap-4 px-4">
            <div className="px-2 py-1 rounded-md text-white">{me?.fullName}</div>
            <Button className="px-4 py-4" onClick={logOut}>Đăng xuất</Button>
          </div>
        </div>
      </div>
      <div className="h-[calc(h-screen-160px)] w-[160px] z-[100]">
        <div className="bg-white w-[160px] opacity-85 fixed top-[60px] bottom-0 left-0 bg-no-repeat py-2">
          {MenuSidebar.map((menu) => (
            me && menu.allowRole.includes(me?.role) && (
              <div className="flex items-center justify-center p-2" key={menu.path}>
                <SidebarItem title={menu.title} path={menu.path} />
              </div>
            )            
          ))}
        </div>
        <div className="w-[calc(100vw-177px)] mt-[60px] ml-[160px] h-[calc(h-screen-160px)]">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout