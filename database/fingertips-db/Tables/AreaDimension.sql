--Data for all the geographical areas including CCBs, statistical areas, counties, GP Practices
CREATE TABLE [dbo].[AreaDimension](
	[AreaKey] [int] IDENTITY(1,1) NOT NULL,				--the surrogate key
	[Code] [nvarchar](20) NOT NULL, 					--the area code, taken from the original Fingertips Pholio database. These are relevant outside Fingertips
	[Name] [nvarchar](255) NOT NULL,					--the name of the area e.g. Leeds
	[StartDate] [datetime2](7) NOT NULL,				--the start data that this row was relevant for, to support slowly changing dimensions if an area changes over time
	[EndDate] [datetime2](7) NOT NULL,					--the end data that this row was relevant for, to support slowly changing dimensions if an area changes over time
	[AreaType] nvarchar(50) NULL,						-- the area type of the area
	[IsDistrictAndCounty] [bit] NULL
CONSTRAINT [PK_AreaDimension] PRIMARY KEY CLUSTERED 
(
	[AreaKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE UNIQUE NONCLUSTERED INDEX [AreaCodeIndex] ON [dbo].[AreaDimension]
(
	[Code] ASC
)

GO

CREATE NONCLUSTERED INDEX [IsDistrictAndCountyIndex] ON [dbo].[AreaDimension]
(
	[IsDistrictAndCounty]
)
GO