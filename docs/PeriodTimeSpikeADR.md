
# Investigation into the Complex Time Period Reporting

One of the key requirements is to enable the ability to display various complex date periods on the line chart and data tables. Currently, in next generation fingertip , we are only displaying data only calendar years, and some of it is being displayed incorrectly, ignoring the indicators "year type".

The fingertips current website, uses this various year types to compute and display the period label.


## Reporting Year Types

These are the different time period formats currently in use:
| Year Type | Indicator ID | Period Format | Frequency |
|  ---      |---        |---     | ---         | 
| Calendar  |  |  |  |
| Financial | 20401 | e.g 1998, 1999, 2000,... |  1yr |
| Academic    | 92033 | e.g 2009/10 - 13/14,... | 5yrs |
| Financial Rolling Year – Quarterly   | 91041 | 2023/24 Q3 | Quarterly |
| Calendar Rolling – Quarterly   |  |  | |
| Calendar Rolling Year – Monthly   |  |  | |
| Financial Single Year – Cumulative Quarters   |  |  | |
| August–July   |  |  | |
| March–February   |  |  | |
| Financial Multi-Year – Cumulative Quarters   | 91112 | 2020/21 Q1 - 2020/21 Q2  | Quarterly |
| October–September   |  |  |  |
| Financial Rolling Year – Monthly   |  |  | |
| July–June   |  |  | |
| November–November   |  |  | |
| Financial Year Endpoint   | 93468 |  e.g 1998, 1999,... | Annual |


This spike is to find the approaches appropriate we have to take to be able to support this complex year reporting types, that can be discussed with the team.


---

## Table of Contents

- [Problem Overview](#problem-overview)  
  - [The Current Charts](#CurrentChart)
  - [The Goals](#TheGoals)
- [Proposed Solutions](#proposed-solution)  
  - [Definitions](#definitions)  
  - [Solution A](#SolutionA)
    - [Database Creator](#DatabaseCreatorChangesOnSolutionA)
    - [Health Data](#health-data)  
    - [Field Types and Descriptions](#field-types-and-descriptions)  
  
  - [Solution B](#SolutionB)  
  - [Option A](#option-a)  
    - [Database Changes Required](#database-changes-required)  
    - [Frontend Changes Required](#frontend-changes-required)  
  - [Option B](#option-b)  
  - [Option C](#option-c)  
- [High Chart Changes](#HighChanges)
- [References](#references)

---

## Problem Overview
  -  As a user I want to be able to see different period labels base on the indicator on the charts and on data tables. 

At the moment , we are plotting  the y-values to the x-values (year as the period label ) as shown below.

### Current Chart

![Chart Image](./images/current_fingertips_linechart.png)

However, want we want is to make the chart period more dynamic, in this way we can accommodate different year types and the appropriate ticks on chart labels.

An example will be: 

![](./images/Current_Q1_reporting.png)

### Goals

The goal is to propose how to handle the following:

- Required database changes  
- Whether the Time Period should be treated as its own dimension  
- Whether API changes are required  
- Frontend changes required, including:  
  - Handling different time periods in the Highcharts line chart (currently, years are treated as integers on the x-axis)  
  - Ensuring sorting still works in various areas  
  - How to display the period type  
- Agreement on which types of date periods should be supported for **FingertipsNext**  
- Documentation of proposed options (and ideally a recommendation) in Confluence

---

## Proposed Solutions
Below is a list of the proposed solutions and the modules that would be affected if any of them is accepted.

#### Require Module Changes
| Component Name | Descriptions | Change Required |
| -- | -- | -- |
| DataCreator | Ingestion Module , we need to add new fields e.g TimePeriod , YearType | Yes |
| Database | The HealthMeasure point table will have to change to accommodate new types | Yes |
| Frontend | Any frontend component that is using year on a chart has to change to use the PeriodLabel instead | Yes |
| Backend API | Allow for new fields to be returned |  Yes |
| HighChart | Advance configuration on Highchart to allow tick labels on the charts to avoid stacking | Yes |


### Solution A
In this option A, I propose precomputing the "Time Period" fields during data ingestion into the current Fingertips database. 

![](./images/Time%20Period%20Fingertips.png)

#### Database Creator
  Currently, the database creator serves as a temporary data ingestion module for the next-generation database.
  The proposed solution suggests performing all period label computations within this module—if they are missing—prior to ingesting the timePeriod label into the Fingertips database, along with the year, as is currently being done.


##### Require fields need to compute the labels are shown below


| Field                         | Type   | Description                                                                                      | Required |
|------------------------------|--------|---------------------------------------------------------------------------------------------------|----------|
| **Indicator**.yearType       | string | Used to identify the indicator                                                                    | Yes      |
| **Indicator**.Frequency    | string | The name of the indicator                                                                         | Yes      |
| Time Period                  | string | The data point period label or period of collection                                               | Optional |
| **HealthData**               | struct |                                                                                                   |          |
| **HealthData**.TimePeriodSortable | int    | Contains the year, and the quarterly report it was reported  e.g 20100000                        | Yes      |
| **HealthData**.TimePeriodRange  | string | Reporting period range. For calendar years we have `1yr`; for financial, quarterly, etc , optional if we have the frequency     | Optional |

---
 If we are doing the pre-calculation in the Data Creator , we don't really need to export all the fields to our database. We create a new fields called PeriodLabel which the out of the pre-computation can be exported. 

```csharp
// File: DataCreator/DataCreator/DataFileReader.cs
var indicatorData = new HealthMeasureEntity
{
    IndicatorId = indicatorId,
    TimePeriod = timePeriod,
    ...
};
allData.Add(indicatorData);
```

##### The Expected Output
- `PeriodLabel`: the displayable labels for the data points

#### Database Schema  Changes
 The only important changes here is adding a new field on the HealthMeasure Table.

 ```sql
CREATE TABLE [dbo].[HealthMeasure](
    [HealthMeasureKey] [int] IDENTITY(1,1) NOT NULL, 
    [PeriodLabel] NVARCHAR(30)  NOT NULL, 
    ...
)
```

#### API Endpoint Changes
Adding a new PeriodLabel to the HealthDataPoint 

```TypeScript
export interface HealthDataPoint {
    periodLabel: string, 
    ...
}
```
---


### Solution B

Solution B is similar to Solution A; however, instead of performing the period label pre-calculation in the DataCreator module before ingestion, we can ingest the required fields and recalculate the period labels either at the API level or on the frontend before displaying them.


### Database Changes
We need to track the new fields at the database level to enable recalculation in case they are missing or stored in an incorrect format.


| Field                  | Type   | Source | Destination |
|----------------------  |--------| ---  | --- |
| **Indicator**.yearType | string | Philo Database | fingertips.IndicationDimension |
| Time Period Sortable   | string    | CSV Database | fingertips.HealthMeasure|
| PeriodLabel  | string   | Calculated Field | fingertips.HealthMeasure |
| Time Period Range      | string | CSV Database | fingertips.IndicationDimension|

---

After porting this fields to the next generation database the same calculations for the period label has to be carryout and the period label has to be updated.


### Optional C
  Do nothing at all 


## Frontend : High chart changes

Currently, the frontend only displays years without labels. Instead, what we want to do is the ability to display a label along side a tick bars that will allow us to display different range values within the x-Axis of the high chart.



Example:

```javascript
xAxis: {
  categories: xValues,
  max: xValues.length - 1,
  tickLength: 0,
  allowDecimals: false,
  labels: { style: { fontSize: AXIS_LABEL_FONT_SIZE } },
}
```

### Example TypeScript Function

```typescript
const generateTimePeriodsFrom = (timePeriodHealthData: HealthDataPoint[]) => {
  const seenPeriods: string[] = [];
  const timePeriodLabels: string[] = [];

  timePeriodHealthData.forEach((h) => {
    const year = h.year.toString();
    const index = seenPeriods.indexOf(year);

    if (index === -1) {
      seenPeriods.push(year);
      timePeriodLabels.push(h.timePeriod ?? year);
    } else if (h.timePeriod) {
      if (timePeriodLabels[index] !== h.timePeriod) {
        timePeriodLabels[index] = h.timePeriod;
      }
    }
  });

  return timePeriodLabels;
};
```

This ensures that duplicates are avoided and that correct labels are shown.

---

## Option B

Instead of computing values during ingestion, we can compute them at the API level or directly in the frontend. In this approach:

- The code remains similar
- Less upfront processing, but could be slower at runtime
- Depends heavily on the frontend to correct and display the proper labels

---

## References

Coming soon: [Line Chart](#)

---

Would you like me to help refactor this into a Confluence-ready version or into a project proposal format?