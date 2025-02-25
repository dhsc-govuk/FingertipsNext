import { selectChartView } from '@/lib/viewUtils/selectChartView';

interface ViewsSkeletonProps {
  areaCodes: string[];
}

export function ViewsSkeleton({ areaCodes }: ViewsSkeletonProps) {
  const selectedView = selectChartView(areaCodes);
  return (
    <div>
      <p>Call {selectedView}</p>
    </div>
  );
}
