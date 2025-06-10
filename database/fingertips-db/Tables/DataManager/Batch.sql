--This stores a batch of health data points belonging to a single indicator that have been uploaded together.
CREATE TABLE [DataManager].[Batch]
(
    [BatchId] [int] IDENTITY(1,1) NOT NULL,  -- Surrogate key for the batch
    [IndicatorKey] [smallint] NOT NULL,  -- Foreign key to the indicator this batch belongs to
    [Created] [datetime2](7) NOT NULL DEFAULT GETDATE(),  -- The date and time the batch was created
    [Published] [bit] NOT NULL DEFAULT 0,  -- Whether the batch has been published
CONSTRAINT [PK_Batch] PRIMARY KEY CLUSTERED
(
    [BatchId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [DataManager].[Batch] WITH CHECK ADD CONSTRAINT [FK_Batch_IndicatorDimension] FOREIGN KEY([IndicatorKey])
REFERENCES [dbo].[IndicatorDimension] ([IndicatorKey])