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
    DELETE FROM [dbo].[DateDimension];
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY 
    DELETE FROM [dbo].[PeriodDimension];
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
DBCC CHECKIDENT ('[DateDimension]', RESEED, 0);
DBCC CHECKIDENT ('[PeriodDimension]', RESEED, 0);
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

--create some period data
INSERT INTO [dbo].[PeriodDimension]
(Period)
VALUES
('Year'),
('Quarter'),
('Month'),
('Week'),
('Day'),
('Financial Year'),
('Academic Year'),
('2 Year'),
('3 Year'),
('5 Year')

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

--populate the DateDimension table
DECLARE @CurrentDate DATE = '2000-01-01'
DECLARE @EndDate DATE = '2035-12-31'

WHILE @CurrentDate < @EndDate
BEGIN
   INSERT INTO [dbo].[DateDimension] (
      [Date],
      [Day],
      [DaySuffix],
      [Weekday],
      [WeekDayName],
      [DayOfYear],
      [WeekOfMonth],
      [WeekOfYear],
      [Month],
      [MonthName],
      [MonthNameShort],
      [Quarter],
      [QuarterName],
      [Year],
      [IsWeekend]
      )
   SELECT 
      DATE = @CurrentDate,
      Day = DAY(@CurrentDate),
      [DaySuffix] = CASE 
         WHEN DAY(@CurrentDate) = 1
            OR DAY(@CurrentDate) = 21
            OR DAY(@CurrentDate) = 31
            THEN 'st'
         WHEN DAY(@CurrentDate) = 2
            OR DAY(@CurrentDate) = 22
            THEN 'nd'
         WHEN DAY(@CurrentDate) = 3
            OR DAY(@CurrentDate) = 23
            THEN 'rd'
         ELSE 'th'
         END,
      WEEKDAY = DATEPART(dw, @CurrentDate),
      WeekDayName = DATENAME(dw, @CurrentDate),
      [DayOfYear] = DATENAME(dy, @CurrentDate),
      [WeekOfMonth] = DATEPART(WEEK, @CurrentDate) - DATEPART(WEEK, DATEADD(MM, DATEDIFF(MM, 0, @CurrentDate), 0)) + 1,
      [WeekOfYear] = DATEPART(wk, @CurrentDate),
      [Month] = MONTH(@CurrentDate),
      [MonthName] = DATENAME(mm, @CurrentDate),
      [MonthNameShort] = UPPER(LEFT(DATENAME(mm, @CurrentDate), 3)),
      [Quarter] = DATEPART(q, @CurrentDate),
      [QuarterName] = CASE 
         WHEN DATENAME(qq, @CurrentDate) = 1
            THEN 'first'
         WHEN DATENAME(qq, @CurrentDate) = 2
            THEN 'second'
         WHEN DATENAME(qq, @CurrentDate) = 3
            THEN 'third'
         WHEN DATENAME(qq, @CurrentDate) = 4
            THEN 'fourth'
         END,
      [Year] = YEAR(@CurrentDate),
      [IsWeekend] = CASE 
         WHEN DATENAME(dw, @CurrentDate) = 'Sunday'
            OR DATENAME(dw, @CurrentDate) = 'Saturday'
            THEN 1
         ELSE 0
         END

   SET @CurrentDate = DATEADD(DD, 1, @CurrentDate)
END

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
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2, ROWTERMINATOR = ''0x0A'''
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
    N'Persons',
    N'Persons',
    0,
    11
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
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2, ROWTERMINATOR = ''0x0A'''
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
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2, ROWTERMINATOR = ''0x0A'''
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
                    THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2, ROWTERMINATOR = ''0x0A'''
                    ELSE 'FORMAT = ''CSV'', FIRSTROW = 2'
               END + ')';
EXEC sp_executesql @sqlArea;

INSERT INTO dbo.AreaDimension 
(
    Code,
    Name,
    StartDate,
    EndDate,
    AreaType,
    IsDistrictAndCounty
)
SELECT
    RTRIM(AreaCode),
    RTRIM(AreaName),
    DATEADD(YEAR, -10, GETDATE()),
    DATEADD(YEAR, 10, GETDATE()),
    replace(replace(AreaTypeCode, char(10),''), char(13),''),
    IIF(RTRIM(AreaCode) LIKE 'E09%' OR RTRIM(AreaCode) LIKE 'E08%' OR RTRIM(AreaCode) LIKE 'E06%', 1, 0)
FROM
     #TempAreaData;

-- Health Data
CREATE TABLE #RawHealthData
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
    IsSexAggregatedOrSingle bit,
    IsAgeAggregatedOrSingle bit,
    IsDeprivationAggregatedOrSingle bit,
    FromDate NVARCHAR(MAX),
    ToDate NVARCHAR(MAX),
    Avoid INT
);

DECLARE @sqlHealth NVARCHAR(4000),
        @filePathHealth NVARCHAR(500),
        @INDEX INT = 1;

WHILE (@INDEX <= 2)
    BEGIN
        IF @UseAzureBlob = '1'
            SET @filePathHealth = CONCAT('healthdata',@INDEX,'.csv');
        ELSE
            SET @filePathHealth = CONCAT('$(LocalFilePath)healthdata',@INDEX,'.csv');
        
        SET @sqlHealth = 'BULK INSERT #RawHealthData FROM ''' + @filePathHealth + ''' WITH (' +
                         CASE WHEN @UseAzureBlob = '1'
                                  THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FORMAT = ''CSV'', FIRSTROW = 2, ROWTERMINATOR = ''0x0A'''
                              ELSE 'FORMAT = ''CSV'', FIRSTROW = 2'
                             END + ')';

        EXEC sp_executesql @sqlHealth;
        
        SET @INDEX = @INDEX + 1;
    END

-- START
DECLARE @RAWHELATHDATACOUNT INT
    SET @RAWHELATHDATACOUNT = (SELECT COUNT(*) FROM #RawHealthData)

PRINT(CONCAT('RawHealthDataCount: ',@RAWHELATHDATACOUNT))
-- END

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
    Category NVARCHAR(255),
    AgeID INT,
    IsSexAggregatedOrSingle bit,
    IsAgeAggregatedOrSingle bit,
    FromDate NVARCHAR(MAX),
    ToDate NVARCHAR(Max),
    IsDeprivationAggregatedOrSingle bit
);

INSERT INTO #TempHealthData
(
    IndicatorId,
    Year,
    AreaCode,
    Count,
    Value,
    Lower95CI,
    Upper95CI,
    Lower98CI,
    Upper98CI,
    Denominator,
    Sex,
    CategoryType,
    Category,
    AgeID,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle,
    FromDate,
    ToDate
)
SELECT 
    IndicatorId,
    Year,
    LTRIM(RTRIM(AreaCode)) AS AreaCode,
    Count,
    Value,
    Lower95CI,
    Upper95CI,
    Lower98CI,
    Upper98CI,
    Denominator,
    LTRIM(RTRIM(Sex)) AS Sex,
    LTRIM(RTRIM(CategoryType)) AS CategoryType,
    LTRIM(RTRIM(Category)) AS Category,
    AgeID,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle,
    FromDate,
    ToDate
FROM #RawHealthData;

-- START
DECLARE @TempHealthDataCount INT
SET @TempHealthDataCount = (SELECT COUNT(*) FROM #RawHealthData)

PRINT(CONCAT('TempHealthDataCount: ',@TempHealthDataCount))
-- END


DROP TABLE #RawHealthData;

CREATE INDEX IX_TempHealthData_AreaCode ON #TempHealthData(AreaCode);
CREATE INDEX IX_TempHealthData_IndicatorId ON #TempHealthData(IndicatorId);
CREATE INDEX IX_TempHealthData_Sex ON #TempHealthData(Sex);
CREATE INDEX IX_TempHealthData_AgeID ON #TempHealthData(AgeID);


-- START
DECLARE @HealthDataCount INT
SET @HealthDataCount = (SELECT COUNT(*) FROM dbo.HealthMeasure)

PRINT(CONCAT('HealthDataCount before: ',@HealthDataCount))
-- END

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
    IsDeprivationAggregatedOrSingle,
    FromDateKey,
    ToDateKey
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
    temp.Year,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle,
    datedim_from.DateKey,
    datedim_to.DateKey
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
JOIN
	[dbo].[DateDimension] datedim_from ON datedim_from.[Date] = (CONVERT(DATETIME, temp.FromDate, 103)) 
JOIN
    [dbo].[DateDimension] datedim_to ON datedim_to.[Date] = (CONVERT(DATETIME, temp.ToDate, 103))
WHERE temp.Value IS NOT NULL;

-- TODO: remove this, and similar debugging PRINT statement
-- START
SET @HealthDataCount = (SELECT COUNT(*) FROM dbo.HealthMeasure)

PRINT(CONCAT('HealthDataCount between: ',@HealthDataCount))
-- END

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT ALL

-- START
SET @HealthDataCount = (SELECT COUNT(*) FROM dbo.HealthMeasure)

PRINT(CONCAT('HealthDataCount after: ',@HealthDataCount))
-- END

DROP TABLE #TempHealthData;

GO


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
