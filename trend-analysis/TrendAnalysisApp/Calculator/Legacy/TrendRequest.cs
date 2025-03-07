using TrendAnalysisApp.Calculator.Legacy.Models;

namespace TrendAnalysisApp.Calculator.Legacy
{
    public class TrendRequest
    {
        public int ValueTypeId { get; set; }

        /// <summary>
        /// All data including invalid data
        /// </summary>
        public IEnumerable<CoreDataSet> Data { get; set; }

        /// <summary>
        /// Longest unbroken sequence of valid data if enough are available
        /// </summary>
        public IEnumerable<CoreDataSet> ValidData
        {
            get { return GetValidDataList(); }
        }

        public int YearRange { get; set; }

        public int ComparatorMethodId { get; set; }

        public ValidationResult IsValid()
        {
            if (!IsValueTypeValid())
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "The recent trend cannot be calculated for this value type"
                };
            }

            if (YearRange != 1)
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "The recent trend cannot be calculated for this year range"
                };
            }

            if (Data == null)
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "No data points found"
                };
            }

            if (Data.Count() < TrendMarkerCalculator.PointsToUse)
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "Not enough data points to calculate recent trend"
                };
            }

            // Define valid data
            if (ValidData.Count() < TrendMarkerCalculator.PointsToUse)
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "Not enough data points with valid values to calculate recent trend"
                };
            }

            // Check for possible divide by zero errors if the count and denominator are same
            if (IsPossibleDivideByZeroErrors())
            {
                return new ValidationResult()
                {
                    IsValid = false,
                    ValidationMessage = "The recent trend cannot be calculated"
                };
            }

            return new ValidationResult()
            {
                IsValid = true,
                ValidationMessage = string.Empty
            };
        }

        private bool IsValueTypeValid()
        {
            if (ValueTypeId == ValueTypeIds.Proportion
                    || ValueTypeId == ValueTypeIds.CrudeRate
                    || ValueTypeId == ValueTypeIds.DirectlyStandardisedRate)
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Method to check whether the count and denominator are equal.
        /// If they are equal, then SPC for proportion calculation will
        /// result in divide by zero error leading to wrong trend result.
        /// </summary>
        /// <returns>Boolean</returns>
        private bool IsPossibleDivideByZeroErrors()
        {
            foreach (var data in ValidData)
            {
                if (data.Count.Value.CompareTo(data.Denominator) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Get the data (starting with the most recent) until an invalid data point is reached.
        /// </summary>
        private IList<CoreDataSet> GetValidDataList()
        {
            var validData = new List<CoreDataSet>();
            var unsortedData = Data.ToList();
            if (unsortedData.Any())
            {
                var orderedData = unsortedData.OrderByDescending(x => x.Year);
                foreach (var data in orderedData)
                {
                    // Check data is valid. Years don't need to be consecutive.
                    if (IsDataValid(data))
                    {
                        validData.Add(data);
                    }
                }
            }
            return validData;
        }

        /// <summary>
        /// Only Count and denominator are required for the calculation. Check Value too because 
        /// a missing value suggests it has been suppressed.
        /// </summary>
        private static bool IsDataValid(CoreDataSet data)
        {
            return data.IsValueValid && data.IsCountValid && data.IsDenominatorValid;
        }
    }
}