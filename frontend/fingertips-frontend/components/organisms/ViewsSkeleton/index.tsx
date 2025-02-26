'use client';

import { selectedViewRenderer } from '@/lib/viewUtils/selectedViewRenderer';
import { viewSelector } from '@/lib/viewUtils/viewUtils';

interface ViewsSkeletonProps {
  areaCodes: string[];
  indicatorsSelected: string[];
}

export function ViewsSkeleton({
  areaCodes,
  indicatorsSelected,
}: ViewsSkeletonProps) {
  return (
    <>
      {selectedViewRenderer(
        viewSelector(areaCodes),
        areaCodes,
        indicatorsSelected
      )}
    </>
  );
}
