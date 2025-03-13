--All the public health indicators
CREATE TABLE [dbo].[IndicatorDimension](
	[IndicatorKey] [smallint] IDENTITY(1,1) NOT NULL,		--The surrogate key
	[Name] [nvarchar](255) NOT NULL,						--The name of the indicator e.g. Under 75 mortality rate from all causes
	[IndicatorId] [int] NOT NULL,							--The original ID of the indicator taken from the original Fingertips Pholio database.
	[Polarity] [nvarchar](255) NULL,                         --The polarity to apply to the indicator i.e. whether high value is good or bad in terms of trends and benchmarking
	[ValueType] [nvarchar](255) NULL,                        --The type of value for the data collected for the indicator e.g. proportion, directly standardised rate
	[BenchmarkComparisonMethod] [nvarchar](255) NULL,        --e.g. RAG or Quntiles
	[StartDate] [datetime2](7) NOT NULL,					--The start data that this row was relevant for, to support slowly changing dimensions if an indicator changes over time
	[EndDate] [datetime2](7) NOT NULL,						--The end data that this row was relevant for, to support slowly changing dimensions if an indicator changes over time
 CONSTRAINT [PK_IndicatorDimension] PRIMARY KEY CLUSTERED 
(
	[IndicatorKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]