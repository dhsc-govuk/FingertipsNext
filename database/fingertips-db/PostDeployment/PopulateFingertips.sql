-- This file contains SQL statements that will be executed after the build script.
BEGIN TRY 
    TRUNCATE TABLE [dbo].[HealthMeasure];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[AgeDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[AreaDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[DeprivationDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM  [dbo].[IndicatorDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[SexDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[TrendDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [Areas].[AreaRelationships];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [Areas].[Areas];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [Areas].[AreaTypes];
END TRY
BEGIN CATCH
END CATCH;
GO


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


--create the trend dimension data
SET IDENTITY_INSERT [dbo].[TrendDimension] ON
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (1, N'Not yet calculated', 0)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (2, N'Cannot be calculated', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (3, N'Increasing', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (4, N'Decreasing', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (5, N'No significant change', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (6, N'Increasing and getting better', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (7, N'Increasing and getting worse', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (8, N'Decreasing and getting better', 1)
INSERT [dbo].[TrendDimension] ([TrendKey], [Name], [HasValue]) VALUES (9, N'Decreasing and getting worse', 1)
SET IDENTITY_INSERT [dbo].[TrendDimension] OFF
GO

BEGIN TRY DROP TABLE #TempDeprivationData; END TRY BEGIN CATCH END CATCH;
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

-- Deprivation Data
CREATE TABLE #TempDeprivationData
(
    CategoryName NVARCHAR(255),
    CategoryTypeName NVARCHAR(255),
    Sequence INT
);
DECLARE @sqlDeprivation NVARCHAR(4000), @filePathDeprivation NVARCHAR(500);
IF @UseAzureBlob = '1'
    SET @filePathDeprivation = 'categories.csv';
ELSE
    SET @filePathDeprivation = '$(LocalFilePath)categories.csv';
SET @sqlDeprivation = 'BULK INSERT #TempDeprivationData FROM ''' + @filePathDeprivation + ''' WITH (' +
              CASE WHEN @UseAzureBlob = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlDeprivation;

--manually insert the ALL deprivation value
INSERT [dbo].[DeprivationDimension] 
(
    [Name],
    [Type],
    [HasValue],
    [Sequence]
) 
VALUES 
(
    N'All',
    N'All',
    0,
    1
)

INSERT INTO [dbo].[DeprivationDimension] 
(
    Name,
    Type,
    HasValue,
    Sequence
)
SELECT 
    REPLACE(CategoryName, char(13), ''),
    REPLACE(CategoryTypeName, char(13), ''),
    1,
    Sequence
FROM #TempDeprivationData;

DROP TABLE #TempDeprivationData;

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

INSERT INTO [dbo].[AgeDimension] 
(
    Name,
    AgeID,
    HasValue
)
SELECT 
    RTRIM(Age),
    AgeID, 
    IIF(AgeID = 1, 0, 1)
FROM 
    #TempAgeData;

DROP TABLE #TempAgeData;

-- Indicator Data
CREATE TABLE #TempIndicatorData
(
    IndicatorID INT,
    Polarity NVARCHAR(255),
    BenchmarkComparisonMethod [nvarchar](255),
    ValueType NVARCHAR(255),
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

INSERT INTO [dbo].[IndicatorDimension] 
(
    Name,
    IndicatorId,
    Polarity,                                      
	ValueType,                       
	BenchmarkComparisonMethod,
    StartDate,
    EndDate
)
SELECT 
    REPLACE(REPLACE(IndicatorName, '"', ''), char(13),''),
    IndicatorID,
    Polarity,
    ValueType,
    BenchmarkComparisonMethod,
    DATEADD(YEAR, -10, GETDATE()),
    DATEADD(YEAR, 10, GETDATE())
FROM 
    #TempIndicatorData;

DROP TABLE #TempIndicatorData;

-- Area Data
CREATE TABLE #TempAreaData
(
    Children NVARCHAR (max),
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

INSERT INTO dbo.AreaDimension 
(
    Code,
    Name,
    StartDate,
    EndDate,
    AreaType
)
SELECT
    RTRIM(AreaCode),
    RTRIM(AreaName),
    DATEADD(YEAR, -10, GETDATE()),
    DATEADD(YEAR, 10, GETDATE()),
    replace(replace(AreaTypeCode, char(10),''), char(13),'')
FROM
     #TempAreaData;


-- Health Data
CREATE TABLE #TempHealthData
(
    IndicatorId INT,
    Year INT,
    AreaCode NVARCHAR(255),
    Count FLOAT,
    Value FLOAT,
    Lower95CI FLOAT,
    Upper95CI FLOAT,
    Lower98CI FLOAT,
    Upper98CI FLOAT,
    Denominator FLOAT,
    Sex NVARCHAR(255),
    CategoryType NVARCHAR(MAX),
    Category NVARCHAR(MAX),
    AgeID INT,
    IsSexAggregatedOrSingle NVARCHAR(255),
    IsAgeAggregatedOrSingle NVARCHAR(255),
    IsDeprivationAggregatedOrSingle NVARCHAR(255),
    Avoid INT
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

ALTER TABLE [dbo].[HealthMeasure] NOCHECK CONSTRAINT ALL
INSERT INTO [dbo].[HealthMeasure]
(
    AreaKey,
    IndicatorKey,
    SexKey,
    AgeKey,
    DeprivationKey,
    Count,
    Denominator,
    Value,
    LowerCI,
    UpperCI,
    Year,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle
)
SELECT
    areadim.AreaKey,
    inddim.[IndicatorKey],
    sexdim.[SexKey],
    agedim.[AgeKey],
    depdim.[DeprivationKey],
    Count,
    Denominator,
    Value,
    Lower95CI,
    Upper95CI,
    Year,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle
FROM 
	#TempHealthData temp
JOIN
	[dbo].[AreaDimension] areadim ON LTRIM(RTRIM(temp.AreaCode))=areadim.[Code]
JOIN
	[dbo].[IndicatorDimension] inddim ON inddim.IndicatorId = temp.IndicatorId
JOIN
	[dbo].[SexDimension] sexdim ON sexdim.[Name] = LTRIM(RTRIM(temp.Sex))
JOIN
	[dbo].[AgeDimension] agedim ON agedim.[AgeID] = temp.AgeID
JOIN
	[dbo].[DeprivationDimension] depdim  ON depdim.[Name] = LTRIM(RTRIM(temp.Category)) AND depdim.[Type]=LTRIM(RTRIM(temp.CategoryType))
WHERE temp.Value IS NOT NULL;

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT ALL

DROP TABLE #TempHealthData;


INSERT INTO [Areas].[AreaTypes]
SELECT DISTINCT
    replace(replace(AreaTypeCode, char(10),''), char(13),''),
    AreaType,
    HierarchyType,
    Level+1 As 'Level'
FROM
    #TempAreaData;

INSERT INTO [Areas].[Areas]
SELECT
    AreaCode,
    AreaName,
    replace(replace(AreaTypeCode, char(10),''), char(13),'')
FROM
    #TempAreaData;


INSERT INTO [Areas].[AreaRelationships] 
(
    ParentAreaKey,
    ChildAreaKey
)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] area1  WHERE area1.[AreaCode] = T.AreaCode),
    (SELECT TOP 1 [AreaKey] FROM [Areas].[Areas] area2 WHERE area2.[AreaCode] = value)
FROM
    #TempAreaData T
CROSS APPLY
    STRING_SPLIT(Children, '|')
WHERE
    value!='""'

-- Insert additional district-level records for applicable AreaCodes
--create a table variable to temporarily store the data
--insert the higher level UAs into into
DECLARE @HigherLevels TABLE
(
    AreaKey INT, 
    AreaCode NVARCHAR(255), 
    AreaName NVARCHAR(255)
)
INSERT INTO @HigherLevels
SELECT
    AreaKey,
    AreaCode,
    AreaName
FROM 
    [Areas].[Areas] a 
WHERE 
    a.AreaCode LIKE 'E09%' OR a.AreaCode LIKE 'E08%' OR a.AreaCode LIKE 'E06%'

--replicate the higher level UAs and give them the lower level area type
INSERT INTO [Areas].[Areas]
SELECT 
	AreaCode,
	AreaName,
	'districts-and-unitary-authorities'
FROM
	@HigherLevels

 --the lower level UA has the high level UA as the parent
 INSERT INTO [Areas].[AreaRelationships]
 (
    ParentAreaKey,
    ChildAreaKey
 )
 SELECT 
	higher.AreaKey,
	(SELECT TOP 1 AreaKey FROM [Areas].[Areas] WHERE [AreaName]=higher.AreaName AND [AreaTypeKey]='districts-and-unitary-authorities')
 FROM
	@HigherLevels higher

DROP TABLE #TempAreaData;
GO

PRINT N'Update complete.';
GO
