create table Areas.AreaRelationships(
    [ParentAreaKey] int not null,  
    [ChildAreaKey] int not null,
)

GO

ALTER TABLE [Areas].[AreaRelationships]  WITH CHECK ADD CONSTRAINT [FK_AreaRelationships_ChildAreaKey] FOREIGN KEY([ChildAreaKey])
REFERENCES [Areas].[Areas] ([AreaKey])

GO

ALTER TABLE [Areas].[AreaRelationships]  WITH CHECK ADD CONSTRAINT [FK_AreaRelationships_ParentAreaKey] FOREIGN KEY([ParentAreaKey])
REFERENCES [Areas].[Areas] ([AreaKey])

GO

CREATE NONCLUSTERED INDEX [ParentChildIndex] ON [Areas].[AreaRelationships] ([ParentAreaKey]) INCLUDE ([ChildAreaKey]) WITH (ONLINE = ON)
GO