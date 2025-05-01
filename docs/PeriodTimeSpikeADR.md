
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
| Financial Year Endpoint   |  |  | |


This spike is to find the approaches appropriate we have to take to be able to support this complex year reporting types, that can be discussed with the team.


---

## Table of Contents

- [Problem Overview](#problem-overview)  
  - [Proposed Solution](#proposed-solution)  
  - [Definitions](#definitions)  
  - [Health Data](#health-data)  
    - [Field Types and Descriptions](#field-types-and-descriptions)  
  - [Different Day Types](#different-day-types)  
- [Proposed Solutions](#proposed-solutions)  
  - [Option A](#option-a)  
    - [Database Changes Required](#database-changes-required)  
    - [Frontend Changes Required](#frontend-changes-required)  
  - [Option B](#option-b)  
  - [Option C](#option-c)  
- [References](#references)

---

## Problem Overview
  -  As a user I want to be able to see different period labels base on the indicator on the charts and on data tables. 

At the moment , we are plotting  the y-values to the x-values (year as the period label ) as shown below.

### Current Chart

![Chart Image](./images/current_fingertips_linechart.png)

However want we want is to make the chart period more dynamic, in this way we can accommodate different year types and the appropriate ticks on chart labels.

An example of will be something like: 

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

## Health Data

Currently, the health data points come from downloadable CSV files, which contain the following columns or features:

### Health Data Collection Periods

The data is collected across different time periods, listed below.

### Field Types and Descriptions

| Field                         | Type   | Description                                                                                       | Required |
|------------------------------|--------|---------------------------------------------------------------------------------------------------|----------|
| Indicator ID                 | string | Used to identify the indicator                                                                    | Yes      |
| Indicator Name               | string | The name of the indicator                                                                         | No       |
| Time Period                  | string | The data point period label or period of collection                                               | No       |
| **HealthData**               | struct |                                                                                                   | Optional |
| HealthData.TimePeriodSortable | int    | Contains the year it was reported                                                                 | Yes      |
| HealthData.TimePeriodRange  | string | Reporting period range. For calendar years we have `1yr`; for financial, quarterly, etc.         | Optional |

---

## Option A

In this option, I propose precomputing the "Time Period" fields during data ingestion into the current Fingertips database. This makes the database more like a presentation layer that doesn’t require additional calculations at query time.

![](./images/Time%20Period%20Fingertips.png)

This approach encourages moving most of the current computations to the pre-ingestion stage, making the system more scalable and future-proof. It would not require major database changes beyond the addition of the Time Period fields.

### Required Fields for Precomputation

- `YearType`: from the indicator metadata  
- `TimePeriodSortable`: from the data points (CSV files)  
- `TimeRange`: custom duration (e.g., "April–March", "Financial Year", etc.)

---

## Database Changes

Two additional fields should be added to the database table for **HealthData**:

**Required Fields:**

- `Time Period`
- `Time Period Range`
- `Time Period Sorted`

### Example Changes

In the data creation tool:

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

In the database schema:

```sql
CREATE TABLE [dbo].[HealthMeasure](
    [HealthMeasureKey] [int] IDENTITY(1,1) NOT NULL, -- Surrogate key
     ,
    ...
)
```

Each time period follows a specific string format depending on the indicator. This allows for easy display and sorting.

---

## Reporting Year Types

These are the different time period formats currently in use:

- Calendar  
- Financial  
- Academic  
- Financial Rolling Year – Quarterly  
- Calendar Rolling – Quarterly  
- Calendar Rolling Year – Monthly  
- Financial Single Year – Cumulative Quarters  
- August–July  
- March–February  
- Financial Multi-Year – Cumulative Quarters  
- October–September  
- Financial Rolling Year – Monthly  
- July–June  
- November–November  
- Financial Year Endpoint  

> Note: The year type alone is not enough to reconstruct the time period, especially if it’s invalid or missing.

To recompute the **Time Period**, the following are essential:

| Field                 | Type   |
|----------------------|--------|
| Indicator ID          | string |
| Time Period Sortable | int    |
| Time Period Range     | string |

---

## Frontend Changes Required

Currently, the frontend only displays years without labels. Instead, we should display the full time period string. Use the `xAxis.categories` in Highcharts instead of `xValues`.

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