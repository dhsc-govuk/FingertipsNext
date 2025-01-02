import { Data } from "./types";

export const sampleData: Data[] = [
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
  {
    IID: "300",
    Descriptive: {
      Name: "Participation rate, total",
      Definition:
        "Proportion of eligible children measured in the National Child Measurement Programme (NCMP)",
    },
  },
  {
    IID: "310",
    Descriptive: {
      Name: "Rate of admissions due to liver disease in per 300,000 population",
      Definition: "Directly age-standardised rate of hospital admissions due to liver disease in per 300,000 population",
    },
  },
  {
    IID: "316",
    Descriptive: {
      Name: "Study of of drug sensitive TB notifications across full course of treatment",
      Definition: 
        "The annual proportion of drug sensitive TB notifications expected to complete treatment within 310 days of treatment start date",
    },
  },
  {
    IID: "327",
    Descriptive: {
      Name: "Waiting < 310 days to enter IAPT treatment ",
      Definition: 
        "Study across 316 hospitals of the number of service requests with first treatment appointment in the month where the individual had a significant wait",
    },
  },
  {
    IID: "330",
    Descriptive: {
      Name: "Waiting > 310 days to enter IAPT treatment ",
      Definition: 
        "Study of the number of service requests with first treatment appointment in the month where the individual had a > 310 day wait",
    },
  },
];
