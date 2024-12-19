using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DHSC.FingertipsNext.Modules.Repository;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Core.Repository
{
    public class RepositoryDbContext : DbContext
    {

        public RepositoryDbContext() 
        {
        }

        //public RepositoryDbContext(DbContextOptions<RepositoryDbContext> options)
        //    : base(options)
        //{
        //}

        public RepositoryDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<HealthMeasure> HealthMeasures {  get; set; }
    }


}
