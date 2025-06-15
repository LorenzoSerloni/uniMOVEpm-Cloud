import React from "react";
import SimulationCard from "./SimulationCard";
import SimulationCardsSkeleton from "./SimulationCardsSkeleton";
import type { DataPreview, SimulationCardByDay } from "../Shared/Interface";

interface SimulationCardsListProps {
  allSimulationCards: SimulationCardByDay[];
  simulationCardsMockByDay: DataPreview[];
  onDeleteSimulation?: (date: string, title: string) => void;
}

const SimulationCardsList = ({
  allSimulationCards,
  simulationCardsMockByDay,
  onDeleteSimulation,
}: SimulationCardsListProps) => (
  <div className="overflow-y-auto h-4/5">
    {allSimulationCards.length === 0 && simulationCardsMockByDay.length === 0 ? (
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
          {Data.SimulationData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-12">
              <img
                src="./no-data.svg"
                alt="No simulations"
                className="h-32 mb-4 opacity-70"
                style={{ pointerEvents: "none" }}
              />
              <div className="text-lg font-semibold text-gray-500">
                Oops! No simulations are present for this day.
              </div>
            </div>
          ) : (
            <div className="mt-6 w-full grid grid-cols-4 px-4 max-[1800px]:px-2 gap-8 mb-6">
              {Data.SimulationData.map((Simulation, simIndex) => (
                <div
                  key={Simulation.title + simIndex}
                  className="col-span-1 flex justify-center"
                >
                  <SimulationCard
                    title={Simulation.title}
                    date={
                      (() => {
                        const d = Data.date;
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()
                    }
                    onDelete={
                      onDeleteSimulation
                        ? () =>
                            onDeleteSimulation(
                              (() => {
                                const d = Data.date;
                                const day = String(d.getDate()).padStart(2, "0");
                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                const year = d.getFullYear();
                                return `${day}-${month}-${year}`;
                              })(),
                              Simulation.title
                            )
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))
    )}
  </div>
);

export default SimulationCardsList;
