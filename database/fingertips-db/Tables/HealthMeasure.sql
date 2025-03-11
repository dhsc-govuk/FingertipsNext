--This holds the core health data. e.g. 800 Females under the age of 75 people per 100000 People with type 1 diabetes received a blood pressure check in Leeds in 2022
CREATE TABLE [dbo].[HealthMeasure](
	[HealthMeasureKey] [int] IDENTITY(1,1) NOT NULL, 	--The surrogate key
	[AgeKey] [smallint] NOT NULL,                     --Foreign key to the age - what age is this row for
	[AreaKey] [int] NOT NULL,                         --Foreign key to the area - what geography is this row for
	[IndicatorKey] [smallint] NOT NULL,               --Foreign key to the indicator - what indicator is this row for
	[SexKey] [tinyint] NOT NULL,                      --Foreign key to the sex - what sex is this row for
	[TrendKey] [tinyint] NULL DEFAULT 1,              --Foreign key to the trend - what trend applies to this row. It defaults to NotYetCalculated as trends are calculated during a subsequent step
	[DeprivationKey] [smallint] NOT NULL DEFAULT 1,   --Foreign key to the deprivation dimension - what deprivation value applies to this row. It defaults to All, as not all health data is broken down by deprivation measures.
	[Count] [float] NULL,                             --How many were counted for this data - e.g. how many people were counted in order to create this row
	[Denominator] [float] NULL,                       --The denominator for the data that was collected e.g. if we count the number of people in England with condition X, then the denominator is the population of England
	[Value] [float] NULL,                             --The value of the data e.g. how many people per 100 000. This is the key piece of data for this row
	[LowerCI] [float] NULL,                           --The lower confidence interval value - a statistically calculated value using methodology described in the indicator metadata
	[UpperCI] [float] NULL,                           --The upper confidence interval value - a statistically calculated value using methodology described in the indicator metadata
	[Year] [smallint] NOT NULL,                       --A junk dimension of the year that this row is for e.g. 2022
 CONSTRAINT [PK_HealthMeasure] PRIMARY KEY CLUSTERED
(
	[HealthMeasureKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_AgeDimension] FOREIGN KEY([AgeKey])
REFERENCES [dbo].[AgeDimension] ([AgeKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_AgeDimension]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_AreaDimension] FOREIGN KEY([AreaKey])
REFERENCES [dbo].[AreaDimension] ([AreaKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_AreaDimension]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_IndicatorDimension] FOREIGN KEY([IndicatorKey])
REFERENCES [dbo].[IndicatorDimension] ([IndicatorKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_IndicatorDimension]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_SexDimension] FOREIGN KEY([SexKey])
REFERENCES [dbo].[SexDimension] ([SexKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_SexDimension]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_TrendDimension] FOREIGN KEY([TrendKey])
REFERENCES [dbo].[TrendDimension] ([TrendKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_TrendDimension]
GO

ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_DeprivationDimension] FOREIGN KEY([DeprivationKey])
REFERENCES [dbo].[DeprivationDimension] ([DeprivationKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_DeprivationDimension]
GO