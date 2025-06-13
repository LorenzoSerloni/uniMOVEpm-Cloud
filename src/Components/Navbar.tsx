import { useContext } from "react";
import { AuthContext } from "../Contexts/SettingAuth";
import { IoMdLogOut } from "react-icons/io";

interface NavbarProps {
  height?: string; // e.g. "h-20"
}

export default function Navbar({ height = "h-20" }: NavbarProps) {
  const { logout } = useContext(AuthContext);

  return (
    <div className={`${height} bg-[#c1092a] flex flex-row items-center px-6 text-white text-2xl font-bold gap-8 justify-between`}>
      <div className="flex flex-row items-center gap-8">
        <img src="/logo.svg" className="h-8" alt="logo" />
        <h1>uniMOVEpm-Cloud</h1>
      </div>
      <div className="flex flex-row items-center gap-6">
        <IoMdLogOut
          className="fill-white h-7 w-7 cursor-pointer hover:scale-110 transition"
          title="Sign out"
          onClick={logout}
        />
      </div>
    </div>
  );
}
