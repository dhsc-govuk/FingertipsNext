import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SegmentInfo } from '@/lib/common-types';

export const searchFromSegmentInfo = (info: SegmentInfo): SearchStateParams => {
  return {
    [SearchParams.SegmentationSex]: info.sex,
    [SearchParams.SegmentationAge]: info.age,
    [SearchParams.SegmentationReportingPeriod]: info.reportingPeriod,
  };
};
