import React from "react";
import SimulationCard from "./SimulationCard";
import SimulationCardsSkeleton from "./SimulationCardsSkeleton";
import type { DataPreview } from "../Shared/Interface";

interface SimulationCardsListProps {
  simulationCardsMockByDay: DataPreview[];
  onDeleteSimulation?: (date: string, title: string) => void;
}

const SimulationCardsList = ({
  simulationCardsMockByDay,
  onDeleteSimulation,
}: SimulationCardsListProps) => (
  <div className="overflow-y-auto h-4/5">
    {simulationCardsMockByDay.length === 0 ? (
      <SimulationCardsSkeleton cardsPerRow={4} rows={2} />
    ) : (
      simulationCardsMockByDay.map((Data, index) => (
        <React.Fragment key={index}>
          <div className="flex w-full justify-center items-center gap-8 mt-4">
            <div className="w-80 h-1 rounded-full bg-black "></div>
            <div className="text-xl font-semibold text-black ">
              {Data.date.toLocaleDateString()}
            </div>
            <div className="w-80 h-1 rounded-full bg-black"></div>
          </div>
          <div className="mt-6 w-full grid grid-cols-4 px-4 max-[1800px]:px-2 gap-8 mb-6">
            {Data.SimulationData.map((Simulation, simIndex) => (
              <div
                key={Simulation.title + simIndex}
                className="col-span-1 flex justify-center"
              >
                <SimulationCard
                  title={Simulation.title}
                  date={Data.date.toLocaleDateString()}
                  onDelete={
                    onDeleteSimulation
                      ? () =>
                          onDeleteSimulation(
                            Data.date.toLocaleDateString(),
                            Simulation.title
                          )
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </React.Fragment>
      ))
    )}
  </div>
);

export default SimulationCardsList;
