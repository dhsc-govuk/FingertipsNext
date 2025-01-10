import { GeographySearchData, IndicatorSearchData } from "./types";

export const sampleIndicatorData: IndicatorSearchData[] = [
  {
    IID: "108",
    Descriptive: {
      Name: "Under 75 mortality rate from all causes",
      Definition:
        "Directly age-standardised mortality rate for all deaths, per 100,000 population, in those aged under 75 years",
    },
  },
  {
    IID: "113",
    Descriptive: {
      Name: "Smoking attributable mortality (old method)",
      Definition:
        "<p>Deaths attributable to smoking, directly age standardised rate for persons aged 35 years +. Relative risks by ICD10 code from The Information Centre for Health and Social Care, Statistics on Smoking: England 2010. A full description of the methodology is available in the APHO Health Profiles user guide.</p>",
    },
  },
  {
    IID: "114",
    Descriptive: {
      Name: "QOF Total List Size",
      Definition: "Total number of patients registered with the practice",
    },
  },
  {
    IID: "200",
    Descriptive: {
      Name: "Learning disability: QOF prevalence (all ages)",
      Definition:
        "The percentage of patients with learning disabilities, as recorded on practice disease registers",
    },
  },
  {
    IID: "212",
    Descriptive: {
      Name: "Stroke: QOF prevalence (all ages)",
      Definition:
        "The percentage of patients with stroke or transient ischaemic attack (TIA), as recorded on practice disease registers (proportion of total list size).",
    },
  },
];

export const sampleGeographyData: GeographySearchData[] = [
  {
    id: "1",
    areaName: "Manchester",
    areaType: "City",
    areaCode: "M1 3DG",
  },
  {
    id: "2",
    areaName: "Blackburn",
    areaType: "City",
    areaCode: "BB1 3BL",
  },
  {
    id: "3",
    areaName: "London",
    areaType: "City",
    areaCode: "BB1 3BL",
  },
];
