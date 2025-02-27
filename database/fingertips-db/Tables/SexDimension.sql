--Male, Female or everyone
CREATE TABLE [dbo].[SexDimension](
	[SexKey] [tinyint] IDENTITY(1,1) NOT NULL,			--The surrogate key
	[Name] [nvarchar](50) NOT NULL,						--The name of the sex e.g. Female
	[HasValue] [bit] NOT NULL,							--A flag to indicate if the data has a value (if not it is for all persons)
	[SexId] [tinyint] NOT NULL,							--The original ID of the sex taken from the original Fingertips Pholio database.
 CONSTRAINT [PK_SexDimension] PRIMARY KEY CLUSTERED 
(
	[SexKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SexDimension] ADD  CONSTRAINT [DF_SexDimension_HasValue]  DEFAULT ((0)) FOR [HasValue]
GO