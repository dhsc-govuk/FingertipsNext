--This stores the metadata of the batch of health data points belonging to a single indicator that have been uploaded together.
CREATE TABLE [DataManagement].[Batch]
(
    [BatchKey] [int] IDENTITY(1,1) NOT NULL,  -- Surrogate key for the batch
    [BatchId] AS (CONVERT(nvarchar(50), [IndicatorKey]) + '_' + REPLACE(CONVERT(varchar, [Created], 101), '/', '') + REPLACE(CONVERT(varchar, [Created], 108), ':', '')) PERSISTED NOT NULL,
    [IndicatorKey] [smallint] NOT NULL,  -- Indicator ID of the indicator this batch belongs to
    [Created] [datetime2](7) NOT NULL DEFAULT GETDATE(),  -- The date and time the batch was created
CONSTRAINT [PK_Batch] PRIMARY KEY CLUSTERED
(
    [BatchKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]