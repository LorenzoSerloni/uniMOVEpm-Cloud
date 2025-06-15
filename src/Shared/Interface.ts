export interface SimulationCard {
  title: string;
}

export interface DataPreview{
  date: Date
  SimulationData: SimulationCard[]
}

export  interface SimulationData {
    title: string;
  }

export interface SimulationCardByDay {
    date: Date;
    SimulationData: SimulationData[];
  }

export type Week = {
  mondays: string;
  tuesdays: string;
  wednesdays: string;
  thursdays: string;
  fridays: string;
  saturdays: string;
  sundays: string;
};