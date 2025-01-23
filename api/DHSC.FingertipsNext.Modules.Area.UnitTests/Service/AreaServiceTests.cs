using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Service;
using NSubstitute;
using NSubstitute.Equivalency;

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
    public async void GetHierarchies_ShouldDelegateToRepository()
    {
        CreateService();
        _mockRepository.GetHierarchiesAsync().Returns(["str1", "str2"]);
    }

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
