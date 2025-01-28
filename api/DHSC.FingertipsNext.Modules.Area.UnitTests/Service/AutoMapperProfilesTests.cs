using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Service;

public class AutoMapperProfilesTests
{
    IMapper _mapper;

    [Fact]
    public void Mapping_AreaModel_To_SchemaRootArea()
    {
        Setup();
        var areaModel = Fake.AreaModel;
        var mappedArea = _mapper.Map<RootArea>(areaModel);

        mappedArea.Code.ShouldBe(areaModel.AreaCode);
        mappedArea.Name.ShouldBe(areaModel.AreaName);
    }
    
    [Fact]
    public void Mapping_AreaModel_To_SchemaArea()
    {
        Setup();
        var areaModel = Fake.AreaModel;
        var mappedArea = _mapper.Map<Schemas.Area>(areaModel);

        AssertAreaPropertiesMatch(mappedArea, areaModel);
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_AreaWithRelations_WhenModelFullyPopulated()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        foreach (var child in mappedAwr.Children)
        {
            var childSource = awr.Children.First(c => c.AreaCode == child.Code);
            AssertAreaPropertiesMatch(child, childSource);
        }
        
        foreach (var ancestor in mappedAwr.Ancestors)
        {
            var ancestorSource = awr.Ancestors.First(c => c.AreaCode == ancestor.Code);
            AssertAreaPropertiesMatch(ancestor, ancestorSource);
        }
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_AreaWithRelations_WhenModelFullyPopulatedExceptForParent()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.ParentArea = null;
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        mappedAwr.Parent.ShouldBeNull();

        foreach (var child in mappedAwr.Children)
        {
            var childSource = awr.Children.First(c => c.AreaCode == child.Code);
            AssertAreaPropertiesMatch(child, childSource);
        }
        
        foreach (var ancestor in mappedAwr.Ancestors)
        {
            var ancestorSource = awr.Ancestors.First(c => c.AreaCode == ancestor.Code);
            AssertAreaPropertiesMatch(ancestor, ancestorSource);
        }
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_AreaWithRelations_WhenModelFullyPopulatedExceptForChildren()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.Children = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        mappedAwr.Children.ShouldBeEmpty();
        
        foreach (var ancestor in mappedAwr.Ancestors)
        {
            var ancestorSource = awr.Ancestors.First(c => c.AreaCode == ancestor.Code);
            AssertAreaPropertiesMatch(ancestor, ancestorSource);
        }
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_AreaWithRelations_WhenModelFullyPopulatedExceptForAncestors()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.Ancestors = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        foreach (var child in mappedAwr.Children)
        {
            var childSource = awr.Children.First(c => c.AreaCode == child.Code);
            AssertAreaPropertiesMatch(child, childSource);
        }
        
        mappedAwr.Ancestors.ShouldBeEmpty();
    }

    void AssertAreaPropertiesMatch(Schemas.Area area, AreaModel areaModel)
    {
        area.Code.ShouldBe(areaModel.AreaCode);
        area.Name.ShouldBe(areaModel.AreaName);
        area.HierarchyName.ShouldBe(areaModel.HierarchyType);
        area.AreaType.ShouldBe(areaModel.AreaType);
        area.Level.ShouldBe(areaModel.Level);
    }

    void Setup()
    {
        MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new AutoMapperProfiles());
        });

        _mapper = new Mapper(mapperConfig);
    }
}