---DROP PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison];
---GO
---DROP TYPE dbo.AreaCodeList;
---GO
---DROP TYPE dbo.YearList;
---GO
CREATE TYPE dbo.AreaCodeList AS TABLE( AreaCode varchar(20) );
GO
CREATE TYPE dbo.YearList AS TABLE( YearNum varchar(20) );
GO