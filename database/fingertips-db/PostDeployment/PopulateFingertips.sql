SET NOCOUNT ON;
GO

-- External data source creation (only if using Azure Blob)
IF '$(UseAzureBlob)' = '1'
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.symmetric_keys WHERE name = '##MS_DatabaseMasterKey##')
        EXEC('CREATE MASTER KEY ENCRYPTION BY PASSWORD = ''$(MasterKeyPassword)''');
    IF NOT EXISTS (SELECT * FROM sys.database_scoped_credentials WHERE name = 'MyAzureBlobStorageCredential')
        EXEC('CREATE DATABASE SCOPED CREDENTIAL MyAzureBlobStorageCredential WITH IDENTITY = ''Managed Identity''');
    IF NOT EXISTS (SELECT * FROM sys.external_data_sources WHERE name = 'MyAzureBlobStorage')
        EXEC('CREATE EXTERNAL DATA SOURCE MyAzureBlobStorage WITH (TYPE = BLOB_STORAGE, LOCATION = ''$(BlobStorageLocation)'', CREDENTIAL = MyAzureBlobStorageCredential)');
END;
GO

TRUNCATE TABLE [dbo].[HealthMeasure];
GO
DELETE FROM [dbo].[AgeDimension];
GO
DELETE FROM [dbo].[AreaDimension];
GO
DELETE FROM [dbo].[IndicatorDimension];
GO
DELETE FROM [dbo].[SexDimension];
GO

DBCC CHECKIDENT ('[HealthMeasure]', RESEED, 0);
DBCC CHECKIDENT ('[AgeDimension]', RESEED, 0);
DBCC CHECKIDENT ('[AreaDimension]', RESEED, 0);
DBCC CHECKIDENT ('[IndicatorDimension]', RESEED, 0);
DBCC CHECKIDENT ('[SexDimension]', RESEED, 0);
GO

BEGIN TRY DROP TABLE #TempAgeData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempIndicatorData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempAreaData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempHealthData; END TRY BEGIN CATCH END CATCH;
GO

INSERT INTO [dbo].[SexDimension] (Name, IsFemale, HasValue)
VALUES ('Male', 0, 1), ('Female', 1, 1), ('Persons', 0, 0);
GO

/* Age Data */
CREATE TABLE #TempAgeData
(
    AgeID INT,
    Age NVARCHAR(255),
    MinYears INT,
    MaxYears INT
);
DECLARE @sqlAge NVARCHAR(4000), @filePathAge NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathAge = 'agedata.csv';
ELSE
    SET @filePathAge = '$(LocalFilePath)agedata.csv';
SET @sqlAge = 'BULK INSERT #TempAgeData FROM ''' + @filePathAge + ''' WITH (' +
              CASE WHEN '$(UseAzureBlob)' = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlAge;
GO

INSERT INTO [dbo].[AgeDimension] (Name, AgeID, HasValue)
SELECT RTRIM(Age), AgeID, IIF(AgeID = 1, 0, 1)
FROM #TempAgeData;
GO

DROP TABLE #TempAgeData;
GO

/* Indicator Data */
CREATE TABLE #TempIndicatorData
(
    IndicatorID INT,
    IndicatorName NVARCHAR(255)
);
DECLARE @sqlInd NVARCHAR(4000), @filePathInd NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathInd = 'indicators.csv';
ELSE
    SET @filePathInd = '$(LocalFilePath)indicators.csv';
SET @sqlInd = 'BULK INSERT #TempIndicatorData FROM ''' + @filePathInd + ''' WITH (' +
              CASE WHEN '$(UseAzureBlob)' = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlInd;
GO

INSERT INTO [dbo].[IndicatorDimension] (Name, IndicatorId, StartDate, EndDate)
SELECT TRIM('"' FROM IndicatorName), IndicatorID, DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempIndicatorData;
GO

DROP TABLE #TempIndicatorData;
GO

/* Area Data */
CREATE TABLE #TempAreaData
(
    Children NVARCHAR(MAX),
    Parents NVARCHAR(MAX),
    AreaCode NVARCHAR(255),
    AreaName NVARCHAR(255)
);
DECLARE @sqlArea NVARCHAR(4000), @filePathArea NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathArea = 'areas.csv';
ELSE
    SET @filePathArea = '$(LocalFilePath)areas.csv';
SET @sqlArea = 'BULK INSERT #TempAreaData FROM ''' + @filePathArea + ''' WITH (' +
               CASE WHEN '$(UseAzureBlob)' = '1'
                    THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                    ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
               END + ')';
EXEC sp_executesql @sqlArea;
GO

INSERT INTO dbo.AreaDimension (Code, Name, StartDate, EndDate)
SELECT RTRIM(AreaCode), RTRIM(AreaName), DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempAreaData;
GO

DROP TABLE #TempAreaData;
GO

/* Health Data */
CREATE TABLE #TempHealthData
(
    IndicatorId INT,
    Year INT,
    AgeID INT,
    Sex NVARCHAR(255),
    AreaCode NVARCHAR(255),
    Count FLOAT,
    Value FLOAT,
    LowerCI FLOAT,
    UpperCI FLOAT,
    Denominator FLOAT,
    Trend NVARCHAR(255),
    CategoryTypeId INT,
    CategoryId INT
);
DECLARE @sqlHealth NVARCHAR(4000), @filePathHealth NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathHealth = 'healthdata.csv';
ELSE
    SET @filePathHealth = '$(LocalFilePath)healthdata.csv';
SET @sqlHealth = 'BULK INSERT #TempHealthData FROM ''' + @filePathHealth + ''' WITH (' +
                 CASE WHEN '$(UseAzureBlob)' = '1'
                      THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                      ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                 END + ')';
EXEC sp_executesql @sqlHealth;
GO

INSERT INTO [dbo].[HealthMeasure] (AreaKey, IndicatorKey, SexKey, AgeKey, Count, Value, LowerCI, UpperCI, Year)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [dbo].[AreaDimension] WHERE [Code] = LTRIM(RTRIM(temp.AreaCode))),
    (SELECT TOP 1 [IndicatorKey] FROM [dbo].[IndicatorDimension] WHERE IndicatorId = temp.IndicatorId),
    (SELECT TOP 1 [SexKey] FROM [dbo].[SexDimension] WHERE [Name] = LTRIM(RTRIM(temp.Sex))),
    (SELECT TOP 1 [AgeKey] FROM [dbo].[AgeDimension] WHERE [AgeID] = temp.AgeID),
    Count, Value, LowerCI, UpperCI, Year
FROM #TempHealthData temp
WHERE temp.Value IS NOT NULL;
GO

DROP TABLE #TempHealthData;
GO

/* Area Data */
CREATE TABLE #TempAreaData
(
    Children NVARCHAR (max),
    Parents NVARCHAR (max),
    AreaCode NVARCHAR(255),
    AreaName NVARCHAR(255),
    [Level] INT,
    HierarchyType NVARCHAR(255),
    AreaType NVARCHAR(255),
    AreaTypeCode NVARCHAR(255)
);
DECLARE @sqlArea NVARCHAR(4000), @filePathArea NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathArea = 'areas.csv';
ELSE
    SET @filePathArea = '$(LocalFilePath)areas.csv';
SET @sqlArea = 'BULK INSERT #TempAreaData FROM ''' + @filePathArea + ''' WITH (' +
               CASE WHEN '$(UseAzureBlob)' = '1'
                    THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                    ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
               END + ')';
EXEC sp_executesql @sqlArea;
GO

INSERT INTO [Areas].[AreaTypes]
SELECT distinct
    AreaTypeCode,
    AreaType,
    HierarchyType,
    Level+1 As 'Level'
FROM #TempAreaData;
GO

INSERT INTO [Areas].[Areas]
SELECT
    AreaCode,
    AreaName,
    AreaTypeCode
FROM #TempAreaData;
GO

INSERT INTO [Areas].[AreaRelationships] (ParentAreaKey, ChildAreaKey)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] WHERE [AreaCode] = AreaCode),
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] WHERE [AreaCode] = value)
FROM #TempAreaData T
CROSS APPLY
    STRING_SPLIT(Children, '|')
WHERE
    value!='""'
GO

DROP TABLE #TempAreaData;
GO

PRINT N'Update complete.';
GO
