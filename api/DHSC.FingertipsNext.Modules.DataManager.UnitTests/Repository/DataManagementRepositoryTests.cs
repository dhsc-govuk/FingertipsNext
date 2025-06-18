using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Repository;

public class DataManagementRepositoryTests : IDisposable
{
    private readonly DataManagementDbContext _dbContext;
    private DataManagementRepository _dataManagementRepository;

    public DataManagementRepositoryTests()
    {
        _dbContext = new DataManagementDbContext();
        _dataManagementRepository = new DataManagementRepository(_dbContext);
    }
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _dbContext.Dispose();
        }
    }

    
    [Fact]
    public void SayHelloTest()
    {
        // assert
        _dataManagementRepository.SayHello().ShouldBe("I'm a Repository");
    }
    [Fact]
    public void RepositoryInitialisationShouldThrowErrorIfNullDBContextIsProvided()
    {
        var act = () => _dataManagementRepository = new DataManagementRepository(null!);

        act.ShouldThrow<ArgumentNullException>()
            .Message.ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }
}