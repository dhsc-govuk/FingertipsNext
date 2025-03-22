# Trend Analysis App
## Overview
This is a dotnet console application to be used during the data loading process. It will calculate the latest trend for each Health Measure with unique dimensions - i.e. a given indicator e.g `Under 75 mortality rate from all causes` associated with a given area, sex and age group - and then set this value in the database. This will mean that the frontend can simply retrieve trend data and will not have to perform any calculations.

## Updating AI Indicator Search Data
The trend analysis app also writes area by area trends to `SearchData/assets/indicators.json`. There is a fully automated process whereby, in Github Actions, the updated file is made available to the subsequent job that will load the new indicator search data. If the underlying area or indicators data is updated by the DataCreator tool, the only manual step required is to copy the new indicators.json file to `SearchData/assets`.

However, for consistency you may want to run the trend analysis app manual as per the instructions below. This will mean the indicators.json file will have the most up to date per area trend data for each indicator. It is symlinked with the file in the `search-setup` project so will mean, if we are doing any testing of the Azure AI Search test indexes then it will be using the latest data.

## How to run
Typically, a developer will not need to invoke this package directly, as it is run, when required, via Docker compose and within automated jobs in the pipeline.

However, if you are making changes in here and prefer to run directly via the CLI (or are performing a manual update relating to the section above):

```
Ensure the fingertips-db is already running but the trend-analysis has not yet been run
cd into this directory

export SQLCONNSTR_FINGERTIPS_DB={YOUR_LOCAL_CONN_STRING}
dotnet run
```
