import { format } from "date-fns";

interface HourPickerProps {
  selectedHour: number;
  selectedMinute: number;
  selectedSeconds: number;
  selectedMilliseconds: number;
  setSelectedHour: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMinute: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSeconds: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMilliseconds: React.Dispatch<React.SetStateAction<number>>;
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  setShowHourPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HourPicker({
  selectedHour,
  selectedMinute,
  selectedSeconds,
  selectedMilliseconds,
  setSelectedHour,
  setSelectedMinute,
  setSelectedSeconds,
  setSelectedMilliseconds,
  setSelectedTime,
  setShowHourPicker,
}: HourPickerProps) {
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 24) {
      setSelectedHour(value);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setSelectedMinute(value);
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setSelectedSeconds(value);
    }
  };

  const handleMillisecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 999) {
      setSelectedMilliseconds(value);
    }
  };

  return (
    <div className="absolute w-full bg-white top-9 rounded-md z-10 shadow drop-shadow-white p-3 flex flex-col gap-2">
      <div className="grid grid-cols-15 gap-2">
        <div className="flex flex-col col-span-3 items-center ml-2">
          <h2 className="text-xs font-semibold mb-2">Hours</h2>
          <input
            aria-label="hours-picker"
            type="number"
            value={selectedHour}
            onChange={handleHourChange}
            className="text-center w-10 border-2 rounded-sm border-black"
            min="1"
            max="24"
          />
        </div>
        <span className="mt-6 font-semibold ml-1">:</span>
        <div className="flex flex-col col-span-3 items-center">
          <h2 className="text-xs font-semibold mb-2">Minutes</h2>
          <input
            aria-label="minutes-picker"
            type="number"
            value={selectedMinute}
            onChange={handleMinuteChange}
            className="text-center w-10 border-2 rounded-sm"
            min="0"
            max="59"
          />
        </div>
        <span className="mt-6 font-semibold">:</span>
        <div className="flex flex-col col-span-3 items-center">
          <h2 className="text-xs font-semibold mb-2">Seconds</h2>
          <input
            aria-label="seconds-picker"
            type="number"
            value={selectedSeconds}
            onChange={handleSecondsChange}
            className="text-center w-10 border-2 rounded-sm"
            min="0"
            max="59"
          />
        </div>
        <span className="mt-6 font-semibold">:</span>
        <div className="flex flex-col col-span-3 items-center mr-2">
          <h2 className="text-xs font-semibold mb-2">Milliseconds</h2>
          <input
            aria-label="milliseconds-picker"
            type="number"
            value={selectedMilliseconds}
            onChange={handleMillisecondsChange}
            className="text-center w-14 border-2 rounded-sm"
            min="0"
            max="999"
          />
        </div>
      </div>
      <div className="mt-4 text-center flex flex-row w-full gap-2 text-sm">
        <button
          className="border-black border-2 text-black p-2 rounded px-2 w-1/2 cursor-pointer hover:border-black/50 hover:text-black/50"
          onClick={() => {
            setSelectedTime(format(new Date().getTime(), "HH:mm:ss.SSS"));
            setShowHourPicker(false);
          }}
        >
          Now
        </button>
        <button
          className="bg-black text-white p-2 rounded px-2 w-1/2 cursor-pointer hover:bg-black/50"
          onClick={() => {
            const formattedTime = `${selectedHour
              .toString()
              .padStart(2, "0")}:${selectedMinute
              .toString()
              .padStart(2, "0")}:${selectedSeconds
              .toString()
              .padStart(2, "0")}.${selectedMilliseconds
              .toString()
              .padStart(3, "0")}`;
            setSelectedTime(formattedTime);
            setShowHourPicker(false);
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}