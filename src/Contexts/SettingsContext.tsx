import { createContext } from "react";

export const DataContext = createContext<{
  selectedStartingDate: string;
  setSelectedStartingDate: React.Dispatch<React.SetStateAction<string>>;
  selectedStartingTime: string;
  setSelectedStartingTime: React.Dispatch<React.SetStateAction<string>>;
  selectedEndingDate: string;
  setSelectedEndingDate: React.Dispatch<React.SetStateAction<string>>;
  selectedEndingTime: string;
  setSelectedEndingTime: React.Dispatch<React.SetStateAction<string>>;
  simulationType: { value: string; label: string }[];
  setSimulationType: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >;
  durationType: { value: string; label: string }[];
  setDurationType: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >;
  dark: boolean;
  setDark: (v: boolean) => void;
}>({
  selectedStartingDate: "",
  setSelectedStartingDate: () => {},
  selectedStartingTime: "",
  setSelectedStartingTime: () => {},
  selectedEndingDate: "",
  setSelectedEndingDate: () => {},
  selectedEndingTime: "",
  setSelectedEndingTime: () => {},
  simulationType: [],
  setSimulationType: () => {},
  durationType: [],
  setDurationType: () => {},
  dark: false,
  setDark: () => {},
});
