import styled from 'styled-components';
import { SpineChartLegendItem } from '@/components/charts/SpineChart/SpineChartLegend/SpineChartLegendItem';
import { SpineChartLegendTypes } from '@/components/charts/SpineChart/SpineChartLegend/SpineChartLegend.types';
import React, { FC } from 'react';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { SpineChartQuartilesInfoContainer } from '@/components/charts/SpineChart/SpineChart/SpineChartQuartilesInfo';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  marginBottom: '0.5rem',
});

const FlexDiv = styled.div({
  display: 'flex',
  gap: '1rem',
});

interface SpineChartLegendProps {
  legendsToShow: BenchmarkLegendsToShow;
  benchmarkToUse: string;
  groupName?: string;
  areaNames?: string[];
}

export const SpineChartLegend: FC<SpineChartLegendProps> = ({
  legendsToShow,
  benchmarkToUse,
  groupName = '',
  areaNames = ['Area'],
}) => {
  const searchState = useSearchStateParams();
  const { [SearchParams.GroupSelected]: selectedGroupCode } = searchState;

  const benchmarkName =
    benchmarkToUse === areaCodeForEngland ? englandAreaString : groupName;

  const alternativeBenchmarkName =
    benchmarkToUse === areaCodeForEngland ? `Group: ${groupName}` : undefined;

  const shouldShowAlternativeBenchmark =
    alternativeBenchmarkName && selectedGroupCode !== areaCodeForEngland;

  return (
    <DivContainer>
      <FlexDiv>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Benchmark}>
          Benchmark: {benchmarkName}
        </SpineChartLegendItem>
        {shouldShowAlternativeBenchmark ? (
          <SpineChartLegendItem itemType={SpineChartLegendTypes.Group}>
            {alternativeBenchmarkName}
          </SpineChartLegendItem>
        ) : null}
        {areaNames.map((name, index) => (
          <SpineChartLegendItem
            key={`SpineChartLegendItem-${name}`}
            itemType={
              index === 0
                ? SpineChartLegendTypes.Area
                : SpineChartLegendTypes.AreaTwo
            }
          >
            {name}
          </SpineChartLegendItem>
        ))}
      </FlexDiv>

      <BenchmarkLegends
        legendsToShow={legendsToShow}
        bottomMargin={false}
        title={`Compared to ${benchmarkName}`}
      />
      <SpineChartQuartilesInfoContainer />
    </DivContainer>
  );
};
