# Investigation into the complex Time Period Reporting.
One of the key requirements is to enable the ability to display various complex date periods on the line chart and data tables. Currently, we are only displaying data for calendar years, and some of it is being displayed incorrectly.

###Table of Content
[Problem Overview](#ProblemOverview)
-   [Proposal Solution](#ProposalSolution)
-   [Definition](#ProblemDefination)
-   [Health Data](#HealthData)
-   - [Fields Types and Descriptions](#FieldsTypeAndDescriptions)
-   [Different Day Types](#DifferentDayTypes)

[Proposal Solutions](#ProposalSolutions)
-   [Option A](#OptionalA)
    -   [Database changes required](#DatabaseChangesRequired)
    -   [Database changes required](#DatabaseChangesRequired)
    -   [Frontend changes required](#DatabaseChangesRequired)
-   [Option B](#OptionalB)
-   [Option C](#OptionalC)

[References](#LineChart)



## Problem Overview
   

   ### Current Chart
   ![Chart Image](./images/current_fingertips_linechart.png)

   ### Goals
   The goals is to proposal how I will handle the following 

     -  Database changes required
     -  If we need the Time period as its own dimension?
     -  Will there be an API changes required
     -  Frontend changes required ?
        -  Including how we’d handle the different time periods in the high charts line chart (the x axis is currently treating years as integers)
        - Ensuring sorting still works in the various areas
        - How do we need to display the period type?
     -  Agree which types of data period would need to be supported for FingertipsNext
     - Document the proposed options (and ideally a recommendation) in Confluence



 
 At the moment the  health data points is coming from the download CSV which have the following columns or features.

 ### Health Data 
   The health mode of collections are in different periods which I will list below
   1)

 #### Fields Types and Descriptions


 | Field | Type  | Description | required |
 | --- | --- | --- | --- | 
 Indicator ID | string | use to identify the indicator | Yes |
 Indicator Name | string | the indicator name  |  No |
 Time period | string | the data point period label or period of collections | No |
 | **HealthData** | struct | | Optional |
 **HealthData.TimePeriodSortable** | int | contains the year its reported | Yes |
| **HealthData.TimePeriodRange** | string | contain the reporting period range , for calender year we have 1yr, while we have some financial to be yr , and 3 months this field is not as usable compare to the year type of the indicator metadata. | Optional |


## Optional A
   In this option , I am proposal will precompute the "Time-Period" fields during data ingestion into our current fingertip database. This approach make the fingertip database more as like presentation databases that requires no additional pre-calculations.
   This will also encourages we moving most of the pre-computations that we are currently doing to be more to the pre-ingestion stages.

   If we are to do that that means we don't really need to create heavy changes on the database, just the Time-Period field since we are not going to pre-comp

    This approach make it easier it more scalable and can be move easier to the data ingestions tools where plan to create information.
    
    Fields required for recomputing the "Period Labels"
     - YearType:  from the indicator meta 
     - time Period Sortable: from the data points (CSV files)
     - time Range 





## Database Changes
  The changes on the database side there should be additional field added to the is bring two additional fields to the database table for the **HealthData**

  **Required Fields**
     - Time Period
     - Time Period Range
     - Time Period Sorted

    Changes
      The changes on the database side would be additional fields to the indicator table and the data point table.
      - Changes in the data creation tools to allow this fields to be brings this fields to the database. 
       - One of my suggestion approach is to pre-calculate this time-period format so we can use just it at the endpoint.

  We need to include import the Time Period Field after pre-computations

  ```python
              #File DataCreator/DataCreator/DataFileReader.cs
                var indicatorData = new HealthMeasureEntity
                {
                    IndicatorId = indicatorId,
                    TimePeriod = timePeriod,
                    ...
                    
                };
                allData.Add(indicatorData);
            }
  ```
    

  We also need to alter the HealthMeasure table that contains the dataset.

  ```SQL
    CREATE TABLE [dbo].[HealthMeasure](
        [HealthMeasureKey] [int] IDENTITY(1,1) NOT NULL, 	--The surrogate key
        [TimePeriod] [nvarchar](20)
	...
    )
  ```

 Each time period will follow different string formats based on the indicator it belongs to. This makes it easier, as we only need the ability to display the time period alongside the corresponding data.


###  Reporting Year Types
 - Calendar
 - Financial
 - Academic 
 - Financial Rolling year - quarterly
 - Calendar  Rolling  quarterly
 - Calendar rolling year - monthly
 - Financial single year cumulative quarters
 - August-July
 - March February
 - Financial multi year cumulative quarters
 - October-September
 - Financial rolling year -monthly
 - July-june
 - November-November
 - Financial year end point

 The year type only is not enough to know how the Time period can be re-calculated incase its invalid during validation and transformation of the dataset.


| Field | Type  | 
 | --- | --- | 
 Indicator ID | string |
 **Time Period Sortable** | int |
| **Time Period Range** | string |


 To be able to compute correctly the "Time Period" the following additional fields or feature are needed.



  These are the different period types we currently support, and because of this we need to get additional data feature to allow us to be able to compute this Period labels when Period fields is missing.
  
  along with how to compute them if they're missing from the CSV files we receive. Based on the current state, we can approach this in two ways:

Use the existing data and handle any missing period labels on the frontend.

Pre-validate all CSV files and automatically compute the period values when the format is incorrect or missing.
  