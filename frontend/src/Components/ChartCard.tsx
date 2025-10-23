import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import {
  FiDownload,
  FiRefreshCcw,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

interface ChartCardProps {
  header: string;
  x: number[];
  y: (number | null)[];
  headers: string[];
}

export default function ChartCard({ header, x, y, headers }: ChartCardProps) {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const handleExport = (type: "png" | "jpeg") => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(`image/${type}`);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${header}.${type}`;
      link.click();
    }
  };

  const handleResetZoom = () => {
    chartRef.current?.resetZoom();
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const factor = direction === "in" ? 1.2 : 0.8;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomPlugin = (chart as any).$zoom;
    if (zoomPlugin) {
      // Fallback in case the plugin provides a custom API
      zoomPlugin.zoom({ x: factor, y: factor });
    } else {
      // Basic manual zoom (adjusting chart area)
      const zoomOptions = chart.options.plugins?.zoom?.zoom;
      if (zoomOptions) {
        chart.zoom({ x: factor, y: factor });
      }
    }
  };

  return (
    <div className="w-full h-[30vh] min-h-[300px] mb-10 bg-white rounded-2xl border-2 border-black flex flex-col p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={() => handleZoom("in")}
            className="hover:text-[#c1092a] transition"
            title="Zoom In"
          >
            <FiZoomIn size={18} />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="hover:text-[#c1092a] transition"
            title="Zoom Out"
          >
            <FiZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="hover:text-[#c1092a] transition"
            title="Reset Zoom"
          >
            <FiRefreshCcw size={18} />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-[#c1092a] text-center flex-1">
          {header}
        </h3>
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={() => handleExport("png")}
            className="flex items-center gap-1 hover:text-[#c1092a] transition text-sm font-medium"
            title="Export as PNG"
          >
            <FiDownload size={16} />
            PNG
          </button>
          <button
            onClick={() => handleExport("jpeg")}
            className="flex items-center gap-1 hover:text-[#c1092a] transition text-sm font-medium"
            title="Export as JPG"
          >
            <FiDownload size={16} />
            JPG
          </button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <Line
          ref={chartRef}
          data={{
            labels: x,
            datasets: [
              {
                label: header,
                data: y,
                fill: false,
                borderColor: "#c1092a",
                backgroundColor: "#c1092a",
                tension: 0.2,
                pointRadius: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false },
              zoom: {
                zoom: {
                  wheel: { enabled: true },
                  pinch: { enabled: true },
                  mode: "xy",
                },
                pan: {
                  enabled: true,
                  mode: "xy",
                },
              },
            },
            scales: {
              x: {
                grid: { color: "#f0f0f0" },
                ticks: { color: "#444" },
                title: { display: true, text: headers[0], color: "#333" },
              },
              y: {
                grid: { color: "#f0f0f0" },
                ticks: { color: "#444" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
