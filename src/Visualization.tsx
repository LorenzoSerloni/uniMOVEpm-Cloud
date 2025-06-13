import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCsvFile } from "./Shared/ApiFunctionCaller";
import { AuthContext } from "./Contexts/SettingAuth";
import { DataContext } from "./Contexts/SettingsContext";
import Navbar from "./Components/Navbar,";
import ChartSkeleton from "./Components/ChartSkeleton";
import ChartCard from "./Components/ChartCard";
import HeaderRow from "./Components/HeaderRow";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function parseCSV(csv: string) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => line.split(","));
  return { headers, data };
}

export default function Visualization() {
  const { date, title } = useParams();
  const realTime = title;
  const { idToken } = useContext(AuthContext);
  const { dark } = useContext(DataContext);
  const [csvData, setCsvData] = useState<{ headers: string[]; data: string[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idToken || !date || !realTime) return;
    const [yyyy, mm, dd] = date.split("-");
    const apiDate = `${dd}-${mm}-${yyyy}`;
    getCsvFile(idToken, apiDate, realTime)
      .then((csv) => setCsvData(parseCSV(csv)))
      .catch(() => setError("Failed to load CSV data"));
  }, [idToken, date, realTime]);

  if (error) return <div>{error}</div>;

  if (!csvData) {
    return (
      <div className={`h-dvh w-full flex flex-col ${dark ? "bg-black" : "bg-white"}`}>
        <Navbar />
        <div className="flex flex-col flex-1 items-center justify-center w-full overflow-auto h-full">
          <HeaderRow date={date} realTime={realTime} dark={dark} />
          <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-8 px-8 py-8 col-span-1">
            {[...Array(4)].map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { headers, data } = csvData;
  const x = data.map((row) => Number(row[0]));
  const charts = headers
    .slice(1)
    .filter((header) => header.trim().toLowerCase() !== "engine")
    .map((header, idx) => {
      const realIdx = headers.findIndex((h) => h === header);
      const y = data.map((row) => {
        const val = row[realIdx];
        return val === undefined || val === "" ? null : Number(val);
      });
      return (
        <ChartCard key={header + idx} header={header} x={x} y={y} headers={headers} />
      );
    });

  return (
    <div className={`h-dvh w-full flex flex-col ${dark ? "bg-black" : "bg-white"}`}>
      <Navbar />
      <div className="flex flex-col flex-1 items-center justify-center w-full overflow-auto h-full">
        <HeaderRow date={date} realTime={realTime} dark={dark} />
        <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-8 px-8 py-8 col-span-1">
          {charts}
        </div>
      </div>
    </div>
  );
}
