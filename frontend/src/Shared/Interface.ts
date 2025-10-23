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

/**
 * Interface representing a single 2D point.
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Interface representing the position of a car.
 * 
 * @property {number} Xcoordinate - The X coordinate of the car's position.
 * @property {number} Ycoordinate - The Y coordinate of the car's position.
 * @property {number} AngleOrientation - The angle orientation of the car.
 * @property {Point2D[]} ProjectedTrajectory - Array of projected trajectory points.
 */
export interface CarPositioning {
  Xcoordinate: number;
  Ycoordinate: number;
  AngleOrientation: number;
  ProjectedTrajectory: Point2D[];
}

/**
 * Interface representing the dimensions of an image.
 *
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */
export interface MapImageDimensions {
    width: number;
    height: number;
}

export interface Point {
    x: number;
    y: number;
    speed: number;
}
