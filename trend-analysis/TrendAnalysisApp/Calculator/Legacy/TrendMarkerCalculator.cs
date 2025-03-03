using TrendAnalysisApp.Calculator.Legacy.Models;

namespace TrendAnalysisApp.Calculator.Legacy
{
    public class TrendMarkerCalculator
    {
        public const int PointsToUse = 5;
        public const int NumberOfIterations = 6;
        public const double ChiSquareConfidence = 9.54953570608324;

        private Dictionary<int, TrendMarkerCalculatedValue> _trendMarkerCalculatedValues;
        private Dictionary<int, TrendMarkerCalculatedValueForProportion> _trendMarkerCalculatedValueForProportions;
        private double _chi2;

        public double Slope { get; set; }

        public TrendMarkerResult GetResults(TrendRequest trendRequest)
        {
            return CalculateTrend(trendRequest);
        }

        private TrendMarkerResult CalculateTrend(TrendRequest trendRequest)
        {
            // Initialise and calculate trend marker
            var trendMarker = trendRequest.ValidData.Count() >= PointsToUse ? TrendMarker.NoChange : TrendMarker.CannotBeCalculated;

            // Check whether trend request is valid
            
            var validationResult = trendRequest.IsValid();
            if (!validationResult.IsValid)
            {
                return new TrendMarkerResult()
                {
                    Marker = TrendMarker.CannotBeCalculated,
                    NumberOfPointsUsedInCalculation = PointsToUse,
                    ChiSquare = 0.0,
                    IsSignificant = false,
                    Message = validationResult.ValidationMessage
                };
            }

            // Is there a significant trend
            var isSignificant = trendRequest.ComparatorMethodId == ComparatorMethodIds.SpcForProportions
                ? IsSignificantForProportions(trendRequest)
                : IsSignificant(trendRequest);

            // Calculate trend marker if there is a significant trend
            if (isSignificant)
            {
                if (Slope > 0)
                {
                    trendMarker = TrendMarker.Increasing;
                }
                else if (Slope < 0)
                {
                    trendMarker = TrendMarker.Decreasing;
                }
                else
                {
                    trendMarker = TrendMarker.NoChange;
                }
            }

            // Return results
            return new TrendMarkerResult()
            {
                Marker = trendMarker,
                NumberOfPointsUsedInCalculation = PointsToUse,
                ChiSquare = _chi2,
                IsSignificant = isSignificant,
                Message = string.Empty
            };
        }

        /// <summary>
        /// Checks whether the core data set records are significant.
        /// This calculation is for comparator methods other than SPC for proportions
        /// </summary>
        /// <returns>A boolean result</returns>
        private bool IsSignificant(TrendRequest trendRequest)
        {
            var validDataList = trendRequest.ValidData.ToList();
            var dataList = GetMostRecentData(validDataList);
            var counter = 1;

            _trendMarkerCalculatedValues = new Dictionary<int, TrendMarkerCalculatedValue>();

            foreach (var coreDataSet in dataList)
            {
                var limit = (coreDataSet.UpperCI95.Value - coreDataSet.LowerCI95.Value) / 3.92;
                var divisor = Math.Pow(limit, 2);

                var trendMarkerCalculatedValue = new TrendMarkerCalculatedValue()
                {
                    Val1 = 1 / divisor,
                    Val2 = (coreDataSet.Value * counter) / divisor,
                    Val3 = counter / divisor,
                    Val4 = coreDataSet.Value / divisor,
                    Val5 = Math.Pow(counter, 2) / divisor
                };

                _trendMarkerCalculatedValues.Add(counter, trendMarkerCalculatedValue);
                counter++;
            }

            var noOutliers = NoOutliersCheck();
            return noOutliers && _chi2 > ChiSquareConfidence;
        }

        /// <summary>
        /// Checks whether the core data set records are significant.
        /// This calculation is only for the comparator method SPC for proportions
        /// </summary>
        /// <returns>A boolean result</returns>
        private bool IsSignificantForProportions(TrendRequest trendRequest)
        {
            var validDataList = trendRequest.ValidData.ToList();
            var dataList = GetMostRecentData(validDataList);
            var counter = 1;
            var denomSum = 0.0;
            var countAndYearSum = 0.0;
            var countSum = 0.0;
            var denomAndYearSum = 0.0;
            var denomAndYearPower2Sum = 0.0;

            _trendMarkerCalculatedValueForProportions = new Dictionary<int, TrendMarkerCalculatedValueForProportion>();
;
            foreach (var coreDataSet in dataList)
            {
                var countValue = coreDataSet.Count.Value;
                var logValue = Math.Log(countValue / (coreDataSet.Denominator - countValue));

                var trendMarkerCalculatedValueForProportion = new TrendMarkerCalculatedValueForProportion()
                {
                    Value = logValue,
                    MultipliedValue = logValue * counter
                };

                _trendMarkerCalculatedValueForProportions.Add(counter, trendMarkerCalculatedValueForProportion);

                denomSum += coreDataSet.Denominator;
                countAndYearSum += countValue * counter;
                countSum += countValue;
                denomAndYearSum += coreDataSet.Denominator * counter;
                denomAndYearPower2Sum += coreDataSet.Denominator * Math.Pow(counter, 2);

                counter++;
            }


            var numerator = denomSum * Math.Pow((denomSum * countAndYearSum) - (countSum * denomAndYearSum), 2);
            var denominator = countSum * (denomSum - countSum) * ((denomSum * denomAndYearPower2Sum) - Math.Pow(denomAndYearSum, 2));
            _chi2 = numerator / denominator;

            var noOutliers = NoOutliersCheckForProportion();
            return noOutliers && _chi2 > ChiSquareConfidence;
        }

        /// <summary>
        /// Check whether any outlier exists.
        /// This calculation is for comparator methods other than SPC for proportions
        /// </summary>
        /// <returns>A boolean result</returns>
        private bool NoOutliersCheck()
        {
            var slopeSum = 0;

            // Loop through the number of points to use
            // The counter starts from 0 instead of 1 and this
            // is to handle the complete scenario
            // Counter = 0 => Consider all trend marker calculated rows
            // Counter = 1 => Do not consider the first trend marker calculated row
            // Counter = 2 => Do not consider the second trend marker calculated row
            // Counter = 3 => Do not consider the third trend marker calculated row
            // Counter = 4 => Do not consider the fourth trend marker calculated row
            // Counter = 5 => Do not consider the fifth trend marker calculated row
            for (var checkCounter = 0; checkCounter <= PointsToUse; checkCounter++)
            {
                var sum1 = 0.0;
                var sum2 = 0.0;
                var sum3 = 0.0;
                var sum4 = 0.0;
                var sum5 = 0.0;

                foreach (var data in _trendMarkerCalculatedValues)
                {
                    if ((checkCounter == 0) || (checkCounter > 0 && data.Key != checkCounter))
                    {
                        sum1 += data.Value.Val1;
                        sum2 += data.Value.Val2;
                        sum3 += data.Value.Val3;
                        sum4 += data.Value.Val4;
                        sum5 += data.Value.Val5;
                    }
                }

                // Calculate the slope value and sum of the slope values
                var slopeValue = ((sum1 * sum2) - (sum3 * sum4)) / ((sum1 * sum5) - Math.Pow(sum3, 2));

                slopeSum += slopeValue < 0 ? -1 : 1;

                // Calculate slope and chi2 considering all trend marker calculated rows
                if (checkCounter == 0)
                {
                    Slope = slopeValue;

                    var beta = Math.Sqrt(sum1 / ((sum1 * sum5) - Math.Pow(sum3, 2)));
                    _chi2 = Math.Pow((Slope / beta), 2);
                }
            }

            // Return
            return Math.Abs(slopeSum) == NumberOfIterations;
        }

        /// <summary>
        /// Check whether any outlier exists.
        /// This calculation is only for the comparator method SPC for proportions
        /// </summary>
        /// <returns>A boolean result</returns>
        private bool NoOutliersCheckForProportion()
        {
            var slopeSum = 0;

            for (var checkCounter = 0; checkCounter <= PointsToUse; checkCounter++)
            {
                var valueSum = 0.0;
                var multipliedValueSum = 0.0;
                var sumTi = 0;
                var nSumTi2 = 0;

                foreach (var data in _trendMarkerCalculatedValueForProportions)
                {
                    if ((checkCounter == 0) || (checkCounter > 0 && data.Key != checkCounter))
                    {
                        valueSum += data.Value.Value;
                        multipliedValueSum += data.Value.MultipliedValue;
                    }
                }

                if (checkCounter == 0)
                {
                    multipliedValueSum = PointsToUse * multipliedValueSum;
                }
                else
                {
                    multipliedValueSum = (PointsToUse - 1) * multipliedValueSum;
                }

                switch (checkCounter)
                {
                    case 0:
                        sumTi = 15;
                        nSumTi2 = 275;
                        break;
                    case 1:
                        sumTi = 14;
                        nSumTi2 = 216;
                        break;
                    case 2:
                        sumTi = 13;
                        nSumTi2 = 204;
                        break;
                    case 3:
                        sumTi = 12;
                        nSumTi2 = 184;
                        break;
                    case 4:
                        sumTi = 11;
                        nSumTi2 = 156;
                        break;
                    case 5:
                        sumTi = 10;
                        nSumTi2 = 120;
                        break;
                }

                // Calculate the slope value and sum of the slope values
                var slopeValue = (multipliedValueSum - (valueSum * sumTi)) / (nSumTi2 - Math.Pow(sumTi, 2));

                slopeSum += slopeValue < 0 ? -1 : 1;

                // Calculate slope considering all trend marker calculated rows
                if (checkCounter == 0)
                {
                    Slope = slopeValue;
                }
            }

            // Return
            return Math.Abs(slopeSum) == NumberOfIterations;
        }

        /// <summary>
        /// Gets the number of core data set list records, defined by PointsToUse constant,
        /// most recent time period but ordered ascending
        /// </summary>
        /// <param name="dataList"></param>
        /// <returns>Core data set list</returns>
        private IEnumerable<CoreDataSet> GetMostRecentData(IEnumerable<CoreDataSet> dataList)
        {
            var filtereCoreDataSets = dataList
                .Where(x => x.LowerCI95 != null && x.UpperCI95 != null && x.IsValueValid)
                .OrderByDescending(t => t.Year)
                .Take(PointsToUse);

            return filtereCoreDataSets.OrderBy(t => t.Year);
        }
    }
}