import {
  HealthDataPoint,
  IndicatorSegment,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

export const findHealthPointsBySegmentation = (
  indicatorSegments: IndicatorSegment[],
  searchState: SearchStateParams
): HealthDataPoint[] => {
  const { [SearchParams.SegmentationSex]: selectedSegSex } = searchState;

  const matchingSegment = indicatorSegments.find((segment) => {
    const { sex } = segment;
    const sexMatch =
      (!selectedSegSex && sex.isAggregate) ||
      sex.value.toLowerCase() === selectedSegSex?.toLowerCase();
    const ageMatch = true;
    const freqMatch = true;

    return sexMatch && ageMatch && freqMatch;
  });

  return matchingSegment?.healthData ?? [];
};
