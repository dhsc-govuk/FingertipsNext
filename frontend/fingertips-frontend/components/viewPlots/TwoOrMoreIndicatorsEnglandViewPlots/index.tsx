'use client';

import { H2 } from 'govuk-react';
import { MultiIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlotProps';

export function TwoOrMoreIndicatorsEnglandViewPlots({
  englandIndicatorData,
  indicatorMetadata,
}: Readonly<MultiIndicatorViewPlotProps>) {
  return (<H2>View data for selected indicators and areas</H2>);
}
