'use client';
import { OneAreaView } from '@/components/views/OneAreaView';
import { ThreeOrMoreAreasView } from '@/components/views/ThreeOrMoreAreasView';
import { TwoAreasView } from '@/components/views/TwoAreasView';
import { selectChartView } from '@/lib/viewUtils/selectChartView';

interface ViewsSkeletonProps {
  areaCodes: string[];
}

function renderSelectedViewComponent(selectedView: string) {
  switch (selectedView) {
    case 'oneAreaView':
      return <OneAreaView />;
    case 'twoAreasView':
      return <TwoAreasView />;
    case 'threeOrMoreAreasView':
      return <ThreeOrMoreAreasView />;
  }
}

export function ViewsSkeleton({ areaCodes }: ViewsSkeletonProps) {
  return <>{renderSelectedViewComponent(selectChartView(areaCodes))}</>;
}
