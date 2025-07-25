﻿using Bogus;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

internal sealed class AreaModelFaker : Faker<AreaModel>
{
    public AreaModelFaker()
    {
        StrictMode(true);
        RuleFor(a => a.AreaKey, f => f.IndexFaker);
        RuleFor(a => a.AreaName, f => f.Lorem.Sentence(4));
        RuleFor(a => a.AreaCode, f => f.Random.Guid().ToString());
        RuleFor(a => a.AreaType, f => Fake.AreaTypeModel);
        RuleFor(a => a.AreaTypeKey, f => Fake.AreaTypeModel.AreaTypeKey);
        RuleFor(a => a.Children, f => new List<AreaModel>());
        RuleFor(a => a.Parents, f => new List<AreaModel>());
    }
}
