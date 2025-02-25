'use client';
import { OneAreaView } from '@/components/views/OneAreaView';
import { ThreeOrMoreAreasView } from '@/components/views/ThreeOrMoreAreasView';
import { TwoAreasView } from '@/components/views/TwoAreasView';
import { selectChartView } from '@/lib/viewUtils/selectChartView';

interface ViewsSkeletonProps {
  areaCodes: string[];
  indicatorsSelected: string[];
}

function renderSelectedViewComponent(
  selectedView: string,
  areaCodes: string[],
  indicatorsSelected: string[]
) {
  switch (selectedView) {
    case 'oneAreaView':
      return (
        <OneAreaView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
    case 'twoAreasView':
      return (
        <TwoAreasView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
    case 'threeOrMoreAreasView':
      return (
        <ThreeOrMoreAreasView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
  }
}

export function ViewsSkeleton({
  areaCodes,
  indicatorsSelected,
}: ViewsSkeletonProps) {
  return (
    <>
      {renderSelectedViewComponent(
        selectChartView(areaCodes),
        areaCodes,
        indicatorsSelected
      )}
    </>
  );
}
