# Trend Analysis App
## Overview
This is a dotnet console application to be used during the data loading process. It will calculate the latest trend for each Health Measure with unique dimensions - i.e. a given indicator e.g `Under 75 mortality rate from all causes` associated with a given area, sex and age group - and then set this value in the database. This will mean that the frontend can simply retrieve trend data and will not have to perform any calculations.

## How to run
It is not envisaged that developers will need to run this locally, as it is intended to be invoked as an automated pipeline job. However, if ever required locally e.g. for debugging please do the following:

```
Ensure the fingertips-db is already running
cd into this directory

export SQLCONNSTR_FINGERTIPS_DB={YOUR_LOCAL_CONN_STRING}
dotnet run
```
