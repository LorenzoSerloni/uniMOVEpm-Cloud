import { useState, type ReactNode } from "react";
import { DataContext } from "./SettingsContext";
import { format } from "date-fns";

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStartingDate, setSelectedStartingDate] = useState<string>(
    localStorage.getItem("startingDate") || format(new Date(), "yyyy-MM-dd")
  );
  const [selectedStartingTime, setSelectedStartingTime] = useState<string>(
    format(new Date(), "HH:mm:ss")
  );
  const [selectedEndingDate, setSelectedEndingDate] = useState<string>(
    localStorage.getItem("endingDate") || format(new Date(), "yyyy-MM-dd")
  );
  const [selectedEndingTime, setSelectedEndingTime] = useState<string>(
    format(new Date(), "HH:mm:ss")
  );
  const [simulationType, setSimulationType] = useState<
    { value: string; label: string }[]
  >([]);
  const [durationType, setDurationType] = useState<
    { value: string; label: string }[]
  >([]);

  return (
    <DataContext.Provider
      value={{
        selectedStartingDate,
        setSelectedStartingDate,
        selectedStartingTime,
        setSelectedStartingTime,
        selectedEndingDate,
        setSelectedEndingDate,
        selectedEndingTime,
        setSelectedEndingTime,
        simulationType,
        setSimulationType,
        durationType,
        setDurationType,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
