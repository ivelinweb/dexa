import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import { selectSidebar, setSidebar } from "@/slices/sidebar/sidebar.slice";
import { ListCollapseIcon, MenuIcon } from "lucide-react";
import React from "react";

function ToggleMenu() {
  const isHide = useAppSelector(selectSidebar);
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => dispatch(setSidebar(!isHide))}
      role="button"
      className={`p-2`}
    >
      <MenuIcon
        size={26}
        className={`${isHide ? "" : "rotate-180"}  transition-all duration-100`}
      />
    </div>
  );
}

export default ToggleMenu;
