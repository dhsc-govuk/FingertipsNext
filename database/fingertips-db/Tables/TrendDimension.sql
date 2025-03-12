--Increasing, decreasing, no change and cannot be calculated
CREATE TABLE [dbo].[TrendDimension](
	[TrendKey] [tinyint] IDENTITY(1,1) NOT NULL,        --The surrogate key
	[Name] [nvarchar](80) NOT NULL,						--The name of the trend e.g. Increasing, Decreasing, No change
	[HasValue] [bit] NOT NULL,							--A flag to indicate if the data has a value (if not it is for all persons/a dummy value)
 CONSTRAINT [PK_TrendDimension] PRIMARY KEY CLUSTERED
(
	[TrendKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO