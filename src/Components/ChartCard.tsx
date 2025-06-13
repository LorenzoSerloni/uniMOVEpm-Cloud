import { Line } from "react-chartjs-2";

interface ChartCardProps {
  header: string;
  x: number[];
  y: (number | null)[];
  headers: string[];
}

export default function ChartCard({ header, x, y, headers }: ChartCardProps) {
  return (
    <div className="w-full h-[30vh] min-h-[300px] mb-10 bg-white rounded-lg shadow-lg border-2 border-black flex flex-col items-center justify-center p-6">
      <h3 className="text-lg font-semibold mb-2 text-[#c1092a]">{header}</h3>
      <Line
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
            legend: { display: true, position: "top" as const },
            title: { display: false },
          },
          scales: {
            x: {
              grid: { color: "#eee" },
              ticks: { color: "#222" },
              title: { display: true, text: headers[0] },
            },
            y: { grid: { color: "#eee" }, ticks: { color: "#222" } },
          },
        }}
      />
    </div>
  );
}