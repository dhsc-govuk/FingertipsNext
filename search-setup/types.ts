export interface Data {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
  };
  // Most recent value held in database column 'Year'.
  LatestDataPeriod: string;
}
