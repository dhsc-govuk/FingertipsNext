using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Service;

public class AutoMapperProfilesTests
{
    private readonly IMapper _mapper;

    public AutoMapperProfilesTests() =>
        _mapper = new Mapper(new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new AutoMapperProfiles());
        }));

    [Fact]
    public void Mapping_AreaModel_To_SchemaRootArea()
    {
        var areaModel = Fake.AreaModel;
        var mappedArea = _mapper.Map<RootArea>(areaModel);

        mappedArea.Code.ShouldBe(areaModel.AreaCode);
        mappedArea.Name.ShouldBe(areaModel.AreaName);
    }

    [Fact]
    public void Mapping_AreaModel_To_SchemaArea()
    {
        var areaModel = Fake.AreaModel;
        var mappedArea = _mapper.Map<Schemas.Area>(areaModel);

        AssertAreaPropertiesMatch(mappedArea, areaModel);
    }

    #region AreaWithRelationsModel to Schema AreaWithRelations

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulated()
    {
        var awr = Fake.AreaWithRelationsModel;
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        foreach (var parent in mappedAwr.Parents)
        {
            var parentSource = awr.ParentAreas.First(c => c.AreaCode == parent.Code);
            AssertAreaPropertiesMatch(parent, parentSource);
        }

        foreach (var child in mappedAwr.Children)
        {
            var childSource = awr.Children.First(c => c.AreaCode == child.Code);
            AssertAreaPropertiesMatch(child, childSource);
        }
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForParent()
    {
        var awr = Fake.AreaWithRelationsModel;
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForChildren()
    {
        var awr = Fake.AreaWithRelationsModel;
        awr.Children = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        mappedAwr.Children.ShouldBeEmpty();
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }


    [Fact]
    public void Mapping_AreaWithRelationsModel_To_SchemaAreaWithRelations_WhenModelFullyPopulatedExceptForSiblings()
    {
        var awr = Fake.AreaWithRelationsModel;
        awr.Siblings = [];
        var mappedAwr = _mapper.Map<AreaWithRelations>(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    #endregion

    #region AreaTypeModel To Schema AreaType

    [Fact]
    public void Mapping_AreaTypeModel_To_SchemaAreaType()
    {
        var areaTypeModel = Fake.AreaTypeModel;
        var mappedAreaType = _mapper.Map<AreaType>(areaTypeModel);

        mappedAreaType.Key.ShouldBe(areaTypeModel.AreaTypeKey);
        mappedAreaType.Name.ShouldBe(areaTypeModel.AreaTypeName);
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
            
            area.AreaType.HierarchyName.ShouldBe(areaModel.AreaType.HierarchyType);
            area.AreaType.Name.ShouldBe(areaModel.AreaType.AreaTypeName);
            area.AreaType.Key.ShouldBe(areaModel.AreaType.AreaTypeKey);
            area.AreaType.Level.ShouldBe(areaModel.AreaType.Level);
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
}
