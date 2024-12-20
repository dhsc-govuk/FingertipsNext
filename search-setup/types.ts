export interface IndicatorSearchData {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
  };
}

export interface GeographySearchData {
  ID: string;
  Name: string;
  Type: string;
  Address: {
    AddressLine1: string;
    AddressLine2?: string;
    AddressLine3?: string;
    AddressLine4?: string;
    Postcode: string;
  };
}
