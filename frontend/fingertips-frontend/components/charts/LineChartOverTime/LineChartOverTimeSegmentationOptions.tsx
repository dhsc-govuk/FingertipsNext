import { useLineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { SegmentationDropDowns } from '@/components/forms/SegmentationOptions/SegmentationDropDowns';

export function LineChartOverTimeSegmentationOptions() {
  const apiReqParams = useLineChartOverTimeRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(apiReqParams);

  if (!healthData) return null;

  const options = segmentValues(healthData);
  return <SegmentationDropDowns options={options} />;
}
