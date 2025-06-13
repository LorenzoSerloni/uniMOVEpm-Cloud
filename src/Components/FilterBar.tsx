import DatePicker from "./DatePicker";
// import Selector from "./Selector";

interface FiltersBarProps {
  selectedStartingDate: string;
  setSelectedStartingDate: React.Dispatch<React.SetStateAction<string>>;
  selectedEndingDate: string;
  setSelectedEndingDate: React.Dispatch<React.SetStateAction<string>>;
  selectedStartingTime: string;
  setSelectedStartingTime: React.Dispatch<React.SetStateAction<string>>;
  selectedEndingTime: string;
  setSelectedEndingTime: React.Dispatch<React.SetStateAction<string>>;
}

const FiltersBar = ({
  selectedStartingDate,
  setSelectedStartingDate,
  selectedEndingDate,
  setSelectedEndingDate,
  selectedStartingTime,
  setSelectedStartingTime,
  selectedEndingTime,
  setSelectedEndingTime,
}:
FiltersBarProps) => (
  <div className="mt-10 w-full grid grid-cols-2 px-20 mb-8">
    <div className="col-span-1 flex justify-center flex-col items-center gap-1">
      <div className="flex w-80 pl-2 font-semibold">Pick Starting Date:</div>
      <div className="w-80 h-7.5">
        <DatePicker
          title="Start Date Selector"
          selectedDate={selectedStartingDate}
          setSelectDate={setSelectedStartingDate}
          selectedTime={selectedStartingTime}
          setSelectedTime={setSelectedStartingTime}
          name="startingDate"
        />
      </div>
    </div>
    <div className="col-span-1 flex justify-center flex-col items-center gap-1">
      <div className="flex w-80 pl-2 font-semibold">Pick Ending Date:</div>
      <div className="w-80 h-7.5">
        <DatePicker
          title="End Date Selector"
          selectedDate={selectedEndingDate}
          setSelectDate={setSelectedEndingDate}
          selectedTime={selectedEndingTime}
          setSelectedTime={setSelectedEndingTime}
          name="endingDate"
        />
      </div>
    </div>
  </div>
);

export default FiltersBar;
