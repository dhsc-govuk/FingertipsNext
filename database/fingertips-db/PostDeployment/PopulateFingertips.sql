SET NOCOUNT ON;
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

-- Reseed the tables, starting from 0. (Identity insert is turned off for this seeding data)
DBCC CHECKIDENT ('[HealthMeasure]', RESEED, 0);
DBCC CHECKIDENT ('[AgeDimension]', RESEED, 0);
DBCC CHECKIDENT ('[AreaDimension]', RESEED, 0);
DBCC CHECKIDENT ('[IndicatorDimension]', RESEED, 0);
DBCC CHECKIDENT ('[SexDimension]', RESEED, 0);
GO

-- Drop temp tables in case they exist

BEGIN TRY
    DROP TABLE #TempAgeData;
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY
    DROP TABLE #TempIndicatorData;
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY
    DROP TABLE #TempAreaData;
END TRY
BEGIN CATCH
END CATCH;
GO

BEGIN TRY
    DROP TABLE #TempHealthData;
END TRY
BEGIN CATCH
END CATCH;
GO
---------------------------------------------------------------------------------------------------------------------------
-- For each CSV file, BULK INSERT into a temporary table, then insert into the real tables.

------------------------------------------------
---For Sex diemension this is static data
	INSERT INTO [dbo].[SexDimension] 
	(
		Name,
		IsFemale,
		HasValue
	)
	VALUES
        ('Male', 0, 1),
        ('Female',1, 1),
        ('Persons',0, 0)
GO

------------------------------------------------
-- Age Data
CREATE TABLE #TempAgeData
(
    AgeID INT,
    Age NVARCHAR(255),
    MinYears INT,
    MaxYears INT
);
GO

DECLARE @sql NVARCHAR(4000);
SET @sql = 'BULK INSERT #TempAgeData FROM ''$(FilePath)agedata.csv'' WITH (DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2)';
EXECUTE sp_executesql @sql;
GO

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
GO

DROP TABLE #TempAgeData;
GO

------------------------------------------------
-- Indicator Data
CREATE TABLE #TempIndicatorData
(
    IndicatorID INT,
    IndicatorName NVARCHAR(255)
);
GO
DECLARE @sql NVARCHAR(4000)
SET @sql = 'BULK INSERT #TempIndicatorData FROM ''$(FilePath)indicators.csv'' WITH (DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2)';
EXECUTE sp_executesql @sql;
GO

INSERT INTO [dbo].[IndicatorDimension]
    (
    Name,
    IndicatorId,
    StartDate,
    EndDate
    )
SELECT
    RTRIM(IndicatorName),
    IndicatorID,
    DATEADD(YEAR, -10, GETDATE()),
    DATEADD(YEAR, 10, GETDATE())
FROM
    #TempIndicatorData;
GO

DROP TABLE #TempIndicatorData;
GO

------------------------------------------------
-- Area Data
CREATE TABLE #TempAreaData
(
    Children NVARCHAR(MAX),
    Parents NVARCHAR(MAX),
    AreaCode NVARCHAR(255),
    AreaName NVARCHAR(255)
);
GO

DECLARE @sql NVARCHAR(4000)
SET @sql = 'BULK INSERT #TempAreaData FROM ''$(FilePath)areas.csv'' WITH (DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2)';
EXECUTE sp_executesql @sql;
GO

INSERT INTO dbo.AreaDimension
(
    Code,
    Name,
    StartDate,
    EndDate
)
SELECT
    RTRIM(AreaCode),
    RTRIM(AreaName),
    DATEADD(YEAR, -10, GETDATE()),
    DATEADD(YEAR, 10, GETDATE())
FROM
    #TempAreaData;
GO

DROP TABLE #TempAreaData;
GO

------------------------------------------------
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
GO

DECLARE @sql NVARCHAR(4000)
SET @sql = 'BULK INSERT #TempHealthData 
           FROM ''$(FilePath)healthdata.csv'' 
           WITH (DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2)';
EXEC sp_executesql @sql;
GO

INSERT INTO [dbo].[HealthMeasure]
(
    AreaKey,
    IndicatorKey,
    SexKey,
    AgeKey,
    Count,
    Value,
    LowerCI,
    UpperCI,
    Year
)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [dbo].[AreaDimension] WHERE [Code] = temp.AreaCode),
    (SELECT TOP 1 [IndicatorKey] FROM [dbo].[IndicatorDimension] WHERE IndicatorId = temp.IndicatorId),
    (SELECT TOP 1 [SexKey] FROM [dbo].[SexDimension] WHERE [Name] = temp.Sex),
    (SELECT TOP 1 [AgeKey] FROM [dbo].[AgeDimension] WHERE [AgeID] = temp.AgeID),
    Count,
    Value,
    LowerCI,
    UpperCI,
    Year
	FROM
		#TempHealthData temp
	WHERE
		temp.Value IS NOT NULL
GO

DROP TABLE #TempHealthData;
GO
