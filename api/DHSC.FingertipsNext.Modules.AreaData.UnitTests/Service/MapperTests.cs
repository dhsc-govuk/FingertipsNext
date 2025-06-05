using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;
using DHSC.FingertipsNext.Modules.AreaData.Service;
using DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Service;

public class AreaMapperTests
{
    private readonly AreaMapper _areaMapper = new AreaMapper();

    [Fact]
    public void MappingAreaModelToSchemaRootArea()
    {
        var areaModel = Fake.AreaModel;
        var mappedArea = _areaMapper.MapToRootArea(areaModel);

        mappedArea.Code.ShouldBe(areaModel.AreaCode);
        mappedArea.Name.ShouldBe(areaModel.AreaName);
    }

    [Fact]
    public void MappingAreaModelToSchemaArea()
    {
        var areaModel = Fake.AreaModel;
        var mappedArea = _areaMapper.Map(areaModel);

        AssertAreaPropertiesMatch(mappedArea, areaModel);
    }

    #region AreaWithRelationsModel to Schema AreaWithRelations

    [Fact]
    public void MappingAreaWithRelationsModelToSchemaAreaWithRelationsWhenModelFullyPopulated()
    {
        var awr = Fake.AreaWithRelationsModel;
        var mappedAwr = _areaMapper.Map(awr);

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
    public void MappingAreaWithRelationsModelToSchemaAreaWithRelationsWhenModelFullyPopulatedExceptForParent()
    {
        var awr = Fake.AreaWithRelationsModel;
        var mappedAwr = _areaMapper.Map(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    [Fact]
    public void MappingAreaWithRelationsModelToSchemaAreaWithRelationsWhenModelFullyPopulatedExceptForChildren()
    {
        var awr = Fake.AreaWithRelationsModel;
        awr.Children.Clear();
        var mappedAwr = _areaMapper.Map(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        mappedAwr.Children.ShouldBeEmpty();
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }


    [Fact]
    public void MappingAreaWithRelationsModelToSchemaAreaWithRelationsWhenModelFullyPopulatedExceptForSiblings()
    {
        var awr = Fake.AreaWithRelationsModel;
        awr.Siblings.Clear();
        var mappedAwr = _areaMapper.Map(awr);

        AssertAreaPropertiesMatch(mappedAwr, awr.Area);

        AssertAreaListsAreEquivalent(mappedAwr.Parents, awr.ParentAreas);
        AssertAreaListsAreEquivalent(mappedAwr.Children, awr.Children);
        AssertAreaListsAreEquivalent(mappedAwr.Siblings, awr.Siblings);
    }

    #endregion

    #region AreaTypeModel To Schema AreaType

    [Fact]
    public void MappingAreaTypeModelToSchemaAreaType()
    {
        var areaTypeModel = Fake.AreaTypeModel;
        var mappedAreaType = _areaMapper.Map(areaTypeModel);

        mappedAreaType.Key.ShouldBe(areaTypeModel.AreaTypeKey);
        mappedAreaType.Name.ShouldBe(areaTypeModel.AreaTypeName);
        mappedAreaType.HierarchyName.ShouldBe(areaTypeModel.HierarchyType);
        mappedAreaType.Level.ShouldBe(areaTypeModel.Level);
    }

    #endregion

    static void AssertAreaPropertiesMatch(Schemas.Area area, AreaModel areaModel, bool canBeNull = false)
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

    static void AssertAreaListsAreEquivalent(IList<Schemas.Area> mappedAreas, IList<AreaModel> modelAreas)
    {
        mappedAreas.Count.ShouldBe(modelAreas.Count);

        foreach (var mapped in mappedAreas)
        {
            var model = modelAreas.First(c => c.AreaCode == mapped.Code);
            AssertAreaPropertiesMatch(mapped, model);
        }
    }
}
