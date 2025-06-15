import { useNavigate } from "react-router-dom";

interface SimulationCardProps {
  title: string;
  date: string;
  onDelete?: () => void;
}

export default function SimulationCard({
  title,
  date,
  onDelete,
}: SimulationCardProps) {
  const tipology = "simulation";
  const navigate = useNavigate();

  // Handler for card click
  const handleClick = () => {
    // Use yyyy-MM-dd for date and replace : with - in time
    if (date) {
      const safeDate = date.replace(/\//g, "-").replace(/"/g, "");
      // Replace : with - in time for URL safety
      const safeTime = title.replace(/:/g, "-");
      navigate(`/visualization/${safeDate}/${safeTime}`);
    } else {
      alert("Date is missing for this simulation card.");
    }
  };

  return (
    <div
      className="h-64 w-112 max-[1800px]:w-96 max-[1800px]:h-60 rounded-lg border-2 border-black flex flex-row cursor-pointer hover:shadow-lg hover:drop-shadow-black"
      onClick={handleClick}
    >
      <div className="bg-black w-64 max-[1800px]:w-56 h-full flex flex-col py-3 px-7 max-[1800px]:px-5">
        <div className="text-white font-bold max-[1800px]:text-sm border-b-2 border-white flex w-full items-center mt-2 pb-2">
          {"Saving hour : " + title.replace(/-/g, ":")}
        </div>
      </div>
      <div className="bg-none w-48 max-[1800px]:w-40 h-full flex flex-col p-2">
        <div className="flex h-1/6 w-full justify-end items-center">
          <div className="border-2 border-black p-2 rounded-sm h-7 flex flex-row items-center gap-2 relative justify-between">
            <div className="flex flex-row items-center  gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c1092a] opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-[#c1092a]/70"></span>
              </span>
              <h1 className="font-bold text-sm max-[1800px]:text-[10px]">
                {tipology}
              </h1>
            </div>
            <img
              src={
                tipology.toLowerCase() == "race"
                  ? `./race.svg`
                  : `./simulation.svg`
              }
              alt="tipology logo"
              className={tipology.toLowerCase() == "race" ? `h-6` : `h-4`}
            />
          </div>
        </div>
        <div className="w-full h-4/6 flex justify-center items-center">
          <img
            src="./businessman.svg"
            alt="businessman image"
            className="h-36 w-36"
          />
        </div>
        <div className="flex h-1/6 w-full justify-end items-center">
          <div
            className="h-8 w-8 bg-black flex justify-center items-center rounded-md p-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete();
              }
            }}
          >
            <img src="./bin.svg" alt="bin icon" className="h-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
