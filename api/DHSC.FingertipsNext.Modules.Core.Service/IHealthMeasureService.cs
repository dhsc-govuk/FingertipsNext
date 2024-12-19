using DHSC.FingertipsNext.Modules.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public interface IHealthMeasureService
    {
        Task<HealthMeasure> GetFirstHealthMeasure();
    }
}
