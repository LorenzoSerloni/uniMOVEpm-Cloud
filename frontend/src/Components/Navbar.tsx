import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  height?: string;
}

export default function Navbar({ height = "h-40" }: NavbarProps) {
  const navigate = useNavigate()
  const handleLogout = async () => {
    const mode = import.meta.env.VITE_MODE;
    const ip = import.meta.env.VITE_IP;
    let url = "localhost";
    if (mode === "production" && ip) {
      url = ip;
    }
    try {
      const response = await fetch(`http://${url}:5001/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        navigate(0);
        console.log("Logout effettuato con successo");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div
      className={`${height} bg-[#c1092a] flex flex-row items-center px-6 text-white text-2xl font-bold gap-8 justify-between`}
    >
      <div className="flex flex-row items-center gap-8">
        <img src="/logo.svg" className="h-8" alt="logo" />
        <h1>uniMOVEpm Analytics</h1>
      </div>
      <div className="flex flex-row items-center gap-6">
        <IoMdLogOut
          className="fill-white h-7 w-7 cursor-pointer hover:scale-110 transition"
          title="Sign out"
          onClick={() => handleLogout()}
        />
      </div>
    </div>
  );
}
