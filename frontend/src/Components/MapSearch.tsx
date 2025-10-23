// MapSearch.tsx
import React from "react";

interface MapSearchProps {
  searchInputs: {
    x: string;
    y: string;
    time: string;
  };
  setSearchInputs: React.Dispatch<
    React.SetStateAction<{ x: string; y: string; time: string }>
  >;
  onHighlight: () => void;
  onClear: () => void;
}

export default function MapSearch({
  searchInputs,
  setSearchInputs,
  onHighlight,
  onClear,
}: MapSearchProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end px-8 pt-2 pb-2">
      <div className="flex flex-col">
        <label className="text-xs font-semibold pl-2">X</label>
        <input
          type="number"
          step="0.001"
          value={searchInputs.x}
          onChange={(e) =>
            setSearchInputs((p) => ({ ...p, x: e.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 w-24"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold pl-2">Y</label>
        <input
          type="number"
          step="0.001"
          value={searchInputs.y}
          onChange={(e) =>
            setSearchInputs((p) => ({ ...p, y: e.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 w-24"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold pl-2">Time</label>
        <input
          type="number"
          step="0.001"
          value={searchInputs.time}
          onChange={(e) =>
            setSearchInputs((p) => ({ ...p, time: e.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 w-24"
        />
      </div>
      <button
        onClick={onHighlight}
        className="flex flex-row gap-4 font-medium items-center px-4 py-2 rounded transition text-xs bg-[#c1092a] text-white hover:bg-[#a10822]"
      >
        <h1>Highlight</h1>
        <img src="/map.svg" className="h-4.5" alt="dowload icon" />
      </button>
      <button
        onClick={onClear}
        className="flex flex-row gap-4 font-semibold items-center px-4 h-8.5 rounded transition text-xs bg-black text-white hover:bg-gray-800"
      >
        <h1>Clear</h1>
      </button>
    </div>
  );
}
