import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCsvFile } from "./Shared/ApiFunctionCaller";
import Navbar from "./Components/Navbar";
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
import MapView from "./MapView";
import type { Point } from "./Shared/Interface";
import MapSearch from "./Components/MapSearch";

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

  const [csvData, setCsvData] = useState<{
    headers: string[];
    data: string[][];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [highlightPoint, setHighlightPoint] = useState<Point | null>(null);
  const [projectedPath, setProjectedPath] = useState<Point[]>([]);
  const [searchInputs, setSearchInputs] = useState({ x: "", y: "", time: "" });

  // Fetch CSV data
  useEffect(() => {
    if (!date || !realTime) return;
    const [yyyy, mm, dd] = date.split("-");
    const apiDate = `${dd}-${mm}-${yyyy}`;
    getCsvFile(apiDate, realTime)
      .then((csv) => setCsvData(parseCSV(csv)))
      .catch(() => setError("Failed to load CSV data"));
  }, [date, realTime]);

  if (error) return <div>{error}</div>;

  if (!csvData) {
    return (
      <div className="h-dvh w-full flex flex-col bg-white">
        <Navbar height="h-17.5" />
        <div className="flex flex-col flex-1 items-center justify-center w-full overflow-auto h-full">
          <HeaderRow date={date} realTime={realTime} simulationOwner="????"/>
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

  const speedIdx = headers.findIndex((h) => h.trim().toLowerCase() === "speed");
  const mapWidthIdx = headers.findIndex(
    (h) => h.trim().toLowerCase() === "mapwidth"
  );
  const mapHeightIdx = headers.findIndex(
    (h) => h.trim().toLowerCase() === "mapheight"
  );
  const projXIdx = headers.findIndex(
    (h) => h.trim().toLowerCase() === "projectedtrajectoryx"
  );
  const projYIdx = headers.findIndex(
    (h) => h.trim().toLowerCase() === "projectedtrajectoryy"
  );
  const SimulationOwnerIdx = headers.findIndex(
    (h) => h.trim().toLowerCase() === "simulationowner"
  );

  const simulationOwner = data[0][SimulationOwnerIdx]

  // Real map size
  let realDimensions: number[] = [];
  if (mapWidthIdx !== -1 && mapHeightIdx !== -1 && data.length > 0) {
    const lastRow = data[data.length - 1];
    realDimensions = [
      Number(lastRow[mapWidthIdx]),
      Number(lastRow[mapHeightIdx]),
    ];
  }

  // Process CSV rows
  const processedData = data.map((row) => {
    const time = parseFloat(row[0]);
    const posX = parseFloat(row[1]);
    const posY = parseFloat(row[2]);
    const speed = speedIdx !== -1 ? parseFloat(row[speedIdx]) : 0;

    // Parse dash-separated projected trajectories
    const projected: Point[] = [];
    if (projXIdx !== -1 && projYIdx !== -1) {
      const xs = row[projXIdx] ? row[projXIdx].split("-").map(Number) : [];
      const ys = row[projYIdx] ? row[projYIdx].split("-").map(Number) : [];
      for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        projected.push({ x: xs[i], y: ys[i], speed: 0 });
      }
    }

    return { time, posX, posY, speed, projected };
  });

  // Actual path for MapView
  const actualPath: Point[] = processedData.map((r) => ({
    x: r.posX,
    y: r.posY,
    speed: r.speed,
  }));

  // Chart data
  const round3 = (n: number) => Number(n.toFixed(3));

  const time = processedData.map((r) => round3(r.time));
  const posX = processedData.map((r) => round3(r.posX));
  const posY = processedData.map((r) => round3(r.posY));

  const charts = headers
    .slice(1, -1)
    .filter(
      (header) =>
        ![
          "engine",
          "mapwidth",
          "mapheight",
          "posx",
          "posy",
          "projectedtrajectoryx",
          "projectedtrajectoryy",
        ].includes(header.trim().toLowerCase())
    )
    .map((header, idx) => {
      const realIdx = headers.findIndex((h) => h === header);
      const y = data.map((row) => {
        const val = row[realIdx];
        return val === undefined || val === "" ? null : round3(Number(val));
      });
      return (
        <ChartCard
          key={header + idx}
          header={header}
          x={time}
          y={y}
          headers={headers}
        />
      );
    });

 charts.unshift(
    <ChartCard
      key="PosY"
      header="Y Position over Time"
      x={time}
      y={posY}
      headers={["Time", "posY"]}
    />,
    <ChartCard
      key="PosX"
      header="X Position over Time"
      x={time}
      y={posX}
      headers={["Time", "posX"]}
    />
  );

  const handleHighlight = () => {
    let targetRow: (typeof processedData)[0] | null = null;

    if (searchInputs.time) {
      const targetTime = parseFloat(searchInputs.time);
      
      // Validate time range
      const minTime = processedData[0].time;
      const maxTime = processedData[processedData.length - 1].time;
      
      if (targetTime < minTime || targetTime > maxTime) {
        alert(`Time ${targetTime}s is outside the valid range: ${minTime.toFixed(3)}s - ${maxTime.toFixed(3)}s`);
        return;
      }
      
      targetRow = processedData.reduce((prev, curr) =>
        Math.abs(curr.time - targetTime) < Math.abs(prev.time - targetTime)
          ? curr
          : prev
      );
    } else if (searchInputs.x && searchInputs.y) {
      const targetX = parseFloat(searchInputs.x);
      const targetY = parseFloat(searchInputs.y);
      
      // Validate coordinate range
      const minX = Math.min(...processedData.map(r => r.posX));
      const maxX = Math.max(...processedData.map(r => r.posX));
      const minY = Math.min(...processedData.map(r => r.posY));
      const maxY = Math.max(...processedData.map(r => r.posY));
      
      if (targetX < minX || targetX > maxX || targetY < minY || targetY > maxY) {
        alert(`Coordinates (${targetX}, ${targetY}) are outside the valid range:\nX: ${minX.toFixed(2)} - ${maxX.toFixed(2)}\nY: ${minY.toFixed(2)} - ${maxY.toFixed(2)}`);
        return;
      }
      
      targetRow = processedData.reduce((prev, curr) => {
        const prevDist = Math.hypot(prev.posX - targetX, prev.posY - targetY);
        const currDist = Math.hypot(curr.posX - targetX, curr.posY - targetY);
        return currDist < prevDist ? curr : prev;
      });
    }

    if (targetRow) {
      setHighlightPoint({
        x: targetRow.posX,
        y: targetRow.posY,
        speed: targetRow.speed,
      });
      setProjectedPath(targetRow.projected || []);
    }
  };

  const handleClear = () => {
    setSearchInputs({ x: "", y: "", time: "" });
    setHighlightPoint(null);
    setProjectedPath([]);
  };

  return (
    <div className="h-dvh w-full flex flex-col bg-white">
      <Navbar height="h-18.5" />
      <HeaderRow date={date} realTime={realTime} simulationOwner={simulationOwner}/>
      <div className="flex flex-col w-full overflow-y-auto h-[86vh]">
        <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-8 px-8 py-4 col-span-1">
          {charts}
        </div>
        <MapSearch
          searchInputs={searchInputs}
          setSearchInputs={setSearchInputs}
          onHighlight={handleHighlight}
          onClear={handleClear}
        />
        <div className="flex w-full px-8 py-8">
          <MapView
            mapPath={`http://localhost:5001/map/${date}/${realTime}.svg`}
            realDimensions={realDimensions}
            actualPath={actualPath}
            projectedPath={projectedPath}
            highlightPoint={highlightPoint}
          />
        </div>
      </div>
    </div>
  );
}
