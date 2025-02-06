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

    #region AreaWithRelationsModel to Schema AreaWithRelations

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulated()
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
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForParent()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.ParentArea = null;
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        mappedAwr.Parent.ShouldBeNull();

        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Ancestors, awr.Ancestors);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForChildren()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.Children = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        mappedAwr.Children.ShouldBeEmpty();
        AssertAreaListsAreEquivalent(mappedAwr.Ancestors, awr.Ancestors);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);

        foreach (var ancestor in mappedAwr.Ancestors)
        {
            var ancestorSource = awr.Ancestors.First(c => c.AreaCode == ancestor.Code);
            AssertAreaPropertiesMatch(ancestor, ancestorSource);
        }
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForAncestors()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.Ancestors = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        mappedAwr.Ancestors.ShouldBeEmpty();
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForSiblings()
    {
        Setup();
        var awr = Fake.AreaWithRelationsModel;
        awr.Siblings = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);
        AssertAreaPropertiesMatch(mappedAwr.Parent, awr.ParentArea);

        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Ancestors, awr.Ancestors);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    #endregion

    #region AreaTypeModel To Schema AreaType

    [Fact]
    public void Mapping_AreaTypeModel_To_SchemaAreaType()
    {
        Setup();
        var areaTypeModel = Fake.AreaTypeModel;
        var mappedAreaType = _mapper.Map<AreaType>(areaTypeModel);

        mappedAreaType.Name.ShouldBe(areaTypeModel.AreaTypeName);
        mappedAreaType.UrlName.ShouldBe(areaTypeModel.AreaTypeUrlName);
        mappedAreaType.HierarchyName.ShouldBe(areaTypeModel.HierarchyType);
        mappedAreaType.Level.ShouldBe(areaTypeModel.Level);
    }

    #endregion

    void AssertAreaPropertiesMatch(Schemas.Area? area, AreaModel? areaModel, bool canBeNull = false)
    {
        if (area == null && areaModel == null && canBeNull)
            return;

        if (area != null && areaModel != null)
        {
            area.Code.ShouldBe(areaModel.AreaCode);
            area.Name.ShouldBe(areaModel.AreaName);
            area.HierarchyName.ShouldBe(areaModel.HierarchyType);
            area.AreaType.ShouldBe(areaModel.AreaType);
            area.Level.ShouldBe(areaModel.Level);
        }
        else
        {
            Assert.Fail();
        }
    }

    void AssertAreaListsAreEquivalent(List<Schemas.Area> mappedAreas, List<AreaModel> modelAreas)
    {
        mappedAreas.Count.ShouldBe(modelAreas.Count);

        foreach (var mapped in mappedAreas)
        {
            var model = modelAreas.First(c => c.AreaCode == mapped.Code);
            AssertAreaPropertiesMatch(mapped, model);
        }
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
