import React from "react";

const CardSkeleton = () => (
  <div className="col-span-1 flex justify-center">
    <div className="h-64 w-112 max-[1800px]:w-96 max-[1800px]:h-60 rounded-lg border-2 border-black flex flex-row bg-white animate-pulse">
      {/* Left title bar */}
      <div className="bg-black w-64 max-[1800px]:w-56 h-full flex flex-col py-3 px-7 max-[1800px]:px-5">
        <div className="border-b-2 border-white flex w-full items-center mt-2 pb-2">
          <div className="h-6 w-32 max-[1800px]:w-24 bg-gray-700 rounded" />
        </div>
      </div>
      {/* Right content */}
      <div className="bg-none w-48 max-[1800px]:w-40 h-full flex flex-col p-2">
        {/* Top right "tipology" badge */}
        <div className="flex h-1/6 w-full justify-end items-center">
          <div className="border-2 border-black p-2 rounded-sm h-7 flex flex-row items-center gap-2 relative justify-between">
            <div className="flex flex-row items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c1092a] opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-[#c1092a]/70"></span>
              </span>
              <div className="h-4 w-12 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-4 bg-gray-300 rounded" />
          </div>
        </div>
        {/* Center image */}
        <div className="w-full h-4/6 flex justify-center items-center">
          <div className="h-36 w-36 bg-gray-200 rounded" />
        </div>
        {/* Delete button */}
        <div className="flex h-1/6 w-full justify-end items-center">
          <div className="h-8 w-8 bg-gray-300 flex justify-center items-center rounded-md p-2" />
        </div>
      </div>
    </div>
  </div>
);

export default CardSkeleton;