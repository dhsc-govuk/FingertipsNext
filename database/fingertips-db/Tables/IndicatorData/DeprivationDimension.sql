-- The deprivation classifications that data belongs to
CREATE TABLE [dbo].[DeprivationDimension]
(
  [DeprivationKey] [smallint] IDENTITY(1,1) NOT NULL,   -- Surrogate key for deprivation
  [Name] [nvarchar](100) NOT NULL,                      -- The name of the deprivation classification
  [Type] [nvarchar](255) NOT NULL,                      -- The type of the deprivation classification
  [HasValue] [bit] NOT NULL,                            -- A flag to indicate if the data has a value (if not it is not broken down by deprivation classifications)
  [Sequence] [tinyint] NOT NULL
 CONSTRAINT [PK_DeprivationDimension] PRIMARY KEY CLUSTERED
(
	[DeprivationKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]