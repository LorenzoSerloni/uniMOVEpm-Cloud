import { useMemo, useState } from "react";
import { format } from "date-fns";
import { getDaysOfWeek } from "../Shared/FunctionHelper";
import type { Week } from "../Shared/Interface";
import HourPicker from "./HourPicker";
import MonthSelector from "./MonthSelector";

interface DatePickerProps {
  title: string;
  selectedDate: string;
  setSelectDate: React.Dispatch<React.SetStateAction<string>>;
  selectedTime: string;
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  name: "startingDate" | "endingDate"; // add this line
}

export default function DatePicker({
  title,
  selectedDate,
  selectedTime,
  setSelectDate,
  setSelectedTime,
  name,
}: DatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [showMonthsSelector, setShowMonthsSelector] = useState<boolean>(false);
  const [showHourPicker, setShowHourPicker] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [daysOfTheCurrentMonth, setDaysOfTheCurrentMonth] = useState<Week[]>(
    getDaysOfWeek(selectedYear, selectedMonth)
  );
  const [selectedHour, setSelectedHour] = useState<number>(
    new Date().getHours()
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    new Date().getMinutes()
  );
  const [selectedSeconds, setSelectedSeconds] = useState<number>(
    new Date().getSeconds()
  );
  const [selectedMilliseconds, setSelectedMilliseconds] = useState<number>(
    new Date().getMilliseconds()
  );

  useMemo(() => {
    const cachedYear = localStorage.getItem(`selectedYear-${title}`);

    const cachedMonth = localStorage.getItem(`selectedMonth-${title}`);

    if (cachedYear) setSelectedYear(parseInt(cachedYear));
    if (cachedMonth) setSelectedMonth(parseInt(cachedMonth));
  }, [title]);

  useMemo(() => {
    const tempWeeks: Week[] = getDaysOfWeek(selectedYear, selectedMonth - 1);
    setDaysOfTheCurrentMonth(tempWeeks);
  }, [selectedMonth, selectedYear]);

  useMemo(() => {
    localStorage.setItem(`selectedYear-${title}`, selectedYear.toString());
    localStorage.setItem(`selectedDate-${title}`, selectedDate);
    localStorage.setItem(`selectedMonth-${title}`, selectedMonth.toString());
    localStorage.setItem(`selectedTime-${title}`, selectedTime);
  }, [selectedYear, selectedDate, selectedMonth, selectedTime, title]);

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

  return (
    <div className="relative flex flex-col gap-2 h-full max-[1400px]:text-[8px]">
      <div
        className="w-full h-full flex flex-row items-center justify-between pl-2 bg-white rounded-md border-1  border-[#848383] cursor-pointer"
        onClick={() => {
          setIsDatePickerOpen(!isDatePickerOpen);
          setShowMonthsSelector(false);
          setShowHourPicker(false);
        }}
      >
        <div className="flex flex-row gap-2 items-center justify-center">
          <img
            alt="calendar"
            src="calendar.svg"
            className="h-5 max-[1400px]:h-3"
          ></img>
          <h1 className="text-sm max-[1400px]:text-[8px] text-black">{`${selectedDate} ${selectedTime}`}</h1>
        </div>
        <div className="pr-1">
          <img
            src={"./collapsing-gray.svg"}
            className={`col-span-1 h-1.5 w-2.5 max-[1400px]:h-1 cursor-pointer ${
              !isDatePickerOpen ? "rotate-down" : "rotate-up"
            }`}
            alt="collapsing icon"
          />
        </div>
      </div>
      {isDatePickerOpen && !showMonthsSelector && !showHourPicker && (
        <div className="absolute w-full bg-white top-9 rounded-md z-10 shadow drop-shadow-white p-3 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between w-full mb-2">
            <img
              className="rotate-90 h-1.5 cursor-pointer"
              key="month-selector-left"
              src="./collapsing-gray.svg"
              alt="collapsing icon"
              onClick={() => {
                if (selectedMonth == 1) {
                  setSelectedYear(selectedYear - 1);
                  setSelectedMonth(12);
                } else setSelectedMonth(selectedMonth - 1);
              }}
            />
            <h1
              className="text-sm font-semibold cursor-pointer hover:text-slate-800/70 max-[1400px]:text-[8px]"
              onClick={() => setShowMonthsSelector(!showMonthsSelector)}
            >
              {months[selectedMonth]} {selectedYear}
            </h1>
            <img
              className="-rotate-90 h-1.5 cursor-pointer"
              key="month-selector-right"
              src="./collapsing-gray.svg"
              alt="collapsing icon"
              onClick={() => {
                if (selectedMonth == 12) {
                  setSelectedYear(selectedYear + 1);
                  setSelectedMonth(1);
                } else setSelectedMonth(selectedMonth + 1);
              }}
            />
          </div>
          {daysOfTheCurrentMonth.map((week, index) => (
            <div
              key={index}
              className="flex flex-row grid-cols-7 gap-1 w-full text-sm max-[1400px]:text-[8px] font-normal"
            >
              {Object.entries(week).map(([day, date]) => {
                const dateMonth = parseInt(date.split("-")[1], 10);
                const isCurrentMonth = dateMonth === selectedMonth;

                return (
                  <div
                    key={day}
                    className={`col-span-1 w-full hover:bg-black/50 flex justify-center items-center rounded-sm hover:text-white cursor-pointer p-0.5 ${
                      isCurrentMonth ? "text-black" : "text-black/50"
                    } ${
                      selectedDate && selectedDate === date
                        ? "text-white bg-black"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectDate(date);
                      localStorage.setItem(name, date);
                      setIsDatePickerOpen(false);
                      setShowHourPicker(true);
                    }}
                  >
                    {date.split("-")[2]}
                  </div>
                );
              })}
            </div>
          ))}
          <button
            className="w-full h-10 hover:bg-gray-400 rounded-md font-semibold text-black border-1 border-gray-400 hover:text-white cursor-pointer"
            onClick={() => {
              const today = format(new Date(), "yyyy-MM-dd");
              setSelectDate(today);
              localStorage.setItem(name, today);
              setIsDatePickerOpen(false);
              setShowHourPicker(true);
            }}
          >
            Today
          </button>
        </div>
      )}
      {showMonthsSelector && !showHourPicker && (
        <MonthSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          setShowMonthsSelector={setShowMonthsSelector}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      )}
      {showHourPicker && (
        <HourPicker
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          selectedSeconds={selectedSeconds}
          selectedMilliseconds={selectedMilliseconds}
          setSelectedMilliseconds={setSelectedMilliseconds}
          setSelectedHour={setSelectedHour}
          setSelectedMinute={setSelectedMinute}
          setSelectedSeconds={setSelectedSeconds}
          setSelectedTime={setSelectedTime}
          setShowHourPicker={setShowHourPicker}
        />
      )}
    </div>
  );
}
