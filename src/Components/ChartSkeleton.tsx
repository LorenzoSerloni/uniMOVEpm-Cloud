export default function ChartSkeleton() {
  // No dark mode logic needed
  const aux: number[] = Array.from({ length: 10 }, (_, i) => i);

  const validHeights = [
    "h-6",
    "h-24",
    "h-16",
    "h-32",
    "h-20",
    "h-28",
    "h-24",
    "h-20",
    "h-12",
    "h-8",
  ];

  return (
    <div
      role="status"
      className="w-full h-[30vh] min-h-[300px] mb-10 bg-white animate-pulse flex flex-col items-center justify-center rounded-lg shadow-lg border-2 border-black p-6"
    >
      {/* Simulated chart title */}
      <div className="flex items-center mb-6 w-full">
        <div className="w-8 h-8 rounded-full bg-[#c1092a] opacity-80 mr-3" />
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
      </div>
      {/* Simulated chart bars/lines */}
      <div className="flex-1 flex items-end justify-between gap-2 px-2 w-full">
        {aux.map((index: number) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-4 md:w-6 ${validHeights[index]} rounded-t-lg`}
              style={{
                background: "linear-gradient(180deg, #c1092a 70%, #f3f3f3 100%)",
                opacity: 0.85,
              }}
            ></div>
            <div className="w-4 md:w-6 h-2 bg-gray-100 rounded-b-lg mt-1" />
          </div>
        ))}
      </div>
      {/* Simulated x-axis */}
      <div className="w-full h-2 bg-gray-200 rounded-full mt-6" />
    </div>
  );
}