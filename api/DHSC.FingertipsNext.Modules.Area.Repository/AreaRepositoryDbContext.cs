﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Types;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepositoryDbContext : DbContext
{
    public AreaRepositoryDbContext()
    {
    }

    public AreaRepositoryDbContext(DbContextOptions<AreaRepositoryDbContext> options)
        : base(options)
    {
    }

    public DbSet<AreaModel> Area { get; set; }
    public DbSet<AreaTypeModel> AreaType { get; set; }
    public DbSet<AreaRelationshipModel> AreaRelationship { get; set; }

}



