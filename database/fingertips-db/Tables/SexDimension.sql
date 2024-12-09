CREATE TABLE [dbo].[SexDimension](
	[SexKey] [tinyint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[IsFemale] [bit] NOT NULL,
	[HasValue] [bit] NOT NULL,
	[SexId] [tinyint] NOT NULL,
 CONSTRAINT [PK_SexDimension] PRIMARY KEY CLUSTERED 
(
	[SexKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SexDimension] ADD  CONSTRAINT [DF_SexDimension_IsFemale]  DEFAULT ((0)) FOR [IsFemale]
GO
ALTER TABLE [dbo].[SexDimension] ADD  CONSTRAINT [DF_SexDimension_HasValue]  DEFAULT ((0)) FOR [HasValue]