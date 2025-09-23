import React from "react";
import CardSkeleton from "./CardSkeleton";

interface SimulationCardsSkeletonProps {
  cardsPerRow?: number;
  rows?: number;
}

const SimulationCardsSkeleton = ({ cardsPerRow = 4, rows = 1 }: SimulationCardsSkeletonProps) => (
  <>
    {[...Array(rows)].map((_, rowIdx) => (
      <React.Fragment key={rowIdx}>
        <div className="flex w-full justify-center items-center gap-8 mt-4">
          <div className="w-80 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="text-xl font-semibold text-gray-400 dark:text-gray-600">
            &nbsp;
          </div>
          <div className="w-80 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div className="mt-6 w-full grid grid-cols-4 px-4 max-[1800px]:px-2 gap-8 mb-6">
          {[...Array(cardsPerRow)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </React.Fragment>
    ))}
  </>
);

export default SimulationCardsSkeleton;