import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { ReportingPeriod } from '@/generated-sources/ft-api-client';

describe('segmentDropDownOptions', () => {
  describe('Sex segmentation', () => {
    const mockData = mockIndicatorWithHealthDataForArea({
      areaHealthData: [
        mockHealthDataForArea({
          indicatorSegments: [
            mockIndicatorSegment({ sex: { value: 'A', isAggregate: false } }),
            mockIndicatorSegment({ sex: { value: 'D', isAggregate: false } }),
            mockIndicatorSegment({ sex: { value: 'Agg', isAggregate: true } }),
            mockIndicatorSegment({ sex: { value: 'B', isAggregate: false } }),
            mockIndicatorSegment({ sex: { value: 'C', isAggregate: false } }),
          ],
        }),
      ],
    });

    it(
      'should find the segmentation options available for sex and reverse' +
        'the order except the aggregate point which must be first',
      () => {
        const result = segmentValues(mockData);

        expect(result.sex).toEqual(['Agg', 'D', 'C', 'B', 'A']);
      }
    );
  });

  describe('Reporting Period segmentation', () => {
    it(
      'should find the segmentation options available for reporting period' +
        'ordered by smallest to largest',
      () => {
        const mockData = mockIndicatorWithHealthDataForArea({
          areaHealthData: [
            mockHealthDataForArea({
              indicatorSegments: [
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Yearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.FiveYearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Quarterly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Monthly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.ThreeYearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.TwoYearly,
                }),
              ],
            }),
          ],
        });

        const result = segmentValues(mockData);

        expect(result.reportingPeriod).toEqual([
          'Monthly',
          'Quarterly',
          'Yearly',
          'Two yearly',
          'Three yearly',
          'Five yearly',
        ]);
      }
    );

    it(
      'should find the segmentation options available for reporting period' +
        'and remove any duplicated reporting periods',
      () => {
        const mockData = mockIndicatorWithHealthDataForArea({
          areaHealthData: [
            mockHealthDataForArea({
              indicatorSegments: [
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Yearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.FiveYearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.FiveYearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Yearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.FiveYearly,
                }),
                mockIndicatorSegment({
                  reportingPeriod: ReportingPeriod.Yearly,
                }),
              ],
            }),
          ],
        });

        const result = segmentValues(mockData);

        expect(result.reportingPeriod).toEqual(['Yearly', 'Five yearly']);
      }
    );
  });
});
