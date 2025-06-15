import { useNavigate } from "react-router-dom";

interface HeaderRowProps {
  date?: string;
  realTime?: string;
}

export default function HeaderRow({ date, realTime }: HeaderRowProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center w-full px-4 py-2 gap-2">
      <button
        onClick={() => navigate(-1)}
        className={`px-4 py-2 rounded transition text-xs ml-4 bg-[#c1092a] text-white hover:bg-[#a10822]
          `}
      >
        ← Back
      </button>
      <h2
        className={`text-xl font-bold text-center flex-1
          text-[#c1092a]
        `}
      >
        Visualization for {date} {realTime}
      </h2>
      <div style={{ width: "70px" }} />
    </div>
  );
}
