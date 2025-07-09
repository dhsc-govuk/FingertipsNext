import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { SegmentationDropDowns } from '@/components/forms/SegmentationOptions/SegmentationDropDowns';

export function OneIndicatorSegmentationOptions() {
  const apiReqParams = useOneIndicatorRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(apiReqParams);

  if (!healthData) return null;

  const options = segmentValues(healthData);
  return <SegmentationDropDowns options={options} />;
}
