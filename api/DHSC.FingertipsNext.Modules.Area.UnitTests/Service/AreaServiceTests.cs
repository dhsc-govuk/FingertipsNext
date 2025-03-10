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
    private readonly IAreaRepository _mockRepository;
    private readonly IMapper _mapper;
    private readonly AreaService _service;

    public AreaServiceTests()
    {
        MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new AutoMapperProfiles());
        });

        _mapper = new Mapper(mapperConfig);
        _mockRepository = Substitute.For<IAreaRepository>();

        _service = new AreaService(_mockRepository, _mapper);
    }

    [Fact]
    public async Task GetHierarchies_ShouldDelegateToRepository()
    {
        _mockRepository.GetHierarchiesAsync().Returns(["str1", "str2"]);

        var result = await _service.GetHierarchies();

        result.ShouldBe(["str1", "str2"]);
        await _mockRepository.Received().GetHierarchiesAsync();
    }

    #region GetAreaTypes

    [Fact]
    public async Task GetAreaTypes_ShouldDelegateToRepository_IfParameterPassed()
    {
        _mockRepository.GetAreaTypesAsync("hierarchyType").Returns(SampleAreaTypes);

        var result = await _service.GetAreaTypes("hierarchyType");

        result.ShouldBeEquivalentTo(_mapper.Map<List<AreaType>>(SampleAreaTypes));
        await _mockRepository.Received().GetAreaTypesAsync("hierarchyType");
    }

    [Fact]
    public async Task GetAreaTypes_ShouldDelegateToRepository_IfNoParameterPassed()
    {
        _mockRepository.GetAreaTypesAsync(null).Returns(SampleAreaTypes);

        var result = await _service.GetAreaTypes();

        result.ShouldBeEquivalentTo(_mapper.Map<List<AreaType>>(SampleAreaTypes));
        await _mockRepository.Received().GetAreaTypesAsync(null);
    }

    private static readonly List<AreaTypeModel> SampleAreaTypes = new List<AreaTypeModel>
    {
        new AreaTypeModel{ AreaTypeKey = "at1", AreaTypeName = "AT1", HierarchyType = "HT1", Level = 1 },
        new AreaTypeModel{ AreaTypeKey = "at2", AreaTypeName = "AT2", HierarchyType = "HT2", Level = 2 }
    };
    
    #endregion

    #region GetRootArea

    [Fact]
    public void GetRootArea_ShouldReturnEnglandAlways()
    {
        var result =  _service.GetRootArea();
        result.ShouldBeEquivalentTo(new RootArea { Name="England", Code="E92000001"});
    }

    #endregion

    #region GetAreaDetails
    
    [Fact]
    public async Task GetAreaDetails_ShouldDelegateToRepositorySupplyingDefaults()
    {
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        await _service.GetAreaDetails("area1", null, null, null);

        await _mockRepository.Received().GetAreaAsync("area1", false, false, null);
    }

    [Fact]
    public async Task GetAreaDetails_ShouldReturnNull_IfRepositoryReturnsNull()
    {
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns((AreaWithRelationsModel?)null);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        result.ShouldBeNull();
    }

    [Fact]
    public async Task GetAreaDetails_ShouldReturnedMappedResult_IfRepositoryReturnsArea()
    {
        var fakeAreaWithRelationsModel = Fake.AreaWithRelationsModel;
        _mockRepository
            .GetAreaAsync(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<bool>(), Arg.Any<string?>())
            .Returns(fakeAreaWithRelationsModel);

        var result = await _service.GetAreaDetails("area1", null, null, null);

        var expectedResult = _mapper.Map<AreaWithRelations>(fakeAreaWithRelationsModel);
        result.ShouldBeEquivalentTo(expectedResult);
    }

    #endregion

    #region GetAreaDetailsForAreaType

    [Fact]
    public async Task GetAreaDetailsForAreaType_ShouldReturnEmptyList_IfRepositoryReturnsEmptyList()
    {
        var fakeAreaModels = new List<AreaModel>();
        _mockRepository
            .GetAreasForAreaTypeAsync(Arg.Any<string>())
            .Returns(fakeAreaModels);
        
        var result = await _service.GetAreaDetailsForAreaType("area1");
        
        result.Count.ShouldBe(0);
    }
    
    [Fact]
    public async Task GetAreaDetailsForAreaType_ShouldReturnMappedList_IfRepositoryReturnsAreas()
    {
        var fakeAreaModels = new List<AreaModel>{ Fake.AreaModel, Fake.AreaModel };
        _mockRepository
            .GetAreasForAreaTypeAsync(Arg.Any<string>())
            .Returns(fakeAreaModels);
        
        var result = await _service.GetAreaDetailsForAreaType("area1");
        
        result.Count.ShouldBe(2);
        result[0].Code.ShouldBeEquivalentTo(fakeAreaModels[0].AreaCode);
        result[1].Code.ShouldBeEquivalentTo(fakeAreaModels[1].AreaCode);
    }
    
    #endregion
}
