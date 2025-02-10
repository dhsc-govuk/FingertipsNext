--The age (range) of the population that the data is for
CREATE TABLE [dbo].[AgeDimension](
	[AgeKey] [smallint] IDENTITY(1,1) NOT NULL, -- Surrogate key of the age
	[Name] [nvarchar](50) NOT NULL, 			      -- The name of the age e.g. over 75
	[AgeID] [smallint] NOT NULL, 				        -- The age id, taken from the original Fingertips Pholio database
	[HasValue] [bit] NOT NULL,	    						-- A flag to indicate if the data has a value (if not it is for all persons)
 CONSTRAINT [PK_AgeDimension] PRIMARY KEY CLUSTERED
(
	[AgeKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]