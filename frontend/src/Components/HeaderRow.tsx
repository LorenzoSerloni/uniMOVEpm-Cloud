import { useNavigate } from "react-router-dom";
import { downloadCsvFile } from "../Shared/ApiFunctionCaller";

interface HeaderRowProps {
  date?: string;
  realTime?: string;
  simulationOwner: string;
}

export default function HeaderRow({ date, realTime, simulationOwner }: HeaderRowProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 items-center w-full px-4 py-10 gap-2 ">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded transition text-xs ml-4 bg-[#c1092a] text-white hover:bg-[#a10822]"
        >
          ← Back
        </button>
      </div>
      <h2 className="text-xl font-bold text-center flex-1 text-[#c1092a]">
        Visualization for {date} {realTime} mabe by {simulationOwner}
      </h2>
      <div className="grid-cols-1 flex justify-end gap-4 mr-8">
        <button
          onClick={() => {
            if (date && realTime) downloadCsvFile(date, realTime);
          }}
          className=" flex flex-row gap-4 items-center px-4 py-2 rounded transition text-xs bg-[#c1092a] text-white hover:bg-[#a10822]"
        >
          <h1>Download Data</h1>
          <img src="/Download_white.svg" className="h-4" alt="dowload icon" />
        </button>
      </div>
    </div>
  );
}
