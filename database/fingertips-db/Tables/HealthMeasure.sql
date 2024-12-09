CREATE TABLE [dbo].[HealthMeasure](
	[HealthMeasureKey] [int] IDENTITY(1,1) NOT NULL,
	[AreaKey] [int] NOT NULL,
	[IndicatorKey] [smallint] NOT NULL,
	[SexKey] [tinyint] NOT NULL,
	[AgeKey] [smallint] NOT NULL,
	[Count] [float] NOT NULL,
	[Value] [float] NOT NULL,
	[LowerCI] [float] NOT NULL,
	[UpperCI] [float] NOT NULL,
	[Year] [smallint] NOT NULL,
 CONSTRAINT [PK_HealthMeasure] PRIMARY KEY CLUSTERED 
(
	[HealthMeasureKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HealthMeasure]  WITH CHECK ADD  CONSTRAINT [FK_HealthMeasure_AgeDimesnion] FOREIGN KEY([AgeKey])
REFERENCES [dbo].[AgeDimension] ([AgeKey])
GO

ALTER TABLE [dbo].[HealthMeasure] CHECK CONSTRAINT [FK_HealthMeasure_AgeDimesnion]
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