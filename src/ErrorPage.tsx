import Navbar from "./Components/Navbar";

export default function ErrorPage() {
  return (
    <div className="h-dvh w-full bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        {/* Left: Univpm logo */}
        <div className="flex flex-col items-center justify-center pr-12">
          <img
            src="./Univpm.svg"
            alt="Università Politecnica delle Marche"
            className="h-32 w-auto mb-4"
          />
        </div>
        {/* Right: Error content */}
        <div className="flex flex-col items-start justify-center gap-6 pl-12 border-l-2 border-gray-200">
          <div className="flex items-center gap-4">
            <svg
              className="h-12 w-12 text-[#c1092a]"
              fill="none"
              viewBox="0 0 48 48"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                fill="#fff"
              />
              <line
                x1="24"
                y1="14"
                x2="24"
                y2="28"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="24" cy="34" r="2.5" fill="currentColor" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">
              Please retry to authenticate!
            </h1>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-3 bg-[#c1092a] text-white text-lg rounded shadow hover:bg-[#c1092a]/70 transition cursor-pointer"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    </div>
  );
}
