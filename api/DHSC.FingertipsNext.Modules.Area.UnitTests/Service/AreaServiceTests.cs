using AutoMapper;
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
    IAreaRepository _mockRepository;
    IMapper _mapper;
    AreaService _service;

    [Fact]
    public async Task GetHierarchies_ShouldDelegateToRepository()
    {
        CreateService();
        _mockRepository.GetHierarchiesAsync().Returns(["str1", "str2"]);

        var result = await _service.GetHierarchies();

        result.ShouldBe(["str1", "str2"]);
        await _mockRepository.Received().GetHierarchiesAsync();
    }

    #region GetAreaTypes

    [Fact]
    public async Task GetAreaTypes_ShouldDelegateToRepository_IfParameterPassed()
    {
        CreateService();
        _mockRepository.GetAreaTypesAsync("hierarchyType").Returns(["ar1", "ar2"]);

        var result = await _service.GetAreaTypes("hierarchyType");

        result.ShouldBe(["ar1", "ar2"]);
        await _mockRepository.Received().GetAreaTypesAsync("hierarchyType");
    }

    [Fact]
    public async Task GetAreaTypes_ShouldDelegateToRepository_IfNoParameterPassed()
    {
        CreateService();
        _mockRepository.GetAreaTypesAsync(null).Returns(["ar1", "ar2"]);

        var result = await _service.GetAreaTypes();

        result.ShouldBe(["ar1", "ar2"]);
        await _mockRepository.Received().GetAreaTypesAsync(null);
    }

    #endregion

    #region GetRootArea

    [Fact]
    public async Task GetRootArea_ShouldDelegateToRepository()
    {
        CreateService();
        _mockRepository.GetRootAreaAsync().Returns((AreaModel?)null);

        var result = await _service.GetRootArea();

        await _mockRepository.Received().GetRootAreaAsync();
    }

    [Fact]
    public async Task GetRootArea_ShouldReturnNull_IfRepositoryReturnsNull()
    {
        CreateService();
        _mockRepository.GetRootAreaAsync().Returns((AreaModel?)null);

        var result = await _service.GetRootArea();

        result.ShouldBeNull();
    }

    [Fact]
    public async Task GetRootArea_ShouldReturnMappedArea_IfRepositoryReturnsArea()
    {
        CreateService();
        var mockArea = Fake.AreaModel;
        _mockRepository.GetRootAreaAsync().Returns(mockArea);

        var result = await _service.GetRootArea();

        result.ShouldBeEquivalentTo(_mapper.Map<RootArea>(mockArea));
    }

    #endregion

    #region GetAreaDetails

    [Fact]
    public async Task GetAreaDetails_ShouldDelegateToRepositorySupplyingDefaults()
    {
        CreateService();
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        await _mockRepository.Received().GetAreaAsync("area1", false, false, null);
    }

    [Fact]
    public async Task GetAreaDetails_ShouldReturnNull_IfRepositoryReturnsNull()
    {
        CreateService();
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        result.ShouldBeNull();
    }

    [Fact]
    public async Task GetAreaDetails_ShouldReturnedMappedResult_IfRepositoryReturnsArea()
    {
        CreateService();
        var fakeAreaWithRelationsModel = Fake.AreaWithRelationsModel;
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns(fakeAreaWithRelationsModel);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        var expectedResult = _mapper.Map<AreaWithRelations>(fakeAreaWithRelationsModel);
        result.ShouldBeEquivalentTo(expectedResult);
    }

    #endregion

    void CreateService()
    {
        MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new AutoMapperProfiles());
        });

        _mapper = new Mapper(mapperConfig);
        _mockRepository = Substitute.For<IAreaRepository>();

        _service = new AreaService(_mockRepository, _mapper);
    }
}
