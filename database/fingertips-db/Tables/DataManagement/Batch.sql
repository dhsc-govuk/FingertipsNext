--This stores the metadata of the batch of health data points belonging to a single indicator that have been uploaded together.
CREATE TABLE [DataManagement].[Batch]
(
    [BatchKey] [int] IDENTITY(1,1) NOT NULL,  -- Surrogate key for the batch
    [BatchId] [nvarchar](50) NOT NULL,  -- The ID for the batch
    [IndicatorId] [smallint] NOT NULL,  -- Indicator ID of the indicator this batch belongs to
    [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),  -- The date and time the batch was created
    [PublishedAt] [datetime2] NOT NULL,
    [UserId] [uniqueidentifier] NOT NULL,
    [Status] [nvarchar](50) NOT NULL
CONSTRAINT [PK_Batch] PRIMARY KEY CLUSTERED
(
    [BatchKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]