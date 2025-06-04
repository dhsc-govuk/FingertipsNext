using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Service;

/// <summary>
///
/// </summary>
public class AreaServiceTests
{
    private readonly IAreaRepository _mockRepository;
    private readonly AreaMapper _areaMapper;
    private readonly AreaService _service;

    public AreaServiceTests()
    {
        _areaMapper = new AreaMapper();
        _mockRepository = Substitute.For<IAreaRepository>();

        _service = new AreaService(_mockRepository, _areaMapper);
    }

    [Fact]
    public async Task GetHierarchiesShouldDelegateToRepository()
    {
        _mockRepository.GetHierarchiesAsync().Returns(["str1", "str2"]);

        var result = await _service.GetHierarchies();

        result.ShouldBe(["str1", "str2"]);
        await _mockRepository.Received().GetHierarchiesAsync();
    }

    #region GetAreaTypes

    [Fact]
    public async Task GetAreaTypesShouldDelegateToRepositoryIfParameterPassed()
    {
        _mockRepository.GetAreaTypesAsync("hierarchyType").Returns(SampleAreaTypes);

        var result = await _service.GetAreaTypes("hierarchyType");

        result.ShouldBeEquivalentTo(_areaMapper.Map(SampleAreaTypes));
        await _mockRepository.Received().GetAreaTypesAsync("hierarchyType");
    }

    [Fact]
    public async Task GetAreaTypesShouldDelegateToRepositoryIfNoParameterPassed()
    {
        _mockRepository.GetAreaTypesAsync(null).Returns(SampleAreaTypes);

        var result = await _service.GetAreaTypes();

        result.ShouldBeEquivalentTo(_areaMapper.Map(SampleAreaTypes));
        await _mockRepository.Received().GetAreaTypesAsync(null);
    }

    private static readonly List<AreaTypeModel> SampleAreaTypes = new List<AreaTypeModel>
    {
        new() { AreaTypeKey = "at1", AreaTypeName = "AT1", HierarchyType = "HT1", Level = 1 },
        new() { AreaTypeKey = "at2", AreaTypeName = "AT2", HierarchyType = "HT2", Level = 2 }
    };

    #endregion

    #region GetRootArea

    [Fact]
    public void GetRootAreaShouldReturnEnglandAlways()
    {
        var result = _service.GetRootArea();
        result.ShouldBeEquivalentTo(new RootArea { Name = "England", Code = "E92000001" });
    }

    #endregion

    #region GetAreaDetails

    [Fact]
    public async Task GetAreaDetailsShouldDelegateToRepositorySupplyingDefaults()
    {
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        await _service.GetAreaDetails("area1", null, null, null);

        await _mockRepository.Received().GetAreaAsync("area1", false, false, null);
    }

    [Fact]
    public async Task GetAreaDetailsShouldReturnNullIfRepositoryReturnsNull()
    {
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        result.ShouldBeNull();
    }

    [Fact]
    public async Task GetAreaDetailsShouldReturnedMappedResultIfRepositoryReturnsArea()
    {
        var fakeAreaWithRelationsModel = Fake.AreaWithRelationsModel;
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns(fakeAreaWithRelationsModel);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        var expectedResult = _areaMapper.Map(fakeAreaWithRelationsModel);
        result.ShouldBeEquivalentTo(expectedResult);
    }

    #endregion

    #region GetAreaDetailsForAreaType

    [Fact]
    public async Task GetAreaDetailsForAreaTypeShouldReturnEmptyListIfRepositoryReturnsEmptyList()
    {
        var fakeAreaModels = new List<AreaModel>();
        _mockRepository
            .GetAreasForAreaTypeAsync(Arg.Any<string>())
            .Returns(fakeAreaModels);

        var result = await _service.GetAreaDetailsForAreaType("area1");

        result.Count.ShouldBe(0);
    }

    [Fact]
    public async Task GetAreaDetailsForAreaTypeShouldReturnMappedListIfRepositoryReturnsAreas()
    {
        var fakeAreaModels = new List<AreaModel> { Fake.AreaModel, Fake.AreaModel };
        _mockRepository
            .GetAreasForAreaTypeAsync(Arg.Any<string>())
            .Returns(fakeAreaModels);

        var result = await _service.GetAreaDetailsForAreaType("area1");

        result.Count.ShouldBe(2);
        result[0].Code.ShouldBeEquivalentTo(fakeAreaModels[0].AreaCode);
        result[1].Code.ShouldBeEquivalentTo(fakeAreaModels[1].AreaCode);
    }

    #endregion

    #region GetMultipleAreaDetails

    [Fact]
    public async Task GetMultipleAreaDetailsShouldReturnedMappedResultIfRepositoryReturnsAreas()
    {
        var fakeAreaWithNoRelationsModel = new List<AreaModel>
        {
            Fake.AreaNoRelationsModel,
            Fake.AreaNoRelationsModel
        };
        _mockRepository
            .GetMultipleAreaDetailsAsync(Arg.Any<string[]>())
            .Returns(fakeAreaWithNoRelationsModel);

        var result = await _service.GetMultipleAreaDetails(["areaOne", "districtNine"]);

        await _mockRepository.Received(1).GetMultipleAreaDetailsAsync(
            Arg.Is<string[]>(areaCodes => areaCodes[0] == "areaOne" && areaCodes[1] == "districtNine")
        );
        result.Count.ShouldBe(2);
        result[0].ShouldBeEquivalentTo(
            _areaMapper.Map(fakeAreaWithNoRelationsModel[0])
        );
        result[1].ShouldBeEquivalentTo(
            _areaMapper.Map(fakeAreaWithNoRelationsModel[1])
        );
    }

    [Fact]
    public async Task GetMultipleAreaDetailsShouldReturnedEmptyListIfRepositoryReturnsEmpty()
    {
        _mockRepository
            .GetMultipleAreaDetailsAsync(Arg.Any<string[]>())
            .Returns(new List<AreaModel> { });

        var result = await _service.GetMultipleAreaDetails(["areaOne"]);

        await _mockRepository.Received(1).GetMultipleAreaDetailsAsync(
            Arg.Is<string[]>(areaCodes => areaCodes[0] == "areaOne")
        );
        result.Count.ShouldBe(0);
    }

    #endregion
}
