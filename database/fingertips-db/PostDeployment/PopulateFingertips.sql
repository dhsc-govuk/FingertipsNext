-- This file contains SQL statements that will be executed after the build script.

--delete all existing data so we always start from a known position
TRUNCATE TABLE [dbo].[HealthMeasure]
DELETE FROM [dbo].[AgeDimension]
DELETE FROM [dbo].[AreaDimension]
DELETE FROM [dbo].[DeprivationDimension]
DELETE FROM  [dbo].[IndicatorDimension]
DELETE FROM [dbo].[SexDimension]
DELETE FROM [dbo].[TrendDimension]
DELETE FROM [Areas].[AreaRelationships]
DELETE FROM [Areas].[Areas]
DELETE FROM [Areas].[AreaTypes];

--reseed the tables, starting from 0. Currently identity insert is turned off for this seeding data
DBCC CHECKIDENT ('[HealthMeasure]', RESEED, 0);
DBCC CHECKIDENT ('[AgeDimension]', RESEED, 0);
DBCC CHECKIDENT ('[AreaDimension]', RESEED, 0);
DBCC CHECKIDENT ('[DeprivationDimension]', RESEED, 0);
DBCC CHECKIDENT ('[IndicatorDimension]', RESEED, 0);
DBCC CHECKIDENT ('[SexDimension]', RESEED, 0);
DBCC CHECKIDENT ('[TrendDimension]', RESEED, 0);
DBCC CHECKIDENT ('[Areas].[Areas]', RESEED, 0);

--create some sex dimension data
INSERT INTO [dbo].[SexDimension] 
	(
		Name,
		HasValue,
        SexId
	)
	VALUES
	('Male',1,1),
	('Female',1,2),
	('Persons',0,4)

-- Create some deprivation dimension data
SET IDENTITY_INSERT [dbo].[DeprivationDimension] ON

INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (1, N'All', N'All', 0, 1)

INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (2, N'Most deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 1)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (3, N'Second most deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 2)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (4, N'Third more deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 3)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (5, N'Fourth more deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 4)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (6, N'Fifth more deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 5)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (7, N'Fifth less deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 6)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (8, N'Fourth less deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 7)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (9, N'Third less deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 8)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (10, N'Second least deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 9)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (11, N'Least deprived decile (IMD2019)', N'County & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 10)

INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (12, N'Most deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 1)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (13, N'Second most deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 2)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (14, N'Third more deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 3)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (15, N'Fourth more deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 4)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (16, N'Fifth more deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 5)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (17, N'Fifth less deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 6)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (18, N'Fourth less deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 7)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (19, N'Third less deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 8)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (20, N'Second least deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 9)
INSERT [dbo].[DeprivationDimension] ([DeprivationKey], [Name], [Type], [HasValue], [Sequence]) VALUES (21, N'Least deprived decile (IMD2019)', N'District & UA deprivation deciles in England (IMD2019, 4/23 geography)', 1, 10)
SET IDENTITY_INSERT [dbo].[DeprivationDimension] OFF
GO

--create the trend dimension data
SET IDENTITY_INSERT [dbo].[TrendDimension] ON
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (1, N'NotYetCalculated', 0)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (2, N'CannotBeCalculated', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (3, N'Increasing', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (4, N'Decreasing', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (5, N'NoChange', 1)
SET IDENTITY_INSERT [dbo].[TrendDimension] OFF
GO


BEGIN TRY DROP TABLE #TempAgeData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempIndicatorData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempAreaData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempHealthData; END TRY BEGIN CATCH END CATCH;
GO

DECLARE @UseAzureBlob NVARCHAR(10) = '$(UseAzureBlob)';
DECLARE @DistrictsAndUnitary NVARCHAR(255) = 'Districts and Unitary Authorities';

IF @UseAzureBlob = '1'
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.symmetric_keys WHERE name = '##MS_DatabaseMasterKey##')
        EXEC('CREATE MASTER KEY ENCRYPTION BY PASSWORD = ''$(MasterKeyPassword)''');
    IF NOT EXISTS (SELECT * FROM sys.database_scoped_credentials WHERE name = 'MyAzureBlobStorageCredential')
        EXEC('CREATE DATABASE SCOPED CREDENTIAL MyAzureBlobStorageCredential WITH IDENTITY = ''Managed Identity''');
    IF NOT EXISTS (SELECT * FROM sys.external_data_sources WHERE name = 'MyAzureBlobStorage')
        EXEC('CREATE EXTERNAL DATA SOURCE MyAzureBlobStorage WITH (TYPE = BLOB_STORAGE, LOCATION = ''$(BlobStorageLocation)'', CREDENTIAL = MyAzureBlobStorageCredential)');
END;

-- Age Data
CREATE TABLE #TempAgeData
(
    AgeID INT,
    Age NVARCHAR(255),
    MinYears INT,
    MaxYears INT
);
DECLARE @sqlAge NVARCHAR(4000), @filePathAge NVARCHAR(500);
IF @UseAzureBlob = '1'
    SET @filePathAge = 'agedata.csv';
ELSE
    SET @filePathAge = '$(LocalFilePath)agedata.csv';
SET @sqlAge = 'BULK INSERT #TempAgeData FROM ''' + @filePathAge + ''' WITH (' +
              CASE WHEN @UseAzureBlob = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlAge;

INSERT INTO [dbo].[AgeDimension] (Name, AgeID, HasValue)
SELECT RTRIM(Age), AgeID, IIF(AgeID = 1, 0, 1)
FROM #TempAgeData;

DROP TABLE #TempAgeData;

-- Indicator Data
CREATE TABLE #TempIndicatorData
(
    IndicatorID INT,
    IndicatorName NVARCHAR(255)
);
DECLARE @sqlInd NVARCHAR(4000), @filePathInd NVARCHAR(500);
IF @UseAzureBlob = '1'
    SET @filePathInd = 'indicators.csv';
ELSE
    SET @filePathInd = '$(LocalFilePath)indicators.csv';
SET @sqlInd = 'BULK INSERT #TempIndicatorData FROM ''' + @filePathInd + ''' WITH (' +
              CASE WHEN @UseAzureBlob = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlInd;

INSERT INTO [dbo].[IndicatorDimension] (Name, IndicatorId, StartDate, EndDate)
SELECT REPLACE(REPLACE(IndicatorName, '"', ''), char(13),''), IndicatorID, DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempIndicatorData;

DROP TABLE #TempIndicatorData;

-- Area Data
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
IF @UseAzureBlob = '1'
    SET @filePathArea = 'areas.csv';
ELSE
    SET @filePathArea = '$(LocalFilePath)areas.csv';
SET @sqlArea = 'BULK INSERT #TempAreaData FROM ''' + @filePathArea + ''' WITH (' +
               CASE WHEN @UseAzureBlob = '1'
                    THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2'
                    ELSE 'FORMAT = ''CSV'', FIRSTROW = 2'
               END + ')';
EXEC sp_executesql @sqlArea;

INSERT INTO dbo.AreaDimension (Code, Name, StartDate, EndDate)
SELECT RTRIM(AreaCode), RTRIM(AreaName), DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempAreaData;


-- Health Data
CREATE TABLE #TempHealthData
(
    IndicatorId INT,
    Category NVARCHAR(MAX),
    CategoryType NVARCHAR(MAX),
    Age NVARCHAR(255),
    Sex NVARCHAR(255),
    Trend NVARCHAR(255),
    Denominator FLOAT,
    Upper98CI FLOAT,
    CategoryTypeId INT,
    Lower98CI FLOAT,
    Lower95CI FLOAT,
    Value FLOAT,
    Count FLOAT,
    AreaCode NVARCHAR(255),
    SexID INT,
    AgeID INT,
    Year INT,
    Upper95CI FLOAT,
    CategoryId INT
);
DECLARE @sqlHealth NVARCHAR(4000), @filePathHealth NVARCHAR(500);
IF @UseAzureBlob = '1'
    SET @filePathHealth = 'healthdata.csv';
ELSE
    SET @filePathHealth = '$(LocalFilePath)healthdata.csv';
SET @sqlHealth = 'BULK INSERT #TempHealthData FROM ''' + @filePathHealth + ''' WITH (' +
                 CASE WHEN @UseAzureBlob = '1'
                      THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2'
                      ELSE 'FORMAT = ''CSV'', FIRSTROW = 2'
                 END + ')';
EXEC sp_executesql @sqlHealth;

INSERT INTO [dbo].[HealthMeasure] (AreaKey, IndicatorKey, SexKey, AgeKey, Count, Value, LowerCI, UpperCI, Year)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [dbo].[AreaDimension] WHERE [Code] = LTRIM(RTRIM(temp.AreaCode))),
    (SELECT TOP 1 [IndicatorKey] FROM [dbo].[IndicatorDimension] WHERE IndicatorId = temp.IndicatorId),
    (SELECT TOP 1 [SexKey] FROM [dbo].[SexDimension] WHERE [Name] = LTRIM(RTRIM(temp.Sex))),
    (SELECT TOP 1 [AgeKey] FROM [dbo].[AgeDimension] WHERE [AgeID] = temp.AgeID),
    Count, Value, Lower95CI, Upper95CI, Year
FROM #TempHealthData temp
WHERE temp.Value IS NOT NULL;

DROP TABLE #TempHealthData;


INSERT INTO [Areas].[AreaTypes]
SELECT distinct
    replace(replace(AreaTypeCode, char(10),''), char(13),''),
    AreaType,
    HierarchyType,
    Level+1 As 'Level'
FROM #TempAreaData;

INSERT INTO [Areas].[Areas]
SELECT
    AreaCode,
    AreaName,
    replace(replace(AreaTypeCode, char(10),''), char(13),'')
FROM #TempAreaData;

-- Insert additional district-level records for applicable AreaCodes
INSERT INTO [Areas].[Areas] (AreaCode, AreaName, AreaTypeKey)
SELECT
    AreaCode,
    AreaName,
    (SELECT TOP 1 AreaTypeKey FROM [Areas].[AreaTypes] WHERE AreaTypeName = @DistrictsAndUnitary) -- Lookup AreaTypeKey
FROM #TempAreaData
WHERE 
    LEFT(AreaCode, 3) IN ('E06', 'E08', 'E09')  -- Match the required areaCode prefixes
    AND NOT EXISTS (
        SELECT 1 FROM [Areas].[Areas] 
        WHERE AreaCode = #TempAreaData.AreaCode 
        AND AreaTypeKey = (SELECT TOP 1 AreaTypeKey FROM [Areas].[AreaTypes] WHERE AreaTypeName = @DistrictsAndUnitary)
    );

INSERT INTO [Areas].[AreaRelationships] (ParentAreaKey, ChildAreaKey)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] area1  WHERE area1.[AreaCode] = T.AreaCode),
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] area2 WHERE area2.[AreaCode] = value)
FROM #TempAreaData T
CROSS APPLY
    STRING_SPLIT(Children, '|')
WHERE
    value!='""'

-- Insert parent-child relationships for newly created district-level areas
INSERT INTO [Areas].[AreaRelationships] (ParentAreaKey, ChildAreaKey)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] WHERE [AreaCode] = T.AreaCode 
        AND AreaTypeKey = (SELECT TOP 1 AreaTypeKey FROM [Areas].[AreaTypes] WHERE AreaTypeName = @DistrictsAndUnitary)),
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] WHERE [AreaCode] = value)
FROM #TempAreaData T
CROSS APPLY STRING_SPLIT(Children, '|')
WHERE 
    LEFT(AreaCode, 3) IN ('E06', 'E08', 'E09')
    AND value != '""'

DROP TABLE #TempAreaData;
GO

PRINT N'Update complete.';
GO
