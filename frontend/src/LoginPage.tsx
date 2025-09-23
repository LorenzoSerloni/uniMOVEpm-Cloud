import { type FormEvent, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./Contexts/UseAuth";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { login, user } = useAuth();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const mode = import.meta.env.VITE_MODE;
    const ip = import.meta.env.VITE_IP;
    let url = "localhost";
    if (mode === "production" && ip) {
      url = ip;
    }
    setIsDisabled(true);

    try {
      const response = await fetch(`http://${url}:5001/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const authCookie = getCookie("auth");
        if (authCookie) {
          await login(authCookie);
        } else {
          console.error("Problem with coockies");
          alert("An error occurred in the coockies passed for the login");
        }
      } else if (response.status == 403)
        alert(
          "User already logged in in another device pls logout in the other device if you want to log in here"
        );
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsDisabled(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="flex flex-col items-center overflow-hidden bg-[#F0F0F2]"
      style={{ height: "100vh" }}
    >
      <div
        className="w-full flex flex-row justify-between items-center bg-[#c1092a] pr-8"
        style={{ height: "6.5vh" }}
      >
        <div className="w-full h-full flex flex-row justify-between items-center mr-10">
          <div className="h-full flex flex-row items-center pl-8 gap-6">
            <img src="./logo.svg" className="h-4/6" alt="logo" />
            <div className="text-3xl font-bold text-white">uniMOVEpm</div>
          </div>
        </div>

      </div>
      <div className="flex flex-row w-full h-full items-center justify-evenly border-[#121212]">
        <img
          src={"./Univpm.svg"}
          className="w-2/6 2xl:h-1/6 mt-30"
          alt="logo"
        />
        <form
          onSubmit={handleLogin}
          className="lg:w-96 lg:py-12 py-4 mt-30 px-4 rounded-lg text-center bg-none flex flex-col justify-center items-center"
        >
          <h1 className="text-4xl font-bold text-[#121212] py-4 border-b-2 border-[#121212]">
            Login Form
          </h1>
          <div className="py-4">
            <div className="mb-4">
              <label
                className="text-2xl font-semibold text-left block m-1 text-[#121212] "
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="rounded-sm lg:w-80 w-60 h-8 p-2 border-2 border-[#c1092a] text-[#121212] focus:border-[#121212]  focus:outline-none"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                required
                value={credentials.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-10">
              <label
                className="text-2xl font-semibold text-left block m-1 text-[#121212]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="rounded-sm lg:w-80 w-60 h-8 p-2 border-2 border-[#c1092a] text-[#121212] focus:border-[#121212]  focus:outline-none"
                type="password"
                name="password"
                id="password"
                required
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className={`bg-[#c1092a] text-lg font-semibold text-white py-2 px-4 lg:w-80 w-60 rounded-md hover:bg-red-900 ${
                isDisabled ? "opacity-40" : ""
              }`}
              disabled={
                isDisabled || !credentials.username || !credentials.password
              }
            >
              {isDisabled ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
