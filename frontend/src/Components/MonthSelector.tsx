import { useCallback, useRef, useState } from "react";

interface MonthSelectorProps {
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  setShowMonthsSelector: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function MonthSelector({
  selectedMonth,
  setSelectedMonth,
  setShowMonthsSelector,
  selectedYear,
  setSelectedYear,
}: MonthSelectorProps) {
  const [currentSelectedYear, setCurrentSelectedYear] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const months: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const handleYearSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentSelectedYear(event.target.value);
    },
    []
  );

  const handleBlur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  return (
    <div className="absolute w-full bg-white top-7 rounded-md z-10 shadow drop-shadow-white p-3 flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between w-full mb-2">
        <img
          className="rotate-90 h-1.5 cursor-pointer"
          key="month-selector-left"
          src="./collapsing-gray.svg"
          alt="collapsing icon"
          onClick={() => {
            setSelectedYear(selectedYear - 1);
          }}
        />
        <h1
          className="text-sm font-semibold cursor-pointer hover:text-slate-800/70"
          onClick={() => setShowMonthsSelector(false)}
        >
          {selectedYear}
        </h1>
        <img
          className="-rotate-90 h-1.5 cursor-pointer"
          key="month-selector-right"
          src="./collapsing-gray.svg"
          alt="collapsing icon"
          onClick={() => {
            setSelectedYear(selectedYear + 1);
          }}
        />
      </div>
      <div
        key={"MonthSelector"}
        className="grid grid-cols-3 h-full gap-3 w-full text-sm font-normal"
      >
        {Object.entries(months).map(([key, value]) => (
          <div
            key={key}
            className={`col-span-1 w-full hover:bg-black/50 flex justify-center items-center rounded-sm hover:text-white cursor-pointer p-2 text-xs ${
              selectedMonth === parseInt(key) ? "text-white bg-black" : ""
            }`}
            onClick={() => {
              setSelectedMonth(parseInt(key));
              setShowMonthsSelector(false);
            }}
          >
            {value}
          </div>
        ))}
      </div>
      <div>
        <input
          aria-label="year input"
          placeholder="Insert a specific year..."
          value={currentSelectedYear}
          onChange={(e) => handleYearSelection(e)}
          ref={inputRef}
          onKeyUp={(e) => {
            if (e.key === "Enter" && currentSelectedYear) {
              setSelectedYear(parseInt(currentSelectedYear));
              handleBlur();
              setCurrentSelectedYear("");
              if(selectedMonth){
                setShowMonthsSelector(false)
            }
            }
           
          }}
          className="py-2 mt-2 px-2 border-black hover:border-black/50 border-1 text-black rounded-sm hover:text-black/50 hover:placeholder:text-black/50 placeholder:text-black w-full text-sm"
        />
      </div>
    </div>
  );
}