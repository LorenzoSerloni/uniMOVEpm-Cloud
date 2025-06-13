import { useContext, useEffect, useState } from "react";
import Navbar from "./Components/Navbar,";
import SimulationCardsList from "./Components/SimulationCardsList";
import { DataContext } from "./Contexts/SettingsContext";
import FiltersBar from "./Components/FilterBar";
import { AuthContext } from "./Contexts/SettingAuth";
import { getSimulationDataByDay, deleteSimulation } from "./Shared/ApiFunctionCaller";

function App() {
  const {
    selectedStartingDate,
    selectedEndingDate,
    selectedStartingTime,
    selectedEndingTime,
    setSelectedStartingDate,
    setSelectedEndingDate,
    setSelectedStartingTime,
    setSelectedEndingTime,
  } = useContext(DataContext);

  const { idToken } = useContext(AuthContext);

  interface SimulationData {
    title: string;
  }

  interface SimulationCardByDay {
    date: Date;
    SimulationData: SimulationData[];
  }

  const [allSimulationCards, setAllSimulationCards] = useState<SimulationCardByDay[]>([]);
  const [filteredSimulationCards, setFilteredSimulationCards] = useState<SimulationCardByDay[]>([]);

  // Fetch all cards once
  useEffect(() => {
    if (!idToken) return;
    getSimulationDataByDay(idToken)
      .then((files) => {
        setAllSimulationCards(files);
      })
      .catch(() => {
        // handle error, maybe redirect to /error
      });
  }, [idToken]);

  // Filter cards by interval
  useEffect(() => {
    if (!selectedStartingDate || !selectedEndingDate) {
      setFilteredSimulationCards(allSimulationCards);
      return;
    }

    // Build start and end Date objects in local time
    const start = new Date(`${selectedStartingDate}T${selectedStartingTime}`);
    const end = new Date(`${selectedEndingDate}T${selectedEndingTime}`);

    const filtered = allSimulationCards
      .map((day) => {
        // Format day.date as YYYY-MM-DD
        const dayString = [
          day.date.getFullYear(),
          String(day.date.getMonth() + 1).padStart(2, "0"),
          String(day.date.getDate()).padStart(2, "0"),
        ].join("-");
        const filteredSimulations = day.SimulationData.filter((sim) => {
          // sim.title is HH-MM-SS, convert to HH:MM:SS
          const simTime = sim.title.replace(/-/g, ":");
          const simDate = new Date(`${dayString}T${simTime}`);
          return simDate >= start && simDate <= end;
        });
        return { ...day, SimulationData: filteredSimulations };
      })
      .filter((day) => day.SimulationData.length > 0);

    setFilteredSimulationCards(filtered);
  }, [
    allSimulationCards,
    selectedStartingDate,
    selectedEndingDate,
    selectedStartingTime,
    selectedEndingTime,
  ]);

  const handleDeleteSimulation = async (date: string, title: string) => {
    if (!idToken) return;
    // Support both "dd-mm-yyyy" and "dd/mm/yyyy"
    const [day, month, year] = date.replace(/\//g, "-").split("-");
    const apiDate = `${day}-${month}-${year}`;
    const apiTime = title.replace(/-/g, ":");
    try {
      await deleteSimulation(idToken, apiDate, apiTime);
      setAllSimulationCards(prev =>
        prev.map(dayObj => ({
          ...dayObj,
          SimulationData: dayObj.SimulationData.filter(
            sim => sim.title !== title || dayObj.date.toLocaleDateString() !== date
          )
        })).filter(dayObj => dayObj.SimulationData.length > 0)
      );
    } catch {
      alert("Failed to delete simulation");
    }
  };

  return (
    <div className="h-dvh w-full bg-white flex flex-col">
      <Navbar />
      <div className="h-1/10 w-full flex flex-row justify-center items-center pb-3 text-2xl font-bold bg-none gap-2 pt-20 ">
        <img src="./chart.svg" alt="chart" className="h-12 mr-2" />
        <h1>Search your session</h1>
        <img src="./lens.svg" alt="chart" className="h-14" />
      </div>
      <FiltersBar
        selectedStartingDate={selectedStartingDate}
        setSelectedStartingDate={setSelectedStartingDate}
        selectedEndingDate={selectedEndingDate}
        setSelectedEndingDate={setSelectedEndingDate}
        selectedStartingTime={selectedStartingTime}
        setSelectedStartingTime={setSelectedStartingTime}
        selectedEndingTime={selectedEndingTime}
        setSelectedEndingTime={setSelectedEndingTime}
      />
      <SimulationCardsList
        simulationCardsMockByDay={filteredSimulationCards}
        onDeleteSimulation={handleDeleteSimulation}
      />
    </div>
  );
}

export default App;
