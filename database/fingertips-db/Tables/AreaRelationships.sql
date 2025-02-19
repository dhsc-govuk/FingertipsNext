create table Areas.AreaRelationships(
    [ChildAreaKey] int not null,
    [ParentAreaKey] int not null,  
)

GO

ALTER TABLE [Areas].[AreaRelationships]  WITH CHECK ADD CONSTRAINT [FK_AreaRelationships_ChildAreaKey] FOREIGN KEY([ChildAreaKey])
REFERENCES [Areas].[Areas] ([AreaKey])

GO

ALTER TABLE [Areas].[AreaRelationships]  WITH CHECK ADD CONSTRAINT [FK_AreaRelationships_ParentAreaKey] FOREIGN KEY([ParentAreaKey])
REFERENCES [Areas].[Areas] ([AreaKey])

GO
